import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq, ne, desc, sql } from 'drizzle-orm';
import { hash, compare } from 'bcrypt';
import { jwtConfig, authMiddleware, requireRole } from '../middleware/auth';

const SALT_ROUNDS = 10;

// Routes accessible by admin and moderator
const adminModeratorRoutes = new Elysia()
  .use(jwtConfig)
  .use(authMiddleware)
  .use(requireRole(['admin', 'moderator']))

  // Get all users (Admin and Moderator only)
  .get('/', async ({ user }) => {
    try {
      const allUsers = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt));

      return {
        users: allUsers,
        requestedBy: user,
      };
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  })

  // Get single user by ID (Admin and Moderator only)
  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.id, parseInt(params.id)),
          columns: {
            password: false, // Exclude password
          },
        });

        if (!user) {
          set.status = 404;
          return { error: 'User not found' };
        }

        return { user };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to fetch user' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );

// Routes accessible by admin only
const adminOnlyRoutes = new Elysia()
  .use(jwtConfig)
  .use(authMiddleware)
  .use(requireRole(['admin']))

  // Create new user (Admin only)
  .post(
    '/',
    async ({ body, set }) => {
      try {
        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, body.email),
        });

        if (existingUser) {
          set.status = 400;
          return { error: 'User already exists' };
        }

        // Hash password
        const hashedPassword = await hash(body.password, SALT_ROUNDS);

        // Create user
        const [newUser] = await db
          .insert(users)
          .values({
            email: body.email,
            password: hashedPassword,
            name: body.name,
            role: body.role || 'user',
          })
          .returning({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            createdAt: users.createdAt,
          });

        return {
          message: 'User created successfully',
          user: newUser,
        };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to create user' };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
        name: t.String({ minLength: 2 }),
        role: t.Optional(t.Union([t.Literal('admin'), t.Literal('user'), t.Literal('moderator')])),
      }),
    }
  )

  // Update user (Admin only)
  .patch(
    '/:id',
    async ({ params, body, set }) => {
      try {
        const userId = parseInt(params.id);

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!existingUser) {
          set.status = 404;
          return { error: 'User not found' };
        }

        // Check for email conflicts (excluding current user)
        if (body.email) {
          const emailConflict = await db.query.users.findFirst({
            where: eq(users.email, body.email),
          });

          if (emailConflict && emailConflict.id !== userId) {
            set.status = 400;
            return { error: 'Email already in use' };
          }
        }

        // Prepare update data
        const updateData: any = {};
        if (body.email) updateData.email = body.email;
        if (body.name) updateData.name = body.name;
        if (body.role) updateData.role = body.role;
        if (body.password) {
          updateData.password = await hash(body.password, SALT_ROUNDS);
        }
        updateData.updatedAt = new Date();

        // Update user
        const [updatedUser] = await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, userId))
          .returning({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            updatedAt: users.updatedAt,
          });

        return {
          message: 'User updated successfully',
          user: updatedUser,
        };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to update user' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        email: t.Optional(t.String({ format: 'email' })),
        password: t.Optional(t.String({ minLength: 6 })),
        name: t.Optional(t.String({ minLength: 2 })),
        role: t.Optional(t.Union([t.Literal('admin'), t.Literal('user'), t.Literal('moderator')])),
      }),
    }
  )

  // Delete user (Admin only)
  .delete(
    '/:id',
    async ({ params, set, user }) => {
      try {
        const userId = parseInt(params.id);

        // Prevent self-deletion
        if (user.id === userId) {
          set.status = 400;
          return { error: 'Cannot delete your own account' };
        }

        // Check if user exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!existingUser) {
          set.status = 404;
          return { error: 'User not found' };
        }

        // Delete user
        await db.delete(users).where(eq(users.id, userId));

        return {
          message: 'User deleted successfully',
          deletedUserId: userId,
        };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to delete user' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );

// Routes accessible by authenticated users (for their own profile)
const userProfileRoutes = new Elysia()
  .use(jwtConfig)
  .use(authMiddleware)

  // Get own profile
  .get('/me', async ({ user }) => {
    try {
      const currentUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
        columns: {
          password: false, // Exclude password
        },
      });

      if (!currentUser) {
        return { error: 'User not found' };
      }

      return { user: currentUser };
    } catch (error) {
      return { error: 'Failed to fetch profile' };
    }
  })

  // Update own profile
  .patch(
    '/me',
    async ({ user, body, set }) => {
      try {
        // Check for email conflicts
        if (body.email && body.email !== user.email) {
          const emailConflict = await db.query.users.findFirst({
            where: eq(users.email, body.email),
          });

          if (emailConflict) {
            set.status = 400;
            return { error: 'Email already in use' };
          }
        }

        // Prepare update data
        const updateData: any = {};
        if (body.email) updateData.email = body.email;
        if (body.name) updateData.name = body.name;
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.bio !== undefined) updateData.bio = body.bio;
        updateData.updatedAt = sql`(strftime('%s', 'now'))`;

        // Update user
        const [updatedUser] = await db
          .update(users)
          .set(updateData)
          .where(eq(users.id, user.id))
          .returning({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            phone: users.phone,
            bio: users.bio,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          });

        return {
          message: 'Profile updated successfully',
          user: updatedUser,
        };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to update profile' };
      }
    },
    {
      body: t.Object({
        email: t.Optional(t.String({ format: 'email' })),
        name: t.Optional(t.String({ minLength: 2 })),
        phone: t.Optional(t.String()),
        bio: t.Optional(t.String()),
      }),
    }
  )

  // Change own password
  .post(
    '/me/change-password',
    async ({ user, body, set }) => {
      try {
        // Get current user with password
        const currentUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });

        if (!currentUser) {
          set.status = 404;
          return { error: 'User not found' };
        }

        // Verify current password
        const isValid = await compare(body.currentPassword, currentUser.password);
        if (!isValid) {
          set.status = 400;
          return { error: 'Current password is incorrect' };
        }

        // Hash new password
        const hashedPassword = await hash(body.newPassword, SALT_ROUNDS);

        // Update password
        await db
          .update(users)
          .set({
            password: hashedPassword,
            updatedAt: sql`(strftime('%s', 'now'))`,
          })
          .where(eq(users.id, user.id));

        return {
          message: 'Password changed successfully',
        };
      } catch (error) {
        set.status = 500;
        return { error: 'Failed to change password' };
      }
    },
    {
      body: t.Object({
        currentPassword: t.String({ minLength: 6 }),
        newPassword: t.String({ minLength: 6 }),
      }),
    }
  );

// Combine all routes
export const usersRoutes = new Elysia({ prefix: '/users' })
  .use(userProfileRoutes)
  .use(adminModeratorRoutes)
  .use(adminOnlyRoutes);

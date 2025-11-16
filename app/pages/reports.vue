<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold">Reports</h1>
        <p class="text-base-content/60 mt-1">Generate and export various system reports</p>
      </div>
      <button class="btn btn-primary" @click="showGenerateModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Generate New Report
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title">Total Reports</div>
          <div class="stat-value text-primary">{{ reportStats.total }}</div>
          <div class="stat-desc">All time</div>
        </div>
      </div>
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title">This Month</div>
          <div class="stat-value text-secondary">{{ reportStats.thisMonth }}</div>
          <div class="stat-desc">Generated reports</div>
        </div>
      </div>
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title">Scheduled</div>
          <div class="stat-value text-accent">{{ reportStats.scheduled }}</div>
          <div class="stat-desc">Recurring reports</div>
        </div>
      </div>
      <div class="stats shadow bg-base-100">
        <div class="stat">
          <div class="stat-title">Processing</div>
          <div class="stat-value text-info">{{ reportStats.processing }}</div>
          <div class="stat-desc">In queue</div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-control">
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Search reports..." 
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <select v-model="filters.type" class="select select-bordered">
              <option value="">All Types</option>
              <option value="user">User Report</option>
              <option value="analytics">Analytics Report</option>
              <option value="financial">Financial Report</option>
              <option value="activity">Activity Report</option>
              <option value="custom">Custom Report</option>
            </select>
          </div>
          <div class="form-control">
            <select v-model="filters.status" class="select select-bordered">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="scheduled">Scheduled</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div class="form-control">
            <select v-model="filters.period" class="select select-bordered">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Table -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">Recent Reports</h2>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-outline" @click="refreshReports">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Date Range</th>
                <th>Generated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in filteredReports" :key="report.id">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                      <div :class="getReportIconClass(report.type)" class="rounded w-10">
                        <component :is="getReportIcon(report.type)" class="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ report.name }}</div>
                      <div class="text-sm opacity-50">{{ report.description }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="badge badge-outline">{{ report.type }}</div>
                </td>
                <td class="text-sm">{{ report.dateRange }}</td>
                <td class="text-sm">{{ formatDate(report.generatedAt) }}</td>
                <td>
                  <div :class="getStatusBadgeClass(report.status)" class="badge">
                    {{ report.status }}
                  </div>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      v-if="report.status === 'completed'"
                      class="btn btn-ghost btn-xs" 
                      @click="handleViewReport(report.id)"
                      title="View Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      v-if="report.status === 'completed'"
                      class="btn btn-ghost btn-xs" 
                      @click="handleDownloadReport(report.id)"
                      title="Download Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button 
                      class="btn btn-ghost btn-xs" 
                      @click="handleDeleteReport(report.id)"
                      title="Delete Report"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Scheduled Reports -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Scheduled Reports</h2>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Frequency</th>
                <th>Next Run</th>
                <th>Recipients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="scheduled in scheduledReports" :key="scheduled.id">
                <td class="font-bold">{{ scheduled.name }}</td>
                <td>
                  <div class="badge badge-outline">{{ scheduled.type }}</div>
                </td>
                <td>{{ scheduled.frequency }}</td>
                <td class="text-sm">{{ formatDate(scheduled.nextRun) }}</td>
                <td>
                  <div class="flex -space-x-2">
                    <div v-for="(recipient, index) in scheduled.recipients.slice(0, 3)" :key="index" class="avatar placeholder">
                      <div class="bg-neutral text-neutral-content rounded-full w-8">
                        <span class="text-xs">{{ recipient.charAt(0) }}</span>
                      </div>
                    </div>
                    <div v-if="scheduled.recipients.length > 3" class="avatar placeholder">
                      <div class="bg-neutral text-neutral-content rounded-full w-8">
                        <span class="text-xs">+{{ scheduled.recipients.length - 3 }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-ghost btn-xs" @click="handleEditSchedule(scheduled.id)">
                      Edit
                    </button>
                    <button class="btn btn-ghost btn-xs text-error" @click="handleDeleteSchedule(scheduled.id)">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <dialog :class="['modal', { 'modal-open': showGenerateModal }]">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Generate New Report</h3>
        
        <form @submit.prevent="handleGenerateReport" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Report Name</span>
            </label>
            <input 
              v-model="newReport.name" 
              type="text" 
              placeholder="Enter report name" 
              class="input input-bordered" 
              required 
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Report Type</span>
            </label>
            <select v-model="newReport.type" class="select select-bordered" required>
              <option value="">Select type</option>
              <option value="user">User Report</option>
              <option value="analytics">Analytics Report</option>
              <option value="financial">Financial Report</option>
              <option value="activity">Activity Report</option>
              <option value="custom">Custom Report</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Start Date</span>
              </label>
              <input 
                v-model="newReport.startDate" 
                type="date" 
                class="input input-bordered" 
                required 
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">End Date</span>
              </label>
              <input 
                v-model="newReport.endDate" 
                type="date" 
                class="input input-bordered" 
                required 
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Description (Optional)</span>
            </label>
            <textarea 
              v-model="newReport.description" 
              class="textarea textarea-bordered h-20" 
              placeholder="Enter report description"
            ></textarea>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Export Format</span>
            </label>
            <div class="flex gap-2">
              <label class="label cursor-pointer gap-2">
                <input v-model="newReport.format" type="radio" name="format" value="pdf" class="radio radio-primary" checked />
                <span class="label-text">PDF</span>
              </label>
              <label class="label cursor-pointer gap-2">
                <input v-model="newReport.format" type="radio" name="format" value="excel" class="radio radio-primary" />
                <span class="label-text">Excel</span>
              </label>
              <label class="label cursor-pointer gap-2">
                <input v-model="newReport.format" type="radio" name="format" value="csv" class="radio radio-primary" />
                <span class="label-text">CSV</span>
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Schedule this report</span>
              <input v-model="newReport.schedule" type="checkbox" class="toggle toggle-primary" />
            </label>
          </div>

          <div v-if="newReport.schedule" class="form-control">
            <label class="label">
              <span class="label-text">Frequency</span>
            </label>
            <select v-model="newReport.frequency" class="select select-bordered">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div class="modal-action">
            <button type="button" class="btn btn-ghost" @click="closeGenerateModal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isGenerating">
              <span v-if="isGenerating" class="loading loading-spinner"></span>
              Generate Report
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeGenerateModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const showGenerateModal = ref(false);
const isGenerating = ref(false);

const reportStats = ref({
  total: 156,
  thisMonth: 23,
  scheduled: 8,
  processing: 2
});

const filters = ref({
  search: '',
  type: '',
  status: '',
  period: ''
});

const newReport = ref({
  name: '',
  type: '',
  startDate: '',
  endDate: '',
  description: '',
  format: 'pdf',
  schedule: false,
  frequency: 'monthly'
});

const reports = ref([
  {
    id: 1,
    name: 'Monthly User Activity',
    description: 'User engagement and activity metrics',
    type: 'user',
    dateRange: 'Oct 1 - Oct 31, 2024',
    generatedAt: new Date('2024-11-01'),
    status: 'completed'
  },
  {
    id: 2,
    name: 'Q3 Analytics Report',
    description: 'Quarterly analytics summary',
    type: 'analytics',
    dateRange: 'Jul 1 - Sep 30, 2024',
    generatedAt: new Date('2024-10-15'),
    status: 'completed'
  },
  {
    id: 3,
    name: 'Financial Summary',
    description: 'Revenue and expense analysis',
    type: 'financial',
    dateRange: 'Oct 1 - Oct 31, 2024',
    generatedAt: new Date('2024-11-05'),
    status: 'processing'
  },
  {
    id: 4,
    name: 'User Activity Log',
    description: 'Detailed user activity tracking',
    type: 'activity',
    dateRange: 'Nov 1 - Nov 15, 2024',
    generatedAt: new Date('2024-11-16'),
    status: 'completed'
  },
  {
    id: 5,
    name: 'Custom Dashboard Report',
    description: 'Custom metrics report',
    type: 'custom',
    dateRange: 'Oct 1 - Nov 1, 2024',
    generatedAt: new Date('2024-11-02'),
    status: 'failed'
  }
]);

const scheduledReports = ref([
  {
    id: 1,
    name: 'Weekly User Summary',
    type: 'user',
    frequency: 'Weekly',
    nextRun: new Date('2024-11-24'),
    recipients: ['Admin', 'Manager', 'Analyst']
  },
  {
    id: 2,
    name: 'Monthly Analytics',
    type: 'analytics',
    frequency: 'Monthly',
    nextRun: new Date('2024-12-01'),
    recipients: ['CEO', 'CTO', 'Product Manager', 'Marketing']
  }
]);

const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const matchesSearch = !filters.value.search || 
      report.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      report.description.toLowerCase().includes(filters.value.search.toLowerCase());
    
    const matchesType = !filters.value.type || report.type === filters.value.type;
    const matchesStatus = !filters.value.status || report.status === filters.value.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });
});

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getReportIcon = (type: string) => {
  return 'svg'; // Placeholder - would return actual icon component
};

const getReportIconClass = (type: string) => {
  const classes: Record<string, string> = {
    user: 'bg-primary text-primary-content',
    analytics: 'bg-secondary text-secondary-content',
    financial: 'bg-accent text-accent-content',
    activity: 'bg-info text-info-content',
    custom: 'bg-warning text-warning-content'
  };
  return classes[type] || 'bg-neutral text-neutral-content';
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    completed: 'badge-success',
    processing: 'badge-warning',
    scheduled: 'badge-info',
    failed: 'badge-error'
  };
  return classes[status] || 'badge-ghost';
};

const handleGenerateReport = async () => {
  isGenerating.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Generating report:', newReport.value);
    
    alert('Report generation started! You will be notified when it\'s ready.');
    closeGenerateModal();
  } catch (error) {
    console.error('Failed to generate report:', error);
    alert('Failed to generate report. Please try again.');
  } finally {
    isGenerating.value = false;
  }
};

const closeGenerateModal = () => {
  showGenerateModal.value = false;
  newReport.value = {
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    description: '',
    format: 'pdf',
    schedule: false,
    frequency: 'monthly'
  };
};

const handleViewReport = (id: number) => {
  console.log('Viewing report:', id);
  alert(`Opening report ${id}...`);
};

const handleDownloadReport = (id: number) => {
  console.log('Downloading report:', id);
  alert(`Downloading report ${id}...`);
};

const handleDeleteReport = (id: number) => {
  if (confirm('Are you sure you want to delete this report?')) {
    reports.value = reports.value.filter(r => r.id !== id);
    alert('Report deleted successfully!');
  }
};

const handleEditSchedule = (id: number) => {
  console.log('Editing schedule:', id);
  alert(`Editing schedule ${id}...`);
};

const handleDeleteSchedule = (id: number) => {
  if (confirm('Are you sure you want to delete this scheduled report?')) {
    scheduledReports.value = scheduledReports.value.filter(s => s.id !== id);
    alert('Scheduled report deleted successfully!');
  }
};

const refreshReports = () => {
  console.log('Refreshing reports...');
  alert('Reports refreshed!');
};
</script>

  <template>
    <q-page padding>
      <!-- Header -->
      <div class="row items-center q-mb-lg">
        <h4 class="text-h4 q-my-none">Leave</h4>
        <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
          <q-breadcrumbs-el icon="list_alt" />
          <q-breadcrumbs-el label="List" />
        </q-breadcrumbs>
      </div>

      <q-card class="q-pa-md">
        <div class="text-h6 q-mb-lg">List of Leave Requests</div>

        <!-- Filters -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-6">
            <div class="text-subtitle2 q-mb-sm">Status</div>
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              outlined
              dense
              emit-value
              map-options
              clearable
              options-dense
              label="Select Status"
            />
          </div>
          <div class="col-12 col-sm-6">
            <div class="text-subtitle2 q-mb-sm">Type of Leaves</div>
            <q-select
              v-model="leaveTypeFilter"
              :options="leaveTypeOptions"
              outlined
              dense
              emit-value
              map-options
              clearable
              options-dense
              label="Select Leave Type"
            />
          </div>
        </div>

        <!-- Table Controls -->
        <div class="row items-center justify-between q-mb-sm wrap">
          <div class="row items-center q-mb-sm-xs">
            <span class="q-mr-sm">Show</span>
            <q-select
            v-model="pagination.rowsPerPage"
            :options="[5, 10, 20, 50]"
            dense
            outlined
            class="entries-select"
            style="width: 65px"
            @update:model-value="handleRowsPerPageChange"
                />
            <span class="q-ml-sm">entries</span>
          </div>


          <div class="row items-center q-mb-sm-xs">
            <span class="q-mr-sm">Search:</span>
            <q-input
              v-model="search"
              dense
              outlined
              class="search-input"
            />
          </div>
        </div>

        <!-- Desktop View -->
        <div class="gt-xs">
          <q-table
        :rows="paginatedRows"
        :columns="columns"
        row-key="id"
        flat
        :pagination="computedPagination"
        @update:pagination="onUpdatePagination"
        :sort-method="customSort"
        binary-state-sort
        hide-pagination
      >
            <template v-slot:no-data>
              <div class="full-width row flex-center q-pa-md text-grey-8">
                <div class="text-p">No Records Found</div>
              </div>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <span :class="getStatusColorClass(props.row.status)">
                  {{ props.row.status }}
                </span>
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props" class="text-center">
                <q-btn flat round color="grey" icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item>
                        <div class="column q-gutter-y-sm full-width">
                          <q-btn
                          class="q-px-sm full-width"
                          unelevated
                          square
                          color="green"
                          icon="visibility"
                          size="sm"
                          label="View"
                          align="left"
                          @click="viewRequest(props.row)"
                        />
                          <q-btn
                            class="q-px-sm full-width"
                            unelevated
                            square
                            color="orange"
                            icon="check"
                            size="sm"
                            label="Approve"
                            align="left"
                            @click="approveRequest(props.row)"
                          />
                          <q-btn
                            class="q-px-sm full-width"
                            unelevated
                            square
                            color="red"
                            icon="close"
                            size="sm"
                            label="Decline"
                            align="left"
                            @click="declineRequest(props.row)"
                          />
                        </div>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Mobile View -->
        <div class="lt-sm">
          <template v-if="paginatedRows.length">
            <q-list separator>
              <q-item v-for="row in paginatedRows" :key="row.id" class="q-py-md mobile-list-item">
                <q-item-section>
                  <div class="row items-center justify-between q-mb-sm">

                    <div class="q-mb-sm">
                    <div class="text-grey-6 text-caption">Name</div>
                    <div>{{ row.employeeName }}</div>
                  </div>
                    <div class="col-4 text-right">
                      <div class="text-subtitle2 text-grey-7">Status</div>
                      <div :class="getStatusColorClass(row.status)">
                        {{ row.status }}
                      </div>
                    </div>
                  </div>

                  <div class="q-gutter-y-sm">
                    <div>
                      <div class="text-caption text-grey-7">Date Created</div>
                      <div class="text-body2">{{ row.dateCreated }}</div>
                    </div>

                    <div>
                      <div class="text-caption text-grey-7">Leave Date</div>
                      <div class="text-body2">{{ row.leaveDate }}</div>
                    </div>

                    <div>
                      <div class="text-caption text-grey-7">Type of Leave</div>
                      <div class="text-body2">{{ row.typeOfLeave }}</div>
                    </div>

                  <q-btn flat round color="grey" icon="more_vert">
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item>
                          <div class="column q-gutter-y-sm full-width">
                            <q-btn
                              class="q-px-sm full-width"
                              unelevated
                              square
                              color="green"
                              icon="visibility"
                              size="sm"
                              label="View"
                              align="left"
                              @click="viewRequest(row)"
                            />
                            <q-btn
                              class="q-px-sm full-width"
                              unelevated
                              square
                              color="orange"
                              icon="check"
                              size="sm"
                              label="Approve"
                              align="left"
                              @click="approveRequest(row)"
                            />
                            <q-btn
                              class="q-px-sm full-width"
                              unelevated
                              square
                              color="red"
                              icon="close"
                              size="sm"
                              label="Decline"
                              align="left"
                              @click="declineRequest(row)"
                            />
                          </div>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
          <template v-else>
            <div class="full-width row flex-center q-pa-md text-grey-7">
              <div class="text-p">No Records Found</div>
            </div>
          </template>
        </div>

        <!-- Pagination -->
        <div class="row justify-between items-center q-mt-md flex-wrap" v-if="totalRows > 0">
    <div class="col-12 col-sm-auto text-grey-8 q-mb-sm-xs text-center text-sm-left">
      Showing {{ startIndex }} to {{ endIndex }} of {{ totalRows }} entries
    </div>
    <div class="col-12 col-sm-auto">
      <div class="row q-gutter-sm justify-center">
        <q-btn
          label="Previous"
          flat
          :disable="pagination.page === 1"
          @click="onPreviousPage"
        />
        <template v-for="pageNum in displayedPages" :key="pageNum">
          <q-btn
            :label="String(pageNum)"
            flat
            :class="{ 'bg-primary text-white': pageNum === pagination.page }"
            @click="pagination.page = pageNum"
          />
        </template>
        <q-btn
          label="Next"
          flat
          :disable="isLastPage"
          @click="onNextPage"
        />
      </div>
    </div>
  </div>
      </q-card>
      <q-dialog v-model="showConfirmDialog" persistent>
  <q-card style="min-width: 350px">
    <q-card-section class="row items-center">
      <div class="text-h6">{{ confirmationData.actionType }} Leave Request</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <p>Are you sure you want to {{ confirmationData.actionType.toLowerCase() }} this leave request?</p>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        label="Cancel"
        color="grey"
        v-close-popup
      />
      <q-btn
        :flat="true"
        :label="confirmationData.actionType"
        :color="confirmationData.actionType === 'Approve' ? 'orange' : 'red'"
        :loading="isLoading"
        @click="handleStatusChange"
      />
    </q-card-actions>
  </q-card>
</q-dialog>
    </q-page>
  </template>

  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'


  defineOptions({
    name: 'LeaveApplicationsList'
  })


const showConfirmDialog = ref(false)
const confirmationData = ref({
  status: '',
  actionType: '',
  row: null
})

// Add these methods after the existing methods in your script setup
const openConfirmationDialog = (status, actionType, row) => {
  confirmationData.value = {
    status,
    actionType,
    row
  }
  showConfirmDialog.value = true
}
const handleStatusChange = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const { status, actionType, row } = confirmationData.value
    const newStatus = actionType === 'Approve' ? 'Approved' : 'Declined'

    // Update the row's status in the table
    const rowIndex = rows.value.findIndex(r => r.id === row.id)
    if (rowIndex !== -1) {
      rows.value[rowIndex].status = newStatus
    }

    // Show success notification
    $q.notify({
      type: actionType === 'Approve' ? 'positive' : 'negative',
      message: `Leave request ${newStatus.toLowerCase()} successfully`,
      position: 'top'
    })

    // Reset dialog
    showConfirmDialog.value = false
    confirmationData.value = { status: '', actionType: '', row: null }

  } catch (error) {
    console.error('Error:', error)
    $q.notify({
      type: 'negative',
      message: 'Error processing leave request',
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}


  const columns = [
  {
    name: 'dateCreated',
    required: true,
    label: 'DATE CREATED',
    field: 'dateCreated',
    sortable: true,
    align: 'left',
    sort: (a, b, rowA, rowB) => new Date(rowA.dateCreated) - new Date(rowB.dateCreated)
  },
  {
    name: 'employeeName',
    required: true,
    label: 'EMPLOYEE NAME',
    field: 'employeeName',
    sortable: true,
    align: 'left',
    sort: (a, b) => a.localeCompare(b)
  },
  {
    name: 'leaveDate',
    required: true,
    label: 'LEAVE DATE',
    field: 'leaveDate',
    sortable: true,
    align: 'left',
    sort: (a, b, rowA, rowB) => {
      const dateA = new Date(rowA.leaveDate.split(' - ')[0])
      const dateB = new Date(rowB.leaveDate.split(' - ')[0])
      return dateA - dateB
    }
  },
  {
    name: 'typeOfLeave',
    required: true,
    label: 'TYPE OF LEAVE',
    field: 'typeOfLeave',
    sortable: true,
    align: 'left',
    sort: (a, b) => a.localeCompare(b)
  },
  {
    name: 'status',
    required: true,
    label: 'STATUS',
    field: 'status',
    sortable: true,
    align: 'left',
    sort: (a, b) => a.localeCompare(b)
  },
  {
    name: 'action',
    required: true,
    label: 'ACTION',
    field: 'action',
    align: 'center',
    sortable: false
  }
  ]

  // Data
  const search = ref('')
  const statusFilter = ref(null)
  const leaveTypeFilter = ref(null)
  const rows = ref([
  {
      id: 1,
      dateCreated: 'September 16, 2024',
      employeeName: 'Denden',
      leaveDate: 'September 19, 2024 - September 19, 2024',
      typeOfLeave: 'Vacation Leave',
      status: 'Pending',
    },
    {
      id: 2,
      dateCreated: 'September 17, 2024',
      employeeName: 'Alex',
      leaveDate: 'September 20, 2024 - September 21, 2024',
      typeOfLeave: 'Sick Leave',
      status: 'Approved',
    },
    {
      id: 3,
      dateCreated: 'September 18, 2024',
      employeeName: 'Marie',
      leaveDate: 'September 22, 2024 - September 24, 2024',
      typeOfLeave: 'Maternity Leave',
      status: 'Pending',
    },
    {
      id: 4,
      dateCreated: 'September 19, 2024',
      employeeName: 'John',
      leaveDate: 'September 25, 2024 - September 26, 2024',
      typeOfLeave: 'Bereavement Leave',
      status: 'Rejected',
    },
    {
      id: 5,
      dateCreated: 'September 20, 2024',
      employeeName: 'Sara',
      leaveDate: 'September 27, 2024 - September 28, 2024',
      typeOfLeave: 'Vacation Leave',
      status: 'Pending',
    },
    {
      id: 6,
      dateCreated: 'September 21, 2024',
      employeeName: 'Chris',
      leaveDate: 'September 29, 2024 - September 30, 2024',
      typeOfLeave: 'Emergency Leave',
      status: 'Approved',
    },
    {
      id: 7,
      dateCreated: 'September 22, 2024',
      employeeName: 'Kate',
      leaveDate: 'October 1, 2024 - October 3, 2024',
      typeOfLeave: 'Vacation Leave',
      status: 'Pending',
    },
    {
      id: 8,
      dateCreated: 'September 23, 2024',
      employeeName: 'Ben',
      leaveDate: 'October 4, 2024 - October 4, 2024',
      typeOfLeave: 'Sick Leave',
      status: 'Approved',
    },
    {
      id: 9,
      dateCreated: 'September 24, 2024',
      employeeName: 'Emma',
      leaveDate: 'October 5, 2024 - October 7, 2024',
      typeOfLeave: 'Vacation Leave',
      status: 'Rejected',
    },
    {
      id: 10,
      dateCreated: 'September 25, 2024',
      employeeName: 'Luke',
      leaveDate: 'October 8, 2024 - October 9, 2024',
      typeOfLeave: 'Paternity Leave',
      status: 'Pending',
    },
  ])

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ]

  const leaveTypeOptions = [
    { label: 'Vacation Leave', value: 'vacation' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Maternity Leave', value: 'maternity' },
    { label: 'Paternity Leave', value: 'paternity' }
  ]

  const pagination = ref({
  sortBy: 'dateCreated',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

const customSort = (rows, sortBy, descending) => {
  const data = [...rows]

  if (sortBy) {
    data.sort((a, b) => {
      let compareResult = 0

      // Handle different field types
      switch (sortBy) {
        case 'dateCreated':
          compareResult = new Date(a.dateCreated) - new Date(b.dateCreated)
          break

        case 'leaveDate':
          // Extract first date from range for sorting
          const getFirstDate = (dateRange) => {
            return new Date(dateRange.split(' - ')[0])
          }
          compareResult = getFirstDate(a.leaveDate) - getFirstDate(b.leaveDate)
          break

        case 'employeeName':
        case 'typeOfLeave':
        case 'status':
          compareResult = a[sortBy].localeCompare(b[sortBy])
          break

        default:
          compareResult = a[sortBy] > b[sortBy] ? 1 : a[sortBy] < b[sortBy] ? -1 : 0
      }

      return descending ? -compareResult : compareResult
    })
  }

  return data
}

  // Updated computed properties
  const computedPagination = computed(() => ({
    ...pagination.value,
    rowsNumber: totalRows.value
  }))

  const handleRowsPerPageChange = (value) => {
    pagination.value = {
      ...pagination.value,
      rowsPerPage: value,
      page: 1 // Reset to first page when changing entries per page
    }
  }

  // Computed properties
  const filteredRows = computed(() => {
  let filtered = [...rows.value]

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(row =>
      Object.entries(row).some(([key, value]) =>
        key !== 'id' && key !== 'action' &&
        String(value).toLowerCase().includes(searchLower)
      )
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(row =>
      row.status.toLowerCase() === statusFilter.value
    )
  }

  if (leaveTypeFilter.value) {
    filtered = filtered.filter(row =>
      row.typeOfLeave.toLowerCase().includes(leaveTypeFilter.value.toLowerCase())
    )
  }

  return customSort(filtered, pagination.value.sortBy, pagination.value.descending)
})

  const totalRows = computed(() => filteredRows.value.length)

  const totalPages = computed(() =>
    Math.ceil(filteredRows.value.length / pagination.value.rowsPerPage)
  )

  const startIndex = computed(() => {
    if (totalRows.value === 0) return 0
    return (pagination.value.page - 1) * pagination.value.rowsPerPage + 1
  })

  const endIndex = computed(() => {
    const end = startIndex.value + pagination.value.rowsPerPage - 1
    return Math.min(end, totalRows.value)
  })
  const isLastPage = computed(() => pagination.value.page >= totalPages.value)

  const paginatedRows = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return filteredRows.value.slice(start, end)
})

  const displayedPages = computed(() => {
    const total = totalPages.value
    const current = pagination.value.page
    const pages = []

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i)
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) pages.push(i)
      } else {
        for (let i = current - 2; i <= current + 2; i++) pages.push(i)
      }
    }
    return pages
  })

  // Methods
  const onUpdatePagination = (newPagination) => {
  // Handle sorting
  if (newPagination.sortBy !== pagination.value.sortBy ||
      newPagination.descending !== pagination.value.descending) {
    pagination.value = {
      ...pagination.value,
      sortBy: newPagination.sortBy,
      descending: newPagination.descending,
      page: 1 // Reset to first page when sorting changes
    }
  } else {
    pagination.value = {
      ...pagination.value,
      ...newPagination,
      rowsNumber: totalRows.value
    }
  }
}

  const onPreviousPage = () => {
    if (pagination.value.page > 1) {
      pagination.value = {
        ...pagination.value,
        page: pagination.value.page - 1
      }
    }
  }

  const onNextPage = () => {
    if (pagination.value.page < totalPages.value) {
      pagination.value = {
        ...pagination.value,
        page: pagination.value.page + 1
      }
    }
  }

  const getStatusColorClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text'
      case 'rejected':
        return 'text'
      case 'pending':
        return 'text'
      default:
        return 'text'
    }
  }

  const router = useRouter()

const viewRequest = (row) => {
  router.push({
    path: '/LAVLV',
    query: {
      id: row.id,
      dateCreated: row.dateCreated,
      employeeName: row.employeeName,
      typeOfLeave: row.typeOfLeave,
      leaveDate: row.leaveDate,
      status: row.status
    }
  })
}

const approveRequest = (row) => {
  openConfirmationDialog('Approved', 'Approve', row)
}

const declineRequest = (row) => {
  openConfirmationDialog('Declined', 'Decline', row)
}
  </script>

  <style>
  .entries-select {
    min-width: 75px;
  }

  .search-input {
    width: 200px;
  }


  .q-table {
    background-color: white;
  }

  .q-table th {
    font-weight: 500 !important;
  }

  .q-table tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  .mobile-list-item {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    margin-bottom: 8px;
    transition: box-shadow 0.3s ease;
  }

  .mobile-list-item:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Filter section styling */
  .q-select {
    width: 100%;
  }

  /* Table styles */
  .q-table__container {
    border: none !important;
  }

  .q-table > thead > tr > th {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .q-table > tbody > tr > td {
    border-bottom: none;
  }

  .q-table td {
    height: 52px;
  }

  /* Custom scrollbar */
  .q-table__container {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }

  .q-table__container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .q-table__container::-webkit-scrollbar-track {
    background: transparent;
  }

  .q-table__container::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  /* Responsive styles */
  @media (max-width: 599px) {
    .search-input {
      width: 100% !important;
    }

    .entries-select {
      width: 65px !important;
    }

    .q-page {
      padding: 8px !important;
    }

    .q-card {
      padding: 12px !important;
    }

    .row.wrap > div {
      padding: 4px 0;
    }

    .q-mb-sm-xs {
      margin-bottom: 8px;
    }

    .text-h6 {
      font-size: 1.25rem;
    }

    .mobile-list-item {
      margin: 8px 0;
      padding: 16px !important;

    }

    /* Mobile action buttons */
    .action-buttons-mobile {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    }
  }

  @media (min-width: 600px) {
    .search-input {
      width: 200px !important;
    }

    .q-card {
      padding: 20px !important;
    }

    .q-mb-sm-xs {
      margin-bottom: 0;
    }
  }

  /* Status styles */
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  /* Button styles */
  .full-width {
    width: 100%;
  }

  .action-button {
    min-width: 100px;
  }

  /* List item hover effect */
  .q-item {
    transition: background-color 0.3s ease;
  }

  .q-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  /* Filter labels */
  .filter-label {
    font-weight: 500;
    margin-bottom: 4px;
  }

  /* Pagination styles */
  .pagination-btn {
    min-width: 32px;
  }

  /* Loading overlay */
  .loading-overlay {
    background: rgba(255, 255, 255, 0.7);
  }

  /* Utility classes */
  .text-weight-medium {
    font-weight: 500;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .overflow-hidden {
    overflow: hidden;
  }
  .mobile-list-item .q-gutter-sm > * {
    margin: 4px;
  }
  .mobile-list-item .q-btn {
    min-width: 36px;
    padding: 4px 8px;
  }

  /* Improved spacing for mobile status */
  .mobile-list-item .status-text {
    margin-top: 4px;
  }

  /* Better alignment for action buttons */
  .mobile-list-item .row.justify-end {
    margin-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding-top: 12px;
  }
  </style>

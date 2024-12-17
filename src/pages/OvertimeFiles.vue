<template>
  <q-page padding>
    <!-- Header section remains the same -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Overtime</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="schedule" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <q-card class="q-pa-md">
      <!-- Filters -->
      <div class="row items-center justify-between q-mb-lg">
        <div class="col-12 col-sm-4">
          <div class="text-h6 q-mb-sm">List Overtime Files</div>
          <div class="text-subtitle2 q-mb-sm">Status</div>
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            dense
            outlined
            emit-value
            map-options
            option-label="label"
            option-value="value"
            class="q-mb-md"
            @update:model-value="filterData"
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
            debounce="300"
            @update:model-value="filterData"
          />
        </div>
      </div>

      <!-- Desktop View -->
      <div class="gt-xs">
        Copy<q-table
  :rows="paginatedRows"
  :columns="columns"
  row-key="id"
  flat
  :pagination="computedPagination"
  @update:pagination="onUpdatePagination"
  @request="onRequest"
  :sort-method="customSort"
  binary-state-sort
  hide-pagination
>
          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey-7">
              <div class="text-center">
                <div class="text-p">No Records Found</div>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-timeFromTo="props">
            <q-td :props="props">
              {{ props.row.timeFromTo }}
              <q-badge class="q-ml-sm text-weight-medium"
              color="green"
                text-color="white"
                style="font-size: 0.8em"
                >
                {{ props.row.duration }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              {{ props.row.status }}
            </q-td>
          </template>

          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item>
                      <div class="column q-gutter-y-sm full-width">
                        <q-btn
                          class="q-px-sm width"
                          unelevated
                          square
                          color="info"
                          icon="visibility"
                          size="sm"
                          label="View"
                          align="left"
                          @click="viewFile(props.row)"
                        />
                        <q-btn
                          class="q-px-sm width"
                          unelevated
                          square
                          color="info"
                          icon="edit"
                          size="sm"
                          label="Edit"
                          align="left"
                        />
                        <q-btn
                          class="q-px-sm width"
                          unelevated
                          square
                          color="info"
                          icon="delete"
                          size="sm"
                          label="Delete"
                          align="left"
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
                    <div class="text-subtitle1 text-weight-medium">{{ row.name }}</div>
                  </div>
                  <div>
                    <div class="text-caption text-grey-7">Status</div>
                    <div class="text-weight-medium">{{ row.status }}</div>
                  </div>
                </div>

                <div class="q-gutter-y-sm">
                  <div>
                    <div class="text-caption text-grey-7">Date Created</div>
                    <div class="text-body2">{{ row.dateCreated }}</div>
                  </div>

                  <div>
                    <div class="text-caption text-grey-7">Date Filled</div>
                    <div class="text-body2">{{ row.dateFilled }}</div>
                  </div>

                  <div>
                    <div class="text-caption text-grey-7">Time From - To</div>
                    <div class="text-body2 row items-center">
                      {{ row.timeFromTo }}
                      <q-badge
                      color="green"
                      text-color="white"
                      class="q-ml-sm text-weight-medium"
                      style="font-size: 0.8em"
                    >
                      {{ row.duration }}
                    </q-badge>
                    </div>
                  </div>

                  <div>
                    <div class="text-caption text-grey-7">Description</div>
                    <div class="text-body2">{{ row.description }}</div>
                  </div>

                  <div class="row justify-start q-mt-sm">
                    <q-btn flat round icon="more_vert">
                      <q-menu>
                        <q-list style="min-width: 150px">
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
                                @click="viewFile(row)"
                              />
                              <q-btn
                                class="q-px-sm full-width"
                                unelevated
                                square
                                color="orange"
                                icon="edit"
                                size="sm"
                                label="Edit"
                                align="left"
                              />
                              <q-btn
                                class="q-px-sm full-width"
                                unelevated
                                square
                                color="red"
                                icon="delete"
                                size="sm"
                                label="Delete"
                                align="left"
                              />
                            </div>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
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
      <div class="row justify-between items-center q-mt-md flex-wrap" v-if="filteredRows.length">
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
              class="pagination-btn"
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
              class="pagination-btn"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'OvertimeFiles'
})

// State
const search = ref('')
const statusFilter = ref(null)

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
    const column = columns.find(col => col.name === sortBy)
    if (!column || !column.sortable) return data

    data.sort((a, b) => {
      let compareResult = 0
      const valA = column.field(a)
      const valB = column.field(b)

      switch (sortBy) {
        case 'dateCreated':
        case 'dateFilled':
          compareResult = new Date(valA) - new Date(valB)
          break

        case 'timeFromTo':
          const getMinutes = (timeStr) => {
            const [time] = timeStr.split(' - ')
            const [rawTime, period] = time.split(' ')
            let [hours, minutes] = rawTime.split(':').map(Number)
            if (period === 'PM' && hours !== 12) hours += 12
            if (period === 'AM' && hours === 12) hours = 0
            return hours * 60 + minutes
          }
          compareResult = getMinutes(valA) - getMinutes(valB)
          break

        case 'status':
          compareResult = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase())
          break

        default:
          compareResult = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase())
      }

      return descending ? -compareResult : compareResult
    })
  }

  return data
}

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination

  pagination.value = {
    ...pagination.value,
    page,
    rowsPerPage,
    sortBy,
    descending,
    rowsNumber: filteredRows.value.length
  }
}

const columns = [
  {
    name: 'dateCreated',
    required: true,
    label: 'DATE CREATED',
    field: row => row.dateCreated,
    sortable: true,
    align: 'left'
  },
  {
    name: 'name',
    required: true,
    label: 'NAME',
    field: row => row.name,
    sortable: true,
    align: 'left'
  },
  {
    name: 'dateFilled',
    required: true,
    label: 'DATE FILLED',
    field: row => row.dateFilled,
    sortable: true,
    align: 'left'
  },
  {
    name: 'timeFromTo',
    required: true,
    label: 'TIME FROM - TO',
    field: row => row.timeFromTo,
    sortable: true,
    align: 'left'
  },
  {
    name: 'description',
    required: true,
    label: 'DESCRIPTION',
    field: row => row.description,
    sortable: true,
    align: 'left'
  },
  {
    name: 'status',
    required: true,
    label: 'STATUS',
    field: row => row.status,
    sortable: true,
    align: 'left'
  },
  {
    name: 'action',
    required: true,
    label: 'ACTION',
    field: row => row.action,
    sortable: false,
    align: 'center'
  }
]

// Sample data
const rows = ref([
{
    id: 1,
    dateCreated: 'September 16, 2024',
    name: 'Denden',
    dateFilled: '2024-09-16',
    timeFromTo: '12:43 PM - 4:43 PM',
    duration: '4 hours, 0 minutes',
    description: 'test',
    status: 'Approved',
  },
  {
    id: 2,
    dateCreated: 'August 06, 2024',
    name: 'Denden',
    dateFilled: '2024-08-06',
    timeFromTo: '4:06 PM - 9:07 PM',
    duration: '5 hours, 1 minute',
    description: 'test',
    status: 'Approved',
  },
  {
    id: 3,
    dateCreated: 'July 15, 2024',
    name: 'Alex',
    dateFilled: '2024-07-15',
    timeFromTo: '9:00 AM - 12:30 PM',
    duration: '3 hours, 30 minutes',
    description: 'System maintenance',
    status: 'Pending',
  },
  {
    id: 4,
    dateCreated: 'September 12, 2024',
    name: 'Marie',
    dateFilled: '2024-09-12',
    timeFromTo: '10:15 AM - 2:30 PM',
    duration: '4 hours, 15 minutes',
    description: 'Database update',
    status: 'Rejected',
  },
  {
    id: 5,
    dateCreated: 'October 01, 2024',
    name: 'John',
    dateFilled: '2024-10-01',
    timeFromTo: '1:00 PM - 5:00 PM',
    duration: '4 hours, 0 minutes',
    description: 'Hardware upgrade',
    status: 'Approved',
  },
  {
    id: 6,
    dateCreated: 'August 20, 2024',
    name: 'Emma',
    dateFilled: '2024-08-20',
    timeFromTo: '3:30 PM - 6:45 PM',
    duration: '3 hours, 15 minutes',
    description: 'Network optimization',
    status: 'Pending',
  },
  {
    id: 7,
    dateCreated: 'September 25, 2024',
    name: 'Chris',
    dateFilled: '2024-09-25',
    timeFromTo: '8:00 AM - 12:00 PM',
    duration: '4 hours, 0 minutes',
    description: 'Server testing',
    status: 'Approved',
  },
  {
    id: 8,
    dateCreated: 'July 28, 2024',
    name: 'Kate',
    dateFilled: '2024-07-28',
    timeFromTo: '2:00 PM - 5:30 PM',
    duration: '3 hours, 30 minutes',
    description: 'Software debugging',
    status: 'Rejected',
  },
  {
    id: 9,
    dateCreated: 'October 03, 2024',
    name: 'Ben',
    dateFilled: '2024-10-03',
    timeFromTo: '7:00 AM - 11:00 AM',
    duration: '4 hours, 0 minutes',
    description: 'Backup creation',
    status: 'Approved',
  },
  {
    id: 10,
    dateCreated: 'August 30, 2024',
    name: 'Luke',
    dateFilled: '2024-08-30',
    timeFromTo: '4:15 PM - 9:15 PM',
    duration: '5 hours, 0 minutes',
    description: 'System monitoring',
    status: 'Pending',
  },
])

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'In-progress', value: 'in-progress' },
  { label: 'Check Released', value: 'released' },
  { label: 'For Liquidation', value: 'liquidation' },
  { label: 'For Procurement', value: 'procurement' },
  { label: 'For Accounting', value: 'accounting' },
  { label: 'For Finance', value: 'finance' },
  { label: 'Closed', value: 'closed' },
  { label: 'Check Created', value: 'created' }
]

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
      row.status.toLowerCase() === statusFilter.value.toLowerCase()
    )
  }

  return filtered
})

const sortedAndFilteredRows = computed(() => {
  return customSort(
    filteredRows.value,
    pagination.value.sortBy,
    pagination.value.descending
  )
})

const totalRows = computed(() => filteredRows.value.length)
const computedPagination = computed(() => ({
  ...pagination.value,
  rowsNumber: totalRows.value
}))

const totalPages = computed(() => Math.ceil(totalRows.value / pagination.value.rowsPerPage))
const startIndex = computed(() => (pagination.value.page - 1) * pagination.value.rowsPerPage + 1)
const endIndex = computed(() => Math.min(startIndex.value + pagination.value.rowsPerPage - 1, totalRows.value))
const isLastPage = computed(() => pagination.value.page >= totalPages.value)

const paginatedRows = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return sortedAndFilteredRows.value.slice(start, end)
})

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = pagination.value.page
  const maxPages = 5
  const pages = []

  if (total <= maxPages) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    let start = current - Math.floor(maxPages / 2)
    let end = current + Math.floor(maxPages / 2)

    if (start < 1) {
      start = 1
      end = maxPages
    }

    if (end > total) {
      end = total
      start = total - maxPages + 1
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

const handleRowsPerPageChange = (value) => {
  pagination.value = {
    ...pagination.value,
    rowsPerPage: value,
    page: 1 // Reset to first page when changing entries per page
  }
}

const onUpdatePagination = (newPagination) => {
  pagination.value = {
    ...pagination.value,
    ...newPagination,
    rowsNumber: totalRows.value
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

// Add reset pagination method
const resetPagination = () => {
  pagination.value = {
    ...pagination.value,
    page: 1
  }
}

// Update filterData method
const filterData = () => {
  pagination.value.page = 1 // Reset to first page when filtering
}
</script>

<style>
/* Base styles */
.entries-select {
  min-width: 75px;
}

.search-input {
  width: 200px;
}

/* Table styles */
.q-table {
  background-color: white;
  border-radius: 4px;
}

.q-table th {
  font-weight: 500 !important;
  background-color: #f5f5f5;
}

.q-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.q-table tbody tr:hover {
  background-color: #f5f5f5;
}

/* Width utility */
.width {
  width: 100%;
}

/* Mobile list styles */
.mobile-list-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: white;
  transition: box-shadow 0.2s ease;
}

.mobile-list-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

  .mobile-list-item {
    margin: 8px 0;
  }

  .text-subtitle1 {
    font-size: 1rem;
  }

  .text-body2 {
    font-size: 0.875rem;
  }

  .text-caption {
    font-size: 0.75rem;
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

/* Pagination styles */
.pagination-btn {
  min-width: 90px;
}

/* Enhanced accessibility */
.q-btn {
  transition: opacity 0.2s ease;
}

.q-btn:hover {
  opacity: 0.9;
}

/* Table header enhancements */
.q-table thead tr th {
  font-size: 0.875rem;
  padding: 8px 16px;
}

/* Card shadow */
.q-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

/* Table scrollbar customization */
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
</style>

<template>
  <q-page padding>
    <!-- Header with Navigation -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Budget</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="list_alt" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <!-- Main Content Card -->
    <q-card class="q-pa-md">
      <div class="text-h6 q-mb-lg">List of Budget Requests for Employee</div>

      <!-- Responsive Controls -->
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
                          class="q-px-sm width"
                          unelevated
                          square
                          color ="green"
                          icon="visibility"
                          size="sm"
                          label="View"
                          align="left"
                          @click="viewDetails(props.row)"
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
          <div v-for="row in paginatedRows" :key="row.id" class="q-mb-md">
            <q-card flat bordered class="mobile-card">
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-subtitle2">{{ row.dateCreated }}</div>
                  <div class="col-4 text-right">
                    <div class="text-subtitle2 text-grey-7">Status</div>
                    <div :class="getStatusColorClass(row.status)">
                      {{ row.status }}
                    </div>
                  </div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Employee Name</div>
                  <div>{{ row.employeeName }}</div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Project Name</div>
                  <div>{{ row.projectName }}</div>
                </div>

                <div class="row justify-start">
                  <q-btn flat round color="grey" icon="more_vert">
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item>
                          <div class="column q-gutter-y-sm full-width">
                            <q-btn
                              class="q-px-sm width"
                              unelevated
                              square
                              color ="green"
                              icon="visibility"
                              size="sm"
                              label="View"
                              align="left"
                              @click="viewDetails(row)"
                            />
                          </div>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
        <template v-else>
          <div class="full-width row flex-center q-pa-md text-grey-7">
            <div class="text-center">
              <div class="text-p">No Records Found</div>
            </div>
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
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'LBRForEmployee'
})

const search = ref('')
const sortBy = ref('dateCreated')
const descending = ref(false)

// Updated pagination with sorting state
const pagination = ref({
  sortBy: 'dateCreated',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

// Update column definitions
const columns = [
  {
    name: 'dateCreated',
    required: true,
    label: 'DATE CREATED',
    align: 'left',
    field: row => row.dateCreated,
    sortable: true
  },
  {
    name: 'employeeName',
    required: true,
    label: 'EMPLOYEE NAME',
    align: 'left',
    field: row => row.employeeName,
    sortable: true
  },
  {
    name: 'projectName',
    required: true,
    label: 'PROJECT NAME',
    align: 'left',
    field: row => row.projectName,
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'STATUS',
    align: 'left',
    field: row => row.status,
    sortable: true
  },
  {
    name: 'action',
    required: true,
    label: 'ACTION',
    align: 'center',
    field: row => row.action,
    sortable: false
  }
]

const rows = ref([
{
    id: 1,
    dateCreated: 'February 20, 2017',
    employeeName: 'John Smith',
    projectName: 'Website Redesign',
    status: 'Pending',
  },
  {
    id: 2,
    dateCreated: 'November 30, 2016',
    employeeName: 'Sarah Johnson',
    projectName: 'Mobile App Development',
    status: 'Approved',
  },
  {
    id: 3,
    dateCreated: 'March 15, 2018',
    employeeName: 'Emily Davis',
    projectName: 'E-commerce Platform',
    status: 'In Progress',
  },
  {
    id: 4,
    dateCreated: 'July 10, 2017',
    employeeName: 'Michael Brown',
    projectName: 'Cloud Migration',
    status: 'Completed',
  },
  {
    id: 5,
    dateCreated: 'September 25, 2019',
    employeeName: 'Jessica Wilson',
    projectName: 'API Integration',
    status: 'Pending',
  },
  {
    id: 6,
    dateCreated: 'January 5, 2020',
    employeeName: 'David Martinez',
    projectName: 'CRM Implementation',
    status: 'Approved',
  },
  {
    id: 7,
    dateCreated: 'April 18, 2021',
    employeeName: 'Sophia Taylor',
    projectName: 'Data Analytics Dashboard',
    status: 'In Progress',
  },
  {
    id: 8,
    dateCreated: 'June 12, 2018',
    employeeName: 'James Anderson',
    projectName: 'Network Security Upgrade',
    status: 'Completed',
  },
  {
    id: 9,
    dateCreated: 'October 8, 2022',
    employeeName: 'Olivia Thomas',
    projectName: 'AI Chatbot Development',
    status: 'Pending',
  },
  {
    id: 10,
    dateCreated: 'December 1, 2023',
    employeeName: 'Daniel Garcia',
    projectName: 'Blockchain Implementation',
    status: 'In Progress',
  },
])

// Custom sort function
const customSort = (rows, sortBy, descending) => {
  const data = [...rows]

  if (sortBy) {
    const column = columns.find(col => col.name === sortBy)
    if (!column || !column.sortable) return data

    data.sort((a, b) => {
      let compareResult = 0
      const valA = column.field(a)
      const valB = column.field(b)

      if (sortBy === 'dateCreated') {
        const dateA = new Date(valA)
        const dateB = new Date(valB)
        compareResult = dateA.getTime() - dateB.getTime()
      } else {
        compareResult = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase())
      }

      return descending ? -compareResult : compareResult
    })
  }

  return data
}

// Computed properties
const filteredRows = computed(() => {
  if (!search.value) return rows.value

  const searchLower = search.value.toLowerCase()
  return rows.value.filter(row =>
    row.employeeName.toLowerCase().includes(searchLower) ||
    row.projectName.toLowerCase().includes(searchLower) ||
    row.status.toLowerCase().includes(searchLower) ||
    row.dateCreated.toLowerCase().includes(searchLower)
  )
})

const sortedRows = computed(() => {
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

const paginatedRows = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return sortedRows.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(totalRows.value / pagination.value.rowsPerPage))
const startIndex = computed(() => totalRows.value === 0 ? 0 : (pagination.value.page - 1) * pagination.value.rowsPerPage + 1)
const endIndex = computed(() => Math.min(startIndex.value + pagination.value.rowsPerPage - 1, totalRows.value))
const isLastPage = computed(() => pagination.value.page >= totalPages.value)

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

const onUpdatePagination = (newPagination) => {
  pagination.value = {
    ...pagination.value,
    page: newPagination.page,
    rowsPerPage: newPagination.rowsPerPage,
    sortBy: newPagination.sortBy,
    descending: newPagination.descending,
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

const getStatusColorClass = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'text'
    case 'rejected':
      return 'text'
    case 'pending':
      return 'text'
    case 'in progress':
      return 'text'
    case 'completed':
      return 'text'
    default:
      return 'text'
  }
}

const viewDetails = (row) => {
  console.log('View details', row)
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

.mobile-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.width {
  width: 100%;
}

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

.q-mb-sm-xs {
  margin-bottom: 8px;
}
</style>

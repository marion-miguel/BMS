<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Missing Logs</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="format_list_bulleted" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <q-card class="q-pa-md">
      <div class="text-h6 q-mb-lg">Request for List of Missing Logs</div>

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

      <div class="gt-xs">
        <q-table
          :rows="paginatedRows"
          :columns="columns"
          row-key="uniqueId"
          flat
          :pagination="computedPagination"
          @update:pagination="onUpdatePagination"
          :sort-method="customSort"
          @request="onRequest"
          hide-pagination
          binary-state-sort
        >
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
                          color="green"
                          icon="visibility"
                          size="sm"
                          label="View"
                          align="left"
                          @click="onView(props.row)"
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

      <div class="lt-sm">
        <template v-if="paginatedRows.length">
          <div v-for="row in paginatedRows" :key="row.uniqueId" class="q-mb-md">
            <q-card flat bordered class="mobile-card">
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-subtitle2">{{ row.dateCreated }}</div>
                  <div class="col-4 text-right">
                    <div class="text-subtitle2 text-grey-7">Status</div>
                    <div>{{ row.status }}</div>
                  </div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Description</div>
                  <div>{{ row.description }}</div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Reason</div>
                  <div>{{ row.reason }}</div>
                </div>


                <div class="row justify-start">
                  <q-btn flat round icon="more_vert">
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item clickable @click="onView(row)">
                          <q-item-section avatar>
                            <q-btn
                              class="q-px-sm width"
                                unelevated
                                square
                                color="green"
                                icon="visibility"
                                size="sm"
                                label="View"
                                align="left"
                                @click="onView(props.row)"
                              />
                            </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>

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
import { useRouter } from 'vue-router'

defineOptions({
  name: 'MissingLogs'
})

// Data
const search = ref('')
const sortBy = ref('dateCreated')
const router = useRouter()
const descending = ref(false)

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
    name: 'description',
    required: true,
    label: 'DESCRIPTION',
    align: 'left',
    field: row => row.description,
    sortable: true
  },
  {
    name: 'reason',
    required: true,
    label: 'REASON',
    align: 'left',
    field: row => row.reason,
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
    field: row => row.action
  }
]

// Sample data with unique IDs
const rows = ref([
  {
    uniqueId: 1,
    dateCreated: 'September 16, 2024',
    description: 'System maintenance logs missing',
    reason: 'Server restart',
    status: 'Approved'
  },
  {
    uniqueId: 2,
    dateCreated: 'August 06, 2024',
    description: 'Access logs missing',
    reason: 'Network outage',
    status: 'Pending'
  },
  {
    uniqueId: 3,
    dateCreated: 'July 15, 2024',
    description: 'Security audit logs missing',
    reason: 'Configuration error',
    status: 'Rejected'
  },
  {
    uniqueId: 4,
    dateCreated: 'June 30, 2024',
    description: 'Application logs missing',
    reason: 'Disk space issue',
    status: 'Pending'
  },
  {
    uniqueId: 5,
    dateCreated: 'June 15, 2024',
    description: 'Database logs missing',
    reason: 'Backup failure',
    status: 'Approved'
  },
  {
    uniqueId: 6,
    dateCreated: 'May 28, 2024',
    description: 'Network logs missing',
    reason: 'Router malfunction',
    status: 'Pending'
  },
  {
    uniqueId: 7,
    dateCreated: 'May 14, 2024',
    description: 'Firewall logs missing',
    reason: 'System update',
    status: 'Rejected'
  },
  {
    uniqueId: 8,
    dateCreated: 'April 30, 2024',
    description: 'Authentication logs missing',
    reason: 'Service interruption',
    status: 'Approved'
  },
  {
    uniqueId: 9,
    dateCreated: 'April 15, 2024',
    description: 'Performance logs missing',
    reason: 'Memory overflow',
    status: 'Pending'
  },

  {
    uniqueId: 10,
    dateCreated: 'March 31, 2024',
    description: 'Error logs missing',
    reason: 'Application crash',
    status: 'Rejected'
  }
])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'dateCreated',
  descending: false,
  rowsNumber: 0
})
const customSort = (rows, sortBy, descending) => {
  const data = [...rows]

  if (sortBy) {
    const column = columns.find(col => col.name === sortBy)

    data.sort((a, b) => {
      let compareResult

      if (column.name === 'dateCreated') {
        compareResult = new Date(a[sortBy]) - new Date(b[sortBy])
      } else {
        const valA = column.field(a)
        const valB = column.field(b)
        compareResult = valA > valB ? 1 : (valA < valB ? -1 : 0)
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
// Computed properties
const filteredRows = computed(() => {
  if (!search.value) return rows.value
  const searchLower = search.value.toLowerCase()
  return rows.value.filter(row =>
    row.dateCreated.toLowerCase().includes(searchLower) ||
    row.description.toLowerCase().includes(searchLower) ||
    row.reason.toLowerCase().includes(searchLower) ||
    row.status.toLowerCase().includes(searchLower)
  )
})
const sortedAndFilteredRows = computed(() => {
  return customSort(
    filteredRows.value,
    pagination.value.sortBy,
    pagination.value.descending
  )
})
const paginatedRows = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return sortedAndFilteredRows.value.slice(start, end)
})
const totalRows = computed(() => filteredRows.value.length)
const totalPages = computed(() => Math.ceil(totalRows.value / pagination.value.rowsPerPage))
const startIndex = computed(() => totalRows.value === 0 ? 0 : (pagination.value.page - 1) * pagination.value.rowsPerPage + 1)
const endIndex = computed(() => Math.min(startIndex.value + pagination.value.rowsPerPage - 1, totalRows.value))
const isLastPage = computed(() => pagination.value.page >= totalPages.value)

const computedPagination = computed(() => ({
  ...pagination.value,
  rowsNumber: filteredRows.value.length
}))



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
  // Preserve the sorting state while updating pagination
  pagination.value = {
    ...pagination.value,
    page: newPagination.page,
    rowsPerPage: newPagination.rowsPerPage,
    sortBy: newPagination.sortBy,
    descending: newPagination.descending
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

const onView = (row) => {
  router.push({
    path: '/MLV',
    query: {
      date: row.dateCreated,
      description: row.description,
      reason: row.reason,
      status: row.status
    }
  })
}
</script>

<style>
.entries-select {
  min-width: 75px;
}

.search-input {
  width: 200px;
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

/* Additional styles for better table presentation */
.q-table th {
  font-weight: 600;
}

.mobile-card {
  border: 1px solid #e0e0e0;
}

.mobile-card .q-card-section {
  padding: 16px;
}

/* Hover effect for table rows */
.q-table tbody tr:hover {
  background-color: #f5f5f5;
}

/* Style for active page button */
.bg-primary.text-white {
  font-weight: 500;
}
}
</style>

<template>
  <q-page padding>
    <!-- Header with Navigation -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Payslip</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="receipt_long" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <!-- Main Content Card -->
    <q-card class="q-pa-md">
      <div class="text-h6 q-mb-lg">List of Payslips</div>

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
          :sort-method="customSort"
          @request="onRequest"
          hide-pagination
          binary-state-sort
        >
          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey-7">
              <div class="text-center">
                <div class="text-p">No Records Found</div>
              </div>
            </div>
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
                          color="green"
                          icon="visibility"
                          size="sm"
                          label="View"
                          align="left"
                          @click="viewPayslip(props.row)"
                        />
                        <q-btn
                          class="q-px-sm width"
                          unelevated
                          square
                          color="green"
                          icon="download"
                          size="sm"
                          label="Download"
                          align="left"
                          @click="downloadPayslip(props.row)"
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
                  <div class="text-subtitle2">{{ row.datePosted }}</div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Payroll Period</div>
                  <div>{{ row.payrollDate }}</div>
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
                              color="green"
                              icon="visibility"
                              size="sm"
                              label="View"
                              align="left"
                              @click="viewPayslip(row)"
                            />
                            <q-btn
                              class="q-px-sm width"
                              unelevated
                              square
                              color="green"
                              icon="download"
                              size="sm"
                              label="Download"
                              align="left"
                              @click="downloadPayslip(row)"
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
  name: 'PayslipPage'
})

const search = ref('')
const columns = [
  {
    name: 'datePosted',
    required: true,
    label: 'DATE POSTED',
    align: 'left',
    field: row => row.datePosted,
    sortable: true
  },
  {
    name: 'payrollDate',
    required: true,
    label: 'PAYROLL PERIOD',
    align: 'left',
    field: row => row.payrollDate,
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

const rows = ref([
  {
    id: 1,
    datePosted: 'September 20, 2024',
    payrollDate: 'August 10, 2024 - August 25, 2024',
  },
  {
    id: 2,
    datePosted: 'September 20, 2024',
    payrollDate: 'August 26, 2024 - September 10, 2024',
  },
  {
    id: 3,
    datePosted: 'October 5, 2024',
    payrollDate: 'September 11, 2024 - September 25, 2024',
  },
  {
    id: 4,
    datePosted: 'October 20, 2024',
    payrollDate: 'September 26, 2024 - October 10, 2024',
  },
  {
    id: 5,
    datePosted: 'November 5, 2024',
    payrollDate: 'October 11, 2024 - October 25, 2024',
  },
  {
    id: 6,
    datePosted: 'November 20, 2024',
    payrollDate: 'October 26, 2024 - November 10, 2024',
  },
  {
    id: 7,
    datePosted: 'December 5, 2024',
    payrollDate: 'November 11, 2024 - November 25, 2024',
  },
  {
    id: 8,
    datePosted: 'December 20, 2024',
    payrollDate: 'November 26, 2024 - December 10, 2024',
  },
  {
    id: 9,
    datePosted: 'January 5, 2025',
    payrollDate: 'December 11, 2024 - December 25, 2024',
  },
  {
    id: 10,
    datePosted: 'January 20, 2025',
    payrollDate: 'December 26, 2024 - January 10, 2025',
  },
])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'datePosted',
  descending: false,
  rowsNumber: 0
})

// Custom sort method
const customSort = (rows, sortBy, descending) => {
  const data = [...rows]

  if (sortBy) {
    const column = columns.find(col => col.name === sortBy)

    data.sort((a, b) => {
      let compareResult

      if (column.name === 'datePosted') {
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

// Request handler for table
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

// Computed properties with sorting
const filteredRows = computed(() => {
  if (!search.value) return rows.value

  const searchLower = search.value.toLowerCase()
  return rows.value.filter(row =>
    row.datePosted.toLowerCase().includes(searchLower) ||
    row.payrollDate.toLowerCase().includes(searchLower)
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

function viewPayslip(row) {
  console.log('Viewing payslip:', row)
}

function downloadPayslip(row) {
  console.log('Downloading payslip:', row)
}

// Insert Payslip Function
function insertPayslip(datePosted, payrollDate) {
  const newPayslip = {
    id: rows.value.length + 1,
    datePosted,
    payrollDate
  }
  rows.value.push(newPayslip)
  console.log('New payslip added:', newPayslip)
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

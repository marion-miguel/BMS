<template>
  <q-page padding>
    <!-- Header with Navigation -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Employee List</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="format_list_bulleted" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <!-- Main Content Card -->
    <q-card class="q-pa-md">
      <div class="row justify-between items-center q-mb-lg column-mobile">
        <div class="text-h6 q-mb-sm-mobile">Division Performance Commitment and Review (DivPCR)</div>
        <q-btn
          color="green"
          label="Add DivPCR"
          icon="add"
          to="/EIPCR"
        />
      </div>

      <q-tabs
        v-model="activeTab"
        class="text-green custom-tabs q-mb-md"
        indicator-color="green"
        :breakpoint="0"
        dense
        align="center"
        mobile-arrows
        narrow-indicator
        inline-label
      >
        <q-tab
          name="ipcr"
          :label="$q.screen.lt.sm ? 'IPCR' : 'Individual Performance Commitment and Review'"
          class="text-weight-medium custom-tab"
          :class="{ 'active-tab': activeTab === 'ipcr' }"
          @click="$router.push('/IPCRPage')"
        >
          <q-tooltip>Individual Performance Commitment and Review</q-tooltip>
        </q-tab>
        <q-tab
          name="divpcr"
          :label="$q.screen.lt.sm ? 'DivPCR' : 'Division Performance Commitment and Review'"
          class="text-weight-medium custom-tab"
          :class="{ 'active-tab': activeTab === 'divpcr' }"
        >
          <q-tooltip>Division Performance Commitment and Review</q-tooltip>
        </q-tab>
      </q-tabs>

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
          @request="onRequest"
          hide-pagination
          binary-state-sort
          @update:pagination="onUpdatePagination"
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
            {{ props.row.status }}
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
                      color="primary"
                      icon="visibility"
                      size="sm"
                      label="View"
                      align="left"
                    />
                    <q-btn
                      class="q-px-sm width"
                      unelevated
                      square
                      color="warning"
                      icon="edit"
                      size="sm"
                      label="Edit"
                      align="left"
                    />
                    <q-btn
                      class="q-px-sm width"
                      unelevated
                      square
                      color="negative"
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
          <div v-for="row in paginatedRows" :key="row.id" class="q-mb-md">
            <q-card flat bordered class="mobile-card">
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle2">{{ row.periodCover }}</div>
                <div>{{ row.status }}</div>
              </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Final Numerical Rating</div>
                  <div>{{ row.finalNumericalRating }}</div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Final Adjectival Rating</div>
                  <div>{{ row.finalAdjectivalRating }}</div>
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
                            color="primary"
                            icon="visibility"
                            size="sm"
                            label="View"
                            align="left"
                          />
                          <q-btn
                            class="q-px-sm width"
                            unelevated
                            square
                            color="warning"
                            icon="edit"
                            size="sm"
                            label="Edit"
                            align="left"
                          />
                          <q-btn
                            class="q-px-sm width"
                            unelevated
                            square
                            color="negative"
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
  name: 'DivPCRList'
})

const activeTab = ref('divpcr')
const search = ref('')
const sortBy = ref('periodCover')
const descending = ref(false)

const columns = [
  {
    name: 'periodCover',
    required: true,
    label: 'PERIOD COVER',
    align: 'left',
    field: row => row.periodCover,
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
    name: 'finalNumericalRating',
    required: true,
    label: 'FINAL NUMERICAL RATING',
    align: 'left',
    field: row => row.finalNumericalRating,
    sortable: true
  },
  {
    name: 'finalAdjectivalRating',
    required: true,
    label: 'FINAL ADJECTIVAL RATING',
    align: 'left',
    field: row => row.finalAdjectivalRating,
    sortable: true
  },
  {
    name: 'action',
    required: true,
    label: 'ACTION',
    align: 'center',
    sortable: false
  }
]

const rows = ref([
  {
    id: 1,
    periodCover: 'September 20, 2024 - September 21, 2024',
    status: 'Draft',
    finalNumericalRating: '18.00',
    finalAdjectivalRating: 'Outstanding'
  },
  {
    id: 2,
    periodCover: 'September 21, 2024 - September 22, 2024',
    status: 'Draft',
    finalNumericalRating: '0.00',
    finalAdjectivalRating: 'Poor'
  },
  {
    id: 3,
    periodCover: 'September 23, 2024 - September 27, 2024',
    status: 'Draft',
    finalNumericalRating: '0.00',
    finalAdjectivalRating: 'Poor'
  },
  {
    id: 4,
    periodCover: 'September 28, 2024 - September 30, 2024',
    status: 'Finalized',
    finalNumericalRating: '15.50',
    finalAdjectivalRating: 'Very Good'
  },
  {
    id: 5,
    periodCover: 'October 1, 2024 - October 5, 2024',
    status: 'Finalized',
    finalNumericalRating: '19.00',
    finalAdjectivalRating: 'Excellent'
  },
  {
    id: 6,
    periodCover: 'October 6, 2024 - October 10, 2024',
    status: 'Draft',
    finalNumericalRating: '14.00',
    finalAdjectivalRating: 'Good'
  },
  {
    id: 7,
    periodCover: 'October 11, 2024 - October 15, 2024',
    status: 'Draft',
    finalNumericalRating: '17.00',
    finalAdjectivalRating: 'Very Good'
  },
  {
    id: 8,
    periodCover: 'October 16, 2024 - October 20, 2024',
    status: 'Finalized',
    finalNumericalRating: '18.50',
    finalAdjectivalRating: 'Outstanding'
  },
  {
    id: 9,
    periodCover: 'October 21, 2024 - October 25, 2024',
    status: 'Finalized',
    finalNumericalRating: '16.00',
    finalAdjectivalRating: 'Good'
  },
  {
    id: 10,
    periodCover: 'October 26, 2024 - October 30, 2024',
    status: 'Draft',
    finalNumericalRating: '0.00',
    finalAdjectivalRating: 'Poor'
  }
])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'periodCover',
  descending: false,
  rowsNumber: 0
})

const customSort = (rows, sortBy, descending) => {
  const data = [...rows]

  if (sortBy) {
    data.sort((a, b) => {
      let valA, valB

      // Handle different column types
      switch (sortBy) {
        case 'periodCover':
          // Parse dates and compare
          valA = new Date(a.periodCover.split(' - ')[0])
          valB = new Date(b.periodCover.split(' - ')[0])
          break
        case 'status':
          valA = a.status.toLowerCase()
          valB = b.status.toLowerCase()
          break
        case 'finalNumericalRating':
          // Convert to number for numeric sorting
          valA = parseFloat(a.finalNumericalRating)
          valB = parseFloat(b.finalNumericalRating)
          break
        case 'finalAdjectivalRating':
          valA = a.finalAdjectivalRating.toLowerCase()
          valB = b.finalAdjectivalRating.toLowerCase()
          break
        default:
          valA = a[sortBy]
          valB = b[sortBy]
      }

      // Comparison logic
      if (valA === valB) return 0
      if (valA === null || valA === undefined) return descending ? 1 : -1
      if (valB === null || valB === undefined) return descending ? -1 : 1

      const compareResult = valA > valB ? 1 : (valA < valB ? -1 : 0)
      return descending ? -compareResult : compareResult
    })
  }

  return data
}


const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination

  pagination.value = {
    ...pagination.value,
    page: page || 1,
    rowsPerPage: rowsPerPage || 5,
    sortBy: sortBy || 'periodCover',
    descending: descending || false,
    rowsNumber: filteredRows.value.length
  }
}

const filteredRows = computed(() => {
  if (!search.value) return rows.value
  const searchLower = search.value.toLowerCase()
  return rows.value.filter(row =>
    row.periodCover.toLowerCase().includes(searchLower) ||
    row.status.toLowerCase().includes(searchLower) ||
    row.finalNumericalRating.toLowerCase().includes(searchLower) ||
    row.finalAdjectivalRating.toLowerCase().includes(searchLower)
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
    sortBy: newPagination.sortBy || pagination.value.sortBy,
    descending: newPagination.descending !== undefined
      ? newPagination.descending
      : pagination.value.descending
  }
}
const onPreviousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
  }
}

const onNextPage = () => {
  if (pagination.value.page < totalPages.value) {
    pagination.value.page++
  }
}

// Action handlers
const onView = (row) => {
  console.log('View:', row)
  // Implement view logic
}

const onEdit = (row) => {
  console.log('Edit:', row)
  // Implement edit logic
}

const onDelete = (row) => {
  console.log('Delete:', row)
  // Implement delete logic
}
</script>

<style>
.entries-select {
  min-width: 75px;
}
.custom-tabs {
  border-radius: 4px;
  background: #f5f5f5;
}

.custom-tab {
  padding: 8px 16px;
  transition: all 0.3s ease;
  border-radius: 4px;
  margin: 4px;
}

.active-tab {
  color: green !important;
}

.custom-tab:hover:not(.active-tab) {
  background: rgba(76, 175, 80, 0.1);
}

.search-input {
  width: 200px;
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
@media (max-width: 599px) {
  .column-mobile {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .q-mb-sm-mobile {
    margin-bottom: 12px;
  }

  .mobile-full-width {
    width: 100%;
  }
}
</style>

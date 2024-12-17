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
      <div class="text-h6 q-mb-lg">Individual Performance Commitment and Review (IPCR)</div>

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
        >
          <q-tooltip>Individual Performance Commitment and Review</q-tooltip>
        </q-tab>
        <q-tab
          name="divpcr"
          :label="$q.screen.lt.sm ? 'DivPCR' : 'Division Performance Commitment and Review'"
          class="text-weight-medium custom-tab"
          :class="{ 'active-tab': activeTab === 'divpcr' }"
          @click="$router.push('/DIVPCRPage')"
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
        row-key="uniqueId"
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
                  <div class="text-subtitle2">{{ row.employeeName }}</div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Position</div>
                  <div>{{ row.position }}</div>
                </div>

                <div class="row justify-start">
                  <q-btn flat round color="grey" icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item>
                  <q-btn
                  class="q-px-sm width"
                  unelevated
                  square
                  color="green"
                  icon="visibility"
                  size="sm"
                  label="View"
                  align="left"
                  />
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
  name: 'EmployeeList'
})
const activeTab = ref('ipcr')
const search = ref('')
const columns = [
  {
    name: 'employeeName',
    required: true,
    label: 'EMPLOYEE NAME',
    align: 'left',
    field: row => row.employeeName,
    sortable: true
  },
  {
    name: 'position',
    required: true,
    label: 'POSITION',
    align: 'left',
    field: row => row.position,
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
    employeeName: 'NADINE LUSTRE',
    position: 'Jr System Developer'
  },
  {
    id: 2,
    employeeName: 'SYDNEY SALONGA',
    position: 'CSR'
  },
  {
    id: 3,
    employeeName: 'JESSICA MANALASTAS',
    position: 'Admin/HR Assistant'
  },
  {
    id: 4,
    employeeName: 'LORELIE PATDU',
    position: 'Admin/HR Head'
  },
  {
    id: 5,
    employeeName: 'JONALD ADVINCULA',
    position: 'Utility/Liaison'
  },
  {
    id: 6,
    employeeName: 'ORLANDO TIMBOL',
    position: 'Project Management Head'
  },
  {
    id: 7,
    employeeName: 'ROLAND AGCALAO',
    position: 'Electrician'
  },
  {
    id: 8,
    employeeName: 'DOMINADOR TIMBOL',
    position: 'Technical Supervisor'
  },
  {
    id: 9,
    employeeName: 'CARL JERVIN AMORIN',
    position: 'Project Manager'
  },
  {
    id: 10,
    employeeName: 'ROBERT TIMBOL',
    position: 'Project Management Head'
  }
])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: null,
  descending: false,
  rowsNumber: 0
})

const computedPagination = computed(() => ({
  ...pagination.value,
  rowsNumber: filteredRows.value.length
}))

const customSort = (rows, sortBy, descending) => {
  const data = [...rows]

  if (sortBy) {
    const column = columns.find(col => col.name === sortBy)

    data.sort((a, b) => {
      let compareResult

      if (column.name === 'dateCreated' || column.name === 'periodCover') {
        compareResult = new Date(a[sortBy]) - new Date(b[sortBy])
      } else if (column.name === 'finalNumericalRating') {
        compareResult = parseFloat(a[sortBy]) - parseFloat(b[sortBy])
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

const sortedAndFilteredRows = computed(() => {
  return customSort(
    filteredRows.value,
    pagination.value.sortBy,
    pagination.value.descending
  )
})

const filteredRows = computed(() => {
  if (!search.value) return rows.value

  const searchLower = search.value.toLowerCase()
  return rows.value.filter(row =>
    row.employeeName.toLowerCase().includes(searchLower) ||
    row.position.toLowerCase().includes(searchLower)
  )
})

const totalRows = computed(() => filteredRows.value.length)
const totalPages = computed(() => Math.ceil(totalRows.value / pagination.value.rowsPerPage))
const startIndex = computed(() => totalRows.value === 0 ? 0 : (pagination.value.page - 1) * pagination.value.rowsPerPage + 1)
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
    pagination.value.page--
  }
}

const onNextPage = () => {
  if (pagination.value.page < totalPages.value) {
    pagination.value.page++
  }
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

@media (max-width: 599px) {
  .search-input {
    width: 100% !important;
  }

  .entries-select {
    width: 75px !important;
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

/* Rest of the existing styles remain the same */
.search-input {
  width: 200px;
}

.q-table {
  background-color: white;
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

<template>
  <q-page padding>
    <!-- Header with Navigation -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Budget</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="request_quote" />
        <q-breadcrumbs-el label="Requests" />
      </q-breadcrumbs>
    </div>

    <!-- Main Content Card -->
    <q-card class="q-pa-md">
      <!-- Title and Apply Button -->
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 q-mb-sm">List of Budget Requests</div>
        <q-btn
          label="Apply"
          color="green"
          text-color="white"
          unelevated
          class="q-px-lg"
          icon="add"
          size="md"
          to="/FEBudgetRequestForm"
        />
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
                          color="green"
                          icon="print"
                          size="sm"
                          label="Print"
                          align="left"
                          @click="printRequest(props.row)"
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
          <q-card v-for="request in paginatedRows" :key="request.uniqueId" flat bordered class="mobile-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle2">{{ request.dateCreated }}</div>
                <div class="text-right">
                  <div class="text-subtitle2 text-grey-7">Status</div>
                  <div :class="getStatusColorClass(request.status)">{{ request.status }}</div>
                </div>
              </div>

              <div class="q-gutter-y-sm">
                <div>
                  <div class="text-caption text-grey-7">RFP Number</div>
                  <div>{{ request.rfpNumber }}</div>
                </div>

                <div>
                  <div class="text-caption text-grey-7">Project Name</div>
                  <div>{{ request.projectName }}</div>
                </div>
              </div>

              <div class="row justify-start q-mt-sm">
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
                            @click="viewRequest(request)"
                          />
                          <q-btn
                            class="q-px-sm full-width"
                            unelevated
                            square
                            color="green"
                            icon="print"
                            size="sm"
                            label="Print"
                            align="left"
                            @click="printRequest(request)"
                          />
                        </div>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </template>
        <template v-else>
          <div class="text-center q-pa-md text-grey-8">
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

    <!-- View Dialog -->
    <q-dialog v-model="showViewDialog" persistent>
      <!-- Dialog content here -->
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'ForEmployee'
})

const $q = useQuasar()
const router = useRouter()

const search = ref('')
const showViewDialog = ref(false)
const selectedRequest = ref(null)

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
    name: 'rfpNumber',
    required: true,
    label: 'RFP NUMBER',
    align: 'left',
    field: row => row.rfpNumber,
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
    field: row => row.action
  }
]

// Add uniqueId to each budget request
const budgetRequests = ref([
{
    uniqueId: 1,
    dateCreated: 'February 20, 2024',
    rfpNumber: 'RFP000016',
    projectName: 'Project Alpha',
    status: 'Pending',
    purpose: 'Operating Expenses'
  },
  {
    uniqueId: 2,
    dateCreated: 'March 15, 2024',
    rfpNumber: 'RFP000017',
    projectName: 'Project Beta',
    status: 'Approved',
    purpose: 'Capital Expenditure'
  },
  {
    uniqueId: 3,
    dateCreated: 'April 5, 2024',
    rfpNumber: 'RFP000018',
    projectName: 'Project Gamma',
    status: 'Completed',
    purpose: 'Research and Development'
  },
  {
    uniqueId: 4,
    dateCreated: 'May 10, 2024',
    rfpNumber: 'RFP000019',
    projectName: 'Project Delta',
    status: 'In Progress',
    purpose: 'Marketing'
  },
  {
    uniqueId: 5,
    dateCreated: 'June 12, 2024',
    rfpNumber: 'RFP000020',
    projectName: 'Project Epsilon',
    status: 'Pending',
    purpose: 'IT Infrastructure'
  },
  {
    uniqueId: 6,
    dateCreated: 'July 8, 2024',
    rfpNumber: 'RFP000021',
    projectName: 'Project Zeta',
    status: 'Approved',
    purpose: 'Employee Welfare'
  },
  {
    uniqueId: 7,
    dateCreated: 'August 19, 2024',
    rfpNumber: 'RFP000022',
    projectName: 'Project Eta',
    status: 'Completed',
    purpose: 'Sustainability'
  },
  {
    uniqueId: 8,
    dateCreated: 'September 22, 2024',
    rfpNumber: 'RFP000023',
    projectName: 'Project Theta',
    status: 'In Progress',
    purpose: 'Client Acquisition'
  },
  {
    uniqueId: 9,
    dateCreated: 'October 3, 2024',
    rfpNumber: 'RFP000024',
    projectName: 'Project Iota',
    status: 'Pending',
    purpose: 'Legal Compliance'
  },
  {
    uniqueId: 10,
    dateCreated: 'November 11, 2024',
    rfpNumber: 'RFP000025',
    projectName: 'Project Kappa',
    status: 'Approved',
    purpose: 'Product Development'
  }
  // ... rest of your data with uniqueIds
].map((request, index) => ({ ...request, uniqueId: index + 1 })))

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'dateCreated',
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

// Request handler for table
const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination

  pagination.value = {
    ...pagination.value,
    page,
    rowsPerPage,
    sortBy,
    descending,
    rowsNumber: filteredRequests.value.length
  }
}

// Computed properties with sorting
const filteredRequests = computed(() => {
  if (!search.value) return budgetRequests.value

  const searchLower = search.value.toLowerCase()
  return budgetRequests.value.filter(request =>
    request.projectName.toLowerCase().includes(searchLower) ||
    request.rfpNumber.toLowerCase().includes(searchLower) ||
    request.status.toLowerCase().includes(searchLower) ||
    request.dateCreated.toLowerCase().includes(searchLower)
  )
})

const sortedAndFilteredRows = computed(() => {
  return customSort(
    filteredRequests.value,
    pagination.value.sortBy,
    pagination.value.descending
  )
})

const paginatedRows = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return sortedAndFilteredRows.value.slice(start, end)
})

const totalRows = computed(() => filteredRequests.value.length)
const totalPages = computed(() => Math.ceil(totalRows.value / pagination.value.rowsPerPage))
const startIndex = computed(() => totalRows.value === 0 ? 0 : (pagination.value.page - 1) * pagination.value.rowsPerPage + 1)
const endIndex = computed(() => Math.min(startIndex.value + pagination.value.rowsPerPage - 1, totalRows.value))
const isLastPage = computed(() => pagination.value.page >= totalPages.value)

const computedPagination = computed(() => ({
  ...pagination.value,
  rowsNumber: filteredRequests.value.length
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

const viewRequest = (request) => {
  selectedRequest.value = request
  showViewDialog.value = true
}

const printRequest = (request) => {
  selectedRequest.value = request
  // Implement print functionality
  console.log('Printing request:', request)
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

.full-width {
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

  .q-mb-sm-xs {
    margin-bottom: 8px;
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
</style>

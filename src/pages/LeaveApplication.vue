<template>
  <q-page padding>
    <!-- Header with Navigation -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Leave</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="event_busy" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <!-- Main Content Card -->
    <q-card class="q-pa-md">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 q-mb-sm">Leave Application</div>
        <q-btn
          label="Apply"
          unelevated
          color="green"
          class="q-px-md"
          icon="add"
          to="/LeaveForm"
        />
      </div>

      <!-- Table Controls -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="row items-center">
          <span class="q-mr-sm">Show</span>
          <q-select
            v-model="pagination.rowsPerPage"
            :options="[5, 10, 20, 50]"
            dense
            outlined
            class="entries-select"
            style="width: 65px"

            @update:model-value="onRowsPerPageChange"
          />
          <span class="q-ml-sm">entries</span>
        </div>

        <div class="row items-center">
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
      <div v-if="$q.screen.gt.xs">
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
            <div class="full-width row flex-center q-pa-md text-grey-8">
              No Records Found
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
            <q-btn flat round icon="more_vert">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item>
                    <div class="column q-gutter-y-sm full-width">
                      <q-btn
                        class="q-px-sm full-width"
                        unelevated
                        square
                        icon="visibility"
                        color="green"
                        size="sm"
                        label="View"
                        align="left"
                        @click="viewRequest(props.row)"
                      />
                      <q-btn
                        v-if="props.row.status === 'Pending'"
                        class="q-px-sm full-width"
                        unelevated
                        square
                        icon="edit"
                        color="orange"
                        size="sm"
                        label="Edit"
                        align="left"
                        @click="editRequest(props.row)"
                      />
                      <q-btn
                        v-if="props.row.status === 'Pending'"
                        class="q-px-sm full-width"
                        unelevated
                        square
                        icon="delete"
                        color="red"
                        size="sm"
                        label="Delete"
                        align="left"
                        @click="deleteRequest(props.row)"
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
      <div v-else class="q-gutter-y-md">
        <template v-if="paginatedRows.length">
          <q-card v-for="row in paginatedRows" :key="row.id" flat bordered class="mobile-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle2 text-weight-medium">{{ row.dateCreated }}</div>
                <div class="text-right">
                  <div class="text-subtitle2 text-grey-7">Status</div>
                  <div :class="getStatusColorClass(row.status)">{{ row.status }}</div>
                </div>
              </div>

              <div class="q-gutter-y-sm">
                <div>
                  <div class="text-caption text-grey-7">Leave Date</div>
                  <div class="text-body2">{{ row.leaveDate }}</div>
                </div>

                <div>
                  <div class="text-caption text-grey-7">Type of Leave</div>
                  <div class="text-body2">{{ row.typeOfLeave }}</div>
                </div>
              </div>

              <div class="row justify-start q-mt-sm">
              <q-btn flat round icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item>
                      <div class="column q-gutter-y-sm full-width">
                        <q-btn
                          class="q-px-sm full-width"
                          unelevated
                          square
                          icon="visibility"
                          color="green"
                          size="sm"
                          label="View"
                          align="left"
                          @click="viewRequest(row)"
                        />
                        <q-btn
                          v-if="row.status === 'Pending'"
                          class="q-px-sm full-width"
                          unelevated
                          square
                          icon="edit"
                          color="orange"
                          size="sm"
                          label="Edit"
                          align="left"
                          @click="editRequest(row)"
                        />
                        <q-btn
                          v-if="row.status === 'Pending'"
                          class="q-px-sm full-width"
                          unelevated
                          square
                          icon="delete"
                          color="red"
                          size="sm"
                          label="Delete"
                          align="left"
                          @click="deleteRequest(row)"
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
            No Records Found
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <div v-if="totalRows > 0" class="row justify-between items-center q-mt-md flex-wrap">
        <div class="col-12 col-sm-auto text-grey-8 q-mb-sm-xs text-center text-sm-left">
          Showing {{ startIndex }} to {{ endIndex }} of {{ totalRows }} entries
        </div>
        <div class="col-12 col-sm-auto">
          <div class="row q-gutter-sm justify-center">
            <q-btn
              flat
              label="Previous"
              :disable="pagination.page === 1"
              @click="onPreviousPage"
            />
            <template v-for="pageNum in displayedPages" :key="pageNum">
              <q-btn
                flat
                :label="String(pageNum)"
                :class="{ 'bg-primary text-white': pageNum === pagination.page }"
                @click="pagination.page = pageNum"
              />
            </template>
            <q-btn
              flat
              label="Next"
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
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'LeaveApplication'
})

const router = useRouter()
const $q = useQuasar()

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
    name: 'leaveDate',
    required: true,
    label: 'LEAVE DATE',
    align: 'left',
    field: row => row.leaveDate,
    sortable: true
  },
  {
    name: 'typeOfLeave',
    required: true,
    label: 'TYPE OF LEAVE',
    align: 'left',
    field: row => row.typeOfLeave,
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

const sortBy = ref('dateCreated')
const descending = ref(false)

const customSort = (rows, sortBy, descending) => {
  const data = [...rows]

  if (sortBy) {
    const column = columns.find(col => col.name === sortBy)

    data.sort((a, b) => {
      let compareResult

      if (column.name === 'dateCreated' || column.name === 'leaveDate') {
        // Extract first date for leaveDate comparison
        const getDate = (value) => {
          if (column.name === 'leaveDate') {
            return new Date(value.split('-')[0].trim())
          }
          return new Date(value)
        }
        compareResult = getDate(a[sortBy]) - getDate(b[sortBy])
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

const search = ref('')
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: null,
  descending: false,
  rowsNumber: 0
})

const filteredRows = computed(() => {
  if (!search.value) return rows.value
  const searchLower = search.value.toLowerCase()
  return rows.value.filter(row =>
    row.dateCreated.toLowerCase().includes(searchLower) ||
    row.leaveDate.toLowerCase().includes(searchLower) ||
    row.typeOfLeave.toLowerCase().includes(searchLower) ||
    row.status.toLowerCase().includes(searchLower) ||
    row.employeeName.toLowerCase().includes(searchLower)
  )
})

const sortedAndFilteredRows = computed(() => {
  return customSort(
    filteredRows.value,
    pagination.value.sortBy,
    pagination.value.descending
  )
})

const computedPagination = computed(() => ({
  ...pagination.value,
  rowsNumber: filteredRows.value.length
}))

const paginatedRows = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return sortedAndFilteredRows.value.slice(start, end)
})

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


const totalRows = computed(() => filteredRows.value.length)
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

const onRowsPerPageChange = (newRowsPerPage) => {
  pagination.value = {
    ...pagination.value,
    rowsPerPage: newRowsPerPage,
    page: 1
  }
}

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
  if (!isLastPage.value) {
    pagination.value.page++
  }
}

const viewRequest = (row) => {
  router.push({
    path: '/LAV',
    query: {
      id: row.id,
      dateCreated: row.dateCreated,
      employeeName: row.employeeName,
      leaveDate: row.leaveDate,
      typeOfLeave: row.typeOfLeave,
      status: row.status
    }
  })
}

// Add these functions in your script setup section after viewRequest:

const editRequest = (row) => {
  router.push({
    path: '/LAE',
    query: {
      id: row.id,
      dateCreated: row.dateCreated,
      employeeName: row.employeeName,
      leaveDate: row.leaveDate,
      typeOfLeave: row.typeOfLeave,
      status: row.status
    }
  })
}
const deleteRequest = async (row) => {
  try {
    const confirmed = await $q.dialog({
      title: 'Delete Leave Request',
      message: `Are you sure you want to delete this leave request for ${row.employeeName}?`,
      ok: {
        label: 'Delete',
        color: 'negative',
        flat: false
      },
      cancel: {
        label: 'Cancel',
        color: 'grey',
        flat: true
      },
      persistent: true,
      html: true // Enable HTML content in message
    }).onOk(async () => {
      try {
        // In a real application, you would make an API call here
        // await api.deleteLeaveRequest(row.id)

        // Remove from local data
        const index = rows.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
          // Remove the item
          rows.value.splice(index, 1)

          // Update pagination if necessary
          if (paginatedRows.value.length === 0 && pagination.value.page > 1) {
            pagination.value.page--
          }

          $q.notify({
            message: 'Leave request deleted successfully',
            type: 'positive',
            position: 'top',
            timeout: 2000
          })
        } else {
          throw new Error('Leave request not found')
        }
      } catch (error) {
        $q.notify({
          message: 'Failed to delete leave request',
          type: 'negative',
          position: 'top',
          timeout: 2000
        })
      }
    })
  } catch (error) {
    console.error('Delete operation error:', error)
    $q.notify({
      message: 'Error processing delete operation',
      type: 'negative',
      position: 'top',
      timeout: 2000
    })
  }
}


const approveRequest = async (row) => {
  try {
    const confirmed = await $q.dialog({
      title: 'Approve Leave Request',
      message: 'Are you sure you want to approve this leave request?',
      ok: {
        label: 'Approve',
        push: true
      },
      cancel: {
        label: 'Cancel',
        flat: true
      },
      persistent: true
    }).onOk(() => true).onCancel(() => false)

    if (confirmed) {
      const index = rows.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        rows.value[index].status = 'Approved'
        $q.notify({
          message: 'Leave request approved successfully',
          position: 'top',
          type: 'positive'
        })
      }
    }
  } catch (error) {
    $q.notify({
      message: 'Error approving leave request',
      position: 'top',
      type: 'negative'
    })
  }
}

const declineRequest = async (row) => {
  try {
    const confirmed = await $q.dialog({
      title: 'Decline Leave Request',
      message: 'Are you sure you want to decline this leave request?',
      ok: {
        label: 'Decline',
        push: true
      },
      cancel: {
        label: 'Cancel',
        flat: true
      },
      persistent: true
    }).onOk(() => true).onCancel(() => false)

    if (confirmed) {
      const index = rows.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        rows.value[index].status = 'Declined'
        $q.notify({
          message: 'Leave request declined',
          position: 'top',
          type: 'negative'
        })
      }
    }
  } catch (error) {
    $q.notify({
      message: 'Error declining leave request',
      position: 'top',
      type: 'negative'
    })
  }
}

const getStatusColorClass = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'text'
    case 'declined':
    case 'rejected':
      return 'text'
    case 'pending':
      return 'text'
    default:
      return 'text'
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

.q-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.mobile-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  transition: box-shadow 0.3s ease;
}

.mobile-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.full-width {
  width: 100%;
}

@media (max-width: 599px) {
  .search-input {
    width: 100%;
  }

  .entries-select {
    width: 65px;
  }

  .q-page {
    padding: 8px;
  }

  .q-card {
    padding: 12px;
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
    width: 200px;
  }

  .q-card {
    padding: 20px;
  }

  .q-mb-sm-xs {
    margin-bottom: 0;
  }
}
</style>

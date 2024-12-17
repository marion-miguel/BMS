// ListFileOvertime.vue
<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Overtime</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="schedule" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <!-- Content Card -->
    <q-card class="q-pa-md">
      <!-- Header with Add Button -->
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 q-mb-sm">List File Overtime</div>
        <q-btn
          label="Apply"
          unelevated
          color="green"
          class="q-px-md"
          icon="add"
          to="/FormOvertime"
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
            @update:model-value="onRequest({ pagination: { ...pagination, rowsPerPage: $event } })"
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
          <template v-slot:body-cell-timeFromTo="props">
            <q-td :props="props">
              {{ props.row.timeFromTo }}
              <q-badge
                color="green"
                class="q-ml-sm text-weight-medium"
                style="font-size: 0.8em"
              >
                {{ props.row.duration }}
              </q-badge>
            </q-td>
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

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey-7">
              <div class="text-center">
                <div class="text-p">No Records Found</div>
              </div>
            </div>
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
                  <div class="text-right">
                    <div class="text-subtitle2 text-grey-7">Status</div>
                    <div :class="getStatusColorClass(row.status)">
                      {{ row.status }}
                    </div>
                  </div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Date Filled</div>
                  <div>{{ row.dateFilled }}</div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Time From - To</div>
                  <div class="row items-center">
                    {{ row.timeFromTo }}
                    <q-badge
                      color="green"
                      class="q-ml-sm text-weight-medium"
                      style="font-size: 0.8em"
                    >
                      {{ row.duration }}
                    </q-badge>
                  </div>
                </div>

                <div class="q-mb-sm">
                  <div class="text-grey-6 text-caption">Description</div>
                  <div>{{ row.description }}</div>
                </div>

                <div class="row justify-start q-gutter-sm">
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
              @click="onView(row)"
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

defineOptions({
  name: 'ListFileOvertime'
})

// Column definitions
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
    name: 'dateFilled',
    required: true,
    label: 'DATE FILLED',
    align: 'left',
    field: row => row.dateFilled,
    sortable: true
  },
  {
    name: 'timeFromTo',
    required: true,
    label: 'TIME FROM - TO',
    align: 'left',
    field: row => row.timeFromTo,
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

// Data and State
const search = ref('')
const showDeleteDialog = ref(false)
const showEditDialog = ref(false)
const selectedRow = ref(null)
const isEditing = ref(false)



const rows = ref([
  {
    id: 1,
    dateCreated: 'September 16, 2024',
    dateFilled: '2024-09-16',
    timeFromTo: '12:43 PM - 4:43 PM',
    duration: '4 hours, 0 minutes',
    description: 'System maintenance',
    status: 'Approved',
  },
  {
    id: 2,
    dateCreated: 'September 17, 2024',
    dateFilled: '2024-09-17',
    timeFromTo: '9:00 AM - 12:30 PM',
    duration: '3 hours, 30 minutes',
    description: 'Server update',
    status: 'Pending',
  },
  // ... other rows ...
])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'dateCreated',
  descending: false,
  rowsNumber: 0
})

// Computed Properties
const filteredRows = computed(() => {
  if (!search.value) return rows.value

  const searchLower = search.value.toLowerCase()
  return rows.value.filter(row =>
    Object.keys(row).some(key =>
      key !== 'id' && key !== 'action' &&
      String(row[key]).toLowerCase().includes(searchLower)
    )
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
  const customSort = (rows, sortBy, descending) => {
    const data = [...rows]

    if (sortBy) {
      const column = columns.find(col => col.name === sortBy)

      data.sort((a, b) => {
        let compareResult

        if (column.name === 'dateCreated' || column.name === 'dateFilled') {
          compareResult = new Date(a[sortBy]) - new Date(b[sortBy])
        } else if (column.name === 'timeFromTo') {
          const getMinutes = (timeStr) => {
            const [time] = timeStr.split(' - ')
            const [rawTime, period] = time.split(' ')
            let [hours, minutes] = rawTime.split(':').map(Number)
            if (period === 'PM' && hours !== 12) hours += 12
            if (period === 'AM' && hours === 12) hours = 0
            return hours * 60 + minutes
          }
          compareResult = getMinutes(a.timeFromTo) - getMinutes(b.timeFromTo)
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

  const getStatusColorClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text'
      case 'rejected':
      case 'declined':
        return 'text'
      case 'pending':
        return 'text'
      default:
        return 'text'
    }
  }

  const onView = (row) => {
    router.push({
      path: '/LFOV',
      query: {
        id: row.id,
        dateCreated: row.dateCreated,
        dateFilled: row.dateFilled,
        timeFromTo: row.timeFromTo,
        duration: row.duration,
        description: row.description,
        status: row.status
      }
    })
  }


  const emits = defineEmits(['update:rows'])

watch(() => route.query, (newQuery) => {
  if (newQuery.updated) {
    const updatedRow = {
      id: parseInt(newQuery.id),
      dateCreated: newQuery.dateCreated,
      dateFilled: newQuery.dateFilled,
      timeFromTo: newQuery.timeFromTo,
      duration: newQuery.duration,
      description: newQuery.description,
      status: newQuery.status
    }
    handleRowUpdate(updatedRow)
  }
})


const convertTo24Hour = (time12h) => {
  if (!time12h) return ''
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  hours = parseInt(hours)

  if (hours === 12) {
    hours = modifier === 'PM' ? 12 : 0
  } else if (modifier === 'PM') {
    hours = hours + 12
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

const convertTo12Hour = (time24h) => {
  if (!time24h) return ''
  const [hours, minutes] = time24h.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${hour12}:${minutes} ${period}`
}

const calculateDuration = (timeFrom, timeTo) => {
  const [fromHours, fromMinutes] = timeFrom.split(':').map(Number)
  const [toHours, toMinutes] = timeTo.split(':').map(Number)

  let totalMinutes = (toHours * 60 + toMinutes) - (fromHours * 60 + fromMinutes)
  if (totalMinutes < 0) totalMinutes += 24 * 60

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours} hours, ${minutes} minutes`
}

// Add watcher for route query updates
watch(() => route.query, (newQuery) => {
  if (newQuery.updated) {
    const updatedRow = {
      id: parseInt(newQuery.id),
      dateCreated: newQuery.dateCreated,
      dateFilled: newQuery.dateFilled,
      timeFromTo: newQuery.timeFromTo,
      duration: newQuery.duration,
      description: newQuery.description,
      status: newQuery.status
    }

    const index = rows.value.findIndex(row => row.id === updatedRow.id)
    if (index !== -1) {
      rows.value[index] = updatedRow
    }
  }
}, { deep: true })

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

/* Table styles */
.q-table th {
  font-weight: 600;
}

.mobile-card {
  border: 1px solid #e0e0e0;
}

.mobile-card .q-card-section {
  padding: 16px;
}

/* Hover effects */
.q-table tbody tr:hover {
  background-color: #f5f5f5;
}

/* Active page button */
.bg-primary.text-white {
  font-weight: 500;
}

/* Badge styles */
.q-badge {
  padding: 4px 8px;
}

/* Additional utility classes */
.cursor-pointer {
  cursor: pointer;
}

.text-weight-medium {
  font-weight: 500;
}
</style>

<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none text-bold">Dashboard</h4>
    </div>

    <!-- Top Stats Cards -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Stats cards with improved responsive classes -->
      <div v-for="(stat, index) in statsData"
           :key="index"
           class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section class="row items-center no-wrap">
            <q-icon :name="stat.icon" color="primary" size="md" class="q-mr-sm" />
            <div class="full-width">
              <div class="text-caption">{{ stat.label }}</div>
              <div class="text-h6">{{ stat.value }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Leave List with Responsive Table -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Leave List</div>

        <!-- Desktop Table -->
        <div class="gt-xs">
          <q-table
            :rows="leaves"
            :columns="columns"
            row-key="dateCreated"
            :pagination="pagination"
            :rows-per-page-options="[5, 10, 15, 0]"
            flat
            bordered
            wrap-cells
          >
          <template v-slot:body-cell-action="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round color="grey" icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item>
                      <div class="column q-gutter-y-sm width">
                        <q-btn
                          class="q-px-sm width"
                          unelevated
                          square
                          color="green"
                          icon="visibility"
                          size="sm"
                          label="View"
                          align="left"
                          @click="handleView(props.row)"
                        />
                        <q-btn
                          class="q-px-sm width"
                          unelevated
                          square
                          color="orange"
                          icon="check"
                          size="sm"
                          label="Approve"
                          align="left"
                          @click="handleApprove(props.row)"
                        />
                        <q-btn
                          class="q-px-sm width"
                          unelevated
                          square
                          color="red"
                          icon="close"
                          size="sm"
                          label="Decline"
                          align="left"
                          @click="handleDecline(props.row)"
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

        <!-- Mobile Cards -->
        <div class="lt-sm">
          <div v-for="leave in leaves" :key="leave.dateCreated" class="q-mb-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <!-- Employee and Status Row -->
                  <div class="col-12">
                    <div class="row justify-between">
                      <div class="col-6">
                        <div class="text-subtitle2 text-grey-7">Employee</div>
                        <div class="text-weight-medium">{{ leave.employeeName }}</div>
                      </div>
                      <div class="col-6 text-right">
                        <div class="text-subtitle2 text-grey-7">Status</div>
                        <div class="text-weight-medium">{{ leave.status }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Date Created -->
                  <div class="col-6">
                    <div class="text-subtitle2 text-grey-7">Date Created</div>
                    <div class="text-weight-medium">{{ leave.dateCreated }}</div>
                  </div>

                  <!-- Leave Date -->
                  <div class="col-12">
                    <div class="text-subtitle2 text-grey-7">Leave Date</div>
                    <div class="text-weight-medium">{{ leave.leaveDate }}</div>
                  </div>

                  <!-- Type of Leave -->
                  <div class="col-12">
                    <div class="text-subtitle2 text-grey-7">Type</div>
                    <div class="text-weight-medium">{{ leave.typeOfLeave }}</div>
                  </div>
                </div>

                <div class="row justify-start q-mt-sm">
                  <q-btn flat round color="grey" icon="more_vert">
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item clickable v-close-popup>
                          <div class="row justify-start q-gutter-x-sm q-mt-sm">
                            <q-btn
                              class="q-px-xs"
                              unelevated
                              square
                              color="green"
                              icon="visibility"
                              size="sm"
                              label="View"
                              @click="handleView(leave)"
                            />
                            <q-btn
                              class="q-px-xs"
                              unelevated
                              square
                              color="orange"
                              icon="check"
                              size="sm"
                              label="Approve"
                              @click="handleApprove(leave)"
                            />
                            <q-btn
                              class="q-px-xs"
                              unelevated
                              square
                              color="red"
                              icon="close"
                              size="sm"
                              label="Decline"
                              @click="handleDecline(leave)"
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
        </div>
      </q-card-section>
    </q-card>

    <!-- Content Grid -->
    <div class="row q-col-gutter-md">
      <!-- Main Content -->
      <div class="col-12 col-lg-8">
        <!-- Announcements -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Announcements</div>
            <div class="gt-xs">
              <q-table
                :rows="announcements"
                :columns="announcementColumns"
                row-key="date"
                flat
                bordered
                wrap-cells
              >
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <q-btn
                    color="green"
                    icon="visibility"
                    size="sm"
                    label="View"
                    @click="handleViewAnnouncement(props.row)"
                  />
                </q-td>
              </template>
              </q-table>
            </div>
            <div class="lt-sm">
              <q-list bordered separator>
                <q-item v-for="announcement in announcements" :key="announcement.date">
                  <q-item-section>
                    <q-item-label>{{ announcement.title }}</q-item-label>
                    <q-item-label caption>{{ announcement.date }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn  unelevated
                            square
                            color="green"
                            icon="visibility"
                            size="sm"
                            label="View"
                            align="left" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>

        <!-- Events -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Events</div>
            <div class="gt-xs">
              <q-table
                :rows="events"
                :columns="eventsColumns"
                row-key="date"
                flat
                bordered
                wrap-cells
              >
              <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  color="green"
                  icon="visibility"
                  size="sm"
                  label="View"
                  @click="handleViewEvent(props.row)"
                />
              </q-td>
            </template>
              </q-table>
            </div>
            <div class="lt-sm">
              <q-list bordered separator>
                <q-item v-for="event in events" :key="event.date">
                  <q-item-section>
                    <q-item-label>{{ event.title }}</q-item-label>
                    <q-item-label caption>{{ event.date }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn  unelevated
                            square
                            color="green"
                            icon="visibility"
                            size="sm"
                            label="View"
                            align="left" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Sidebar -->
      <div class="col-12 col-lg-4">
        <!-- Birthdays Card -->
        <q-card class="info-card q-mb-md" style="height: 228px;">
          <q-card-section class="q-pa-md">
            <div class="text-h6 q-mb-sm">October Birthdays</div>
            <div class="carousel-container q-py-md">
              <div class="row items-center justify-between no-wrap">
                <q-btn flat round dense color="grey" icon="chevron_left" @click="previousBirthday" />
                <div class="text-center carousel-content">
                  <div class="text-h6 q-mb-sm">{{ currentBirthday.name }}</div>
                  <div class="text-subtitle1">{{ currentBirthday.date }}</div>
                </div>
                <q-btn flat round dense color="grey" icon="chevron_right" @click="nextBirthday" />
              </div>
              <!-- Pagination Dots -->
              <div class="row justify-center q-mt-sm">
                <div v-for="(birthday, index) in birthdays"
                     :key="index"
                     class="pagination-dot"
                     :class="{ active: index === currentBirthdayIndex }">
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Holidays Card -->
        <q-card class="info-card q-mb-md" style="height: 228px;">
          <q-card-section class="q-pa-md">
            <div class="text-h6 q-mb-sm">Holidays</div>
            <div class="carousel-container q-py-md">
              <div class="row items-center justify-between no-wrap">
                <q-btn flat round dense color="grey" icon="chevron_left" @click="previousHoliday" />
                <div class="text-center carousel-content">
                  <div class="text-h6 q-mb-sm">{{ currentHoliday.name }}</div>
                  <div class="text-subtitle1">{{ currentHoliday.date }}</div>
                </div>
                <q-btn flat round dense color="grey" icon="chevron_right" @click="nextHoliday" />
              </div>
              <!-- Pagination Dots -->
              <div class="row justify-center q-mt-sm">
                <div v-for="(holiday, index) in holidays"
                     :key="index"
                     class="pagination-dot"
                     :class="{ active: index === currentHolidayIndex }">
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Memo Section -->
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Memo</div>
        <div class="gt-xs">
          <q-table
            :rows="memos"
            :columns="memoColumns"
            row-key="date"
            flat
            bordered
            wrap-cells
          >
          <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="green"
            icon="visibility"
            size="sm"
            label="View"
            @click="handleViewMemo(props.row)"
          />
        </q-td>
      </template>
          </q-table>
        </div>
        <div class="lt-sm">
          <q-list bordered separator>
            <q-item v-for="memo in memos" :key="memo.date">
              <q-item-section>
                <q-item-label>{{ memo.title }}</q-item-label>
                <q-item-label caption>{{ memo.date }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn  unelevated
                        square
                        color="green"
                        icon="visibility"
                        size="sm"
                        label="View"
                        align="left" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

defineOptions({
  name: 'DashBoard'
})

// Stats data
const statsData = ref([
  { label: 'Remaining Total Leave Credits', value: '3', icon: 'event_note' },
  { label: 'Remaining Vacation Leave Credits', value: '0.00', icon: 'beach_access' },
  { label: 'Remaining Sick Leave Balance Credits', value: '3.00', icon: 'medical_services' },
  { label: 'Pending Approval', value: '1', icon: 'hourglass_empty' },
  { label: 'Total Leave', value: '1', icon: 'event_note' },
  { label: 'Total Vacation Leave', value: '0', icon: 'beach_access' },
  { label: 'Total Sick Leave', value: '1', icon: 'medical_services' },
  { label: 'Pending', value: '1', icon: 'hourglass_empty' }
])

// Table settings
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'dateCreated',
  descending: false,
  rowsNumber: 0
})

// Data
const leaves = ref([
  {
    dateCreated: 'September 16, 2024',
    employeeName: 'Denden',
    leaveDate: 'September 19, 2024 - September 19, 2024',
    typeOfLeave: 'Vacation Leave',
    status: 'Pending'
  }
])

const announcements = ref([
  {
    date: 'September 20, 2024',
    title: 'Announcement'
  }
])

const events = ref([
  {
    date: 'July 04, 2024',
    title: 'Office Memo HR2024-00004'
  }
])

const memos = ref([
  {
    date: 'July 04, 2024',
    title: 'Office Memo HR2024-00004'
  }
])

// Birthday and Holiday data
const currentBirthdayIndex = ref(0)
const birthdays = ref([
  { name: 'JD', date: 'October 14' },
  { name: 'Jane', date: 'October 15' },
  { name: 'John', date: 'October 16' }
])

const currentHolidayIndex = ref(0)
const holidays = ref([
  { name: 'Christmas Day', date: 'December 25' },
  { name: 'New Year', date: 'January 1' },
  { name: 'Holy Week', date: 'March 28' }
])

// Computed properties
const currentBirthday = computed(() => birthdays.value[currentBirthdayIndex.value])
const currentHoliday = computed(() => holidays.value[currentHolidayIndex.value])

const showSuccess = (message) => {
  $q.notify({
    type: 'positive',
    message,
    position: 'top',
    timeout: 2000
  })
}

const showError = (message) => {
  $q.notify({
    type: 'negative',
    message,
    position: 'top',
    timeout: 2000
  })
}

const handleCarouselTransition = (content) => {
  if (content) {
    content.classList.add('q-transition--fade')
    setTimeout(() => {
      content.classList.remove('q-transition--fade')
    }, 300)
  }
}

const nextBirthday = () => {
  const content = document.querySelector('.birthday-carousel .carousel-content')
  handleCarouselTransition(content)
  currentBirthdayIndex.value = (currentBirthdayIndex.value + 1) % birthdays.value.length
}

const previousBirthday = () => {
  const content = document.querySelector('.birthday-carousel .carousel-content')
  handleCarouselTransition(content)
  currentBirthdayIndex.value = currentBirthdayIndex.value === 0
    ? birthdays.value.length - 1
    : currentBirthdayIndex.value - 1
}

const nextHoliday = () => {
  const content = document.querySelector('.holiday-carousel .carousel-content')
  handleCarouselTransition(content)
  currentHolidayIndex.value = (currentHolidayIndex.value + 1) % holidays.value.length
}

const previousHoliday = () => {
  const content = document.querySelector('.holiday-carousel .carousel-content')
  handleCarouselTransition(content)
  currentHolidayIndex.value = currentHolidayIndex.value === 0
    ? holidays.value.length - 1
    : currentHolidayIndex.value - 1
}

const showNotification = (type, message) => {
  $q.notify({
    type: type,
    message: message,
    position: 'top',
    timeout: 2000
  })
}

const handleView = async (row) => {
  try {
    await $q.dialog({
      title: 'Leave Request Details',
      message: `
        <div class="q-pa-md">
          <div class="row q-mb-md">
            <div class="col-6">
              <div class="text-subtitle2 text-grey-7">Employee Name</div>
              <div class="text-body1">${row.employeeName}</div>
            </div>
            <div class="col-6">
              <div class="text-subtitle2 text-grey-7">Status</div>
              <div class="text-body1">${row.status}</div>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-6">
              <div class="text-subtitle2 text-grey-7">Date Created</div>
              <div class="text-body1">${row.dateCreated}</div>
            </div>
            <div class="col-6">
              <div class="text-subtitle2 text-grey-7">Leave Type</div>
              <div class="text-body1">${row.typeOfLeave}</div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="text-subtitle2 text-grey-7">Leave Date</div>
              <div class="text-body1">${row.leaveDate}</div>
            </div>
          </div>
        </div>
      `,
      html: true,
      ok: {
        label: 'Close',
        color: 'primary'
      }
    })
  } catch (error) {
    showNotification('negative', 'Error viewing leave details')
  }
}
const handleApprove = async (row) => {
  try {
    const commentOption = await $q.dialog({
      title: 'Approve Leave Request',
      message: 'Do you want to add a comment?',
      options: {
        type: 'checkbox',
        model: [],
        items: [
          { label: 'Add approval comment', value: 'comment' }
        ]
      },
      cancel: true
    })

    let comment = ''
    if (commentOption.length > 0) {
      comment = await $q.dialog({
        title: 'Approval Comment',
        prompt: {
          model: '',
          type: 'text',
          label: 'Enter comment'
        }
      })
    }

    // Update leave status
    const index = leaves.value.findIndex(leave =>
      leave.dateCreated === row.dateCreated &&
      leave.employeeName === row.employeeName
    )

    if (index !== -1) {
      leaves.value[index].status = 'Approved'
      leaves.value[index].approvalComment = comment

      showNotification('positive', `Leave request for ${row.employeeName} approved${comment ? ' with comment' : ''}`)
    }
  } catch (error) {
    showNotification('negative', 'Error approving leave request')
  }
}

const handleDecline = async (row) => {
  try {
    const reason = await $q.dialog({
      title: 'Decline Leave Request',
      message: 'Please provide a reason for declining:',
      prompt: {
        model: '',
        type: 'textarea',
        label: 'Decline Reason'
      },
      cancel: true
    })

    if (reason) {
      const index = leaves.value.findIndex(leave =>
        leave.dateCreated === row.dateCreated &&
        leave.employeeName === row.employeeName
      )

      if (index !== -1) {
        leaves.value[index].status = 'Declined'
        leaves.value[index].declineReason = reason

        showNotification('warning', `Leave request for ${row.employeeName} declined`)
      }
    }
  } catch (error) {
    showNotification('negative', 'Error declining leave request')
  }
}

onMounted(() => {
  const birthdayInterval = setInterval(nextBirthday, 5000)
  const holidayInterval = setInterval(nextHoliday, 5000)

  // Cleanup on component unmount
  return () => {
    clearInterval(birthdayInterval)
    clearInterval(holidayInterval)
  }
})

// Button handlers for other sections
const handleViewAnnouncement = async (announcement) => {
  try {
    await $q.dialog({
      title: 'Announcement Details',
      message: `
        <div class="q-pa-md">
          <div class="text-h6 q-mb-sm">${announcement.title}</div>
          <div class="text-subtitle2 text-grey-7 q-mb-md">${announcement.date}</div>
          <div class="text-body1">${announcement.content || 'No additional details available.'}</div>
        </div>
      `,
      html: true,
      ok: {
        label: 'Close',
        color: 'primary'
      }
    })
  } catch (error) {
    showNotification('negative', 'Error viewing announcement')
  }
}

const handleViewEvent = async (event) => {
  try {
    await $q.dialog({
      title: 'Event Details',
      message: `
        <div class="q-pa-md">
          <div class="text-h6 q-mb-sm">${event.title}</div>
          <div class="text-subtitle2 text-grey-7 q-mb-md">${event.date}</div>
          <div class="text-body1">${event.content || 'No additional details available.'}</div>
        </div>
      `,
      html: true,
      ok: {
        label: 'Close',
        color: 'primary'
      }
    })
  } catch (error) {
    showNotification('negative', 'Error viewing event')
  }
}

const handleViewMemo = async (memo) => {
  try {
    await $q.dialog({
      title: 'Memo Details',
      message: `
        <div class="q-pa-md">
          <div class="text-h6 q-mb-sm">${memo.title}</div>
          <div class="text-subtitle2 text-grey-7 q-mb-md">${memo.date}</div>
          <div class="text-body1">${memo.content || 'No additional details available.'}</div>
        </div>
      `,
      html: true,
      ok: {
        label: 'Close',
        color: 'primary'
      }
    })
  } catch (error) {
    showNotification('negative', 'Error viewing memo')
  }
}

// Table columns
const columns = [
  {
    name: 'dateCreated',
    label: 'DATE CREATED',
    field: 'dateCreated',
    align: 'left'
  },
  {
    name: 'employeeName',
    label: 'EMPLOYEE NAME',
    field: 'employeeName',
    align: 'left'
  },
  {
    name: 'leaveDate',
    label: 'LEAVE DATE',
    field: 'leaveDate',
    align: 'left'
  },
  {
    name: 'typeOfLeave',
    label: 'TYPE OF LEAVE',
    field: 'typeOfLeave',
    align: 'left'
  },
  {
    name: 'status',
    label: 'STATUS',
    field: 'status',
    align: 'left'
  },
  {
    name: 'action',
    label: 'ACTION',
    field: 'action',
    align: 'center'
  }
]

const announcementColumns = [
  { name: 'date', label: 'DATE & TIME', field: 'date', align: 'left' },
  { name: 'title', label: 'TITLE', field: 'title', align: 'left' },
  { name: 'action', label: 'ACTION', field: 'action', align: 'center' }
]

const eventsColumns = [
  { name: 'date', label: 'DATE & TIME', field: 'date', align: 'left' },
  { name: 'title', label: 'TITLE', field: 'title', align: 'left' },
  { name: 'action', label: 'ACTION', field: 'action', align: 'center' }
]

const memoColumns = [
  { name: 'date', label: 'DATE & TIME', field: 'date', align: 'left' },
  { name: 'title', label: 'TITLE', field: 'title', align: 'left' },
  { name: 'action', label: 'ACTION', field: 'action', align: 'center' }
]

watch(currentBirthdayIndex, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    const content = document.querySelector('.carousel-content')
    content?.classList.add('q-transition--fade')
    setTimeout(() => {
      content?.classList.remove('q-transition--fade')
    }, 300)
  }
})

watch(currentHolidayIndex, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    const content = document.querySelector('.carousel-content')
    content?.classList.add('q-transition--fade')
    setTimeout(() => {
      content?.classList.remove('q-transition--fade')
    }, 300)
  }
})


defineExpose({
  pagination,
  leaves,
  announcements,
  events,
  memos,
  currentBirthday,
  currentHoliday,
  nextBirthday,
  previousBirthday,
  nextHoliday,
  previousHoliday,

  handleView,
  handleApprove,
  handleDecline,
  handleViewAnnouncement,
  handleViewEvent,
  handleViewMemo
})
</script>


<style lang="scss">
.dashboard-card {
  height: 100%;

  .q-card__section {
    padding: 16px;
    min-height: 90px;
    display: flex;
    align-items: center;
  }

  .q-icon {
    font-size: 24px;
    margin-right: 12px !important;
  }

  .text-caption {
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.875rem;
    line-height: 1.25;
    margin-bottom: 4px;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text-h6 {
    margin: 4px 0 0;
    color: rgba(0, 0, 0, 0.87);
    font-size: 1.25rem;
    line-height: 1.2;
  }
}

// Table Responsiveness
.q-table {
  &__container {
    @media (max-width: 599px) {
      overflow-x: auto;
    }
  }

  thead tr th {
    position: sticky;
    z-index: 1;
    background: white;
  }

  tbody td {
    @media (max-width: 599px) {
      white-space: normal;
      min-width: 100px;
    }
  }
}

// Mobile Card Styles
.lt-sm {
  .q-card {
    border-radius: 8px;

    .q-card__section {
      padding: 16px;
    }
  }

  .text-subtitle2 {
    font-size: 0.875rem;
    margin-bottom: 4px;
  }

  .text-weight-medium {
    font-size: 1rem;
    margin-bottom: 12px;
  }
}

// Button Styles
.q-btn {
  &.q-px-xs {
    padding: 4px 8px;
    min-height: 32px;

    .q-icon {
      font-size: 18px;
      margin-right: 4px;
    }

    .q-btn__content {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: unset;
    }
  }

  &.dense {
    padding: 4px;
    min-height: 28px;
  }
}

// List Styles
.q-list {
  .q-item {
    padding: 12px;

    .q-item__section {
      padding-right: 12px;
    }

    .q-item__label {
      font-size: 1rem;
      line-height: 1.4;

      &--caption {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// Birthday and Holiday Cards
.birthday-card, .holiday-card {
  .q-card__section {
    padding: 20px;

    .text-h6 {
      margin-bottom: 16px;
    }

    .text-center {
      flex-grow: 1;
      padding: 0 12px;
    }
  }
}

// Responsive Padding
@media (max-width: 599px) {
  .q-page {
    padding: 12px !important;
  }

  .q-card {
    margin-bottom: 12px;
  }

  .row.q-col-gutter-md {
    margin: -6px;

    > * {
      padding: 6px;
    }
  }
}

// General Responsive Adjustments
@media (max-width: 1023px) {
  .text-h4 {
    font-size: 1.5rem;
  }

  .text-h6 {
    font-size: 1.1rem;
  }
}
.info-card {
  .q-card__section {
    min-height: 180px;
    display: flex;
    flex-direction: column;
  }

  .carousel-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .carousel-content {
    flex-grow: 1;
    padding: 0 16px;
    min-width: 150px;

    .text-h6 {
      font-size: 1.25rem;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .text-subtitle1 {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .pagination-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    margin: 0 4px;
    transition: background-color 0.3s;

    &.active {
      background: var(--q-primary);
    }
  }

  @media (max-width: 599px) {
    .q-card__section {
      min-height: 160px;
    }
  }

  @media (min-width: 600px) and (max-width: 1023px) {
    .q-card__section {
      min-height: 170px;
    }
  }
}

// Make cards same height in row when side by side
@media (min-width: 600px) {
  .row > .col-sm-6 {
    .info-card {
      height: 100%;
    }
  }
}

// Ensure consistent spacing
.q-mb-md {
  margin-bottom: 16px;
}

// Improve button touch targets on mobile
@media (max-width: 599px) {
  .info-card {
    .q-btn {
      padding: 8px;

      .q-icon {
        font-size: 24px;
      }
    }
  }
}
</style>

// ListFileOvertimeView.vue
<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <h5 class="q-my-none">Overtime Details</h5>
      <q-breadcrumbs class="q-ml-md">
        <q-breadcrumbs-el icon="schedule" />
        <q-breadcrumbs-el label="Details" />
      </q-breadcrumbs>
    </div>

    <!-- Content Container -->
    <div class="row q-col-gutter-md">
      <!-- Main Form -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Request Details</div>

            <div class="row q-col-gutter-md q-mt-md">
              <!-- Date Created -->
              <div class="col-12">
                <div class="field-label">Date Created</div>
                <q-input
                  v-model="formData.dateCreated"
                  readonly
                  dense
                  class="custom-input"
                  :class="{ 'no-data': !formData.dateCreated }"
                  borderless
                  input-class="no-padding"
                />
              </div>

              <!-- Date Filled -->
              <div class="col-12">
                <div class="field-label">Date Filled</div>
                <q-input
                  v-model="formData.dateFilled"
                  :readonly="!isEditing"
                  dense
                  class="custom-input"
                  :class="{ 'no-data': !formData.dateFilled }"
                  borderless
                  input-class="no-padding"
                  type="date"
                  v-if="isEditing"
                />
                <q-input
                  v-model="formData.dateFilled"
                  readonly
                  dense
                  class="custom-input"
                  :class="{ 'no-data': !formData.dateFilled }"
                  borderless
                  input-class="no-padding"
                  v-else
                />
              </div>

              <!-- Time -->
              <div class="col-12">
                <div class="field-label">Time</div>
                <template v-if="isEditing">
                  <div class="row q-col-gutter-sm">
                    <div class="col-6">
                      <q-input
                        v-model="editTimeFrom"
                        type="time"
                        dense
                        outlined
                        label="From"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        v-model="editTimeTo"
                        type="time"
                        dense
                        outlined
                        label="To"
                      />
                    </div>
                  </div>
                </template>
                <q-input
                  v-else
                  v-model="formData.timeFromTo"
                  readonly
                  dense
                  class="custom-input"
                  :class="{ 'no-data': !formData.timeFromTo }"
                  borderless
                  input-class="no-padding"
                >
                  <template v-slot:append>
                    <div class="text-caption q-ml-sm">
                      {{ formData.duration || '-' }}
                    </div>
                  </template>
                </q-input>
              </div>

              <!-- Description -->
              <div class="col-12">
                <div class="field-label">Description</div>
                <q-input
                  v-model="formData.description"
                  :readonly="!isEditing"
                  dense
                  type="textarea"
                  rows="2"
                  class="custom-input"
                  :class="{ 'no-data': !formData.description }"
                  borderless
                  input-class="no-padding"
                  :outlined="isEditing"
                />
              </div>

              <!-- Status -->
              <div class="col-12">
                <div class="field-label">Status</div>
                <div class="status-text" :class="getStatusColorClass(formData.status)">
                  {{ formData.status || '-' }}
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="col-12 q-gutter-sm q-mt-md">
                <template v-if="formData.status === 'Pending' && !isEditing">
                  <q-btn
                    color="positive"
                    label="Approve"
                    @click="onApprove"
                    :loading="isLoading"
                    icon="check"
                  />
                  <q-btn
                    color="negative"
                    label="Decline"
                    @click="onDecline"
                    :loading="isLoading"
                    icon="close"
                  />
                  <q-btn
                    color="primary"
                    label="Edit"
                    @click="startEdit"
                    :loading="isLoading"
                    icon="edit"
                  />
                  <q-btn
                    color="negative"
                    label="Delete"
                    @click="confirmDelete"
                    :loading="isLoading"
                    icon="delete"
                  />
                </template>
                <template v-if="isEditing">
                  <q-btn
                    color="positive"
                    label="Save"
                    @click="saveEdit"
                    :loading="isLoading"
                    icon="save"
                  />
                  <q-btn
                    color="grey"
                    label="Cancel"
                    @click="cancelEdit"
                    :loading="isLoading"
                    icon="close"
                  />
                </template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Activity Section -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
            <div v-if="activities.length">
              <q-timeline>
                <q-timeline-entry
                  v-for="activity in activities"
                  :key="activity.id"
                  :title="activity.action"
                  :subtitle="activity.timestamp"
                >
                  <div>{{ activity.description }}</div>
                </q-timeline-entry>
              </q-timeline>
            </div>
            <div v-else class="text-center q-mt-md">
              No Recent Activity
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this overtime request?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="handleDelete" :loading="isLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { date } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const isLoading = ref(false)
const isEditing = ref(false)
const showDeleteDialog = ref(false)
const editTimeFrom = ref('')
const editTimeTo = ref('')

const formData = ref({
  id: '',
  dateCreated: '',
  dateFilled: '',
  timeFromTo: '',
  duration: '',
  description: '',
  status: ''
})

const activities = ref([])

// Original data backup for cancel edit
const originalData = ref(null)

// Methods for time conversion
const convertTo24Hour = (time12h) => {
  if (!time12h) return ''
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':').map(Number)

  if (hours === 12) {
    hours = modifier === 'PM' ? 12 : 0
  } else if (modifier === 'PM') {
    hours = hours + 12
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
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

onMounted(() => {
  const { id, dateCreated, dateFilled, timeFromTo, duration, description, status } = route.query

  formData.value = {
    id,
    dateCreated: dateCreated ? date.formatDate(dateCreated, 'MMMM D, YYYY') : '',
    dateFilled: dateFilled || '',
    timeFromTo: timeFromTo || '',
    duration: duration || '',
    description: description || '',
    status: status || ''
  }

  // Store original data for edit cancellation
  originalData.value = { ...formData.value }

  // Parse time for edit fields
  if (timeFromTo) {
    const [timeFrom] = timeFromTo.split(' - ')
    editTimeFrom.value = convertTo24Hour(timeFrom)
    const [, timeTo] = timeFromTo.split(' - ')
    editTimeTo.value = convertTo24Hour(timeTo)
  }
})

const getStatusColorClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'text-green'
    case 'rejected':
    case 'declined':
      return 'text-red'
    case 'pending':
      return 'text-orange'
    default:
      return 'text-grey'
  }
}

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  formData.value = { ...originalData.value }

  // Reset edit time fields
  if (formData.value.timeFromTo) {
    const [timeFrom] = formData.value.timeFromTo.split(' - ')
    editTimeFrom.value = convertTo24Hour(timeFrom)
    const [, timeTo] = formData.value.timeFromTo.split(' - ')
    editTimeTo.value = convertTo24Hour(timeTo)
  }
}

const saveEdit = async () => {
  try {
    isLoading.value = true

    // Validate inputs
    if (!formData.value.dateFilled || !editTimeFrom.value || !editTimeTo.value || !formData.value.description) {
      throw new Error('Please fill in all required fields')
    }

    // Create timeFromTo string
    const timeFromTo = `${convertTo12Hour(editTimeFrom.value)} - ${convertTo12Hour(editTimeTo.value)}`
    const duration = calculateDuration(editTimeFrom.value, editTimeTo.value)

    // Update formData
    formData.value = {
      ...formData.value,
      timeFromTo,
      duration
    }

    // Add activity
    activities.value.unshift({
      id: Date.now(),
      action: 'Request Updated',
      description: 'Overtime request details were updated',
      timestamp: date.formatDate(Date.now(), 'MMM D, YYYY HH:mm')
    })

    // Update original data
    originalData.value = { ...formData.value }

    isEditing.value = false
    $q.notify({
      type: 'positive',
      message: 'Overtime request updated successfully',
      position: 'top'
    })
  } catch (error) {
    console.error('Error updating overtime request:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to update overtime request',
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  try {
    isLoading.value = true
    showDeleteDialog.value = false

    // Add delete activity
    activities.value.unshift({
      id: Date.now(),
      action: 'Request Deleted',
      description: 'Overtime request was deleted',
      timestamp: date.formatDate(Date.now(), 'MMM D, YYYY HH:mm')
    })

    $q.notify({
      type: 'positive',
      message: 'Overtime request deleted successfully',
      position: 'top'
    })

    // Navigate back after short delay
    setTimeout(() => router.push('/overtime'), 1500)
  } catch (error) {
    console.error('Error deleting overtime request:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to delete overtime request',
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

const handleStatusChange = async (newStatus, actionType) => {
  isLoading.value = true

  try {
    await $q.dialog({
      title: `${actionType} Overtime Request`,
      message: `Are you sure you want to ${actionType.toLowerCase()} this overtime request?`,
      cancel: true,
      persistent: true,
      ok: {
        color: actionType === 'Approve' ? 'positive' : 'negative',
        label: actionType,
        flat: true
      },
      cancel: {
        flat: true,
        label: 'Cancel'
      }
    }).onOk(async () => {
      formData.value.status = newStatus

      activities.value.unshift({
        id: Date.now(),
        action: `Request ${newStatus}`,
        description: `Overtime request was ${newStatus.toLowerCase()} by admin`,
        timestamp: date.formatDate(Date.now(), 'MMM D, YYYY HH:mm')
      })

      $q.notify({
        type: actionType === 'Approve' ? 'positive' : 'negative',
        message: `Overtime request ${newStatus.toLowerCase()} successfully`,
        position: 'top',
        timeout: 2000
      })

      setTimeout(() => router.push('/overtime'), 2000)
    })
  } catch (error) {
    console.error('Error:', error)
    $q.notify({
      type: 'negative',
      message: `Error ${actionType.toLowerCase()}ing overtime request`,
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

const onApprove = () => handleStatusChange('Approved', 'Approve')
const onDecline = () => handleStatusChange('Declined', 'Decline')
</script>

<style scoped>
.field-label {
  font-weight: 500;
  margin-bottom: 4px;
}

.status-text {
  padding: 8px 12px;
  min-height: 32px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  width: 100%;
}

.text-green {
  color: #21BA45 !important;
}

.text-red {
  color: #C10015 !important;
}

.text-orange {
  color: #F2C037 !important;
}

.text-grey {
  color: #9E9E9E !important;
}

:deep(.custom-input) {
  .q-field__control {
    height: 32px !important;
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
    border-radius: 4px !important;
    padding: 0 !important;
  }

  .q-field__control:before,
  .q-field__control:after {
    display: none;
  }

  .q-field__native,
  .q-field__input {
    padding: 0 12px !important;
    min-height: 32px !important;
    line-height: 32px !important;
  }

  .q-field__append {
    height: 32px !important;
    min-height: 32px !important;
    padding-right: 12px !important;
    display: flex !important;
    align-items: center !important;
  }
}

:deep(.no-data .q-field__native),
:deep(.no-data .q-field__input) {
  &:empty:before {
    content: '-';
    color: inherit;
    line-height: 32px !important;
  }
}

:deep(.custom-input.q-textarea) {
  .q-field__control {
    height: auto !important;
    min-height: 52px !important;
    padding: 0 !important;
  }

  .q-field__native,
  .q-field__input {
    padding: 8px 12px !important;
    min-height: 52px !important;
    line-height: 1.4 !important;
  }
}

/* Responsive Styles */
@media (max-width: 767px) {
  .q-page {
    padding: 12px;
  }

  .col-md-4 {
    margin-top: 16px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .q-page {
    padding: 16px;
  }
}
</style>


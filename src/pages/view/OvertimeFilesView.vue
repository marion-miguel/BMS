<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="row items-center q-mb-lg">
      <div class="text-h5">Overtime Request Form</div>
      <q-breadcrumbs class="q-ml-md">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Request Form" />
      </q-breadcrumbs>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h6 q-mb-md">Details</div>
              <div>
                <q-btn
                  :loading="isLoading"
                  color="orange"
                  label="Approve"
                  icon="check"
                  @click="onApprove"
                  class="q-mr-sm"
                  size="sm"
                  rounded-lg
                  unelevated
                />
                <q-btn
                  :loading="isLoading"
                  color="red"
                  label="Decline"
                  icon="close"
                  @click="onDecline"
                  size="sm"
                  unelevated
                  rounded-lg
                />
              </div>
            </div>

            <!-- Form Fields -->
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="field-label">Date</div>
                <q-input
                  v-model="formData.date"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <div class="col-12">
                <div class="field-label">Description of Duties and Specific Project</div>
                <q-input
                  v-model="formData.description"
                  outlined
                  dense
                  readonly
                  class="details-field"
                  type="textarea"
                  autogrow
                />
              </div>

              <div class="col-12 col-md-6">
                <div class="field-label">Time From</div>
                <q-input
                  v-model="formData.timeFrom"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <div class="col-12 col-md-6">
                <div class="field-label">Time To</div>
                <q-input
                  v-model="formData.timeTo"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <div class="col-12">
                <div class="field-label">Name</div>
                <q-input
                  v-model="formData.name"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <div class="col-12">
                <div class="field-label">Contact Number</div>
                <q-input
                  v-model="formData.contactNumber"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Activity Card -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="text-h6 q-mb-md">Recent Activity</div>

            <q-timeline color="green">
              <q-timeline-entry
                v-for="activity in activities"
                :key="activity.timestamp"
                :title="activity.title"
                :subtitle="activity.timestamp"
              >
                <div>
                  <div>Approved by: {{ activity.approvedBy }}</div>
                  <div>Status: {{ activity.status }}</div>
                  <div>Remarks: {{ activity.remarks }}</div>
                </div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ confirmationData.actionType }} Overtime Request</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Are you sure you want to {{ confirmationData.actionType.toLowerCase() }} this overtime request?</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="grey"
            v-close-popup
          />
          <q-btn
            :flat="true"
            :label="confirmationData.actionType"
            :color="confirmationData.actionType === 'Approve' ? 'orange' : 'red'"
            :loading="isLoading"
            @click="handleStatusChange"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const route = useRoute()
const isLoading = ref(false)
const showConfirmDialog = ref(false)
const confirmationData = ref({
  status: '',
  actionType: '',
})

// Form Data
const formData = ref({
  date: '',
  description: '',
  timeFrom: '',
  timeTo: '',
  name: '',
  contactNumber: '',
  status: ''
})

// Activities
const activities = ref([
  {
    timestamp: 'SEPTEMBER 18, 2024, 12:34 AM',
    title: 'Overtime Request Updated',
    approvedBy: 'NADINE LUSTRE',
    status: 'Approved',
    remarks: 'The Request Overtime application has been approved.'
  },
  {
    timestamp: 'SEPTEMBER 16, 2024, 4:44 AM',
    title: 'Overtime Request Updated',
    approvedBy: 'NADINE LUSTRE',
    status: 'Rejected',
    remarks: 'The Request Overtime application has been disapproved.'
  },
  {
    timestamp: 'SEPTEMBER 16, 2024, 4:43 AM',
    title: 'Overtime Request Created',
    approvedBy: 'NADINE LUSTRE',
    status: 'Pending',
    remarks: 'The Request Overtime application has been submitted.'
  }
])

onMounted(() => {
  formData.value = {
    date: route.query.date || 'September 16, 2024',
    description: route.query.description || 'test',
    timeFrom: route.query.timeFrom || '12:43 PM',
    timeTo: route.query.timeTo || '4:43 PM',
    name: route.query.name || '',
    contactNumber: route.query.contactNumber || '0',
    status: route.query.status || 'Pending'
  }
})

const openConfirmationDialog = (status, actionType) => {
  confirmationData.value = {
    status,
    actionType,
  }
  showConfirmDialog.value = true
}

const handleStatusChange = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const { status, actionType } = confirmationData.value
    const newStatus = actionType === 'Approve' ? 'Approved' : 'Declined'

    // Update form status
    formData.value.status = newStatus

    // Add new activity with the enhanced format
    const newActivity = {
      timestamp: date.formatDate(new Date(), 'MMMM D, YYYY, h:mm A'),
      title: `Overtime Request ${newStatus}`,
      approvedBy: 'NADINE LUSTRE', // This should come from your auth system
      status: newStatus,
      remarks: `The Request Overtime application has been ${newStatus.toLowerCase()}.`
    }

    activities.value.unshift(newActivity)

    // Show notification
    $q.notify({
      type: actionType === 'Approve' ? 'positive' : 'negative',
      message: `Overtime request ${newStatus.toLowerCase()} successfully`,
      position: 'top'
    })

    // Reset dialog
    showConfirmDialog.value = false
    confirmationData.value = { status: '', actionType: '' }

    // Optional: Redirect back to list after a delay
    setTimeout(() => {
      router.push('/OvertimeFiles')
    }, 2000)

  } catch (error) {
    console.error('Error:', error)
    $q.notify({
      type: 'negative',
      message: 'Error processing overtime request',
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

const onApprove = () => openConfirmationDialog('Approved', 'Approve')
const onDecline = () => openConfirmationDialog('Declined', 'Decline')
</script>

<style scoped>
.field-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 4px;
}

:deep(.details-field .q-field__control) {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

:deep(.details-field .q-field__control:before) {
  border: none;
}

:deep(.details-field .q-field__control:after) {
  border: none;
}

:deep(.details-field.q-field--readonly .q-field__control) {
  border-style: solid;
  border-width: 1px;
}

:deep(.details-field.q-field--readonly .q-field__native) {
  color: rgba(0, 0, 0, 0.87);
}

/* Timeline customization */
:deep(.q-timeline__entry) {
  margin-bottom: 20px;
}

:deep(.q-timeline__subtitle) {
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .q-page {
    padding: 16px;
  }
}
</style>

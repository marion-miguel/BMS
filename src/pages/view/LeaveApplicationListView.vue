<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="row items-center q-mb-lg">
      <div class="text-h5">Leave Application</div>
      <q-breadcrumbs class="q-ml-md">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="Form" />
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
                <div class="field-label">Date Created:</div>
                <q-input
                  v-model="formData.dateCreated"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <div class="col-12">
                <div class="field-label">Name:</div>
                <q-input
                  v-model="formData.employeeName"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <div class="col-12">
                <div class="field-label">Type of Leave:</div>
                <q-input
                  v-model="formData.typeOfLeave"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <div class="col-12">
                <div class="field-label">Leave Date:</div>
                <q-input
                  v-model="formData.leaveDate"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <div class="col-12">
                <div class="field-label">Remarks:</div>
                <q-input
                  v-model="formData.remarks"
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
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ confirmationData.actionType }} Leave Request</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Are you sure you want to {{ confirmationData.actionType.toLowerCase() }} this leave request?</p>
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
  reason: ''
})

// Form Data
const formData = ref({
  dateCreated: '',
  employeeName: '',
  typeOfLeave: '',
  leaveDate: '',
  remarks: '',
  status: ''
})

// Activities with proper structure
const activities = ref([
  {
    timestamp: 'SEPTEMBER 18, 2024, 9:00 AM',
    title: 'Leave Application Updated',
    approvedBy: 'NADINE LUSTRE',
    status: 'Pending',
    remarks: 'The leave application has been updated. Remarks: test'
  },
  {
    timestamp: 'SEPTEMBER 16, 2024, 12:46 PM',
    title: 'Leave Application Updated',
    approvedBy: 'NADINE LUSTRE',
    status: 'Pending',
    remarks: 'The leave application has been updated. Remarks: yrdy'
  },
  {
    timestamp: 'SEPTEMBER 16, 2024, 4:45 AM',
    title: 'Leave Application Created',
    approvedBy: '',
    status: 'Pending',
    remarks: 'The status of the leave application is pending and waiting for approval.'
  }
])

onMounted(() => {
  formData.value = {
    dateCreated: route.query.dateCreated || '',
    employeeName: route.query.employeeName || '',
    typeOfLeave: route.query.typeOfLeave || '',
    leaveDate: route.query.leaveDate || '',
    remarks: route.query.remarks || '',
    status: route.query.status || 'Pending'
  }
})

const openConfirmationDialog = (status, actionType) => {
  confirmationData.value = {
    status,
    actionType,
    reason: ''
  }
  showConfirmDialog.value = true
}

const handleStatusChange = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const { status, actionType, reason } = confirmationData.value
    const newStatus = actionType === 'Approve' ? 'Approved' : 'Declined'

    // Update form status
    formData.value.status = newStatus

    // Add new activity with the enhanced format
    const newActivity = {
      timestamp: date.formatDate(new Date(), 'MMMM D, YYYY, h:mm A'),
      title: `Leave Application ${newStatus}`,
      approvedBy: 'NADINE LUSTRE', // This should come from your auth system
      status: newStatus,
      remarks: reason
        ? `Leave request has been ${newStatus.toLowerCase()}: ${reason}`
        : `Leave request has been ${newStatus.toLowerCase()}`
    }

    activities.value.unshift(newActivity)

    // Show success notification
    $q.notify({
      type: actionType === 'Approve' ? 'positive' : 'negative',
      message: `Leave request ${newStatus.toLowerCase()} successfully`,
      position: 'top'
    })

    // Reset dialog
    showConfirmDialog.value = false
    confirmationData.value = { status: '', actionType: '', reason: '' }

  } catch (error) {
    console.error('Error:', error)
    $q.notify({
      type: 'negative',
      message: 'Error processing leave request',
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
  height: 40px;
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

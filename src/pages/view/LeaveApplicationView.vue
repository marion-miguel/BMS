<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <h5 class="q-my-none">Leave Details</h5>
      <q-breadcrumbs class="q-ml-md">
        <q-breadcrumbs-el icon="event_busy" />
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
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <!-- Employee Name -->
              <div class="col-12">
                <div class="field-label">Employee Name</div>
                <q-input
                  v-model="formData.employeeName"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <!-- Leave Date -->
              <div class="col-12">
                <div class="field-label">Leave Date</div>
                <q-input
                  v-model="formData.leaveDate"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <!-- Type of Leave -->
              <div class="col-12">
                <div class="field-label">Type of Leave</div>
                <q-input
                  v-model="formData.typeOfLeave"
                  outlined
                  dense
                  readonly
                  class="details-field"
                />
              </div>

              <!-- Status -->
              <div class="col-12">
                <div class="field-label">Status</div>
                <div class="status-text details-field">
                  {{ formData.status }}
                </div>
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { date } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const isLoading = ref(false)
const formData = ref({
  dateCreated: '',
  employeeName: '',
  leaveDate: '',
  typeOfLeave: '',
  status: ''
})

const activities = ref([])

onMounted(() => {
  formData.value = {
    dateCreated: route.query.dateCreated || '',
    employeeName: route.query.employeeName || '',
    leaveDate: route.query.leaveDate || '',
    typeOfLeave: route.query.typeOfLeave || '',
    status: route.query.status || ''
  }

  if (formData.value.dateCreated) {
    formData.value.dateCreated = date.formatDate(
      formData.value.dateCreated,
      'MMMM D, YYYY'
    )
  }
})

const handleStatusChange = async (newStatus, actionType) => {
  isLoading.value = true

  try {
    const confirmed = await $q.dialog({
      title: `${actionType} Leave Request`,
      message: `Are you sure you want to ${actionType.toLowerCase()} this leave request?`,
      cancel: true,
      persistent: true,
      ok: {
        label: actionType,
        flat: true
      },
      cancel: {
        flat: true,
        label: 'Cancel'
      }
    }).onOk(() => true)

    if (confirmed) {
      formData.value.status = newStatus

      activities.value.unshift({
        id: Date.now(),
        action: `Request ${newStatus}`,
        description: `Leave request was ${newStatus.toLowerCase()} by admin`,
        timestamp: date.formatDate(Date.now(), 'MMM D, YYYY HH:mm')
      })

      $q.notify({
        message: `Leave request ${newStatus.toLowerCase()} successfully`,
        position: 'top',
        timeout: 2000
      })

      setTimeout(() => router.push('/leave'), 2000)
    }
  } catch (error) {
    $q.notify({
      message: `Error ${actionType.toLowerCase()}ing leave request`,
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
  color: rgba(0, 0, 0, 0.7);
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

.status-text {
  padding: 8px 12px;
  min-height: 40px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  width: 100%;
}

/* Responsive styles */
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

<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <h5 class="q-my-none">Leave Application</h5>
      <q-breadcrumbs class="q-ml-md">
        <q-breadcrumbs-el icon="event_busy" />
        <q-breadcrumbs-el label="Form" />
      </q-breadcrumbs>
    </div>

    <!-- Content Container -->
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Application Form</div>

            <q-form @submit="onSubmit" class="q-gutter-y-md">
              <!-- Type of Leave -->
              <div class="col-12">
                <div class="field-label">Type of Leave</div>
                <q-select
                  v-model="formData.typeOfLeave"
                  :options="leaveOptions"
                  outlined
                  dense
                  class="full-width"
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Please select leave type']"
                />
              </div>

              <!-- File Upload -->
              <div class="col-12">
                <div class="field-label">File Upload</div>
                <q-file
                  v-model="formData.file"
                  outlined
                  dense
                  class="full-width"
                  hint="Upload supporting documents"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>

              <!-- Date Range -->
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="field-label">Date From</div>
                  <q-input
                    v-model="formData.dateFrom"
                    type="date"
                    outlined
                    dense
                    class="full-width"
                    :rules="[val => !!val || 'Please select start date']"
                  >

                  </q-input>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="field-label">Date To</div>
                  <q-input
                    v-model="formData.dateTo"
                    type="date"
                    outlined
                    dense
                    class="full-width"
                    :rules="[val => !!val || 'Please select end date']"
                  >

                  </q-input>
                </div>
              </div>

              <!-- Remarks -->
              <div class="col-12">
                <div class="field-label">Remarks</div>
                <q-input
                  v-model="formData.remarks"
                  type="textarea"
                  outlined
                  dense
                  class="full-width"
                  rows="4"
                />
              </div>

              <!-- Action Buttons -->
              <div class="row q-gutter-sm q-mt-lg">
                <q-btn
                  label="Submit"
                  type="submit"
                  color="green"
                  unelevated
                  :loading="submitting"
                />
                <q-btn
                label="Cancel"
                color="red"
                flat
                @click="onCancel"
                :disable="submitting"
              />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'LeaveApplicationForm'
})

const $q = useQuasar()
const router = useRouter()
const submitting = ref(false)

const leaveOptions = [
  {
    label: 'Maternity Leave',
    value: 'maternity'
  },
  {
    label: 'Sick Leave',
    value: 'sick'
  },
  {
    label: 'Vacation Leave',
    value: 'vacation'
  }
]

const formData = ref({
  typeOfLeave: null,
  file: null,
  dateFrom: '',
  dateTo: '',
  remarks: ''
})

const onSubmit = async () => {
  try {
    submitting.value = true

    // Validate dates
    const start = new Date(formData.value.dateFrom)
    const end = new Date(formData.value.dateTo)

    if (end < start) {
      $q.notify({
        color: 'negative',
        message: 'End date cannot be earlier than start date',
        icon: 'warning',
        position: 'top'
      })
      return
    }

    // Create new leave request object
    const newLeaveRequest = {
      id: Date.now(), // Generate unique ID
      dateCreated: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      employeeName: 'Current User', // Replace with actual user name from your auth system
      leaveDate: `${formData.value.dateFrom} - ${formData.value.dateTo}`,
      typeOfLeave: formData.value.typeOfLeave,
      status: 'Pending',
      remarks: formData.value.remarks
    }

    // Here you would typically make an API call to submit the form
    // await api.createLeaveRequest(newLeaveRequest)

    // In a real application, you would emit an event or use a store to update the list
    // For now, we can store it in localStorage to simulate persistence
    const existingRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]')
    existingRequests.unshift(newLeaveRequest)
    localStorage.setItem('leaveRequests', JSON.stringify(existingRequests))

    $q.notify({
      color: 'positive',
      message: 'Leave application submitted successfully',
      icon: 'check',
      position: 'top'
    })

    // Reset form
    formData.value = {
      typeOfLeave: null,
      file: null,
      dateFrom: '',
      dateTo: '',
      remarks: ''
    }

    // Redirect to list view
    router.push('/leave-application')
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error submitting application',
      icon: 'warning',
      position: 'top'
    })
  } finally {
    submitting.value = false
  }
}

const onCancel = async () => {
  try {
    const hasChanges = formData.value.typeOfLeave !== null ||
                      formData.value.file !== null ||
                      formData.value.dateFrom !== '' ||
                      formData.value.dateTo !== '' ||
                      formData.value.remarks !== ''

    if (hasChanges) {
      try {
        await $q.dialog({
          title: 'Cancel Application',
          message: 'You have unsaved changes in your leave application.',
          persistent: true,
          class: 'bg-white',
          ok: {
            push: true,
            color: 'negative',
            label: 'Yes, Cancel',
          },
          cancel: {
            push: true,
            color: 'primary',
            label: 'No, Continue Editing',
          }
        })

        // If confirmation is successful (user clicks Yes, Cancel)
        formData.value = {
          typeOfLeave: null,
          file: null,
          dateFrom: '',
          dateTo: '',
          remarks: ''
        }

        $q.notify({
          message: 'Form cancelled successfully',
          color: 'info',
          position: 'top',
          timeout: 2000,
          actions: [
            { icon: 'close', color: 'white' }
          ]
        })

        router.push('/LeaveApplication')
      } catch {
        // User clicked No, Continue Editing - do nothing and stay on form
      }
    } else {
      // If no changes, just redirect
      router.push('/LeaveApplication')
    }
  } catch (error) {
    console.error('Error in cancel operation:', error)
    $q.notify({
      message: 'Error cancelling form',
      color: 'negative',
      position: 'top',
      icon: 'error'
    })
  }
}
</script>

<style scoped>
.field-label {
  font-weight: 500;
  margin-bottom: 4px;
}

.full-width {
  width: 100%;
}

:deep(.q-field--outlined .q-field__control) {
  min-height: 32px;
  padding: 0 8px;
}

:deep(.q-field__label) {
  top: 8px;
  font-size: 14px;
}

@media (max-width: 767px) {
  .q-page {
    padding: 12px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .q-page {
    padding: 16px;
  }
}
</style>

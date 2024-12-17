<template>
  <q-page class="bg-black-1">
    <!-- Breadcrumb -->
    <div class="q-pa-md">
      <div class="row items-center q-mb-lg">
        <h4 class="text-h4 q-my-none">Leave</h4>
        <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
          <q-breadcrumbs-el icon="schedule" />
          <q-breadcrumbs-el label="Leave Form" />
        </q-breadcrumbs>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-borders q-pa-lg shadow-2">
        <div class="text-h6 q-mb-lg">Leave Form</div>

        <q-form @submit="onSubmit" class="q-gutter-y-md" ref="leaveForm">
          <!-- Type of Leave -->
          <div>
            <div class="text-black-8 q-mb-sm">Type of Leave</div>
            <q-select
              v-model="formData.leaveType"
              :options="leaveTypes"
              outlined
              dense
              placeholder="Select Leave Type"
              :rules="[val => !!val || 'Please select leave type']"
              lazy-rules
            />
          </div>

          <!-- Date Range -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-black-8 q-mb-sm">Date From</div>
              <q-input
                v-model="formData.dateFrom"
                outlined
                dense
                type="date"
                :rules="[
                  val => !!val || 'Start date is required',
                  val => isValidDateRange() || 'Start date must be before end date'
                ]"
                :min="minDate"
              />
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-black-8 q-mb-sm">Date To</div>
              <q-input
                v-model="formData.dateTo"
                outlined
                dense
                type="date"
                :rules="[
                  val => !!val || 'End date is required',
                  val => isValidDateRange() || 'End date must be after start date'
                ]"
                :min="formData.dateFrom || minDate"
              />
            </div>
          </div>

          <!-- File Upload -->
          <div>
            <div class="text-black-8 q-mb-sm">Supporting Documents</div>
            <q-file
              v-model="formData.file"
              outlined
              dense
              label="Choose File"
              accept=".pdf,.doc,.docx,.jpg,.png"
              max-file-size="5000000"
              @rejected="onFileRejected"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>

          <!-- Remarks -->
          <div class="q-mb-lg">
            <div class="text-subtitle2 q-mb-sm">Remarks</div>
            <q-input
              v-model="formData.remarks"
              type="textarea"
              outlined
              rows="5"
              placeholder="Enter your remarks here..."
              :rules="[
                val => !!val || 'Please provide remarks',
              ]"
              counter
              maxlength="500"
              lazy-rules
              class="remarks-field"
            />
          </div>

          <!-- Form Actions -->
          <div class="q-mt-md">
            <q-btn
              label="Submit"
              type="submit"
              color="green"
              class="q-mr-sm"
              unelevated
              :loading="submitting"
            />
            <q-btn
              label="Cancel"
              color="red"
              flat
              @click="confirmCancel"
              :disable="submitting"
            />
          </div>
        </q-form>
      </div>
    </div>

    <!-- Cancel Dialog -->
    <q-dialog v-model="cancelDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to cancel? All changes will be lost.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="No" color="green" v-close-popup />
          <q-btn flat label="Yes" color="red" @click="onCancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Success Dialog -->
    <q-dialog v-model="successDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="check_circle" color="positive" text-color="white" />
          <span class="q-ml-sm">Leave form submitted successfully!</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="green" v-close-popup @click="resetForm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'

export default defineComponent({
  name: 'LeaveForm',

  setup() {
    const $q = useQuasar()
    const leaveForm = ref(null)
    const submitting = ref(false)
    const cancelDialog = ref(false)
    const successDialog = ref(false)

    const leaveTypes = [
      'Vacation Leave',
      'Sick Leave',
      'Paternity Leave'
    ]

    const formData = ref({
      leaveType: null,
      dateFrom: '',
      dateTo: '',
      file: null,
      remarks: ''
    })

    // Get minimum date (today)
    const minDate = computed(() => {
      return date.formatDate(new Date(), 'YYYY-MM-DD')
    })

    // Date validation
    const isValidDateRange = () => {
      if (!formData.value.dateFrom || !formData.value.dateTo) return true
      return formData.value.dateFrom <= formData.value.dateTo
    }

    // File rejection handling
    const onFileRejected = (rejectedEntries) => {
      rejectedEntries.forEach(failure => {
        $q.notify({
          type: 'negative',
          message: `File rejected: ${failure.failedPropValidation === 'max-file-size'
            ? 'File size exceeds 5MB limit'
            : 'Invalid file type'}`
        })
      })
    }

    const validateForm = async () => {
      const isValid = await leaveForm.value.validate()
      if (!isValid) {
        $q.notify({
          color: 'negative',
          message: 'Please fill in all required fields correctly',
          icon: 'warning'
        })
        return false
      }

      if (!isValidDateRange()) {
        $q.notify({
          color: 'negative',
          message: 'End date must be after start date',
          icon: 'warning'
        })
        return false
      }

      return true
    }

    const onSubmit = async () => {
      try {
        const isValid = await validateForm()
        if (!isValid) return

        submitting.value = true

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Show success dialog
        successDialog.value = true

      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'An error occurred while submitting the form',
          icon: 'error'
        })
        console.error('Form submission error:', error)
      } finally {
        submitting.value = false
      }
    }

    const confirmCancel = () => {
      const isFormModified = Object.values(formData.value).some(value => !!value)
      if (isFormModified) {
        cancelDialog.value = true
      } else {
        onCancel()
      }
    }

    const onCancel = () => {
      resetForm()
      $q.notify({
        color: 'info',
        message: 'Form has been reset',
        icon: 'info'
      })
    }

    const resetForm = () => {
      formData.value = {
        leaveType: null,
        dateFrom: '',
        dateTo: '',
        file: null,
        remarks: ''
      }
      if (leaveForm.value) {
        leaveForm.value.reset()
      }
    }

    return {
      formData,
      leaveForm,
      leaveTypes,
      submitting,
      cancelDialog,
      successDialog,
      minDate,
      isValidDateRange,
      onFileRejected,
      onSubmit,
      confirmCancel,
      onCancel,
      resetForm
    }
  }
})
</script>

<style scoped>
.leave-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.form-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 8px;
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .container {
    padding: 12px;
  }

  .form-card {
    border-radius: 4px;
  }

  .q-card-section {
    padding: 16px;
  }
}

/* Form field styling */
:deep(.q-field) {
  margin-bottom: 8px;
}

:deep(.q-field__control) {
  height: 40px;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 4px;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: var(--q-);
}
.remarks-field :deep(.q-field__control) {
  height: auto;
  min-height: 120px;
}

.remarks-field :deep(.q-field__native) {
  padding: 12px;
  min-height: 120px;
  line-height: 1.5;
}

.remarks-field :deep(.q-field__counter) {
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
}

.remarks-field :deep(.q-field__bottom) {
  padding: 4px 12px;
}

.remarks-field :deep(.q-field--error) {
  margin-bottom: 16px;
}

.remarks-field :deep(.q-field--outlined .q-field__control:hover:not(.q-field--disabled)) {
  border-color: #21BA45;
}

.remarks-field :deep(.q-field--focused .q-field__control) {
  border-color: #21BA45;
  border-width: 2px;
}
@media screen and (max-width: 599px) {
  .q-item {
    min-height: 40px;
  }
}
</style>

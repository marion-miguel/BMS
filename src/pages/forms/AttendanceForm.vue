<template>
  <q-page class="bg-grey-1">
    <!-- Breadcrumb section remains the same -->
    <div class="q-pa-md">
      <!-- Form Card -->
      <div class="bg-white rounded-borders q-pa-lg shadow-2">
        <div class="row items-center justify-between q-mb-lg">
          <div class="text-h6">Attendance Form</div>
          <!-- Add timeLog display if exists -->
          <div v-if="timeLogData" class="text-caption q-gutter-x-md">
            <span>Time In: {{ formatTime(timeLogData.timeIn) }}</span>
            <span>Time Out: {{ formatTime(timeLogData.timeOut) }}</span>
          </div>
        </div>

        <q-form @submit="onSubmit" class="q-gutter-y-md" ref="attendanceForm">
          <!-- Date -->
          <div>
            <div class="text-black-8 q-mb-sm">Date</div>
            <q-input
              v-model="formData.date"
              outlined
              dense
              type="date"
              :rules="[val => !!val || 'Date is required']"
              readonly
            />
          </div>

          <!-- Time Summary if irregularity -->
          <div v-if="irregularityData" class="bg-grey-2 q-pa-md rounded-borders">
            <div class="text-subtitle2 q-mb-sm">Time Summary</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div>Late: {{ irregularityData.late }}</div>
                <div>Undertime: {{ irregularityData.undertime }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div>Total Hours: {{ irregularityData.totalHours }}</div>
              </div>
            </div>
          </div>

          <!-- Rest of the form fields remain the same -->
          <div>
            <div class="text-black-8 q-mb-sm">Description of Duties and Specific Project</div>
            <q-input
              v-model="formData.description"
              type="textarea"
              outlined
              rows="4"
              placeholder="Describe your duties and project"
              :rules="[val => !!val || 'Description is required']"
              counter
              maxlength="500"
            />
          </div>

          <!-- Time Range -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-black-8 q-mb-sm">Time In</div>
              <q-input
                v-model="formData.timeIn"
                outlined
                dense
                type="time"
                :rules="[val => !!val || 'Time in is required']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-black-8 q-mb-sm">Time Out</div>
              <q-input
                v-model="formData.timeOut"
                outlined
                dense
                type="time"
                :rules="[
                  val => !!val || 'Time out is required',
                  val => isValidTimeRange() || 'Time out must be after time in'
                ]"
              />
            </div>
          </div>

          <!-- Reason -->
          <div>
            <div class="text-black-8 q-mb-sm">Reason for Not Clocking In/Out</div>
            <q-input
              v-model="formData.reason"
              type="textarea"
              outlined
              rows="3"
              placeholder="Enter the reason"
              :rules="[val => !!val || 'Reason is required']"
            />
          </div>

          <!-- File Upload -->
          <div>
            <div class="text-black-8 q-mb-sm">File Upload</div>
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

          <!-- Form Actions -->
          <div class="row q-gutter-sm q-mt-md">
            <q-btn
              label="Submit"
              color="primary"
              unelevated
              @click="confirmSubmit"
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
      <q-btn flat label="No" color="primary" v-close-popup />
      <q-btn flat label="Yes" color="red" @click="onCancel" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

<!-- Submit Confirmation Dialog -->
<q-dialog v-model="submitDialog" persistent>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="help" color="primary" text-color="white" />
      <span class="q-ml-sm">Are you sure you want to submit this attendance form?</span>
    </q-card-section>

    <q-card-section>
      <div class="text-subtitle2">Please review your entries:</div>
      <div class="q-mt-sm">
        <div><strong>Date:</strong> {{ formData.date }}</div>
        <div><strong>Time In:</strong> {{ formData.timeIn }}</div>
        <div><strong>Time Out:</strong> {{ formData.timeOut }}</div>
        <div><strong>Description:</strong> {{ formData.description }}</div>
        <div><strong>Reason:</strong> {{ formData.reason }}</div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="No" color="grey" v-close-popup />
      <q-btn flat label="Yes, Submit" color="primary" @click="onSubmit" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { date } from 'quasar'

export default defineComponent({
  name: 'AttendanceForm',

  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    const attendanceForm = ref(null)
    const submitting = ref(false)
    const cancelDialog = ref(false)
    const submitDialog = ref(false)
    const timeLogData = ref(null)
    const irregularityData = ref(null)

    const formData = ref({
      date: '',
      description: '',
      timeIn: '',
      timeOut: '',
      reason: '',
      file: null
    })

    const convertToTimeFormat = (timeString) => {
  if (!timeString) return ''

  try {
    // Handle if it's already in HH:mm format
    if (timeString.length === 5 && timeString.includes(':')) {
      return timeString
    }

    // Handle ISO string
    const date = new Date(timeString)
    if (isNaN(date.getTime())) return ''

    return date.toTimeString().slice(0, 5)
  } catch {
    return ''
  }
}

    const formatTime = (isoString) => {
      if (!isoString) return ''
      const date = new Date(isoString)
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }

    const loadTimeLogData = async () => {
  try {
    // First check for data passed via route query
    const {
      date: queryDate,
      timeIn: queryTimeIn,
      timeOut: queryTimeOut,
      late: queryLate,
      undertime: queryUndertime,
      totalHours: queryTotalHours
    } = route.query

    // Set irregularity data if available
    if (queryLate || queryUndertime) {
      irregularityData.value = {
        late: queryLate || '0 hrs 0 min',
        undertime: queryUndertime || '0 hrs 0 min',
        totalHours: queryTotalHours || '0 hrs 0 min'
      }
    }

    // Load time log data from localStorage
    const savedLogs = localStorage.getItem('timeLogs')
    if (!savedLogs) return

    const timeLogs = JSON.parse(savedLogs)
    const dateKey = queryDate || formData.value.date
    const logData = timeLogs[dateKey]

    if (logData) {
      timeLogData.value = logData

      // Use passed times or stored times
      formData.value = {
        ...formData.value,
        date: dateKey,
        timeIn: queryTimeIn ? convertToTimeFormat(queryTimeIn) :
                convertToTimeFormat(logData.timeIn),
        timeOut: queryTimeOut ? convertToTimeFormat(queryTimeOut) :
                 (logData.timeOut ? convertToTimeFormat(logData.timeOut) : '')
      }

      // Check for existing irregularity report
      if (logData.hasIrregularityReport) {
        await loadIrregularityData(dateKey)
      }
    }
  } catch (error) {
    console.error('Error loading time log:', error)
    $q.notify({
      type: 'negative',
      message: 'Error loading time log data',
      timeout: 2000
    })
  }
}
    const loadIrregularityData = async (dateKey) => {
      try {
        const savedIrregularities = localStorage.getItem('irregularityReports')
        if (!savedIrregularities) return

        const irregularities = JSON.parse(savedIrregularities)
        const report = irregularities[dateKey]

        if (report) {
          irregularityData.value = {
            late: report.late || '0 hrs 0 min',
            undertime: report.undertime || '0 hrs 0 min',
            totalHours: report.totalHours || '0 hrs 0 min',
            description: report.description || '',
            reason: report.reason || ''
          }

          formData.value = {
            ...formData.value,
            description: report.description || formData.value.description,
            reason: report.reason || formData.value.reason
          }
        }
      } catch (error) {
        console.error('Error loading irregularity data:', error)
      }
    }

    const saveIrregularityReport = async () => {
      try {
        const dateKey = formData.value.date
        const report = {
          date: dateKey,
          timeIn: formData.value.timeIn,
          timeOut: formData.value.timeOut,
          description: formData.value.description,
          reason: formData.value.reason,
          late: irregularityData.value?.late || '0 hrs 0 min',
          undertime: irregularityData.value?.undertime || '0 hrs 0 min',
          totalHours: calculateTotalHours(),
          submittedAt: new Date().toISOString()
        }

        let savedIrregularities = localStorage.getItem('irregularityReports')
        const irregularities = savedIrregularities ? JSON.parse(savedIrregularities) : {}

        irregularities[dateKey] = report
        localStorage.setItem('irregularityReports', JSON.stringify(irregularities))

        // Update time logs to mark irregularity report
        const savedLogs = localStorage.getItem('timeLogs')
        if (savedLogs) {
          const timeLogs = JSON.parse(savedLogs)
          if (timeLogs[dateKey]) {
            timeLogs[dateKey].hasIrregularityReport = true
            localStorage.setItem('timeLogs', JSON.stringify(timeLogs))
          }
        }
      } catch (error) {
        console.error('Error saving irregularity report:', error)
        throw error
      }
    }

    const isValidTimeRange = () => {
      if (!formData.value.timeIn || !formData.value.timeOut) return true
      return formData.value.timeIn < formData.value.timeOut
    }

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

    // Form validation
    const validateForm = async () => {
      const isValid = await attendanceForm.value.validate()
      if (!isValid) {
        $q.notify({
          color: 'negative',
          message: 'Please fill in all required fields correctly',
          icon: 'warning'
        })
        return false
      }

      if (!isValidTimeRange()) {
        $q.notify({
          color: 'negative',
          message: 'Time out must be after time in',
          icon: 'warning'
        })
        return false
      }

      return true
    }

    // Submit confirmation handler
    const confirmSubmit = async () => {
      const isValid = await validateForm()
      if (isValid) {
        submitDialog.value = true
      }
    }

    const onSubmit = async () => {
      try {
        submitting.value = true

        if (route.query.type === 'timing_irregularity') {
          await saveIrregularityReport()
        }

        await new Promise(resolve => setTimeout(resolve, 1000))

        $q.notify({
          color: 'positive',
          message: 'Form submitted successfully',
          icon: 'check'
        })

        resetForm()
        router.push('/attendance-calendar')
      } catch (error) {
        console.error('Form submission error:', error)
        $q.notify({
          color: 'negative',
          message: 'An error occurred while submitting the form',
          icon: 'error'
        })
      } finally {
        submitting.value = false
      }
    }

    watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.date) {
      formData.value.date = newQuery.date
      loadTimeLogData()
    }
  },
  { immediate: true }
)

    // Cancel confirmation handler
    const confirmCancel = () => {
      const isFormModified = Object.values(formData.value).some(value =>
        value !== '' && value !== null && value !== formData.value.date
      )
      if (isFormModified) {
        cancelDialog.value = true
      } else {
        onCancel()
      }
    }

    // Cancel handler
    const onCancel = () => {
      resetForm()
      router.push('/attendance-calendar')
      $q.notify({
        color: 'info',
        message: 'Form has been reset',
        icon: 'info'
      })
    }

    // Form reset handler
    const resetForm = () => {
      formData.value = {
        date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        description: '',
        timeIn: '',
        timeOut: '',
        reason: '',
        file: null
      }
      if (attendanceForm.value) {
        attendanceForm.value.reset()
      }
    }

    // Calculate total hours
    const calculateTotalHours = () => {
      if (!formData.value.timeIn || !formData.value.timeOut) return '0 hrs 0 min'

      const timeIn = new Date(`2000/01/01 ${formData.value.timeIn}`)
      const timeOut = new Date(`2000/01/01 ${formData.value.timeOut}`)
      const diffMs = timeOut - timeIn
      const totalMinutes = Math.floor(diffMs / (1000 * 60))
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      return `${hours} hrs ${minutes} min`
    }

    // Lifecycle hook - component mounted
    onMounted(() => {
      const { date: queryDate, type } = route.query
      formData.value.date = queryDate || date.formatDate(new Date(), 'YYYY-MM-DD')
      loadTimeLogData()
    })

    // Return all necessary methods and reactive references
    return {
      // Refs
      formData,
      attendanceForm,
      submitting,
      cancelDialog,
      submitDialog,
      timeLogData,
      irregularityData,

      // Methods
      formatTime,
      isValidTimeRange,
      onFileRejected,
      confirmSubmit,
      onSubmit,
      confirmCancel,
      onCancel,
      resetForm,
      calculateTotalHours
    }
  }
})
</script>

<style scoped>
.attendance-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

:deep(.q-field--textarea .q-field__control) {
  height: auto;
  min-height: 100px;
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .q-pa-md {
    padding: 12px;
  }

  .form-card {
    border-radius: 4px;
  }

  .q-card-section {
    padding: 16px;
  }
}
</style>

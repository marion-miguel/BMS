<template>
  <q-page class="bg-black-1">
    <!-- Breadcrumb -->
    <div class="q-pa-md">
      <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Overtime</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="schedule" />
        <q-breadcrumbs-el label="Form Overtime" />
      </q-breadcrumbs>
    </div>

      <!-- Form Card -->
      <div class="bg-white rounded-borders q-pa-lg shadow-2">
        <div class="text-h6 q-mb-lg">Form Overtime</div>

                <q-form
                  @submit="onSubmit"
                  class="q-gutter-y-md"
                  ref="overtimeForm"
                >
                  <!-- Date Field -->
                  <div>
                    <div class="text-black-8 q-mb-sm">Date</div>
                    <q-input
                      v-model="formData.date"
                      outlined
                      dense
                      type="date"
                      :rules="[val => !!val || 'Date is required']"
                    />
                  </div>

          <!-- Description Field -->
          <div>
            <div class="text-black-8 q-mb-sm">Description of Duties and Specific Project</div>
            <q-input
              v-model="formData.description"
              outlined
              type="textarea"
              rows="5"
              placeholder="Describe your duties and project"
              :rules="[
                val => !!val || 'Description is required',
              ]"
              counter
              maxlength="500"
              lazy-rules
            />
          </div>

          <!-- Time Selection -->
          <div class="row q-col-gutter-md">
            <!-- Time From -->
            <div class="col-12 col-sm-6">
              <div class="text-black-8 q-mb-sm">Time From</div>
              <q-input
                v-model="formData.timeFrom"
                outlined
                dense
                readonly
                @click="showTimePicker('timeFrom')"
              >
                <template v-slot:append>
                  <q-icon name="schedule" class="cursor-pointer">
                    <q-menu
                    v-model="timeFromMenu"
                    :offset="[0, 8]"
                    class="time-picker-menu"
                  >
                    <div class="row no-wrap bg-white" style="width: 150px">
                      <!-- Hours Column -->
                      <div class="col">
                        <div class="text-center q-py-sm text-black-8">Hour</div>
                        <q-scroll-area style="height: 200px; width: 50px;">
                          <q-list dense class="text-center">
                            <q-item
                              v-for="h in 12"
                              :key="'h'+h"
                              clickable
                              dense
                              :active="getSelectedHour('timeFrom') === h"
                              active-class="text-white bg-green"
                              @click="setHour('timeFrom', h)"
                              class="cursor-pointer"
                            >
                              <q-item-section>
                                {{ String(h).padStart(2, '0') }}
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-scroll-area>
                      </div>

                      <!-- Minutes Column -->
                      <div class="col">
                        <div class="text-center q-py-sm text-black-8">Minute</div>
                        <q-scroll-area style="height: 200px; width: 60px;">
                          <q-list dense class="text-center">
                            <q-item
                              v-for="m in 59"
                              :key="'m'+m"
                              clickable
                              dense
                              :active="getSelectedMinute('timeFrom') === m"
                              active-class="text-white bg-green"
                              @click="setMinute('timeFrom', m)"
                              class="cursor-pointer"
                            >
                              <q-item-section>
                                {{ String(m).padStart(2, '0') }}
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-scroll-area>
                      </div>

                      <!-- AM/PM Column -->
                      <div class="col">
                        <div class="text-center q-py-sm text-black-8">Period</div>
                        <div class="column items-center">
                          <q-list dense class="full-width">
                            <q-item
                              v-for="period in ['AM', 'PM']"
                              :key="period"
                              clickable
                              dense
                              :active="timeFromPeriod === period"
                              active-class="text-white bg-green"
                              @click="timeFromPeriod = period; updateTime('timeFrom')"
                              class="cursor-pointer justify-center"
                            >
                              <q-item-section class="text-center">
                                {{ period }}
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>
                      </div>
                    </div>
                  </q-menu>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- Time To -->
            <div class="col-12 col-sm-6">
              <div class="text-black-8 q-mb-sm">Time To</div>
              <q-input
                v-model="formData.timeTo"
                outlined
                dense
                readonly
                @click="showTimePicker('timeTo')"
              >
                <template v-slot:append>
                  <q-icon name="schedule" class="cursor-pointer">
                    <q-menu
            v-model="timeToMenu"
            :offset="[0, 8]"
            class="time-picker-menu"
          >
            <div class="row no-wrap bg-white" style="width: 150px">
              <!-- Hours Column -->
              <div class="col">
                <div class="text-center q-py-sm text-black-8">Hour</div>
                <q-scroll-area style="height: 200px; width: 60px;">
                  <q-list dense class="text-center">
                    <q-item
                      v-for="h in 12"
                      :key="'h'+h"
                      clickable
                      dense
                      :active="getSelectedHour('timeTo') === h"
                      active-class="text-white bg-green"
                      @click="setHour('timeTo', h)"
                      class="cursor-pointer"
                    >
                      <q-item-section>
                        {{ String(h).padStart(2, '0') }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </div>

              <!-- Minutes Column -->
              <div class="col">
                <div class="text-center q-py-sm text-black-8">Minute</div>
                <q-scroll-area style="height: 200px; width: 60px;">
                  <q-list dense class="text-center">
                    <q-item
                      v-for="m in 59"
                      :key="'m'+m"
                      clickable
                      dense
                      :active="getSelectedMinute('timeTo') === m"
                      active-class="text-white bg-green"
                      @click="setMinute('timeTo', m)"
                      class="cursor-pointer"
                    >
                      <q-item-section>
                        {{ String(m).padStart(2, '0') }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </div>

            <!-- AM/PM Column -->
            <div class="col">
              <div class="text-center q-py-sm text-black-8">Period</div>
              <div class="column items-center">
                <q-list dense class="full-width">
                  <q-item
                    v-for="period in ['AM', 'PM']"
                    :key="period"
                    clickable
                    dense
                    :active="timeToPeriod === period"
                    active-class="text-white bg-green"
                    @click="timeToPeriod = period; updateTime('timeTo')"
                    class="cursor-pointer justify-center"
                  >
                    <q-item-section class="text-center">
                      {{ period }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </q-menu>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <!-- File Upload -->
          <div>
            <div class="text-black-8 q-mb-sm">File Upload</div>
            <q-file
              v-model="formData.file"
              outlined
              dense
              label="Choose File"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>

          <!-- Person Involved -->
          <div>
            <div class="text-black-8 q-mb-sm">Person Involved During the Overtime/Meeting</div>
            <div class="text-black-8 text-caption q-mb-sm">Name (insert email address if not itbs employee)</div>
            <q-input
              v-model="formData.personInvolved"
              outlined
              dense
            />
          </div>

          <!-- Contact Number -->
          <div>
            <div class="text-black-8 q-mb-sm">Contact Number</div>
            <q-input
              v-model="formData.contactNumber"
              outlined
              dense
              mask="####-###-####"
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
          <span class="q-ml-sm">Overtime form submitted successfully!</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="green" v-close-popup @click="resetForm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'FormOvertime',

  setup() {
    const $q = useQuasar()
    const overtimeForm = ref(null)
    const submitting = ref(false)
    const cancelDialog = ref(false)
    const successDialog = ref(false)

    const timeFromMenu = ref(false)
    const timeToMenu = ref(false)
    const timeFromPeriod = ref('AM')
    const timeToPeriod = ref('AM')

    const formData = ref({
      date: '',
      description: '',
      timeFrom: '',
      timeTo: '',
      file: null,
      personInvolved: '',
      contactNumber: ''
    })

    // Time picker related functions
    const parseTime = (timeStr) => {
      if (!timeStr) return { hour: 1, minute: 0, period: 'AM' }
      const match = timeStr.match(/(\d{1,2}):(\d{2}) (AM|PM)/)
      if (match) {
        return {
          hour: parseInt(match[1]),
          minute: parseInt(match[2]),
          period: match[3]
        }
      }
      return { hour: 1, minute: 0, period: 'AM' }
    }

    const formatTime = (hour, minute, period) => {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`
    }

    const getSelectedHour = (field) => {
      const time = parseTime(formData.value[field])
      return time.hour
    }

    const getSelectedMinute = (field) => {
      const time = parseTime(formData.value[field])
      return time.minute
    }

    const updateTime = (field) => {
      const time = parseTime(formData.value[field])
      const period = field === 'timeFrom' ? timeFromPeriod.value : timeToPeriod.value
      formData.value[field] = formatTime(time.hour, time.minute, period)
    }

    const setHour = (field, hour) => {
      const time = parseTime(formData.value[field])
      const period = field === 'timeFrom' ? timeFromPeriod.value : timeToPeriod.value
      formData.value[field] = formatTime(hour, time.minute, period)
    }

    const setMinute = (field, minute) => {
      const time = parseTime(formData.value[field])
      const period = field === 'timeFrom' ? timeFromPeriod.value : timeToPeriod.value
      formData.value[field] = formatTime(time.hour, minute, period)
    }

    const showTimePicker = (field) => {
      if (field === 'timeFrom') {
        timeFromMenu.value = true
        const time = parseTime(formData.value.timeFrom)
        timeFromPeriod.value = time.period
      } else {
        timeToMenu.value = true
        const time = parseTime(formData.value.timeTo)
        timeToPeriod.value = time.period
      }
    }

    // Form validation and submission
    const validateForm = async () => {
      // Add time validation
      if (!formData.value.timeFrom || !formData.value.timeTo) {
        $q.notify({
          color: 'negative',
          message: 'Please select both start and end times',
          icon: 'warning'
        })
        return false
      }

      // Validate time range
      const timeFrom = parseTime(formData.value.timeFrom)
      const timeTo = parseTime(formData.value.timeTo)

      // Convert to 24-hour format for comparison
      const fromHour = timeFrom.hour + (timeFrom.period === 'PM' ? 12 : 0)
      const toHour = timeTo.hour + (timeTo.period === 'PM' ? 12 : 0)

      if (fromHour > toHour || (fromHour === toHour && timeFrom.minute >= timeTo.minute)) {
        $q.notify({
          color: 'negative',
          message: 'End time must be after start time',
          icon: 'warning'
        })
        return false
      }

      const isValid = await overtimeForm.value.validate()
      if (!isValid) {
        $q.notify({
          color: 'negative',
          message: 'Please fill in all required fields correctly',
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
        date: '',
        description: '',
        timeFrom: '',
        timeTo: '',
        file: null,
        personInvolved: '',
        contactNumber: ''
      }
      if (overtimeForm.value) {
        overtimeForm.value.reset()
      }
    }

    return {
      formData,
      overtimeForm,
      submitting,
      cancelDialog,
      successDialog,
      timeFromMenu,
      timeToMenu,
      timeFromPeriod,
      timeToPeriod,
      getSelectedHour,
      getSelectedMinute,
      setHour,
      setMinute,
      updateTime,
      showTimePicker,
      onSubmit,
      confirmCancel,
      onCancel,
      resetForm
    }
  }
})
</script>

<style scoped>
.time-picker-menu {
  min-width: 200px;
}

/* Mobile Styles */
@media screen and (max-width: 599px) {
  .time-picker-menu {
    width: 100vw !important;
  }

  .q-scroll-area {
    width: 80px !important;
  }

  .q-item {
    min-height: 40px;
  }

  .row.no-wrap {
    justify-content: space-around;
    width: 100% !important;
  }
}
</style>

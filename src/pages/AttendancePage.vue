<template>
  <q-page padding>
    <!-- Breadcrumb -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Attendance</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="event_available" />
        <q-breadcrumbs-el label="Calendar" />
      </q-breadcrumbs>
    </div>

    <!-- Schedule Card -->
    <q-card class="schedule-card q-mb-md" bordered>
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Work Schedule</div>
        <div class="row q-gutter-md justify-center">
          <div class="schedule-item">
            <div class="text-weight-bold">Monday & Friday</div>
            <div>7:30 AM - 5:30 PM</div>
          </div>
          <div class="schedule-item">
            <div class="text-weight-bold">Tuesday - Thursday</div>
            <div>7:00 AM - 6:00 PM</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Clock Card -->
    <q-card class="clock-card q-mb-md" bordered>
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-medium text-grey-8">{{ clockDate }}</div>
        <div class="text-h3 text-weight-bold q-mt-sm text-green-8">{{ clockTime }}</div>

        <!-- Time In/Out Buttons -->
        <div class="row justify-center q-mt-md q-gutter-md">
          <q-btn
            :color="canTimeIn ? 'primary' : 'grey'"
            :label="todayTimeLog?.timeIn ? 'Timed In' : 'Time In'"
            :disable="!canTimeIn"
            @click="timeIn"
            icon="login"
          >
            <q-tooltip v-if="!isWorkingDay">Not a working day</q-tooltip>
          </q-btn>
          <q-btn
            :color="canTimeOut ? 'negative' : 'grey'"
            :label="todayTimeLog?.timeOut ? 'Timed Out' : 'Time Out'"
            :disable="!canTimeOut"
            @click="timeOut"
            icon="logout"
          >
            <q-tooltip v-if="!isWorkingDay">Not a working day</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

    <!-- Calendar Card -->
    <q-card class="centered-card" bordered>
      <q-card-section>
        <!-- Calendar Header -->
        <div class="row items-center justify-between q-mb-md calendar-header-container">
          <div class="text-h6 text-weight-bold">{{ currentMonth }}</div>
          <div class="row items-center">
            <q-btn flat round dense icon="chevron_left" @click="previousMonth" />
            <q-btn flat no-caps label="Today" class="q-mx-sm" @click="goToToday" color="green-8" />
            <q-btn flat round dense icon="chevron_right" @click="nextMonth" />
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="row calendar-header q-mb-md">
          <div v-for="day in weekDays" :key="day" class="col text-center text-weight-medium text-grey-8">
            {{ $q.screen.lt.sm ? day.charAt(0) : day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <div v-for="(week, weekIndex) in calendarDays" :key="weekIndex" class="row q-mb-sm">
            <div v-for="(day, dayIndex) in week" :key="`${weekIndex}-${dayIndex}`" class="col">
              <div
                class="calendar-day"
                :class="{
                  'current-day': isToday(day.date),
                  'different-month': !day.isCurrentMonth,
                  'clickable': day.isCurrentMonth,
                  'has-time-log': hasTimeLog(day.date),
                  'working-day': isScheduledWorkDay(day.date)
                }"
                @click="day.isCurrentMonth && selectDate(day.date)"
              >
                {{ day.dayNumber }}
                <div v-if="hasTimeLog(day.date)" class="time-log-indicator">
                  <q-icon name="schedule" size="xs" color="primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showResetDialog">
      <q-card>
        <q-card-section class="text-h6">
          Reset Time Logs
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-btn
                color="warning"
                label="Reset Today's Log"
                class="full-width"
                @click="confirmReset('today')"
              />
            </div>
            <div class="col-12">
              <q-btn
                color="negative"
                label="Reset All Logs"
                class="full-width"
                @click="confirmReset('all')"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showConfirmDialog">
      <q-card>
        <q-card-section class="text-h6">
          Confirm Reset
        </q-card-section>

        <q-card-section>
          Are you sure you want to reset {{ resetType === 'today' ? 'today\'s' : 'all' }} time logs?
          This action cannot be undone.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Reset"
            color="negative"
            @click="executeReset"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Date Dialog -->
    <q-dialog v-model="showDateDialog" persistent>
      <q-card style="min-width: 350px; max-width: 95vw;">
        <q-card-section class="text-h6 q-pb-none">
          {{ selectedDateFormatted }}
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div v-if="selectedDateTimeLog" class="row q-col-gutter-md">
            <div class="col-6">
              <div class="q-mb-md">
                <div class="text-subtitle2 text-weight-medium">Time In:</div>
                <div>{{ formatTime(selectedDateTimeLog.timeIn) }}</div>
              </div>
              <div class="q-mb-md">
                <div class="text-subtitle2 text-weight-medium">Total Hours:</div>
                <div>{{ calculateDateTotalTime(selectedDateTimeLog) }}</div>
              </div>
              <div>
                <div class="text-subtitle2 text-weight-medium">Late:</div>
                <div>{{ calculateDateLateTime(selectedDate, selectedDateTimeLog) }}</div>
              </div>
            </div>
            <div class="col-6">
              <div class="q-mb-md">
                <div class="text-subtitle2 text-weight-medium">Time Out:</div>
                <div>{{ selectedDateTimeLog.timeOut ? formatTime(selectedDateTimeLog.timeOut) : 'Not yet timed out' }}</div>
              </div>
              <div>
                <div class="text-subtitle2 text-weight-medium">Undertime:</div>
                <div>{{ calculateDateUndertime(selectedDate, selectedDateTimeLog) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="text-grey-8">
            No attendance record for this date
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'AttendancePage',

  data() {
    return {
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      currentDate: new Date(),
      calendarDays: [],
      clockInterval: null,
      clockDate: '',
      clockTime: '',
      showDateDialog: false,
      selectedDate: null,
      timeLogs: {},
      schedules: {
        monFri: {
          startTime: '07:30',
          endTime: '17:30'
        },
        tueThuWed: {
          startTime: '07:00',
          endTime: '18:00'
        }
      }
    }
  },

  computed: {
    currentMonth() {
      return this.currentDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
      })
    },

    todayTimeLog() {
      const today = new Date().toLocaleDateString('en-CA')
      return this.timeLogs[today] || null
    },

    selectedDateTimeLog() {
      if (!this.selectedDate) return null
      const dateKey = this.selectedDate.toLocaleDateString('en-CA')
      return this.timeLogs[dateKey] || null
    },

    selectedDateFormatted() {
      if (!this.selectedDate) return ''
      return this.selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    },

    isWorkingDay() {
      const today = new Date()
      const day = today.getDay()
      return day >= 1 && day <= 5
    },

    canTimeIn() {
      return this.isWorkingDay && !this.todayTimeLog?.timeIn
    },

    canTimeOut() {
      return this.isWorkingDay && this.todayTimeLog?.timeIn && !this.todayTimeLog?.timeOut
    }
  },

  methods: {
    updateClock() {
      const now = new Date()
      this.clockDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
      const hours = now.getHours() % 12 || 12
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM'
      this.clockTime = `${hours}:${minutes}:${seconds} ${ampm}`
    },

    formatTime(isoString) {
      if (!isoString) return ''
      const date = new Date(isoString)
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    },

    calculateDateTotalTime(timeLog) {
      if (!timeLog?.timeIn || !timeLog?.timeOut) return '0 hrs 0 min'

      const timeIn = new Date(timeLog.timeIn)
      const timeOut = new Date(timeLog.timeOut)
      const diffMs = timeOut - timeIn
      const totalMinutes = Math.floor(diffMs / (1000 * 60))
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      return `${hours} hrs ${minutes} min`
    },

    calculateDateLateTime(date, timeLog) {
      if (!timeLog?.timeIn || !this.isScheduledWorkDay(date)) return '0 hrs 0 min'

      const timeIn = new Date(timeLog.timeIn)
      const schedule = this.getScheduleForDate(date)
      if (!schedule) return '0 hrs 0 min'

      const [scheduleHour, scheduleMin] = schedule.startTime.split(':').map(Number)
      const scheduleStart = new Date(timeIn.getFullYear(), timeIn.getMonth(), timeIn.getDate(), scheduleHour, scheduleMin)

      if (timeIn <= scheduleStart) return '0 hrs 0 min'

      const lateMs = timeIn - scheduleStart
      const totalMinutes = Math.floor(lateMs / (1000 * 60))
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      return `${hours} hrs ${minutes} min`
    },

    calculateDateUndertime(date, timeLog) {
      if (!timeLog?.timeIn || !timeLog?.timeOut || !this.isScheduledWorkDay(date)) return '0 hrs 0 min'

      const schedule = this.getScheduleForDate(date)
      if (!schedule) return '0 hrs 0 min'

      const [scheduleEndHour, scheduleEndMin] = schedule.endTime.split(':').map(Number)
      const timeOut = new Date(timeLog.timeOut)
      const scheduleEnd = new Date(timeOut)
      scheduleEnd.setHours(scheduleEndHour, scheduleEndMin, 0, 0)

      if (timeOut < scheduleEnd) {
        const undertimeMs = scheduleEnd - timeOut
        const totalMinutes = Math.floor(undertimeMs / (1000 * 60))
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return `${hours} hrs ${minutes} min`
      }

      return '0 hrs 0 min'
    },

    getScheduleForDate(date) {
      if (!date) return null
      const day = date.getDay()
      if (day === 1 || day === 5) return this.schedules.monFri
      if (day >= 2 && day <= 4) return this.schedules.tueThuWed
      return null
    },

    timeIn() {
      if (!this.canTimeIn) return
      const now = new Date()
      const dateKey = now.toLocaleDateString('en-CA')
      this.timeLogs = {
        ...this.timeLogs,
        [dateKey]: {
          timeIn: now.toISOString(),
          timeOut: null
        }
      }
      this.saveTimeLogs()
    },

    timeOut() {
      if (!this.canTimeOut) return
      const now = new Date()
      const dateKey = now.toLocaleDateString('en-CA')
      if (this.timeLogs[dateKey]) {
        this.timeLogs = {
          ...this.timeLogs,
          [dateKey]: {
            ...this.timeLogs[dateKey],
            timeOut: now.toISOString()
          }
        }
        this.saveTimeLogs()
      }
    },

    saveTimeLogs() {
      try {
        localStorage.setItem('timeLogs', JSON.stringify(this.timeLogs))
      } catch (error) {
        console.error('Error saving time logs:', error)
      }
    },

    loadTimeLogs() {
      try {
        const savedLogs = localStorage.getItem('timeLogs')
        if (savedLogs) {
          this.timeLogs = JSON.parse(savedLogs)
        }
      } catch (error) {
        console.error('Error loading time logs:', error)
      }
    },

    generateCalendar() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      let currentWeek = []
      const allWeeks = []

      const firstDayOfWeek = firstDay.getDay()
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const prevDate = new Date(year, month, -i)
        currentWeek.push({
          date: prevDate,
          dayNumber: prevDate.getDate(),
          isCurrentMonth: false
        })
      }

      for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day)
        currentWeek.push({
          date: currentDate,
          dayNumber: day,
          isCurrentMonth: true
        })

        if (currentWeek.length === 7) {
          allWeeks.push(currentWeek)
          currentWeek = []
        }
      }

      if (currentWeek.length > 0) {
        const daysNeeded = 7 - currentWeek.length
        for (let i = 1; i <= daysNeeded; i++) {
          const nextDate = new Date(year, month + 1, i)
          currentWeek.push({
            date: nextDate,
            dayNumber: i,
            isCurrentMonth: false
          })
        }
        allWeeks.push(currentWeek)
      }

      this.calendarDays = allWeeks
    },

    isToday(dateToCheck) {
      if (!dateToCheck) return false
      const today = new Date()
      return dateToCheck.toDateString() === today.toDateString()
    },

    hasTimeLog(date) {
      if (!date) return false
      const dateKey = date.toLocaleDateString('en-CA')
      return !!this.timeLogs[dateKey]
    },

    isScheduledWorkDay(date) {
      if (!date) return false
      const day = date.getDay()
      return day >= 1 && day <= 5
    },

    selectDate(date) {
      this.selectedDate = date
      this.showDateDialog = true
    },

    previousMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      )
      this.generateCalendar()
    },

    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      )
      this.generateCalendar()
    },

    goToToday() {
      this.currentDate = new Date()
      this.generateCalendar()
    },

    resetTodayTimeLog() {
      try {
        const today = new Date().toLocaleDateString('en-CA')

        // Remove today's time log
        if (this.timeLogs[today]) {
          const { [today]: removed, ...remainingLogs } = this.timeLogs
          this.timeLogs = remainingLogs
          this.saveTimeLogs()

          this.$q.notify({
            type: 'positive',
            message: 'Successfully reset today\'s time log',
            timeout: 2000
          })
        } else {
          this.$q.notify({
            type: 'warning',
            message: 'No time log exists for today',
            timeout: 2000
          })
        }
      } catch (error) {
        console.error('Error resetting time log:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Error occurred while resetting time log',
          timeout: 2000
        })
      }
    },

    resetAllTimeLogs() {
      try {
        // Clear all time logs
        this.timeLogs = {}
        this.saveTimeLogs()

        this.$q.notify({
          type: 'positive',
          message: 'Successfully reset all time logs',
          timeout: 2000
        })
      } catch (error) {
        console.error('Error resetting all time logs:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Error occurred while resetting all time logs',
          timeout: 2000
        })
      }
    }
  },

  mounted() {
    this.updateClock()
    this.generateCalendar()
    this.clockInterval = setInterval(this.updateClock, 1000)
    this.loadTimeLogs()
  },

  beforeUnmount() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval)
    }
  }
})

</script>

<style lang="scss" scoped>
.schedule-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  width: 100%;
  max-width: 800px;
  margin: 0 auto 20px;

  .schedule-item {
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    background-color: #f8f9fa;
    min-width: 200px;
  }
}

.clock-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  width: 100%;
  max-width: 800px;
  margin: 0 auto 20px;
  transition: all 0.3s ease;

  .text-h5 {
    font-size: 1rem;
    @media (min-width: 768px) {
      font-size: 1.25rem;
    }
  }

  .text-h3 {
    font-size: 1.5rem;
    letter-spacing: 1px;
    @media (min-width: 768px) {
      font-size: 2.5rem;
    }
  }
}

.centered-card {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
}

.calendar-header-container {
  flex-wrap: wrap;
  gap: 10px;
}

.calendar-grid {
  .calendar-day {
    height: 100%;
    min-height: 40px;
    border: 1px solid #ddd;
    margin: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;

    @media (min-width: 768px) {
      min-height: 80px;
      margin: 5px;
    }

    &.current-day {
      background-color: #28a745;
      color: rgb(15, 5, 5);
    }

    &.different-month {
      opacity: 0.5;
    }

    &.working-day {
      background-color: #e8f5e9;
    }

    &.clickable {
      cursor: pointer;
      &:hover {
        background-color: #ddd;
        transform: scale(1.05);
      }
    }

    &.has-time-log {
      border: 2px solid green;
    }
  }
}

@media (max-width: 599px) {
  .q-page {
    padding: 16px !important;
  }

  .calendar-controls {
    .q-btn {
      padding: 4px;
      min-height: 32px;
      min-width: 32px;
    }
  }

  .schedule-item {
    min-width: 150px !important;
  }
}

@media (hover: none) {
  .calendar-day.clickable:hover {
    transform: none;
    background-color: #f8f9fa;
  }
}
</style>

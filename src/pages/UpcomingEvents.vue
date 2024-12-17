```vue
<template>
  <q-page padding>
    <!-- Responsive Breadcrumb -->
    <div class="row items-center q-mb-lg wrap">
      <h4 class="text-h5 q-my-none q-mb-xs-sm">Upcoming Events</h4>
      <q-breadcrumbs class="breadcrumb-container" active-color="grey" separator="|">
        <q-breadcrumbs-el icon="event" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row q-col-gutter-md">
      <div v-for="n in 3" :key="n" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="event-card">
          <div class="skeleton-box" style="height: 200px;"></div>
          <q-card-section>
            <div class="skeleton-box q-mb-md" style="height: 24px; width: 80%;"></div>
            <div class="skeleton-box q-mb-md" style="height: 60px;"></div>
            <div class="skeleton-box" style="height: 36px; width: 80px;"></div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Events Grid -->
    <div v-else-if="events.length > 0" class="row q-col-gutter-md">
      <div v-for="event in events" :key="event.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="event-card">
          <!-- Image Area with Date -->
          <div class="event-image relative-position">
            <div class="date-chip bg-green-8">
              {{ event.date }}
            </div>
            <q-img
              :src="`/api/placeholder/${280}/${200}`"
              style="height: 200px"
              class="full-width q-img--menu"
            >
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item clickable v-close-popup @click="showEventDialog(event)">
                    <q-item-section avatar>
                      <q-icon name="visibility" color="green-8" />
                    </q-item-section>
                    <q-item-section>View Details</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="shareEvent(event)">
                    <q-item-section avatar>
                      <q-icon name="share" color="green-8" />
                    </q-item-section>
                    <q-item-section>Share Event</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="addToCalendar(event)">
                    <q-item-section avatar>
                      <q-icon name="event" color="green-8" />
                    </q-item-section>
                    <q-item-section>Add to Calendar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-img>
          </div>

          <q-card-section class="q-pa-md">
            <div class="text-h6 ellipsis-2-lines q-mb-sm">{{ event.title }}</div>
            <div class="text-body2 text-grey-8 ellipsis-3-lines q-mb-md">
              {{ event.description }}
            </div>

            <!-- Event Details Preview -->
            <div class="row items-center text-grey-7 q-mb-md">
              <q-icon name="schedule" size="xs" class="q-mr-xs" />
              <span class="text-caption">See full schedule</span>
            </div>
            <div class="row justify-end">
            <q-btn
              label="View"
              icon="visibility"
              color="green-8"
              class="q-px-xl q-mt-sm"
              unelevated
              rounded-lg
              @click="showEventDialog(event)"
            />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- No Events Message -->
    <template v-else>
      <div class="no-events-container flex flex-center column q-pa-md">
        <q-card class="no-events-card" flat bordered>
          <q-card-section class="text-center">
            <q-icon name="event" size="4rem" class="text-grey-6 q-mb-md" />
            <div class="text-h6 text-grey-8">No Upcoming Events</div>
            <div class="text-subtitle2 text-grey-6">
              There are currently no upcoming events to display.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <!-- Event Dialog -->
    <q-dialog v-model="showDialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
  <q-card class="event-dialog">
    <!-- Dialog Header -->
    <q-card-section class="bg-green-8 text-white q-pa-md">
      <div class="row items-center justify-between">
        <div class="text-h6">{{ selectedEvent?.title }}</div>
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
    </q-card-section>

    <!-- Dialog Content -->
    <q-card-section class="q-pa-md scroll">
      <!-- About Section -->
      <div class="text-h6 q-mb-sm">About this Event</div>
      <p class="text-body1 q-mb-lg">{{ selectedEvent?.description }}</p>

      <!-- Schedule Section -->
      <div class="q-mb-lg">
        <div class="row items-center q-mb-md">
          <q-icon name="schedule" size="sm" class="q-mr-sm text-green-8" />
          <div class="text-subtitle1 text-weight-medium">Schedule</div>
        </div>
        <div class="schedule-container bg-grey-2 rounded-borders q-pa-md">
          <q-list padding>
            <q-item v-for="(item, index) in getScheduleList(selectedEvent?.content)"
                    :key="index"
                    class="q-py-sm">
              <q-item-section side>
                <div class="schedule-dot" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2">{{ item }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <!-- Event Details Card -->
      <div class="q-mb-lg">
        <div class="row items-center q-mb-md">
          <q-icon name="info" size="sm" class="q-mr-sm text-green-8" />
          <div class="text-subtitle1 text-weight-medium">Event Details</div>
        </div>
        <q-card flat bordered>
          <q-list>
            <!-- Date -->
            <q-item>
              <q-item-section avatar>
                <q-icon name="event" color="green-8" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Date</q-item-label>
                <q-item-label>{{ selectedEvent?.date }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset />

            <!-- Time -->
            <q-item>
              <q-item-section avatar>
                <q-icon name="schedule" color="green-8" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Time</q-item-label>
                <q-item-label>{{ getTime(selectedEvent?.content) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset />

            <!-- Location -->
            <q-item>
              <q-item-section avatar>
                <q-icon name="location_on" color="green-8" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Location</q-item-label>
                <q-item-label>{{ getLocation(selectedEvent?.content) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const showDialog = ref(false);
const selectedEvent = ref(null);
const loading = ref(true);

const events = ref([
  {
    id: 1,
    title: "Annual General Meeting",
    date: "November 25, 2024",
    description: "Join us for our annual general meeting where we'll discuss company performance and future plans.",
    content: "Agenda:\n\n- Welcome and Introduction\n- Financial Performance Review\n- Strategic Plans for 2025\n- Q&A Session\n- Networking\n\nLocation: Main Conference Room\nTime: 9:00 AM - 12:00 PM"
  },
  {
    id: 2,
    title: "Holiday Party",
    date: "December 10, 2024",
    description: "Annual company holiday celebration with dinner, entertainment, and awards ceremony.",
    content: "Schedule:\n\n- 6:00 PM: Welcome Reception\n- 7:00 PM: Dinner Service\n- 8:00 PM: Awards Ceremony\n- 9:00 PM: Entertainment & Dancing\n\nLocation: Grand Ballroom, City Hotel\nDress Code: Formal"
  },
  {
    id: 3,
    title: "New Year Kickoff",
    date: "January 5, 2025",
    description: "Start the new year with our company-wide kickoff meeting and team building activities.",
    content: "Event Details:\n\n- Department Updates\n- Goal Setting for 2025\n- Team Building Activities\n- Lunch & Networking\n\nLocation: Company Campus\nTime: 10:00 AM - 4:00 PMEvent Details:\n\n- Department Updates\n- Goal Setting for 2025\n- Team Building Activities\n- Lunch & Networking\n\nLocation: Company Campus\nTime: 10:00 AM - 4:00 PM"

  }
]);

const showEventDialog = (event) => {
  selectedEvent.value = event;
  showDialog.value = true;
};

const getTime = (content) => {
  if (!content) return '';
  const timeMatch = content.match(/Time:([^\n]+)/);
  return timeMatch ? timeMatch[1].trim() : '';
};
// Add these new methods alongside existing ones
const shareEvent = (event) => {
  $q.notify({
    color: 'green-8',
    message: `Sharing event: ${event.title}`,
    icon: 'share'
  });
};

const addToCalendar = (event) => {
  $q.notify({
    color: 'green-8',
    message: `Adding to calendar: ${event.title}`,
    icon: 'event'
  });
};
const getLocation = (content) => {
  if (!content) return '';
  const locationMatch = content.match(/Location:([^\n]+)/);
  return locationMatch ? locationMatch[1].trim() : '';
};

const getSchedule = (content) => {
  if (!content) return '';
  const lines = content.split('\n');
  const scheduleStart = lines.findIndex(line =>
    line.includes('Schedule:') ||
    line.includes('Agenda:') ||
    line.includes('Event Details:')
  );

  if (scheduleStart === -1) return '';

  return lines
    .slice(scheduleStart + 1)
    .filter(line => line.startsWith('-'))
    .join('\n');
};

const getScheduleList = (content) => {
  if (!content) return [];
  const schedule = getSchedule(content);
  return schedule.split('\n')
    .map(item => item.replace(/^-\s*/, '').trim())
    .filter(item => item.length > 0);
};

const getAdditionalInfo = (content) => {
  if (!content) return '';
  const lines = content.split('\n');
  const additionalInfo = lines
    .filter(line =>
      line.includes('Dress Code:') ||
      line.includes('Time:') ||
      (line.includes(':') && !line.includes('Location:') && !line.includes('Schedule:') && !line.includes('Agenda:') && !line.includes('Event Details:'))
    )
    .join('\n');
  return additionalInfo;
};

const additionalEventInfo = computed(() => {
  if (!selectedEvent.value?.content) return null;
  const info = getAdditionalInfo(selectedEvent.value.content);
  if (!info) return null;
  return info.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
});

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  loading.value = false;
});
</script>
<style lang="scss" scoped>
// Card Styles
.event-card {
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s ease;
  background: #fff;

  &:hover {
    @media (hover: hover) {
      transform: translateY(-4px);
    }
  }
}

// Event Elements
.date-chip {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  z-index: 1;
}

.event-image {
  position: relative;
}

// Dialog Styles
.event-dialog {
  width: 90vw;
  max-width: 800px;
  max-height: 70vh;
  border-radius: 8px;


  .schedule-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2E7D32;
  }

  .schedule-container {
    .q-item {
      min-height: unset;
      padding: 4px 0;
    }
  }

  @media (max-width: 599px) {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;

    .scroll {
      height: calc(100vh - 64px);
    }
  }
}

  .section-container {
    background: white;
    border-radius: 8px;
  }

  .schedule-list {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 16px;

    .schedule-item {
      padding: 8px 0;
      position: relative;
      margin-left: 16px;

      &::before {
        content: '';
        position: absolute;
        left: -16px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #2E7D32;
      }

      &:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
    }
  }

  .info-item {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 16px;
  }

  @media (max-width: 599px) {
    .event-header {
      padding: 16px;
    }
  }
// Info Card Styles
.info-card {
  .q-item {
    min-height: 48px;
    padding: 8px 16px;
  }

  .q-item-label.caption {
    color: rgba(0, 0, 0, 0.6);
  }
}

// Content Sections
.content-section {
  .text-h6 {
    color: rgba(0, 0, 0, 0.87);
  }
}

// Schedule Styles
.schedule-list {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 8px 0;
}

.schedule-item {
  position: relative;
  padding: 4px 0;

  .schedule-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2E7D32;
  }
}

// Separator
.q-separator.inset {
  margin-left: 56px;
}

// Loading Skeleton
.skeleton-box {
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
    content: '';
  }
}

// Text Truncation
.ellipsis-2-lines,
.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-2-lines {
  -webkit-line-clamp: 2;
}

.ellipsis-3-lines {
  -webkit-line-clamp: 3;
}

// Navigation
.breadcrumb-container {
  margin-left: 16px;

  @media (min-width: 600px) {
    margin-left: 60px;
  }
}

// Utility Classes
.rounded-borders {
  border-radius: 8px;
}

// Responsive Styles
@media (max-width: 599px) {
  .q-page {
    padding: 16px !important;
  }

  .text-h5 {
    font-size: 1.25rem;
  }
}

// Animations
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
.q-img--menu {
  cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }

</style>

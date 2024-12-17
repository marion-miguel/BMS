<template>
  <q-page padding>
    <!-- Breadcrumb -->
    <div class="row items-center q-mb-lg wrap">
      <h4 class="text-h5 q-my-none q-mb-xs-sm">Announcement</h4>
      <q-breadcrumbs class="breadcrumb-container" active-color="grey" separator="|">
        <q-breadcrumbs-el icon="announcement" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row q-col-gutter-md">
      <div v-for="n in 3" :key="n" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="announcement-card">
          <div class="skeleton-box" style="height: 200px;" />
          <q-card-section>
            <div class="skeleton-box q-mb-md" style="height: 24px;" />
            <div class="skeleton-box q-mb-md" style="height: 48px;" />
            <div class="skeleton-box" style="height: 36px; width: 80px;" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Announcements Grid -->
    <div v-else-if="announcements.length" class="row q-col-gutter-md">
      <div v-for="announcement in announcements" :key="announcement.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="announcement-card">
          <div class="announcement-image bg-grey-2 relative-position">
            <div class="date-chip bg-green-8">{{ announcement.date }}</div>
            <q-img
              :src="`/api/placeholder/280/200`"
              style="height: 200px"
              class="full-width"
            />
          </div>
          <q-card-section class="q-pa-md text-left">
            <div class="text-h6 ellipsis-2-lines q-mb-sm">{{ announcement.title }}</div>
            <div class="text-body2 text-grey-8 ellipsis-3-lines q-mb-md">
              {{ announcement.content }}
            </div>
            <div class="row justify-end">
              <q-btn
                label="View"
                icon="visibility"
                color="green-8"
                class="q-px-xl q-mt-sm"
                unelevated
                rounded-lg
                @click="openDialog(announcement)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="no-events-container flex flex-center column q-pa-md">
      <q-card class="no-events-card" flat bordered>
        <q-card-section class="text-center">
          <q-icon name="announcement" size="4rem" class="text-grey-6 q-mb-md" />
          <div class="text-h6 text-grey-8">No announcements posted</div>
          <div class="text-subtitle2 text-grey-6">
            There are currently no upcoming announcements to display.
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Details Dialog -->
    <q-dialog v-model="showDialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
      <q-card class="announcement-dialog">
        <q-card-section class="bg-green-8 text-white q-pa-md">
          <div class="row items-center justify-between">
            <div class="text-h6">{{ selectedAnnouncement?.title }}</div>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row items-center q-mb-lg">
            <q-icon name="event" size="sm" class="q-mr-sm text-green-8" />
            <span class="text-subtitle1">{{ selectedAnnouncement?.date }}</span>
          </div>
          <div class="text-h6 q-mb-sm">Announcement Details</div>
          <p class="text-body1 q-mb-lg">{{ selectedAnnouncement?.content }}</p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const showDialog = ref(false)
const selectedAnnouncement = ref(null)
const announcements = ref([])

const fetchAnnouncements = async () => {
  try {
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    announcements.value = [
      {
        id: 1,
        title: 'Conduct Guidelines',
        date: 'September 20, 2024',
        content: 'We are pleased to announce updates to our company conduct guidelines. These changes reflect our commitment to maintaining a positive and inclusive workplace environment. Please review the attached documents carefully.',
        attachments: [
          { id: 1, name: 'Conduct_Guidelines_2024.pdf', type: 'pdf' },
          { id: 2, name: 'Summary_of_Changes.docx', type: 'doc' }
        ]
      },
      {
        id: 2,
        title: 'Employee Handbook Update',
        date: 'September 19, 2024',
        content: 'The employee handbook has been updated to include new policies regarding remote work, time off, and professional development opportunities. These changes will take effect starting October 1, 2024.',
        attachments: [
          { id: 3, name: 'Employee_Handbook_2024.pdf', type: 'pdf' }
        ]
      },
      {
        id: 3,
        title: 'Office Policy Changes',
        date: 'September 18, 2024',
        content: 'In response to recent feedback, we\'ve updated several office policies to better accommodate our hybrid work model. Key changes include new meeting guidelines and workspace reservation procedures.',
        attachments: []
      }
    ]
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load announcements'
    })
  } finally {
    loading.value = false
  }
}

const openDialog = (announcement) => {
  selectedAnnouncement.value = announcement
  showDialog.value = true
}

onMounted(() => {
  fetchAnnouncements()
})
</script>

<style lang="scss" scoped>
.announcement-dialog {
  width: 90vw;
  max-width: 800px;
  max-height: 50vh;
  border-radius: 8px;

  @media (max-width: 599px) {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
}

.announcement-card {
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s ease;
  background: #fff;

  &:hover {
    transform: translateY(-4px);
  }
}

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

.announcement-image {
  position: relative;
}

.ellipsis-2-lines,
.ellipsis-3-lines {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}

.ellipsis-2-lines {
  -webkit-line-clamp: 2;
}

.ellipsis-3-lines {
  -webkit-line-clamp: 3;
}

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

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.breadcrumb-container {
  margin-left: 16px;
  @media (min-width: 600px) {
    margin-left: 60px;
  }
}

@media (max-width: 599px) {
  .q-page {
    padding: 16px !important;
  }
}

@media (hover: none) {
  .announcement-card:hover {
    transform: none;
  }
}
</style>

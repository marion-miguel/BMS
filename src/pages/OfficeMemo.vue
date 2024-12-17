<template>
  <q-page padding>
    <!-- Breadcrumb -->
    <div class="row items-center q-mb-lg wrap">
      <h4 class="text-h5 q-my-none q-mb-xs-sm">Office Memo</h4>
      <q-breadcrumbs class="breadcrumb-container" active-color="grey" separator="|">
        <q-breadcrumbs-el icon="description" />
        <q-breadcrumbs-el label="List" />
      </q-breadcrumbs>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row q-col-gutter-md">
      <div v-for="n in 3" :key="n" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="memo-card">
          <div class="skeleton-box" style="height: 200px;"></div>
          <q-card-section>
            <div class="skeleton-box q-mb-md" style="height: 24px; width: 80%;"></div>
            <div class="skeleton-box q-mb-md" style="height: 60px;"></div>
            <div class="skeleton-box" style="height: 36px; width: 80px;"></div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Memo Grid -->
    <div v-else-if="memos.length > 0" class="row q-col-gutter-md">
      <div v-for="memo in memos" :key="memo.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="memo-card">
          <!-- Image Area with Date -->
          <div class="memo-image bg-grey-2 relative-position">
            <div class="date-chip bg-green-8">
              {{ memo.date }}
            </div>
            <q-img
              :src="`/api/placeholder/${280}/${200}`"
              style="height: 200px"
              class="full-width"
            />
          </div>

          <q-card-section class="q-pa-md">
            <div class="text-h6 ellipsis-2-lines q-mb-sm">{{ memo.title }}</div>
            <div class="text-body2 text-grey-8 ellipsis-3-lines q-mb-md">
              {{ memo.content }}
            </div>

            <div class="row items-center justify-between">
              <div class="row items-center text-grey-7" v-if="memo.attachments?.length">
                <q-icon name="attach_file" size="xs" class="q-mr-xs" />
                <span class="text-caption">{{ memo.attachments.length }} attachment{{ memo.attachments.length > 1 ? 's' : '' }}</span>
              </div>
              <q-space />
              <q-btn
              label="View"
              icon="visibility"
              color="green-8"
              class="q-px-xl q-mt-sm"
              unelevated
              rounded-lg
              @click="openDialog(memo)"
            />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- No Memos Message -->
    <template v-else>
      <div class="no-memos-container flex flex-center column q-pa-md">
        <q-card class="no-memos-card" flat bordered>
          <q-card-section class="text-center">
            <q-icon name="description" size="4rem" class="text-grey-6 q-mb-md" />
            <div class="text-h6 text-grey-8">No Posted Memo</div>
            <div class="text-subtitle2 text-grey-6">
              There are currently no memos to display.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <!-- Memo Dialog -->
    <q-dialog v-model="showDialog" maximized persistent transition-show="slide-up" transition-hide="slide-down">
      <q-card class="memo-dialog">
        <!-- Dialog Header -->
        <q-card-section class="bg-green-8 text-white q-pa-md">
          <div class="row items-center justify-between">
            <div class="text-h6">{{ selectedMemo?.title }}</div>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <!-- Dialog Content -->
        <q-card-section class="q-pa-md scroll">
          <!-- Date Section -->
          <div class="row items-center q-mb-lg">
            <q-icon name="event" size="sm" class="q-mr-sm text-green-8" />
            <span class="text-subtitle1">{{ selectedMemo?.date }}</span>
          </div>

          <!-- Content Section -->
          <div class="text-h6 q-mb-sm">Memo Details</div>
          <p class="text-body1 q-mb-lg">{{ selectedMemo?.content }}</p>

          <!-- Attachments Section -->
          <div v-if="selectedMemo?.attachments?.length" class="q-mb-lg">
            <div class="row items-center q-mb-md">
              <q-icon name="attach_file" size="sm" class="q-mr-sm text-green-8" />
              <div class="text-subtitle1 text-weight-medium">Attachments</div>
            </div>
            <q-card flat bordered>
              <q-list padding>
                <template v-for="(attachment, index) in selectedMemo.attachments" :key="attachment.id">
                  <q-item clickable class="attachment-item" @click="downloadAttachment(attachment)">
                    <q-item-section avatar>
                      <q-icon :name="getAttachmentIcon(attachment.type)" color="green-8" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ attachment.name }}</q-item-label>
                      <q-item-label caption>{{ getFileSize(attachment.size) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="row items-center">
                        <q-btn
                          flat
                          round
                          dense
                          icon="download"
                          color="green-8"
                          :loading="downloading === attachment.id"
                          @click.stop="downloadAttachment(attachment)"
                        >
                          <q-tooltip>Download</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="canPreview(attachment.type)"
                          flat
                          round
                          dense
                          icon="visibility"
                          color="green-8"
                          class="q-ml-sm"
                          @click.stop="previewAttachment(attachment)"
                        >
                          <q-tooltip>Preview</q-tooltip>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="index < selectedMemo.attachments.length - 1" inset />
                </template>
              </q-list>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Preview Dialog -->
    <q-dialog v-model="showPreview">
      <q-card class="preview-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ previewAttachment?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="preview-container">
            <q-img
              v-if="isImage(previewAttachment?.type)"
              :src="previewAttachment?.url"
              style="max-height: 70vh"
              fit="contain"
            />
            <iframe
              v-else-if="isPDF(previewAttachment?.type)"
              :src="previewAttachment?.url"
              style="width: 100%; height: 70vh;"
              frameborder="0"
            />
            <div v-else class="text-center q-pa-md">
              <q-icon name="error_outline" size="48px" color="grey-6" />
              <div class="text-h6 text-grey-8 q-mt-md">Preview not available</div>
              <div class="text-body2 text-grey-6">
                This file type cannot be previewed. Please download to view.
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'OfficeMemo'
});

// Initialize Quasar and state variables
const $q = useQuasar();
const loading = ref(true);
const showDialog = ref(false);
const showPreview = ref(false);
const selectedMemo = ref(null);
const previewFile = ref(null);  // Renamed from previewAttachment to previewFile
const downloading = ref(null);
const memos = ref([]);

// Constants for file types
const PREVIEWABLE_TYPES = ['pdf', 'jpg', 'jpeg', 'png'];
const IMAGE_TYPES = ['jpg', 'jpeg', 'png'];
const FILE_ICONS = {
  pdf: 'picture_as_pdf',
  doc: 'description',
  docx: 'description',
  xls: 'table_chart',
  xlsx: 'table_chart',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  default: 'attach_file'
};

// Data fetch function
const fetchMemos = async () => {
  try {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1500));

    memos.value = [
      {
        id: 1,
        title: "Conduct Guidelines",
        date: "July 4, 2024",
        content: "We are pleased to announce updates to our company conduct guidelines. These changes reflect our commitment to maintaining a positive and inclusive workplace environment. Please review the attached documents carefully.",
        attachments: [
          {
            id: 1,
            name: "Conduct_Guidelines_2024.pdf",
            type: "pdf",
            size: 2500000,
            url: "/api/files/conduct-guidelines.pdf"
          },
          {
            id: 2,
            name: "Summary_of_Changes.docx",
            type: "doc",
            size: 500000,
            url: "/api/files/summary.docx"
          }
        ]
      },
      {
        id: 2,
        title: "Employee Handbook Update",
        date: "July 5, 2024",
        content: "The employee handbook has been updated to include new policies regarding remote work, time off, and professional development opportunities. These changes will take effect starting October 1, 2024.",
        attachments: [
          {
            id: 3,
            name: "Employee_Handbook_2024.pdf",
            type: "pdf",
            size: 3500000,
            url: "/api/files/handbook.pdf"
          }
        ]
      },
      {
        id: 3,
        title: "Office Policy Changes",
        date: "July 6, 2024",
        content: "In response to recent feedback, we've updated several office policies to better accommodate our hybrid work model. Key changes include new meeting guidelines and workspace reservation procedures.",
        attachments: []
      }
    ];
  } catch (error) {
    console.error('Failed to fetch memos:', error);
    notifyError('Failed to load memos. Please try again later.');
    memos.value = [];
  } finally {
    loading.value = false;
  }
};

// Dialog handlers
const openDialog = (memo) => {
  if (!memo) return;
  selectedMemo.value = memo;
  showDialog.value = true;
};

// File type handlers
const getAttachmentIcon = (type) => {
  if (!type) return FILE_ICONS.default;
  return FILE_ICONS[type.toLowerCase()] || FILE_ICONS.default;
};

const getFileSize = (bytes) => {
  if (!bytes || typeof bytes !== 'number') return '';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// File type checkers
const canPreview = (type) => {
  if (!type || typeof type !== 'string') return false;
  return PREVIEWABLE_TYPES.includes(type.toLowerCase());
};

const isImage = (type) => {
  if (!type || typeof type !== 'string') return false;
  return IMAGE_TYPES.includes(type.toLowerCase());
};

const isPDF = (type) => {
  if (!type || typeof type !== 'string') return false;
  return type.toLowerCase() === 'pdf';
};

// Notification helpers
const notifySuccess = (message) => {
  $q.notify({
    type: 'positive',
    message,
    position: 'top',
    timeout: 2000
  });
};

const notifyError = (message) => {
  $q.notify({
    type: 'negative',
    message,
    position: 'top',
    timeout: 3000
  });
};

const notifyWarning = (message) => {
  $q.notify({
    type: 'warning',
    message,
    position: 'top',
    timeout: 2000
  });
};

// File handling functions
const downloadAttachment = async (attachment) => {
  if (!attachment?.url || !attachment?.name) {
    notifyError('Invalid attachment information');
    return;
  }

  try {
    downloading.value = attachment.id;

    const link = document.createElement('a');
    link.href = attachment.url;
    link.setAttribute('download', attachment.name);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifySuccess(`Downloading ${attachment.name}`);
  } catch (error) {
    console.error('Download error:', error);
    notifyError(`Failed to download ${attachment.name}`);
  } finally {
    setTimeout(() => {
      downloading.value = null;
    }, 1000);
  }
};

const handlePreview = async (attachment) => {  // Renamed from previewAttachment to handlePreview
  if (!attachment?.type || !attachment?.url) {
    notifyError('Invalid attachment information');
    return;
  }

  try {
    if (!canPreview(attachment.type)) {
      notifyWarning('Preview not available for this file type');
      return;
    }

    previewFile.value = attachment;  // Using the renamed ref
    showPreview.value = true;
  } catch (error) {
    console.error('Preview error:', error);
    notifyError('Failed to load preview');
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchMemos();
});
</script>

<style lang="scss" scoped>
.memo-dialog {
  width: 90vw;
  max-width: 800px;
  max-height: 50vh;
  border-radius: 8px;


  .attachment-item {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    .q-item__section--side {
      padding-left: 16px;
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

.preview-dialog {
  width: 90vw;
  max-width: 1200px;

  .preview-container {
    background: #f5f5f5;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.memo-card {
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

.memo-image {
  position: relative;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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

.no-memos-container {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-memos-card {
  max-width: 400px;
  width: 100%;
}

@media (hover: none) {
  .memo-card:hover {
    transform: none;
  }
}

@media (max-width: 599px) {
  .q-page {
    padding: 16px !important;
  }

  .text-h5 {
    font-size: 1.25rem;
  }

  .preview-dialog {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
    margin: 0;

    .preview-container {
      height: calc(100vh - 120px);
    }
  }
}
</style>

<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <h5 class="q-my-none">Missing Logs Details</h5>
      <q-breadcrumbs class="q-ml-md">
        <q-breadcrumbs-el icon="format_list_bulleted" />
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
              <!-- Date -->
              <div class="col-12">
                <div class="field-label">Date</div>
                <q-input
                  v-model="formData.date"
                  readonly
                  dense
                  class="custom-input"
                  :class="{ 'no-data': !formData.date }"
                  borderless
                  input-class="no-padding"
                />
              </div>

              <!-- Description -->
              <div class="col-12">
                <div class="field-label">Description</div>
                <q-input
                  v-model="formData.description"
                  readonly
                  dense
                  type="textarea"
                  rows=""
                  class="custom-input"
                  :class="{ 'no-data': !formData.description }"
                  borderless
                  input-class="no-padding"
                />
              </div>

              <!-- Time In/Out -->
              <div class="col-12 col-sm-6">
                <div class="field-label">Time In</div>
                <q-input
                  v-model="formData.timeIn"
                  readonly
                  dense
                  class="custom-input"
                  :class="{ 'no-data': !formData.timeIn }"
                  borderless
                  input-class="no-padding"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="field-label">Time Out</div>
                <q-input
                  v-model="formData.timeOut"
                  readonly
                  dense
                  class="custom-input"
                  :class="{ 'no-data': !formData.timeOut }"
                  borderless
                  input-class="no-padding"
                />
              </div>

              <!-- Reason -->
              <div class="col-12">
                <div class="field-label">Reason</div>
                <q-input
                  v-model="formData.reason"
                  readonly
                  dense
                  type="textarea"
                  rows="2"
                  class="custom-input"
                  :class="{ 'no-data': !formData.reason }"
                  borderless
                  input-class="no-padding"
                />
              </div>

              <!-- Status -->
              <div class="col-12">
                <div class="field-label">Status</div>
                <div class="status-text">
                  {{ formData.status || '-' }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Activity -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
            <div class="text-center q-mt-md">
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
import { useRoute } from 'vue-router'

const route = useRoute()

const formData = ref({
  date: '',
  description: '',
  timeIn: '',
  timeOut: '',
  reason: '',
  status: ''
})

onMounted(() => {
  formData.value = {
    date: route.query.date || '',
    description: route.query.description || '',
    timeIn: route.query.timeIn || '',
    timeOut: route.query.timeOut || '',
    reason: route.query.reason || '',
    status: route.query.status || ''
  }
})
</script>

<style scoped>
.field-label {
  font-weight: 500;
  margin-bottom: 4px;
}

.status-text {
  padding: 8px 12px;
  min-height: 32px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  width: 100%;
}

:deep(.custom-input) {
  .q-field__control {
    height: 32px !important;
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
    border-radius: 4px !important;
  }

  .q-field__control:before,
  .q-field__control:after {
    display: none;
  }

  .q-field__native,
  .q-field__input {
    padding: 8px 12px !important;
    min-height: 32px !important;
    line-height: 16px !important;
  }
}

:deep(.no-data .q-field__native),
:deep(.no-data .q-field__input) {
  &:empty:before {
    content: '-';
    color: inherit;
  }
}

:deep(.custom-input.q-textarea) {
  .q-field__control {
    height: auto !important;
    min-height: 32px;
  }

  .q-field__native,
  .q-field__input {
    padding: 8px 12px !important;
    min-height: 52px !important;
  }
}

/* Responsive Styles */
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

<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="row items-center q-mb-lg">
      <div class="text-h5">Budget Request</div>
      <q-breadcrumbs class="q-ml-md">
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el label="For Employee" />
      </q-breadcrumbs>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-h6 q-mb-md">Details</div>
              <div>
                <q-btn
                  :loading="isLoading"
                  color="green"
                  label="Approve"
                  icon="check"
                  @click="onApprove"
                  class="q-mr-sm"
                  size="sm"
                  rounded-lg
                  unelevated
                />
                <q-btn
                  :loading="isLoading"
                  color="red"
                  label="Decline"
                  icon="close"
                  @click="onDecline"
                  size="sm"
                  unelevated
                  rounded-lg
                />
              </div>
            </div>

            <!-- Tab Navigation -->
            <q-tabs
              v-model="activeTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left"
              narrow-indicator
            >
              <q-tab name="details" icon="info" label="Details" />
              <q-tab name="documents" icon="description" label="Documents" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="activeTab" animated>
              <q-tab-panel name="details">
                <div class="row q-col-gutter-md">
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

                  <div class="col-12">
                    <div class="field-label">RFP / CAF No.</div>
                    <q-input
                      v-model="formData.rfpNumber"
                      outlined
                      dense
                      readonly
                      class="details-field"
                    />
                  </div>

                  <div class="col-12">
                    <div class="field-label">Project Name</div>
                    <q-input
                      v-model="formData.projectName"
                      outlined
                      dense
                      readonly
                      class="details-field"
                    />
                  </div>

                  <div class="col-12">
                    <div class="field-label">Amount</div>
                    <q-input
                      v-model="formData.amount"
                      outlined
                      dense
                      readonly
                      class="details-field"
                    />
                  </div>

                  <div class="col-12">
                    <div class="field-label">Purpose</div>
                    <q-input
                      v-model="formData.purpose"
                      outlined
                      dense
                      readonly
                      class="details-field"
                      type="textarea"
                      autogrow
                    />
                  </div>

                  <!-- Budget Details Table -->
                  <div class="col-12">
                    <q-table
                      :rows="formData.budgetItems"
                      :columns="budgetColumns"
                      row-key="id"
                      flat
                      bordered
                      hide-bottom
                    />
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="documents">
                <q-table
                  flat
                  bordered
                  :rows="documents"
                  :columns="documentColumns"
                  row-key="id"
                  :rows-per-page-options="[0]"
                >
                  <template v-slot:no-data>
                    <div class="full-width row flex-center text-grey q-pa-sm">
                      No documents submitted
                    </div>
                  </template>

                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                        class="text-bold"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.value }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Activity Card -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-3">
          <q-card-section>
            <div class="text-h6 q-mb-md">Recent Activity</div>

            <q-timeline color="green">
              <q-timeline-entry
                v-for="activity in activities"
                :key="activity.timestamp"
                :title="activity.title"
                :subtitle="activity.timestamp"
              >
              <div>
                  <div>Approved by: {{ activity.approvedBy }}</div>
                  <div>Status: {{ activity.status }}</div>
                  <div>Remarks: {{ activity.remarks }}</div>
                </div>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ confirmationData.actionType }} Budget Request</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Are you sure you want to {{ confirmationData.actionType.toLowerCase() }} this budget request?</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="grey"
            v-close-popup
          />
          <q-btn
            :flat="true"
            :label="confirmationData.actionType"
            :color="confirmationData.actionType === 'Approve' ? 'green' : 'red'"
            :loading="isLoading"
            @click="handleStatusChange"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const showConfirmDialog = ref(false)
const activeTab = ref('details')

const confirmationData = ref({
  status: '',
  actionType: ''
})


const budgetColumns = [
  {
    name: 'amount',
    required: true,
    label: 'AMOUNT',
    align: 'left',
    field: row => row.amount,
    format: val => `${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
  },
  {
    name: 'particulars',
    required: true,
    label: 'PARTICULARS',
    align: 'left',
    field: row => row.particulars,
  }
]

const documentColumns = [
  {
    name: 'document',
    required: true,
    label: 'DOCUMENT',
    align: 'left',
    field: row => row.document
  },
  {
    name: 'action',
    required: true,
    label: 'ACTION',
    align: 'left',
    field: row => row.action
  }
]
const documents = ref([])


const formData = ref({
  employeeName: '',
  rfpNumber: '',
  projectName: '',
  amount: '10000.00',
  purpose: '',
  status: '',
  budgetItems: [
    { id: 1, amount: 1000.00, particulars: 'Transportation' }
  ]
})

onMounted(() => {
  formData.value = {
    employeeName: route.query.employeeName || '',
    projectName: route.query.projectName || '',
    dateCreated: route.query.dateCreated || '',
    status: route.query.status || 'Pending',
    rfpNumber: route.query.rfpNumber || '',
    amount: route.query.amount || '10000.00',
    purpose: route.query.purpose || '',
    budgetItems: [
      { id: 1, amount: 1000.00, particulars: 'Transportation' }
    ]
  }

  // Check if there's an automatic action to perform
  const action = route.query.action
  if (action === 'approve') {
    onApprove()
  } else if (action === 'decline') {
    onDecline()
  }
})


const activities = ref([
  {
    timestamp: 'DECEMBER 17, 2024, 08:57 AM',
    title: 'Budget Request Updated',
    approvedBy: 'NADINE LUSTRE',
    status: 'Pending',
    remarks: 'The Budget Request application is awaiting approval by the Department Head.'
  },
  {
    timestamp: 'DECEMBER 17, 2024, 08:57 AM',
    title: 'Budget Request Updated',
    approvedBy: 'NADINE LUSTRE',
    status: 'Pending',
    remarks: 'The Budget Request application is awaiting approval by the Department Head.'
  }
])

const openConfirmationDialog = (status, actionType) => {
  confirmationData.value = {
    status,
    actionType
  }
  showConfirmDialog.value = true
}

const handleStatusChange = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const { status, actionType } = confirmationData.value
    const newStatus = actionType === 'Approve' ? 'Approved' : 'Declined'

    // Update form status
    formData.value.status = newStatus

    // Add new activity
    const newActivity = {
      timestamp: date.formatDate(new Date(), 'MMMM D, YYYY, h:mm A'),
      title: `Budget Request ${newStatus}`,
      approvedBy: 'NADINE LUSTRE', // This should come from your auth system
      status: newStatus,
      remarks: `The Budget Request application has been ${newStatus.toLowerCase()}.`
    }

    activities.value.unshift(newActivity)

    // Show notification
    $q.notify({
      type: actionType === 'Approve' ? 'positive' : 'negative',
      message: `Budget request ${newStatus.toLowerCase()} successfully`,
      position: 'top'
    })

    // Reset dialog
    showConfirmDialog.value = false
    confirmationData.value = { status: '', actionType: '' }

    // Redirect back to list after delay
    setTimeout(() => {
      router.push('/LBRForEmployee')
    }, 2000)

  } catch (error) {
    console.error('Error:', error)
    $q.notify({
      type: 'negative',
      message: 'Error processing budget request',
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}

const onApprove = () => openConfirmationDialog('Approved', 'Approve')
const onDecline = () => openConfirmationDialog('Declined', 'Decline')
</script>

<style scoped>
.field-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 4px;
}

:deep(.details-field .q-field__control) {
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

:deep(.details-field.q-field--readonly .q-field__native) {
  color: rgba(0, 0, 0, 0.87);
}

/* Timeline customization */
:deep(.q-timeline__entry) {
  margin-bottom: 20px;
}

:deep(.q-timeline__subtitle) {
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 767px) {
  .q-page {
    padding: 16px;
  }
}
:deep(.q-table th) {
  font-weight: 500;
  background-color: #f5f5f5;
}

:deep(.q-table td) {
  white-space: normal;
  word-break: break-word;
}
</style>

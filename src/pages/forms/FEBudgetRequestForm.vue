<template>
  <q-page class="bg-black-1">
    <!-- Breadcrumb -->
    <div class="q-pa-md">
      <div class="row items-center q-mb-lg">
        <h4 class="text-h4 q-my-none">Budget Request</h4>
        <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
          <q-breadcrumbs-el icon="folder" />
          <q-breadcrumbs-el label="Budget Request Form" />
        </q-breadcrumbs>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-borders q-pa-lg shadow-2">
        <div class="text-h6 q-mb-lg">Budget Request Form</div>

        <q-form @submit="onSubmit" class="q-gutter-y-md" ref="budgetForm">
          <!-- Request Type -->
          <div>
            <div class="text-black-8 q-mb-sm">Request Type</div>
            <q-option-group
              v-model="formData.requestType"
              :options="requestTypeOptions"
              color="green"
              inline
              type="radio"
            />
          </div>

          <!-- Project and Amount -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-black-8 q-mb-sm">Project</div>
              <q-select
                v-model="formData.project"
                :options="projectOptions"
                outlined
                dense
                :rules="[val => !!val || 'Project is required']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <div class="text-black-8 q-mb-sm">Amount Requested</div>
              <q-input
                v-model="formData.amountRequested"
                outlined
                dense
                type="number"
                prefix="₱"
                :rules="[
                  val => !!val || 'Amount is required',
                  val => val > 0 || 'Amount must be greater than 0'
                ]"
              />
            </div>
          </div>

          <!-- Purpose -->
          <div>
            <div class="text-black-8 q-mb-sm">Purpose of Cash Advance</div>
            <div class="text-black-8 text-caption q-mb-sm">Describe the purpose of your budget request</div>
            <q-input
              v-model="formData.purpose"
              outlined
              type="textarea"
              rows="4"
              placeholder="Describe the purpose of your budget request"
              :rules="[
                val => !!val || 'Purpose is required',
                val => val.length >= 10 || 'Purpose must be at least 10 characters'
              ]"
            />
          </div>

          <!-- Table Section -->
          <div>
            <div class="text-black-8 q-mb-sm">Budget Items</div>
            <div class="row justify-end q-mb-sm">
              <q-btn
                label="Add Item"
                color="green"
                unelevated
                @click="addRow"
              />
            </div>

            <q-table
              :rows="formData.items"
              :columns="columns"
              flat
              bordered
              hide-pagination
              hide-bottom
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="amount" :props="props">
                    <q-input
                      v-model="props.row.amount"
                      type="number"
                      dense
                      outlined
                      prefix="₱"
                    />
                  </q-td>
                  <q-td key="particulars" :props="props">
                    <q-select
                      v-model="props.row.particulars"
                      :options="particularsOptions"
                      dense
                      outlined
                    />
                  </q-td>
                  <q-td key="actions" :props="props" class="text-center">
                    <q-btn
                      flat
                      round
                      color="red"
                      icon="delete"
                      size="sm"
                      @click="removeRow(props.rowIndex)"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>

          <!-- File Upload -->
          <div>
            <div class="text-black-8 q-mb-sm">Supporting Documents</div>
            <q-file
              v-model="formData.files"
              outlined
              dense
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              @rejected="onRejected"
              :max-file-size="5 * 1024 * 1024"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <div class="text-caption text-grey q-mt-sm">
              Max file size: 5MB. Accepted formats: PDF, DOC, DOCX, XLS, XLSX
            </div>
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
          <span class="q-ml-sm">Budget request submitted successfully!</span>
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
  name: 'BudgetRequestForm',

  setup() {
    const $q = useQuasar()
    const budgetForm = ref(null)
    const submitting = ref(false)
    const cancelDialog = ref(false)
    const successDialog = ref(false)

    const requestTypeOptions = [
      { label: 'New Funding Request', value: 'new' },
      { label: 'With Existing CA', value: 'existing' }
    ]

    const projectOptions = ['Project A', 'Project B', 'Project C']
    const particularsOptions = ['Travel', 'Supplies', 'Equipment', 'Services']

    const columns = [
      {
        name: 'amount',
        label: 'Amount',
        field: 'amount',
        align: 'left',
        style: 'width: 40%'
      },
      {
        name: 'particulars',
        label: 'Particulars',
        field: 'particulars',
        align: 'left',
        style: 'width: 40%'
      },
      {
        name: 'actions',
        label: 'Actions',
        field: 'actions',
        align: 'center',
        style: 'width: 20%'
      }
    ]

    const formData = ref({
      requestType: 'new',
      project: null,
      amountRequested: null,
      purpose: '',
      items: [],
      files: null
    })

    const addRow = () => {
      formData.value.items.push({
        amount: null,
        particulars: null
      })
    }

    const removeRow = (index) => {
      formData.value.items.splice(index, 1)
    }

    const onRejected = (rejectedEntries) => {
      rejectedEntries.forEach(failure => {
        $q.notify({
          color: 'negative',
          message: `File rejected: ${failure.failedPropValidation === 'max-file-size'
            ? 'File size exceeds 5MB limit'
            : 'Invalid file type'}`,
          icon: 'warning'
        })
      })
    }

    const validateForm = async () => {
      const isValid = await budgetForm.value.validate()
      if (!isValid) {
        $q.notify({
          color: 'negative',
          message: 'Please fill in all required fields correctly',
          icon: 'warning'
        })
        return false
      }

      if (formData.value.items.length === 0) {
        $q.notify({
          color: 'negative',
          message: 'Please add at least one budget item',
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
      const isFormModified = Object.values(formData.value).some(value => !!value) || formData.value.items.length > 0
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
        requestType: 'new',
        project: null,
        amountRequested: null,
        purpose: '',
        items: [],
        files: null
      }
      if (budgetForm.value) {
        budgetForm.value.reset()
      }
    }

    return {
      formData,
      budgetForm,
      submitting,
      cancelDialog,
      successDialog,
      requestTypeOptions,
      projectOptions,
      particularsOptions,
      columns,
      addRow,
      removeRow,
      onRejected,
      onSubmit,
      confirmCancel,
      onCancel,
      resetForm
    }
  }
})
</script>

<style>
/* Table styles */
.q-table {
  background-color: white;
}

.q-table th {
  font-weight: 500 !important;
}

.q-table td {
  height: 60px;
}

/* Input and field styles */
.text-subtitle2 {
  font-weight: 500;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 4px;
}

.q-field--outlined .q-field__control {
  height: 40px;
  border-radius: 4px;
}

.q-field--outlined.q-field--dense .q-field__control {
  height: 50px;
}

.q-field {
  font-size: 0.875rem;
}

/* Card styles */
.q-card {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

/* Page styles */
.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Button styles */
.q-btn {
  border-radius: 4px;
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .q-page-container {
    padding: 12px !important;
  }

  .q-card {
    padding: 12px !important;
  }

  .text-h6 {
    font-size: 1.25rem;
  }
}

/* Remove borders */
.q-table__container {
  border: none !important;
}

.q-table > thead > tr > th {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.q-table > tbody > tr > td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}
.form-card {
  max-width: 1200px;
  margin: 0 auto;
}

.input-field {
  width: 100%;
}

.input-field .q-field__control {
  height: 45px !important;
}

.q-textarea .q-field__control {
  height: auto !important;
}

/* Adjust select field specifically */
.q-select .q-field__native {
  padding: 0;
  min-height: 45px;
  line-height: 45px;
}

/* Keep your existing styles */
.text-subtitle2 {
  font-weight: 500;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.7);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .q-page {
    padding: 16px;
  }

  .form-card {
    padding: 16px !important;
  }
}
</style>

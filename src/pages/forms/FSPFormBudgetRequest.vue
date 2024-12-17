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

        <q-form @submit.prevent="onSubmit" class="q-gutter-y-md" ref="budgetForm">
          <!-- Request Type -->


          <!-- Top Row Fields -->
          <div class="row q-col-gutter-md">
            <!-- Project Selection -->
            <div class="col-12 col-md-4">
              <div class="text-black-8 q-mb-sm">Project Name</div>
              <div class="text-black-8 text-caption q-mb-sm">Select your project</div>
              <q-select
                v-model="formData.project"
                :options="projectOptions"
                outlined
                dense
                options-dense
                placeholder="Select One"
                :rules="[val => !!val || 'Project is required']"
              />
            </div>

            <!-- Supplier Name -->
            <div class="col-12 col-md-4">
              <div class="text-black-8 q-mb-sm">Supplier Name</div>
              <div class="text-black-8 text-caption q-mb-sm">Select your supplier</div>
              <q-select
                v-model="formData.supplierName"
                :options="supplierOptions"
                outlined
                dense
                options-dense
                placeholder="Select One"
                :rules="[val => !!val || 'Supplier is required']"
              />
            </div>

            <!-- Category Type -->
            <div class="col-12 col-md-4">
              <div class="text-black-8 q-mb-sm">Category Type</div>
              <div class="text-black-8 text-caption q-mb-sm">Select category</div>
              <q-select
                v-model="formData.categoryType"
                :options="categoryOptions"
                outlined
                dense
                options-dense
                placeholder="Select One"
                :rules="[val => !!val || 'Category is required']"
              />
            </div>
          </div>

          <!-- Terms -->
          <div>
            <div class="text-black-8 q-mb-sm">Terms</div>
            <div class="text-black-8 text-caption q-mb-sm">Enter payment terms</div>
            <q-input
              v-model="formData.terms"
              outlined
              dense
              type="textarea"
              rows="2"
              placeholder="Enter terms"
              :rules="[val => !!val || 'Terms are required']"
            />
          </div>

          <!-- Items Table -->
          <div>
            <div class="text-black-8 q-mb-sm">Items</div>
            <div class="row justify-end q-mb-sm">
              <q-btn
                label="Add Row"
                color="green"
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
              :rows-per-page-options="[0]"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="qty" :props="props">
                    <q-input
                      v-model.number="props.row.qty"
                      type="number"
                      dense
                      outlined
                      @update:model-value="calculateTotal(props.rowIndex)"
                    />
                  </q-td>
                  <q-td key="oum" :props="props">
                    <q-input
                      v-model="props.row.oum"
                      dense
                      outlined
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
                  <q-td key="amount" :props="props">
                    <q-input
                      v-model.number="props.row.amount"
                      type="number"
                      dense
                      outlined
                      prefix="₱"
                      @update:model-value="calculateTotal(props.rowIndex)"
                    />
                  </q-td>
                  <q-td key="totalAmount" :props="props">
                    {{ formatCurrency(props.row.totalAmount) }}
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


          <!-- File Upload -->
          <div>
            <div class="text-black-8 q-mb-sm">Supporting Documents</div>
            <q-file
              v-model="formData.files"
              outlined
              dense
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              bottom-slots
              counter
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <template v-slot:hint>
                Accepted formats: PDF, DOC, DOCX, XLS, XLSX
              </template>
            </q-file>
          </div>

          <!-- Form Actions -->
          <div class="row justify-start q-gutter-x-md q-mt-lg">
            <q-btn
              label="Submit"
              type="submit"
              color="green"
              :loading="submitting"
              class="q-px-md"
            />
            <q-btn
              label="Cancel"
              color="red"
              flat
              @click="showCancelDialog"
              :ripple="false"
              class="q-px-md"
            />
          </div>
        </q-form>
      </div>
    </div>

    <!-- Cancel Dialog -->
    <q-dialog v-model="cancelDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to cancel? All changes will be lost.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="No" color="green" v-close-popup />
          <q-btn flat label="Yes" color="red" @click="confirmCancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Submit Dialog -->
    <q-dialog v-model="submitDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <q-avatar icon="check_circle" color="positive" text-color="white" />
          <span class="q-ml-sm">Submit this budget request?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="No" color="green" v-close-popup />
          <q-btn flat label="Yes" color="green" @click="confirmSubmit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'FSPFormBudgetRequest',

  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const budgetForm = ref(null)
    const submitting = ref(false)
    const cancelDialog = ref(false)
    const submitDialog = ref(false)

    const requestTypeOptions = [
      { label: 'New Funding Request', value: 'new' },
      { label: 'With Existing CA', value: 'existing' }
    ]

    const projectOptions = [
      'ITBS',
      'ITBS Software Engineers',
      'ITBS-HR',
      'ITBS-Finance',
      'ITBS-Admin',
      'ITBS-Creative',
      'ITBS-Project Managers'
    ]

    const supplierOptions = [
      'Office Warehouse',
      'SM Supplies',
      'National Bookstore',
      'Tech Supplies Co.',
      'General Merchandise'
    ]

    const categoryOptions = [
      'Office Supplies',
      'Computer Equipment',
      'Software Licenses',
      'Office Furniture',
      'Training Materials'
    ]

    const particularsOptions = [
      'Printer Paper',
      'Ink Cartridges',
      'Laptops',
      'Monitors',
      'Office Chairs',
      'Software Subscriptions',
      'Training Books'
    ]

    const columns = [
      { name: 'qty', label: 'QTY', field: 'qty', align: 'left' },
      { name: 'oum', label: 'OUM', field: 'oum', align: 'left' },
      { name: 'particulars', label: 'Particulars', field: 'particulars', align: 'left' },
      { name: 'amount', label: 'Amount', field: 'amount', align: 'left' },
      { name: 'totalAmount', label: 'Total Amount', field: 'totalAmount', align: 'left' },
      { name: 'actions', label: '', field: 'actions', align: 'center' }
    ]

    const formData = ref({
      requestType: 'new',
      project: null,
      supplierName: null,
      categoryType: null,
      terms: '',
      items: [],
      remarks: '',
      files: null
    })

    const addRow = () => {
      formData.value.items.push({
        qty: 0,
        oum: '',
        particulars: null,
        amount: 0,
        totalAmount: 0
      })
    }

    const removeRow = (index) => {
      formData.value.items.splice(index, 1)
    }

    const calculateTotal = (index) => {
      const item = formData.value.items[index]
      item.totalAmount = item.qty * item.amount
    }

    const formatCurrency = (value) => {
      return `₱${value.toFixed(2)}`
    }

    const showCancelDialog = () => {
      cancelDialog.value = true
    }

    const confirmCancel = () => {
      router.push('/LBRForSupplierProject')
    }

    const onSubmit = async () => {
      budgetForm.value.validate().then(success => {
        if (success) {
          submitDialog.value = true
        }
      })
    }

    const confirmSubmit = async () => {
      submitting.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        $q.notify({
          color: 'positive',
          message: 'Budget request submitted successfully',
          icon: 'check'
        })
        router.push('/LBRForSupplierProject')
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Error submitting request',
          icon: 'warning'
        })
      } finally {
        submitting.value = false
        submitDialog.value = false
      }
    }

    return {
      formData,
      budgetForm,
      submitting,
      cancelDialog,
      submitDialog,
      requestTypeOptions,
      projectOptions,
      supplierOptions,
      categoryOptions,
      particularsOptions,
      columns,
      addRow,
      removeRow,
      calculateTotal,
      formatCurrency,
      showCancelDialog,
      confirmCancel,
      onSubmit,
      confirmSubmit
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
</style>

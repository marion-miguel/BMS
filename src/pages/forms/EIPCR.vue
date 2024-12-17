<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none" style="margin-left: -125px;">DivPCR</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="event_available" />
        <q-breadcrumbs-el label="Calendar" />
      </q-breadcrumbs>
    </div>


    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="text-h5">Employee Individual Performance Commitment Review (IPCR)</div>
      <q-space />
      <q-btn color="primary" icon="print" label="Print" />
    </div>


    <!-- Core Functions Section -->
    <div class="section-container q-mb-xl">
      <div class="text-h6 q-py-md text-center bg-grey-2">Core Functions 90%</div>

      <div class="row q-col-gutter-md">
        <!-- Major Final Output Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.majorFinalOutput"
            label="Major Final Output"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model="formData.qn"
                label="Qn (Quantity)"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="formData.ql"
                label="Ql (Quality)"
                dense
              />
            </div>
          </div>
        </div>

        <!-- Success Indicator Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.successIndicator"
            label="Success Indicator (Targets + Measures)"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-input
                outlined
                v-model="formData.timeliness"
                label="T (Timeliness)"
                dense
              />
            </div>
          </div>
        </div>

        <!-- Accomplishments Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.accomplishments"
            label="Actual Accomplishments / Expenses"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-file
                outlined
                v-model="formData.attachment"
                label="Attachments (if applicable)"
                dense
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

            </div>
            <div class="col-12">
                <q-btn
                  outline
                  color="primary"
                  class="full-width q-mt-sm"
                  icon="add"
                  label="Add"
                />
              </div>
          </div>
        </div>
      </div>

      <!-- Rating Table -->
      <div class="q-mt-lg">
        <q-table
          :rows="tableRows"
          :columns="columns"
          flat
          bordered
          hide-pagination
          hide-bottom
        >
          <template v-slot:body-cell-rating="props">
            <q-td :props="props">
              <div class="row q-col-gutter-sm">
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.qn" label="QN" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.ql" label="QL" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.t" label="T" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.a" label="A" />
                </div>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Other CSC-Mandated Functions -->
      <div class="text-h6 q-py-md q-mt-xl text-center bg-grey-2">
        Other CSC-Mandated Function/s (included in Core Functions)</div>
        <div class="row q-col-gutter-md">
        <!-- Major Final Output Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.majorFinalOutput"
            label="Major Final Output"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model="formData.qn"
                label="Qn (Quantity)"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="formData.ql"
                label="Ql (Quality)"
                dense
              />
            </div>
          </div>
        </div>

        <!-- Success Indicator Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.successIndicator"
            label="Success Indicator (Targets + Measures)"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-input
                outlined
                v-model="formData.timeliness"
                label="T (Timeliness)"
                dense
              />
            </div>
          </div>
        </div>

        <!-- Accomplishments Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.accomplishments"
            label="Actual Accomplishments / Expenses"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-file
                outlined
                v-model="formData.attachment"
                label="Attachments (if applicable)"
                dense
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

            </div>
            <div class="col-12">
                <q-btn
                  outline
                  color="primary"
                  class="full-width q-mt-sm"
                  icon="add"
                  label="Add"
                />
              </div>
          </div>
        </div>
      </div>

      <!-- Rating Table -->
      <div class="q-mt-lg">
        <q-table
          :rows="tableRows"
          :columns="columns"
          flat
          bordered
          hide-pagination
          hide-bottom
        >
          <template v-slot:body-cell-rating="props">
            <q-td :props="props">
              <div class="row q-col-gutter-sm">
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.qn" label="QN" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.ql" label="QL" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.t" label="T" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.a" label="A" />
                </div>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>


    <div class="functions-container">
      <!-- Strategic Functions Toggle -->
      <div class="row items-center q-mb-md">
        <q-toggle v-model="hideStrategic" label="Strategic Function Input" />
      </div>

      <!-- Strategic Functions Section -->
      <div v-if="!hideStrategic" class="section-container q-mb-xl">
        <div class="text-h6 q-py-md text-center bg-grey-2">Strategic Functions (Optional)</div>

        <div class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Major Final Output -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="strategicData.majorOutput"
              label="Major Final Output"
              outlined
              type="textarea"
              autogrow
              class="q-mb-sm"
            />
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input outlined dense v-model="strategicData.qn" label="Qn (Quantity)" />
              </div>
              <div class="col-6">
                <q-input outlined dense v-model="strategicData.ql" label="Ql (Quality)" />
              </div>
            </div>
          </div>

          <!-- Success Indicator -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="strategicData.successIndicator"
              label="Success Indicator (Targets + Measures)"
              outlined
              type="textarea"
              autogrow
              class="q-mb-sm"
            />
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input outlined dense v-model="strategicData.timeliness" label="T (Timeliness)" />
              </div>
            </div>
          </div>

          <!-- Actual Accomplishments -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="strategicData.accomplishments"
              label="Actual Accomplishments / Expenses"
              outlined
              type="textarea"
              autogrow
              class="q-mb-sm"
            />
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-file
                  outlined
                  dense
                  v-model="strategicData.attachment"
                  label="Attachments (if applicable)"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
              <div class="col-12">
                <q-btn
                  outline
                  color="primary"
                  class="full-width q-mt-sm"
                  icon="add"
                  label="Add"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Rating Table -->
        <q-table
          :rows="strategicRows"
          :columns="columns"
          flat
          bordered
          class="q-mt-md"
          hide-pagination
          :hide-bottom="true"
        >
          <template v-slot:body-cell-rating="props">
            <q-td :props="props">
              <div class="row q-col-gutter-sm justify-center">
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.qn" label="QN" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.ql" label="QL" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.t" label="T" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.a" label="A" />
                </div>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Support Functions Section -->
    <div class="section-container q-mb-xl">

      <!-- Other CSC-Mandated Functions -->
      <div class="text-h6 q-py-md q-mt-xl text-center bg-grey-2">Support Functions 10%</div>
        <div class="row q-col-gutter-md">
        <!-- Major Final Output Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.majorFinalOutput"
            label="Major Final Output"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model="formData.qn"
                label="Qn (Quantity)"
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model="formData.ql"
                label="Ql (Quality)"
                dense
              />
            </div>
          </div>
        </div>

        <!-- Success Indicator Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.successIndicator"
            label="Success Indicator (Targets + Measures)"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-input
                outlined
                v-model="formData.timeliness"
                label="T (Timeliness)"
                dense
              />
            </div>
          </div>
        </div>

        <!-- Accomplishments Column -->
        <div class="col-12 col-md-4">
          <q-input
            outlined
            v-model="formData.accomplishments"
            label="Actual Accomplishments / Expenses"
            type="textarea"
            autogrow
          />

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-file
                outlined
                v-model="formData.attachment"
                label="Attachments (if applicable)"
                dense
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

            </div>
            <div class="col-12">
                <q-btn
                  outline
                  color="primary"
                  class="full-width q-mt-sm"
                  icon="add"
                  label="Add"
                />
              </div>
          </div>
        </div>
      </div>

      <!-- Rating Table -->
      <div class="q-mt-lg">
        <q-table
          :rows="tableRows"
          :columns="columns"
          flat
          bordered
          hide-pagination
          hide-bottom
        >
          <template v-slot:body-cell-rating="props">
            <q-td :props="props">
              <div class="row q-col-gutter-sm">
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.qn" label="QN" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.ql" label="QL" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.t" label="T" />
                </div>
                <div class="col-3">
                  <q-input dense outlined v-model="props.row.a" label="A" />
                </div>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="row justify-end q-gutter-sm">
      <q-btn label="Close" color="purple" flat />
      <q-btn label="Submit" color="green" />
    </div>
  </div>
  </q-page>


</template>

<script setup>
import { ref } from 'vue'

const hideStrategic = ref(false)  // Changed from showStrategic to hideStrategic

const strategicData = ref({
  majorOutput: '',
  qn: '',
  ql: '',
  successIndicator: '',
  timeliness: '',
  accomplishments: '',
  attachment: null
})

const strategicRows = ref([
  {
    majorOutput: '',
    successIndicator: '',
    employeeConcerned: '',
    accomplishments: '',
    qn: '',
    ql: '',
    t: '',
    a: '',
    remarks: '',
    action: ''
  }
])

const formData = ref({
  majorFinalOutput: '',
  qn: '',
  ql: '',
  successIndicator: '',
  timeliness: '',
  accomplishments: '',
  attachment: null
})

const columns = [
  {
    name: 'majorOutput',
    label: 'MAJOR FINAL OUTPUT',
    field: 'majorOutput',
    align: 'left'
  },
  {
    name: 'successIndicator',
    label: 'SUCCESS INDICATOR (TARGETS + MEASURES)',
    field: 'successIndicator',
    align: 'left'
  },
  {
    name: 'employee',
    label: 'EMPLOYEE CONCERNED',
    field: 'employee',
    align: 'left'
  },
  {
    name: 'accomplishments',
    label: 'ACTUAL ACCOMPLISHMENTS / EXPENSES',
    field: 'accomplishments',
    align: 'left'
  },
  {
    name: 'rating',
    label: 'RATING*',
    field: 'rating',
    align: 'center'
  },
  {
    name: 'remarks',
    label: 'REMARKS',
    field: 'remarks',
    align: 'left'
  },
  {
    name: 'action',
    label: 'ACTION',
    field: 'action',
    align: 'center'
  }
]

const tableRows = ref([
  {
    majorOutput: '',
    successIndicator: '',
    employee: '',
    accomplishments: '',
    qn: '',
    ql: '',
    t: '',
    a: '',
    remarks: '',
    action: ''
  }
])

</script>

<style scoped>
.q-page {
  max-width: 1400px;
  margin: 0 auto;
}

.functions-container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-container {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.text-h5 {
  font-size: 1.5rem;
  font-weight: 500;
}

.text-h6 {
  font-size: 1.2rem;
  font-weight: 500;
}

@media (max-width: 1023px) {
  .q-page {
    padding: 12px !important;
  }
}
.row > .col-12 {
    margin-bottom: 12px;
  }


.full-width {
  width: 100%;
}
@media (max-width: 599px) {
  .q-page {
    padding: 8px !important;
  }

  .text-h5 {
    font-size: 1.2rem;
  }

  .text-h6 {
    font-size: 1rem;
  }
}

.q-table th {
  font-weight: 500;
}

.q-table td {
  white-space: normal;
  word-break: break-word;
}
</style>

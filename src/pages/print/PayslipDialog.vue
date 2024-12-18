<template>
  <q-dialog
    v-model="dialogModel"
    persistent
    :maximized="false"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 95vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Payslip Details</div>
        <q-space />
        <q-btn
          icon="print"
          color="primary"
          flat
          round
          dense
          @click="printPayslip"
          class="print-button q-mr-sm"
        >
          <q-tooltip>Print Payslip</q-tooltip>
        </q-btn>
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="closeDialog"
        >
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section class="scroll" id="printable-payslip" style="max-height: 80vh;">
        <div class="payslip-container">
          <!-- Company Header -->
          <div class="text-center q-mb-sm payslip-header">
            <div class="text-h6">ITBS Corporation</div>
            <div>San Jose, City of San Fernando (P)</div>
            <div>(045) - 963 - 5000</div>
          </div>

          <!-- Employee Details -->
          <div class="payslip-info q-mb-sm">
            <div>DATE: {{ payslipData.payrollDate }}</div>
            <div>Name: {{ payslipData.employeeName }}</div>
            <div>ID No.: {{ payslipData.employeeId }}</div>
          </div>

          <!-- Payroll Table -->
          <table class="payslip-table">
            <tr class="header-row">
              <td>PAYROLL</td>
              <td class="amount-column">AMOUNT</td>
            </tr>
            <tr><td>Days Worked</td><td class="amount-column">{{ payslipData.daysWorked }}</td></tr>
            <tr><td>Daily Rate</td><td class="amount-column">{{ formatAmount(payslipData.dailyRate) }}</td></tr>
            <tr><td>Basic Salary</td><td class="amount-column">{{ formatAmount(payslipData.basicSalary) }}</td></tr>
            <tr><td>Overtime (hrs)</td><td class="amount-column">{{ payslipData.overtime }}</td></tr>
            <tr><td>Amount of OT</td><td class="amount-column">{{ formatAmount(payslipData.overtimeAmount) }}</td></tr>
            <tr><td>S.N-W Holiday</td><td class="amount-column">{{ formatAmount(payslipData.snwHoliday) }}</td></tr>
            <tr><td>R. Holiday</td><td class="amount-column">{{ formatAmount(payslipData.rHoliday) }}</td></tr>
            <tr><td>Payroll Allowance</td><td class="amount-column">{{ formatAmount(payslipData.payrollAllowance) }}</td></tr>
            <tr class="total-row"><td>GROSS PAY</td><td class="amount-column">{{ formatAmount(payslipData.grossPay) }}</td></tr>
            <tr><td>SSS</td><td class="amount-column">{{ formatAmount(payslipData.sss) }}</td></tr>
            <tr><td>PAG-IBIG</td><td class="amount-column">{{ formatAmount(payslipData.pagIbig) }}</td></tr>
            <tr><td>PHILHEALTH</td><td class="amount-column">{{ formatAmount(payslipData.philHealth) }}</td></tr>
            <tr><td>Withholding Tax</td><td class="amount-column">{{ formatAmount(payslipData.withholdingTax) }}</td></tr>
            <tr><td>SSS LOAN</td><td class="amount-column">{{ formatAmount(payslipData.sssLoan) }}</td></tr>
            <tr><td>HDMF LOAN</td><td class="amount-column">{{ formatAmount(payslipData.hdmfLoan) }}</td></tr>
            <tr><td>Cash Advance</td><td class="amount-column">{{ formatAmount(payslipData.cashAdvance) }}</td></tr>
            <tr><td>Tardiness (min)</td><td class="amount-column">{{ payslipData.tardiness }}</td></tr>
            <tr><td>Tardiness Amount</td><td class="amount-column">{{ formatAmount(payslipData.tardinessAmount) }}</td></tr>
            <tr class="total-row"><td>TOTAL DEDUCTIONS</td><td class="amount-column">{{ formatAmount(payslipData.totalDeductions) }}</td></tr>
            <tr class="net-pay-row"><td>NET PAY</td><td class="amount-column">{{ formatAmount(payslipData.netPay) }}</td></tr>
          </table>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'PayslipDialog'
}
</script>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  payslipData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)
}

const closeDialog = () => {
  emit('update:modelValue', false)
}

const printPayslip = () => {
  try {
    const printWindow = window.open('', '_blank')
    const printContent = document.getElementById('printable-payslip')

    if (!printContent) {
      throw new Error('Print content not found')
    }

    printWindow.document.open()
    printWindow.document.write('<!DOCTYPE html>')
    printWindow.document.write('<html>')
    printWindow.document.write('<head>')
    printWindow.document.write('<title>Payslip - ' + props.payslipData.employeeName + '</title>')
    printWindow.document.write(`
      <style>
        @media print {
          @page {
            size: letter;
            margin: 15mm;
          }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            font-size: 12pt;
          }
          .payslip-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #000;
          }
          .payslip-header {
            text-align: center;
            padding: 10px;
            border-bottom: 1px solid #000;
          }
          .payslip-header .text-h6 {
            font-size: 16pt;
            font-weight: bold;
            margin: 0;
          }
          .payslip-info {
            padding: 10px;
            border-bottom: 1px solid #000;
          }
          .payslip-table {
            width: 100%;
            border-collapse: collapse;
          }
          .payslip-table td {
            padding: 4px 10px;
            border: none;
          }
          .amount-column {
            text-align: right;
            white-space: nowrap;
          }
          .header-row td {
            font-weight: bold;
            border-bottom: 1px solid #000;
          }
          .total-row td {
            font-weight: bold;
            border-top: 1px solid #000;
          }
          .net-pay-row td {
            font-weight: bold;
            border-top: 2px solid #000;
          }
        }
      </style>
    `)
    printWindow.document.write('</head>')
    printWindow.document.write('<body>')
    printWindow.document.write('<div class="payslip-container">' + printContent.innerHTML + '</div>')
    printWindow.document.write('<scr' + 'ipt>')
    printWindow.document.write(`
      window.onload = function() {
        window.print();
        window.onafterprint = function() {
          window.close();
        }
      }
    `)
    printWindow.document.write('</scr' + 'ipt>')
    printWindow.document.write('</body>')
    printWindow.document.write('</html>')
    printWindow.document.close()

  } catch (error) {
    console.error('Print error:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to print payslip',
      timeout: 2000
    })
  }
}
</script>
<style scoped>
.payslip-container {
  background-color: white;
  border: 1px solid #000;
  padding: 20px;
}

.payslip-header {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #000;
}

.payslip-info {
  padding: 10px;
  border-bottom: 1px solid #000;
}

.payslip-table {
  width: 100%;
  border-collapse: collapse;
}

.payslip-table td {
  padding: 4px 10px;
  border: none;
}

.amount-column {
  text-align: right;
  white-space: nowrap;
}

.header-row td {
  font-weight: bold;
  border-bottom: 1px solid #000;
}

.total-row td {
  font-weight: bold;
  border-top: 1px solid #000;
}

.net-pay-row td {
  font-weight: bold;
  border-top: 2px solid #000;
}

/* Updated print styles */
@media print {
  .q-dialog {
    position: static !important;
  }

  .q-card {
    box-shadow: none !important;
    width: 100% !important;
    max-width: none !important;
  }

  .print-button,
  .q-btn[icon="close"] {
    display: none !important;
  }

  .q-card-section.scroll {
    max-height: none !important;
    overflow: visible !important;
  }
}
</style>

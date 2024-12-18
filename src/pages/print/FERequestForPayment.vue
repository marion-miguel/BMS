<template>
  <div class="print-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <img src="/path-to-your-logo.png" alt="ITBS Logo" />
      </div>
      <div class="company-info">
        <h1 class="text-h4">ITBS INFORMATION TECHNOLOGY BUSINESS SOLUTIONS CORPORATION</h1>
        <div class="address-block">
          <p>Head Office: 7a AEC Commercial Complex, Greenville Subdivision</p>
          <p>San Jose St. cor Abad Santos Avenue, City of San Fernando, Pampanga, Philippines</p>
          <p>Tel #: (02) 8 641-9599 / Tel #: 8-298-5050</p>
          <p>Website: http://www.itbs.com.ph | Email: gogreen@itbs.com.ph</p>
        </div>
      </div>
    </div>

    <!-- Form Title -->
    <div class="form-title q-my-md">
      <h2 class="text-h5 text-weight-bold">REQUEST FOR PAYMENT</h2>
      <div class="form-number">NO: {{ formData.formNumber }}</div>
    </div>

    <!-- Form Content -->
    <div class="form-content">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="field-group">
            <label>PAYEE:</label>
            <div class="field-value">{{ formData.payee }}</div>
          </div>
        </div>
        <div class="col-6">
          <div class="field-group">
            <label>DEPARTMENT:</label>
            <div class="field-value">{{ formData.department }}</div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <table class="full-width q-my-md">
        <thead>
          <tr>
            <th>DATE</th>
            <th>INV.No / REF NO.</th>
            <th>PARTICULARS</th>
            <th>AMOUNT</th>
            <th>EWT</th>
            <th>CHEQUE AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in formData.items" :key="index">
            <td>{{ item.date }}</td>
            <td>{{ item.refNo }}</td>
            <td>{{ item.particulars }}</td>
            <td>{{ formatCurrency(item.amount) }}</td>
            <td>{{ item.ewt }}</td>
            <td>{{ formatCurrency(item.chequeAmount) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-right">Grand Total:</td>
            <td>{{ formatCurrency(formData.grandTotal) }}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Signatures -->
      <div class="signatures q-mt-xl">
        <div class="signature-block">
          <div class="signature-line">
            <span class="name">{{ formData.requestedBy }}</span>
          </div>
          <div class="signature-label">Signature over Printed Name / Date</div>
          <div class="title">REQUESTED BY:</div>
        </div>

        <div class="signature-block">
          <div class="signature-line">
            <span class="name">{{ formData.preparedBy }}</span>
          </div>
          <div class="signature-label">Signature over Printed Name / Date</div>
          <div class="title">PREPARED BY:</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RequestForPayment',
  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(value)
    },
    print() {
      window.print()
    }
  }
})
</script>

<style scoped>
@media print {
  .print-container {
    padding: 20px;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .logo {
    width: 100px;
    margin-right: 20px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid #000;
    padding: 8px;
  }

  .signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }

  .signature-block {
    text-align: center;
    width: 200px;
  }

  .signature-line {
    border-bottom: 1px solid #000;
    margin-bottom: 5px;
  }

  @page {
    size: A4;
    margin: 0;
  }
}
</style>

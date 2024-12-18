<template>
  <div class="print-container p-6">
    <!-- Header -->
    <header class="flex items-start gap-6 mb-8">
      <div class="company-info flex-1">
        <h1 class="text-xl font-bold mb-2">
          ITBS INFORMATION TECHNOLOGY BUSINESS SOLUTIONS CORPORATION
        </h1>
        <div class="text-sm space-y-1">
          <p>Head Office: 7a AEC Commercial Complex, Greenville Subdivision</p>
          <p>San Jose St. cor Abad Santos Avenue, City of San Fernando, Pampanga, Philippines</p>
          <p>Tel #: (02) 8 641-9599 / Tel #: 8-298-5050</p>
          <p>Website: http://www.itbs.com.ph | Email: gogreen@itbs.com.ph</p>
        </div>
      </div>
    </header>

    <!-- Form Title -->
    <div class="form-title mb-8 flex justify-between items-center">
      <h2 class="text-xl font-bold">CASH ADVANCE FORM</h2>
      <div class="form-number">
        <span class="font-semibold">NO:</span> {{ formData.rfpNo }}
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-content">
      <div class="grid grid-cols-2 gap-6 mb-8">
        <div class="space-y-4">
          <div class="field-group">
            <label class="block font-semibold mb-1">PROJECT NAME:</label>
            <div class="field-value border-b border-gray-300 p-2">
              {{ formData.projectName }}
            </div>
          </div>
          <div class="field-group">
            <label class="block font-semibold mb-1">EMPLOYEE NAME:</label>
            <div class="field-value border-b border-gray-300 p-2">
              {{ formData.employeeName }}
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div class="field-group">
            <label class="block font-semibold mb-1">DATE:</label>
            <div class="field-value border-b border-gray-300 p-2">
              {{ formData.dateCreated }}
            </div>
          </div>
          <div class="field-group">
            <label class="block font-semibold mb-1">STATUS:</label>
            <div class="field-value border-b border-gray-300 p-2">
              {{ formData.status }}
            </div>
          </div>
        </div>
      </div>

      <!-- Agreement Text -->
      <div class="agreement-text mb-12 text-sm">
        <p class="font-semibold mb-2">For Official Cash Advance</p>
        <p class="text-justify">
          I agree to render the report to liquidate this cash in the manner and with the time
          prescribed of 3 days. I hereby authorize the company payroll section to deduct any
          outstanding cash advance due to the company from my salary and/or other monies due.
        </p>
      </div>

      <!-- Signatures -->
      <div class="signatures grid grid-cols-2 gap-16 mt-16">
        <div class="signature-block text-center">
          <div class="signature-line min-h-16 border-b border-gray-400 mb-2"></div>
          <div class="signature-label text-sm mb-1">Signature over Printed Name / Date</div>
          <div class="title font-semibold">REQUESTED BY:</div>
        </div>
        <div class="signature-block text-center">
          <div class="signature-line min-h-16 border-b border-gray-400 mb-2"></div>
          <div class="signature-label text-sm mb-1">Signature over Printed Name / Date</div>
          <div class="title font-semibold">PREPARED BY:</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FECashAdvanceForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  }
})
</script>

<style>
@media print {
  @page {
    size: A4;
    margin: 20mm;
  }

  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .print-container {
    max-width: 210mm;
    margin: 0 auto;
  }
}

.print-container {
  background: white;
  max-width: 210mm;
  margin: 0 auto;
}
</style>

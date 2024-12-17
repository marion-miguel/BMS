<template>
  <q-page padding>
    <!-- Header with Navigation -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Profile</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="event_available" />
        <q-breadcrumbs-el label="Profile Information" />
      </q-breadcrumbs>
    </div>

    <!-- Profile Card -->
    <div class="row q-col-gutter-md">
      <!-- Left Side Profile Summary -->
      <div class="col-12 col-md-3">
        <q-card class="profile-card q-pa-md">
          <div class="text-center">
            <q-avatar size="80px" class="q-mb-sm">
              <img src="../assets/img_user.png" alt="User">
            </q-avatar>
            <div class="row items-center justify-center q-mb-sm">
              <div class="text-weight-bold">{{ userData.fullName }}</div>
              <q-badge color="green" class="q-ml-sm">{{ userData.role }}</q-badge>
            </div>
            <div class="text-black q-mb-sm">Employment Status: {{ userData.employmentStatus }}</div>
            <div class="text-grey-8">Department: {{ userData.department }}</div>
          </div>
        </q-card>
      </div>

      <!-- Right Side Information Tabs -->
      <div class="col-12 col-md-9">
        <q-card>
          <q-tabs
            v-model="tab"
            class="text-green"
            active-class="text-green"
            indicator-color="green"
            align="left"
            narrow-indicator
          >
            <q-tab name="profile" label="Profile" />
            <q-tab name="education" label="Education Information" />
            <q-tab name="company" label="Company Information" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- Profile Tab -->
            <q-tab-panel name="profile">
              <div class="text-h6 q-mb-md">Profile Information</div>
              <div class="row q-col-gutter-y-md">
                <div v-for="(value, key) in profileFields" :key="key" class="col-12">
                  <div class="row items-center">
                    <div class="col-12 col-sm-3 text-grey-8">{{ key }}</div>
                    <div class="col-12 col-sm-9 text-black">{{ value }}</div>
                  </div>
                  <q-separator class="q-mt-sm" />
                </div>
              </div>
            </q-tab-panel>

            <!-- Education Tab -->
            <q-tab-panel name="education">
              <div class="text-h6 q-mb-md">Education Information</div>
              <div class="row q-col-gutter-y-md">
                <div v-for="(value, key) in educationFields" :key="key" class="col-12">
                  <div class="row items-center">
                    <div class="col-12 col-sm-3 text-grey-8">{{ key }}</div>
                    <div class="col-12 col-sm-9 text-black">{{ value }}</div>
                  </div>
                  <q-separator class="q-mt-sm" />
                </div>
              </div>
            </q-tab-panel>

            <!-- Company Tab -->
            <q-tab-panel name="company">
              <div class="text-h6 q-mb-md">Company Information</div>
              <div class="row q-col-gutter-y-md">
                <div v-for="(value, key) in companyFields" :key="key" class="col-12">
                  <div class="row items-center">
                    <div class="col-12 col-sm-3 text-grey-8">{{ key }}</div>
                    <div class="col-12 col-sm-9 text-black">{{ value }}</div>
                  </div>
                  <q-separator class="q-mt-sm" />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'ProfilePage'
})

const tab = ref('profile')

// Mock user data - replace with actual API call
const userData = ref({
  fullName: 'John Doe',
  role: 'Software Engineer',
  employmentStatus: 'Regular',
  department: 'Information Technology',
  dateOfBirth: 'May 15, 1985',
  civilStatus: 'Single',
  gender: 'MALE',
  email: 'johndoe@example.com',
  mobile: '09171234567',
  address: 'Metro Manila, Quezon City, Barangay Commonwealth',
  sssNo: '34-5678901-2',
  philhealthNo: '040101123456',
  pagibigNo: '221122334455',
  tinNo: '123-456-789-000',
  // Education Information
  educationAttainment: 'Tertiary',
  degree: 'Bachelor’s',
  course: 'Computer Science',
  yearGraduated: '2007',
  // Company Information
  dateHired: 'January 15, 2015',
  status: 'Regular',
  position: 'Lead Software Developer'
})

// Computed property for profile fields
const profileFields = computed(() => ({
  'Full Name': userData.value.fullName,
  'Date of Birth': userData.value.dateOfBirth,
  'Civil Status': userData.value.civilStatus,
  'Gender': userData.value.gender,
  'Email': userData.value.email,
  'Mobile': userData.value.mobile,
  'Address': userData.value.address,
  'SSS No': userData.value.sssNo,
  'Philhealth No': userData.value.philhealthNo,
  'Pagibig No': userData.value.pagibigNo,
  'TIN No': userData.value.tinNo
}))

// Computed property for education fields
const educationFields = computed(() => ({
  'Education Attainment': userData.value.educationAttainment,
  'Degree': userData.value.degree,
  'Course': userData.value.course,
  'Year': userData.value.yearGraduated
}))

// Computed property for company fields
const companyFields = computed(() => ({
  'Date Hired': userData.value.dateHired,
  'Status': userData.value.status,
  'Department': userData.value.department,
  'Position': userData.value.position
}))
</script>

<style scoped>
.profile-card {
  background-color: white;
  border-radius: 8px;
}

.q-card {
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, .5);
}

.text-primary {
  color: black !important;
}

.q-tabs {
  padding: 0 16px;
}

.q-tab-panels {
  background-color: white;
}

.q-tab-panel {
  padding: 24px;
}

.q-separator {
  background-color: rgba(0, 0, 0, 0.08);
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .q-page {
    padding: 16px !important;
  }

  .q-card {
    padding: 16px !important;
  }

  .text-h6 {
    font-size: 1.25rem;
  }
}
</style>

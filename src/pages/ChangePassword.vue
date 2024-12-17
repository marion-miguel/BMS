<template>

  <q-page padding>
    <!-- Header with Navigation -->
    <div class="row items-center q-mb-lg">
      <h4 class="text-h4 q-my-none">Password</h4>
      <q-breadcrumbs class="q-ml-sm" active-color="grey" style="margin-left: 60px;" separator="|">
        <q-breadcrumbs-el icon="person" />
        <q-breadcrumbs-el label="Form" />
      </q-breadcrumbs>
    </div>

    <q-card class="q-pa-md">
      <div class="text-h6 q-mb-xl">Change Password</div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-y-md" ref="passwordForm">
        <!-- Old Password -->
        <div class="q-mb-lg">
          <div class="text-body2 text-grey-8 q-mb-sm">Old Password</div>
          <q-input
            v-model="oldPassword"
            :type="showOldPassword ? 'text' : 'password'"
            outlined
            class="full-width"
            bg-color="white"
            :rules="[val => !!val || 'Old password is required']"
          >
            <template v-slot:append>
              <q-icon
                :name="showOldPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer text-grey-7"
                @click="showOldPassword = !showOldPassword"
              />
            </template>
          </q-input>
        </div>

        <!-- New Password -->
        <div class="q-mb-lg">
          <div class="text-body2 text-grey-8 q-mb-sm">New Password</div>
          <q-input
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            outlined
            class="full-width"
            bg-color="white"
            :rules="[
              val => !!val || 'New password is required',
              val => val.length >= 8 || 'Password must be at least 8 characters'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="showNewPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer text-grey-7"
                @click="showNewPassword = !showNewPassword"
              />
            </template>
          </q-input>
        </div>

        <!-- Confirm Password -->
        <div class="q-mb-xl">
          <div class="text-body2 text-grey-8 q-mb-sm">Confirmed Password</div>
          <q-input
            v-model="confirmedPassword"
            :type="showConfirmedPassword ? 'text' : 'password'"
            outlined
            class="full-width"
            bg-color="white"
            :rules="[
              val => !!val || 'Password confirmation is required',
              val => val === newPassword || 'Passwords do not match'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmedPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer text-grey-7"
                @click="showConfirmedPassword = !showConfirmedPassword"
              />
            </template>
          </q-input>
        </div>

        <!-- Form Buttons -->
        <div class="row justify-end q-gutter-x-md">
          <q-btn
            label="Cancel"
            color="negative"
            flat
            no-caps
            @click="showCancelDialog"
            :disable="loading"
            class="q-px-md"
          />
          <q-btn
            label="Submit"
            type="submit"
            no-caps
            :loading="loading"
            class="q-px-md"
            style="background: #4CAF50; color: white"
          />
        </div>
      </q-form>
    </q-card>

    <!-- Cancel Dialog -->
    <q-dialog v-model="cancelDialog" persistent>
  <q-card style="min-width: 300px; max-width: 400px">
    <q-card-section class="row items-center">
      <q-avatar icon="warning" color="warning" text-color="white" />
      <span class="q-ml-sm">Are you sure you want to cancel?</span>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="No" color="primary" v-close-popup />
      <q-btn flat label="Yes" color="primary" @click="confirmCancel" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

<!-- Submit Dialog -->
<q-dialog v-model="submitDialog" persistent>
  <q-card style="min-width: 300px; max-width: 400px">
    <q-card-section class="row items-center">
      <q-avatar icon="check_circle" color="positive" text-color="white" />
      <span class="q-ml-sm">Confirm password change?</span>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="No" color="primary" v-close-popup />
      <q-btn flat label="Yes" color="primary" @click="confirmSubmit" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'ChangePassword'
})

const $q = useQuasar()
const router = useRouter()
const passwordForm = ref(null)

// Form data
const oldPassword = ref('')
const newPassword = ref('')
const confirmedPassword = ref('')
const loading = ref(false)

// Dialog controls
const cancelDialog = ref(false)
const submitDialog = ref(false)

// Visibility toggles
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmedPassword = ref(false)

const showCancelDialog = () => {
  cancelDialog.value = true
}

const confirmCancel = () => {
  onCancel()
  router.push('/dashboard') // Adjust route as needed
}

// Form submission
const onSubmit = async () => {
  passwordForm.value.validate().then(success => {
    if (success) {
      submitDialog.value = true
    }
  })
}

const confirmSubmit = async () => {
  try {
    loading.value = true

    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Success notification
    $q.notify({
      type: 'positive',
      message: 'Password changed successfully',
      icon: 'check',
      position: 'top',
      timeout: 2000
    })

    // Reset form
    onCancel()

    // Redirect after success
    router.push('/dashboard') // Adjust route as needed

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to change password',
      icon: 'warning',
      position: 'top',
      timeout: 2000
    })
  } finally {
    loading.value = false
  }
}

const onCancel = () => {
  // Reset all form fields
  oldPassword.value = ''
  newPassword.value = ''
  confirmedPassword.value = ''

  // Reset visibility toggles
  showOldPassword.value = false
  showNewPassword.value = false
  showConfirmedPassword.value = false
}
</script>

<style scoped>
.q-page {
  background-color: white;
  min-height: 100vh;
}

.q-card {
  background-color: white;
  border: none !important;
  border-radius: 8px;
  max-width: 3000px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 1px 5px rgba(0, 0, 0, .5);
}

.q-input {
  background-color: white;
}

.q-input::v-deep .q-field__control {
  height: 45px;
  border-radius: 4px;
}

.q-btn {
  border-radius: 4px;
  font-weight: 500;
}

/* Responsive styles */
@media (max-width: 599px) {
  .q-page {
    padding: 16px !important;
  }

  .q-card {
    padding: 16px !important;
  }
}
</style>

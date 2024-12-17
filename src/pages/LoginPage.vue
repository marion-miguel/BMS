<template>
  <div class="login-container">
    <q-card :class="['login-card', { 'shake-animation': showError }]">
      <q-card-section class="text-center">
        <img src="../assets/logo_itbs.png" alt="ITBS Logo" class="logo" />
        <h4 class="text-h5 q-mb-md bold-text">Employee Portal</h4>
        <p class="text-subtitle2 q-mb-lg">Welcome! Please login to continue.</p>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="formData.username"
            label="Enter your Username"
            filled
            :rules="[validateUsername]"
            :error="!!formErrors.username"
            :error-message="formErrors.username"
            @update:model-value="clearError('username')"
            ref="usernameRef"
          />

          <q-input
            v-model="formData.password"
            label="Enter your Password"
            :type="isPwd ? 'password' : 'text'"
            filled
            :rules="[validatePassword]"
            :error="!!formErrors.password"
            :error-message="formErrors.password"
            @update:model-value="clearError('password')"
            ref="passwordRef"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div v-if="generalError" class="text-negative text-center q-mb-md">
            {{ generalError }}
          </div>

          <div class="full-width q-mt-md text-center">
            <q-btn
              label="Log In"
              type="submit"
              color="green-7"
              style="width: 200px"
              class="q-py-sm text-weight-bold"
              size="small"
              :loading="loading"
              :disable="isLocked"
            >
              <template v-slot:loading>
                <q-spinner-dots color="white" />
              </template>
            </q-btn>
          </div>

          <div class="text-center q-mt-sm">
            <q-btn
              flat
              color="gray"
              label="Forgot Password?"
              @click="showForgotPassword = true"
              :disable="isLocked"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Forgot Password Dialog -->
    <q-dialog v-model="showForgotPassword">
      <q-card style="min-width: 350px; border-radius: 30px;">
        <q-card-section class="text-center">
          <img src="../assets/logo_itbs.png" alt="ITBS Logo" class="logo-small" />
          <h6 class="text-h6">Forgot Password</h6>
          <p class="text-subtitle2">
            Please enter your username and click submit to receive an email containing your validation code.
          </p>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="forgotUsername"
            label="Username"
            filled
            :error="!!forgotPasswordError"
            :error-message="forgotPasswordError"
            :rules="[val => !!val || 'Username is required']"
          />
        </q-card-section>

        <q-card-actions align="around">
          <q-btn flat label="Cancel" color="red" v-close-popup @click="resetForgotPassword" />
          <q-btn flat label="Submit" color="green-7" @click="handleForgotPassword" :loading="forgotPasswordLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'LoginPage'
})

const router = useRouter()
const $q = useQuasar()

// Form data
const formData = reactive({
  username: '',
  password: ''
})

// Form errors
const formErrors = reactive({
  username: '',
  password: ''
})

// State
const isPwd = ref(true)
const loading = ref(false)
const generalError = ref('')
const errorCount = ref(0)
const isLocked = ref(false)
const lockoutEndTime = ref(null)
const showForgotPassword = ref(false)
const forgotUsername = ref('')
const forgotPasswordError = ref('')
const forgotPasswordLoading = ref(false)
const usernameRef = ref(null)
const passwordRef = ref(null)

// Constants
const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 5 * 60 * 1000 // 5 minutes

// Validation rules
const validateUsername = (val) => {
  if (!val) return 'Username is required'
  return true
}

const validatePassword = (val) => {
  if (!val) return 'Password is required'
  return true
}

// Clear specific error
const clearError = (field) => {
  formErrors[field] = ''
  generalError.value = ''
}

// Reset all form errors
const resetErrors = () => {
  Object.keys(formErrors).forEach(key => formErrors[key] = '')
  generalError.value = ''
}

// Reset error count and lockout
const resetErrorCount = () => {
  errorCount.value = 0
  isLocked.value = false
  lockoutEndTime.value = null
  resetErrors()
}

// Handle account lockout
const handleLockout = () => {
  isLocked.value = true
  lockoutEndTime.value = Date.now() + LOCKOUT_DURATION
  generalError.value = 'Account locked for 5 minutes due to too many failed attempts.'

  const interval = setInterval(() => {
    if (Date.now() >= lockoutEndTime.value) {
      resetErrorCount()
      clearInterval(interval)
    }
  }, 1000)
}

// Mock authentication function (replace with actual API call)
const authenticateUser = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simulated authentication check
  if (username === 'admin' && password === '123456') {
    return { success: true }
  }
  return { success: false, error: 'Invalid username or password' }
}

// Login submission handler
const onSubmit = async () => {
  if (isLocked.value) {
    const remainingTime = Math.ceil((lockoutEndTime.value - Date.now()) / 60000)
    generalError.value = `Account is locked. Please try again in ${remainingTime} minutes.`
    return
  }

  // Validate form
  const usernameValid = await usernameRef.value.validate()
  const passwordValid = await passwordRef.value.validate()

  if (!usernameValid || !passwordValid) {
    return
  }

  loading.value = true
  resetErrors()

  try {
    const result = await authenticateUser(formData.username, formData.password)

    if (result.success) {
      resetErrorCount()
      router.push('/DashBoard')
    } else {
      errorCount.value++
      const remainingAttempts = MAX_ATTEMPTS - errorCount.value

      if (errorCount.value >= MAX_ATTEMPTS) {
        handleLockout()
      } else {
        generalError.value = `Invalid username or password ${remainingAttempts} ${
          remainingAttempts === 1 ? 'attempt' : 'attempts'
        } remaining.`

        // Clear password and shake animation
        formData.password = ''
        const card = document.querySelector('.login-card')
        card.classList.remove('shake-animation')
        void card.offsetWidth // Trigger reflow
        card.classList.add('shake-animation')
      }
    }
  } catch (error) {
    generalError.value = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle forgot password
const handleForgotPassword = async () => {
  if (!forgotUsername.value) {
    forgotPasswordError.value = 'Please enter your username'
    return
  }

  forgotPasswordLoading.value = true
  forgotPasswordError.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    $q.notify({
      type: 'positive',
      message: 'Password reset instructions have been sent to your email.',
      position: 'top',
      timeout: 3000
    })

    resetForgotPassword()
  } catch (error) {
    forgotPasswordError.value = 'Failed to process request'
  } finally {
    forgotPasswordLoading.value = false
  }
}

// Reset forgot password form
const resetForgotPassword = () => {
  showForgotPassword.value = false
  forgotUsername.value = ''
  forgotPasswordError.value = ''
}
</script>

<style>
/* Container styles */
.login-container {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-image: url('../assets/bg-login.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Card styles */
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

/* Logo styles */
.logo {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
}

.logo-small {
  width: 70px;
  height: auto;
  margin-bottom: 10px;
}

/* Form styles */
.q-form {
  padding: 0 1rem;
}

/* Animation */
.shake-animation {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* Responsive styles */
@media (max-width: 599px) {
  .login-card {
    max-width: 100%;
    margin: 1rem;
    padding: 15px;
  }

  .logo {
    width: 80px;
  }

  .logo-small {
    width: 60px;
  }

  .q-btn {
    width: 100%;
  }
}

@media (min-width: 600px) and (max-width: 1024px) {
  .login-card {
    width: 80%;
    max-width: 360px;
  }

  .logo {
    width: 90px;
  }

  .logo-small {
    width: 65px;
  }
}
</style>

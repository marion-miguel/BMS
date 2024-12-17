<template>
  <q-layout view="hHh LpR lff">
    <q-header elevated fixed class="bg-green-7">
  <q-toolbar class="header-toolbar">
    <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="q-mr-sm" />

    <div class="header-content">
      <div class="logo-container q-mr-sm">
        <q-item clickable to="/DashBoard" class="logo-item">
          <img src="../assets/logo_itbs.png" alt="ITBS Logo" class="header-logo">
        </q-item>
      </div>

      <q-toolbar-title class="portal-title">
        Employee's Portal
      </q-toolbar-title>

      <div class="header-right">
        <q-btn round flat class="q-mr-sm">
          <q-badge floating color="red" label="0" />
          <q-icon name="notifications" />
        </q-btn>

      <q-list class="tight-icon-list">

                <div class="user-menu">
          <q-btn-dropdown square flat class="user-dropdown q-ml-sm" label="Hi, Denden" no-caps dense color="#FFF">
            <template v-slot:append>
              <q-avatar size="2px">
                <img src="/avatar.png" />
              </q-avatar>
            </template>

        <div class="user-dropdown-header q-pa-md">
          <img src="../assets/logo_itbs.png" class="user-logo" alt="ITBS Logo">
          <div class="user-info">
            <div class="text-weight-medium">Denden</div>
            <div class="text-caption">Employee</div>
          </div>
        </div>
            <q-list class="tight-icon-list">
              <q-item clickable v-close-popup to="/ProfilePage" active-class="text-green-7">
                <q-item-section side class="q-pr-xs">
                  <q-icon name="mdi-account-circle" size="sm" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>

              <q-item clickable v-close-popup to="/ChangePassword" active-class="text-green-7">
                <q-item-section side class="q-pr-xs">
                  <q-icon name="lock" size="sm" />
                </q-item-section>
                <q-item-section>Change Password</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="confirmLogout = true" class="logout-item" active-class="text-green-7">
                <q-item-section side class="q-pr-xs">
                  <q-icon name="mdi-logout" size="sm" />
                </q-item-section>
                <q-item-section class="text-7">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-list>
      </div>
    </div>
  </q-toolbar>
</q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
      :width="250"
      :breakpoint="500"
      bordered
      fixed
      class="bg-white"
      :behavior="$q.screen.lt.sm ? 'mobile' : 'desktop'"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item
            clickable
            v-ripple
            to="/DashBoard"
            :active="isDashboardRoute"
            :class="{ 'text-green-7': isDashboardRoute }"
          >
            <q-item-section avatar>
              <q-icon name="widgets" size="sm" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-expansion-item
            clickable
            active-class="text-green-7"
            icon="announcement"
            label="Announcements"
          >
            <q-list dense padding class="q-pl-lg">
              <q-item clickable v-ripple to="/Announcement" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="announcement" size="sm" />
                </q-item-section>
                <q-item-section>Announcements</q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/UpcomingEvents" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="event" size="sm" />
                </q-item-section>
                <q-item-section>Upcoming Events</q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/OfficeMemo" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="description" size="sm" />
                </q-item-section>
                <q-item-section>Office Memo</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-item clickable v-ripple to="/Policies" active-class="text-green-7">
            <q-item-section avatar>
              <q-icon name="article" size="sm"/>
            </q-item-section>
            <q-item-section>Policies</q-item-section>
          </q-item>

          <q-expansion-item
            icon="event_available"
            label="Attendance"
          >

            <q-list dense padding class="q-pl-lg">
              <q-item clickable v-ripple to="/AttendancePage" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="event_available" size="sm" />
                </q-item-section>
                <q-item-section>Attendance</q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/MissingLogs" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="format_list_bulleted" size="sm" />
                </q-item-section>
                <q-item-section>List Missing Logs</q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/ListFileOvertime" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="schedule" size="sm" />
                </q-item-section>
                <q-item-section>List file Overtime</q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/LeaveApplication" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="event_busy" size="sm" />
                </q-item-section>
                <q-item-section>Leave Application</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            icon="checklist    "
            label="For Approver"
          >

            <q-list dense padding class="q-pl-lg">
              <q-item clickable v-ripple to="/LeaveApplicationsList" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="list_alt" size="sm" />
                </q-item-section>
                <q-item-section>List of Leave Applications</q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/OvertimeFiles" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="schedule" size="sm" />
                </q-item-section>
                <q-item-section>List of Overtime Files</q-item-section>
              </q-item>

          <q-expansion-item
                    icon="account_balance_wallet"
                    label="List of Budget Request"
                  >

            <q-list dense padding class="q-pl-lg">
              <q-item clickable v-ripple to="/LBRForEmployee" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="list_alt" size="sm" />
                </q-item-section>
                <q-item-section>For Employee</q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/LBRForSupplierProject" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="list_alt" size="sm" />
                </q-item-section>
                <q-item-section>For Supplier / Project</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

        </q-list>
      </q-expansion-item>

          <q-item clickable v-ripple to="/PayslipPage" active-class="text-green-7">
            <q-item-section avatar>
              <q-icon name="receipt_long" size="sm" />
            </q-item-section>
            <q-item-section>Payslip</q-item-section>
          </q-item>

          <q-expansion-item
            icon="account_balance_wallet"
            label="Budget Request"
          >

          <q-list dense padding class="q-pl-lg">
              <q-item clickable v-ripple to="/ForEmployee" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="person" size="sm" />
                </q-item-section>
                <q-item-section>For Employee</q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/ForSupplierProject" active-class="text-green-7">
                <q-item-section avatar>
                  <q-icon name="business" size="sm" />
                </q-item-section>
                <q-item-section>For Supplier / Project</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-item clickable v-ripple to="/IPCRPage" active-class="text-green-7">
            <q-item-section avatar>
              <q-icon name="mdi-chart-line" size="sm" />
            </q-item-section>
            <q-item-section>IPCR</q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>


    <q-dialog v-model="confirmLogout" persistent class="logout-dialog">
      <q-card style="min-width: 350px; border-radius: 10px">
        <q-card-section class="text-center q-pb-none">
          <q-avatar size="70px" class="q-mb-md">
            <q-icon name="logout" color="red-7" size="40px" />
          </q-avatar>
          <div class="text-h6 q-mb-md">Confirm Logout</div>
          <div class="text-subtitle1 text-grey-7">
            Are you sure you want to logout from the system?
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            color="grey-7"
            v-close-popup
            class="q-px-md"
            style="border-radius: 5px"
          />
          <q-btn
            flat
            label="Logout"
            color="red-7"
            clickable v-ripple to="/"
            class="q-px-md q-ml-sm"
            style="border-radius: 5px"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          ©2024 <a href="https://www.itbs.com.ph/" class="text-white">Information Technology Business Solutions</a> Corporation All rights reserved.
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

export default {
  name: 'MainLayout',

  setup () {
    const $q = useQuasar()
    const route = useRoute()
    const leftDrawerOpen = ref(true)
    const miniState = ref(false)
    const isMouseOver = ref(false)
    const confirmLogout = ref(false)


    const isDashboardRoute = computed(() => {
      return route.path === '/'
    })

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
      if (!leftDrawerOpen.value) {
        miniState.value = true
      } else {
        miniState.value = false
      }
    }

    const handleMouseOver = () => {
      if (!leftDrawerOpen.value) {
        isMouseOver.value = true
        miniState.value = false
      }
    }

    const handleMouseOut = () => {
      if (!leftDrawerOpen.value) {
        isMouseOver.value = false
        miniState.value = true
      }
    }
    const handleLogout = async () => {
      try {
        localStorage.removeItem('user-token')

        $q.notify({
          type: 'positive',
          message: 'Successfully logged out',
          position: 'top',
          timeout: 1500
        })

        router.push('/')
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error logging out',
          position: 'top'
        })
      } finally {
        confirmLogout.value = false
      }
    }
    return {
      leftDrawerOpen,
      miniState,
      isMouseOver,
      isDashboardRoute,
      confirmLogout,
      toggleLeftDrawer,
      handleMouseOver,
      handleMouseOut,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:300');

$sidebar-primary: #2E7D32;
$sidebar-hover: #E8F5E9;
$text-dark: #1a1a1a;
$text-light: #fefefe;
$padding-base: 0.925rem;
$transition-speed: 400ms;
$base-font-size: 1rem;

:deep(.q-drawer) {
  .q-list {
    .q-item {
      position: relative;
      margin-bottom: 4px;
      border-radius: 8px;
      transition: all $transition-speed;
      padding: 8px 4px;
      font-size: $base-font-size;

      .q-item__section {
        font-size: $base-font-size;

        &--avatar {
          min-width: 16px;
          padding-right: 2px !important;
          margin-right: 8px;
        }

        &--side {
          padding-right: 8px;
          min-width: 24px;
          color: $sidebar-primary;
        }

        &--main {
          font-size: $base-font-size;
        }
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background: $sidebar-primary;
        opacity: 0;
        transition: opacity $transition-speed;
        border-radius: 0 4px 4px 0;
      }

      &:hover {
        background-color: $sidebar-hover;

        &::before {
          opacity: 1;
        }

        .q-icon {
          color: $sidebar-primary;
          font-size: 1.25rem;
        }

        .q-item__label {
          color: $sidebar-primary;
          font-weight: 500;
        }
      }

      .q-icon {
        color: rgba($sidebar-primary, 0.8);
        font-size: 1.25rem;
      }

      &.text-green-7 {
        background: $sidebar-hover;

        &::before {
          opacity: 1;
        }

        .q-icon,
        .q-item__label {
          color: $sidebar-primary !important;
          font-weight: 500;
        }
      }
    }
  }
}

.q-toolbar {
  min-height: 48px;
}

.logo-container {
  .logo-item {
    padding: 0;
    min-height: unset;
    display: flex;
    align-items: center;
  }

  .portal-title {
    font-size: $base-font-size * 1.25;
    padding-left: 4px;
  }
}

.tight-icon-list {
  .q-item {
    min-height: 40px;
    color: $text-dark;

    .q-item__section {
      font-size: $base-font-size;

      &--side {
        padding-right: 8px;
        min-width: 24px;
        color: $sidebar-primary;
      }
    }

    .q-icon {
      font-size: 1.25rem;
    }
  }
}

.header-toolbar {
  padding: 4px 8px;

  @media (max-width: 599px) {
    padding: 4px;
  }
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.header-logo {
  width: 40px;
  height: 50px;

  @media (max-width: 599px) {
    width: 32px;
    height: 40px;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;

  .q-list.tight-icon-list {
    padding: 0;
    margin: 0;

    .q-item {
      padding: 8px 16px;
      font-size: $base-font-size;

      .q-item__section {
        font-size: $base-font-size;
      }

      &:hover {
        background-color: #f5f5f5;
      }

      &:active {
        background-color: $sidebar-hover;
      }
    }
  }
}

.user-dropdown {
  @media (max-width: 599px) {
    .q-btn__content > div {
      display: none;
    }
  }
}

.user-menu {
  display: flex;
  align-items: center;
  margin-left: 8px;

  .user-dropdown {
    .q-avatar {
      margin-left: 8px;
    }

    .q-btn__content {
      font-size: $base-font-size;
    }
  }
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;

  .user-logo {
    width: 40px;
    height: 50px;
    object-fit: contain;

    @media (max-width: 599px) {
      width: 32px;
      height: 40px;
    }
  }

  .user-info {
    display: flex;
    flex-direction: column;

    .text-weight-medium {
      color: $sidebar-primary;
      font-size: $base-font-size * 1.1;
    }

    .text-caption {
      color: #666;
      font-size: $base-font-size;
    }
  }
}

:deep(.q-menu) {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .q-separator {
    margin: 4px 0;
  }

  .q-item {
    border-radius: 4px;
    margin: 2px 4px;
    font-size: $base-font-size;

    .q-item__section {
      font-size: $base-font-size;
    }
  }
}

// For expansion items
.q-expansion-item {
  .q-item__section {
    font-size: $base-font-size;
  }

  .q-icon {
    font-size: 1.25rem;
  }
}

// Dialog styles
.logout-dialog {
  .text-h6 {
    font-size: $base-font-size * 1.25;
  }

  .text-subtitle1 {
    font-size: $base-font-size;
  }
}

// Footer styles
.q-footer {
  .text-subtitle2 {
    font-size: $base-font-size;
  }
}
</style>

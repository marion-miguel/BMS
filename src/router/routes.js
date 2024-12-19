const routes = [
  {
    path: '/',
    component: () => import('pages/LoginPage.vue')
  },

  // Main application routes with layout
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [

      // Dashboard
      { path: '/',component: () => import('pages/LoginPage.vue') },
      { path: '/DashBoard',component: () => import('pages/DashBoard.vue') },

         { path: '/Announcement',component: () => import('pages/AnnouncementPage.vue')},
         { path: '/UpcomingEvents',component: () => import('../pages/UpcomingEvents.vue')},
         { path: '/OfficeMemo',component: () => import('../pages/OfficeMemo.vue')},

      { path: '/Policies',component: () => import('../pages/PolicyPage.vue')},

        { path: '/AttendancePage',component: () => import('../pages/AttendancePage.vue')},
        { path: '/MissingLogs',component: () => import('../pages/MissingLogs.vue')},
        { path: '/ListFileOvertime',component: () => import('../pages/ListFileOvertime.vue')},
        { path: '/LeaveApplication',component: () => import('../pages/LeaveApplication.vue')},

        { path: '/LeaveApplicationsList',component: () => import('../pages/LeaveApplicationsList.vue')},
        { path: '/OvertimeFiles',component: () => import('../pages/OvertimeFiles.vue') },
          { path: '/LBRForEmployee',component: () => import('../pages/LBRForEmployee.vue')},
          { path: '/LBRForSupplierProject',component: () => import('../pages/LBRForSupplierProject.vue')},

      { path: '/PayslipPage',component: () => import('../pages/PayslipPage.vue')},

          { path: '/ForEmployee', component: () => import('../pages/ForEmployee.vue')},
          { path: '/ForSupplierProject', component: () => import('../pages/ForSupplierProject.vue')},

      { path: '/IPCRPage',component: () => import('../pages/IPCRPage.vue')},
      { path: '/DIVPCRPage',component: () => import('../pages/DIVPCR.vue')},


      { path: '/ProfilePage',component: () => import('../pages/ProfilePage.vue')},
      { path: '/ChangePassword',component: () => import('../pages/ChangePassword.vue')},



//FORMS
      { path: '/FormOvertime',component: () => import('../pages/forms/FormOvertime.vue')},
      { path: '/LeaveForm',component: () => import('../pages/forms/LeaveForm.vue')},
      { path: '/FEBudgetRequestForm',component: () => import('../pages/forms/FEBudgetRequestForm.vue')},
      { path: '/FSPFormBudgetRequest',component: () => import('../pages/forms/FSPFormBudgetRequest.vue')},
      { path: '/EIPCR',component: () => import('../pages/forms/EIPCR.vue')},
      { path: '/AttendanceForm',component: () => import('../pages/forms/AttendanceForm.vue')},

//VIEW
      { path: '/MLV',component: () => import('../pages/view/MissingLogsView.vue')},
      { path: '/LFOV',component: () => import('../pages/view/ListFileOvertimeView.vue')},
      { path: '/LAV',component: () => import('../pages/view/LeaveApplicationView.vue')},
      { path: '/LAVLV',component: () => import('../pages/view/LeaveApplicationListView.vue')},
      { path: '/OFV',component: () => import('../pages/view/OvertimeFilesView.vue')},


//EDIT
      { path: '/LAE',component: () => import('../pages/edit/LeaveApplicationEdit.vue')},

//PRINT
      { path: '/RFP',component: () => import('../pages/print/FERequestForPayment.vue')},
      { path: '/CAF',component: () => import('../pages/print/FECashAdvanceForm.vue')},
      { path: '/PayslipDialog',component: () => import('../pages/print/PayslipDialog.vue')},

    ]},

  // Error page - keep this as the last route
  {path: '/:catchAll(.*)*',component: () => import('pages/ErrorNotFound.vue') }
]


export default routes

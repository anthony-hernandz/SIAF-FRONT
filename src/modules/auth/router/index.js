export default [
    {
      path: '/send-mail',
      name: 'send-mail-password',
      meta: {
        title: 'Recuperar Contraseña',
      },
      component: () => import(/* webpackChunkName: "resetPasswordSendMail" */ '../views/SendMailView.vue')
    },
    {
      path: '/restablish-password',
      name: 'restablish-password',
      meta: {
        title: 'Nueva contraseña',
      },
      component: () => import(/* webpackChunkName: "RestablishPassword" */ '../views/RestablishPasswordView.vue')
    },
    {
      path: '/email-code-verification',
      name: 'email-code-verification',
      meta: {
        title: 'Envío de Código',
      },
      component: () => import(/* webpackChunkName: "emailCodeVerification" */ '../views/EmailCodeVerificationView.vue')
    }
  ]

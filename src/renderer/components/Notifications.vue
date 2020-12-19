<template lang='pug'>
  div
    v-snackbar(
      v-for='(notification, i) in notifications'
      :key='i'
      v-model='i'
      app
      top
      :color='notification.type'
      rounded
    ) {{notification.message}}
      template(v-slot:action='{attrs}')
        v-btn(icon @click)
          v-icon fas fa-times
</template>

<script>
export default {
  data () {
    return {
      notifications: [],
      visible: true
    }
  },
  mounted () {
    // TODO: Usar https://github.com/ajanes93/vuetify-snackbar-queue#readme
    // window.wails.Events.On("notify:error", (error) => {
    //   this.notifications.push({
    //     type: 'error',
    //     message: error
    //   });
    // });
    // window.wails.Events.On("notify:warning", (message) =>
    //   this.notifications.push({
    //     type: 'warning',
    //     message
    //   })
    // );
    // window.wails.Events.On("notify:success", (message) =>
    //   this.notifications.push({
    //     type: 'success',
    //     message
    //   })
    // );
    // window.wails.Events.On("notify:info", (message) =>
    //   this.notifications.push({
    //     type: 'info',
    //     message
    //   })
    // );
  }
}
</script>

<style>

</style>
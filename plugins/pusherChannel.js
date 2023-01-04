import Echo from 'laravel-echo'
require('pusher-js')

export default ({ app, $config }, inject) => {
  const pusherChannel = function (target, callback) {
    const echo = new Echo({
      broadcaster: 'pusher',
      key: $config.pusherKey,
      cluster: $config.pusherCluster,
      encrypted: true,
      authEndpoint: $config.echoHost + '/broadcasting/auth',
      auth: {
        headers: {
          Authorization: app.$auth.strategy.token.get(),
          Accept: 'application/json'
        }
      }
    })

    echo.private('App.Models.User.' + app.$auth.user.uuid)
      .listen('Notification', (e) => {
        if (e.target === target) {
          callback()
        }
      })
  }

  inject('pusher_channel', pusherChannel)
}

export default ({ app, $config }, inject) => {
  const captureError = async function(error) {
    if (!$config.sentryDsn) return
    app.$sentry.captureException(error)
  }

  inject('captureError', captureError);
}

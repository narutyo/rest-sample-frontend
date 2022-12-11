module.exports = {
  apps: [
    {
      name: 'Rest Sample Frontend',
      exec_mode: 'cluster',
      instances: '2',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start'
    }
  ]
}

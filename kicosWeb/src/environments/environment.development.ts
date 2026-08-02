export const environment = {
  production: false,
  // Via proxy.conf.json → API prod (pour partage tunnel / local)
  base_url: '/api',
  pusher: {
    key: 'b4f9d7a49fca6dc7af58',
    cluster: 'eu',
  },
  appName: 'Kicos Express',
};

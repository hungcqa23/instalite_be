module.exports = {
  apps: [
      {
          name: 'app',
          script: 'build/app.js',
          instances: '8',
          autorestart: true,
          watch: false,
          max_memory_restart: '512M',
          vizion: false,
          exec_mode: 'cluster',
      },
  ],
};
module.exports = {
  apps: [
    {
      name: 'miscellany-backend',
      script: './backend/dist/main.js',
      instances: '1',
      exec_mode: 'cluster',
      watch: true,
      max_memory_restart: '1G',
      PORT: 3000,
      env: {
        NODE_ENV: 'prod',
        env_file: './backend/.env',
      },
      env_development: {
        NODE_ENV: 'dev',
        env_file: './backend/.env.dev',
      },
    },
    {
      name: 'miscellany-frontend',
      script: './frontend/.output/server/index.mjs',
      PM2_SERVE_PATH: './frontend/build',
      PM2_SERVE_PORT: 3001,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html',
      env: {
        NODE_ENV: 'prod',
        env_file: './frontend/.env',
      },
      env_development: {
        NODE_ENV: 'dev',
        env_file: './frontend/.env.dev',
      },
    },
  ],
};

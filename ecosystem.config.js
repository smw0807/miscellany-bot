module.exports = {
  apps: [
    {
      name: 'miscellany-backend',
      script: './backend/dist/main.js',
      instances: '1',
      exec_mode: 'cluster',
      watch: true,
      max_memory_restart: '1G',
      PORT: 5001,
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
      instances: '1',
      exec_mode: 'cluster',
      watch: true,
      max_memory_restart: '1G',
      PORT: 3001,
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

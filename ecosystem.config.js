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

// # 전체 애플리케이션 실행 (프로덕션)
// pm2 start ecosystem.config.js

// # 전체 애플리케이션 실행 (개발)
// pm2 start ecosystem.config.js --env development

// # 프론트엔드만 실행
// pm2 start ecosystem.config.js --only miscellany-frontend

// # 백엔드만 실행
// pm2 start ecosystem.config.js --only miscellany-backend

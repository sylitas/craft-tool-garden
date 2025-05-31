const path = require('path');

module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run dev',
      cwd: path.resolve(__dirname, 'frontend'),
      env: {},
      watch: ['./'],
      ignore_watch: ['node_modules'],
    },
    {
      name: 'backend',
      script: 'bun',
      args: 'run dev',
      cwd: path.resolve(__dirname, 'backend'),
      env: {},
      watch: ['./'],
      ignore_watch: ['node_modules'],
    },
  ],
};

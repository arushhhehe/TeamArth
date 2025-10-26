#!/usr/bin/env node

/**
 * Environment switcher for Udyam Union Frontend
 * This script helps switch between different environment configurations
 */

import fs from 'fs';
import path from 'path';

const environments = {
  development: {
    VITE_API_URL: 'http://localhost:5000/api',
    VITE_APP_NAME: 'Udyam Union',
    VITE_APP_VERSION: '1.0.0',
    VITE_MOCK_MODE: 'true'
  },
  production: {
    VITE_API_URL: 'https://udyam-union-backend.herokuapp.com/api',
    VITE_APP_NAME: 'Udyam Union',
    VITE_APP_VERSION: '1.0.0',
    VITE_MOCK_MODE: 'false'
  },
  mock: {
    VITE_API_URL: 'http://localhost:5000/api',
    VITE_APP_NAME: 'Udyam Union',
    VITE_APP_VERSION: '1.0.0',
    VITE_MOCK_MODE: 'true'
  }
};

function createEnvFile(env) {
  const envConfig = environments[env];
  if (!envConfig) {
    console.error(`❌ Unknown environment: ${env}`);
    console.log('Available environments:', Object.keys(environments).join(', '));
    process.exit(1);
  }

  const envContent = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync('.env', envContent);
  console.log(`✅ Environment switched to: ${env}`);
  console.log('Environment variables:');
  Object.entries(envConfig).forEach(([key, value]) => {
    console.log(`  ${key}=${value}`);
  });
}

function showCurrentEnv() {
  if (fs.existsSync('.env')) {
    const content = fs.readFileSync('.env', 'utf8');
    console.log('Current .env file:');
    console.log(content);
  } else {
    console.log('No .env file found');
  }
}

const command = process.argv[2];
const env = process.argv[3];

switch (command) {
  case 'switch':
    if (!env) {
      console.error('❌ Please specify an environment');
      console.log('Usage: node switch-env.js switch <environment>');
      console.log('Available environments:', Object.keys(environments).join(', '));
      process.exit(1);
    }
    createEnvFile(env);
    break;
  case 'show':
    showCurrentEnv();
    break;
  case 'list':
    console.log('Available environments:');
    Object.keys(environments).forEach(env => {
      console.log(`  - ${env}`);
    });
    break;
  default:
    console.log('Udyam Union Environment Switcher');
    console.log('');
    console.log('Usage:');
    console.log('  node switch-env.js switch <environment>  - Switch to environment');
    console.log('  node switch-env.js show                  - Show current environment');
    console.log('  node switch-env.js list                  - List available environments');
    console.log('');
    console.log('Available environments:', Object.keys(environments).join(', '));
}

const requiredEnv = [
  'DERP_BOT_TOKEN',
];

const otherEnv = [
  'GITHUB_SHA',
  'WORDNIK_API_KEY',
];


requiredEnv.forEach(envName => {
  if (!process.env[envName]) {
    throw Error(`${envName} is missing from environment. Aborting!`);
  }
});

export const DERP_BOT_TOKEN = process.env.DERP_BOT_TOKEN;
export const GITHUB_SHA = process.env.GITHUB_SHA;
export const WORDNIK_API_KEY = process.env.WORDNIK_API_KEY;
export const isProduction = process.env.NODE_ENV === 'production';


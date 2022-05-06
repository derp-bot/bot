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
  module.exports[envName] = process.env[envName];
});

otherEnv.forEach(envName => {
  module.exports[envName] = process.env[envName];
});

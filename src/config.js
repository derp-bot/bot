const requiredEnv = [
  'DERP_BOT_TOKEN',
];

const otherEnv = [
  'GITHUB_BRANCH',
  'GITHUB_SHA',
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

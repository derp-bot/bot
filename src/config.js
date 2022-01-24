const requiredEnv = [
  'DERP_BOT_TOKEN',
];

requiredEnv.forEach(envName => {
  if (!process.env[envName]) {
    throw Error(`${envName} is missing from environment. Aborting!`);
  }
  module.exports[envName] = process.env[envName];
});


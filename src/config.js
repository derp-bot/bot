const requiredEnv = [
  'DERP_BOT_TOKEN',
  'DERP_CLIENT_ID',
  'DERP_GUILD_ID',
];

requiredEnv.forEach(envName => {
  if (!process.env[envName]) {
    throw Error(`${envName} is missing from environment. Aborting!`);
  }
  module.exports[envName] = process.env[envName];
});


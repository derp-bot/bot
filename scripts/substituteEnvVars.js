const path = require('path');
const fs = require('fs');

const envVarNames = [
  'DISCORD_BOT_TOKEN',
  'HEARTBEAT_HEALTHCHECKS_IO_URL'
];

const deleteTheseKeys = [
  'taskDefinitionArn',
  'revision',
  'status',
  'requiresAttributes',
  'compatibilities',
]

// Load our task def.
const taskDefinitionPath = path.relative(__dirname, path.resolve(process.argv[process.argv.length - 1]));
const taskDefinition = require(taskDefinitionPath);

// Set our environment variables.
const environmentVars = taskDefinition.environment || [];
const newEnvironmentVars = environmentVars.concat(envVarNames.map(name => ({
  name,
  value: process.env[name],
})));
taskDefinition.environment = newEnvironmentVars;

// Delete the values we should'nt be sending back.
deleteTheseKeys.forEach(key => {
  delete taskDefinition[key];
});

fs.writeFileSync(taskDefinitionPath, JSON.stringify(taskDefinition, null, 2));

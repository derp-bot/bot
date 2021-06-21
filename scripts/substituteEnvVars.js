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
  'registeredAt',
  'registeredBy',
]

// Load our task def.
const taskDefinitionPath = path.relative(__dirname, path.resolve(process.argv[process.argv.length - 1]));
const taskDefinition = require(taskDefinitionPath);
const newTaskDefinitionPath = path.resolve('task-definition.json');

// Set our environment variables for our single container.
const [ derpContainer ] = taskDefinition.containerDefinitions;
const environmentVars = derpContainer.environment || [];
const newEnvironmentVars = environmentVars.concat(envVarNames.map(name => ({
  name,
  value: process.env[name],
})));
derpContainer.environment = newEnvironmentVars;

// Delete the values we shouldn't be sending back.
deleteTheseKeys.forEach(key => {
  delete taskDefinition[key];
});

fs.writeFileSync(newTaskDefinitionPath, JSON.stringify(taskDefinition, null, 2));

console.log(`::set-output name=task-definition::${newTaskDefinitionPath}`);

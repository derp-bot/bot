// Pull in any environment definitions we've got.
import 'dotenv/config';

import {
  DERP_BOT_TOKEN,
  GITHUB_SHA,
} from './config.js';
import { Derp } from './derp.js';
import log from 'simplog';

async function main() {
  log.info(`Starting the derp sha:${GITHUB_SHA || 'unknown'}`);

  const derp = new Derp();
  derp.login(DERP_BOT_TOKEN);
}

main();

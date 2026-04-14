const chalk = require('chalk');

const logo = `
███╗   ██╗███████╗██████╗ ███╗   ██╗███████╗ ██████╗██╗  ██╗██████╗
████╗  ██║██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔════╝██║  ██║██╔═══██╗
██╔██╗ ██║█████╗  ██║   ██║██╔██╗ ██║█████╗  ██║     ███████║██║   ██║
██║╚██╗██║██╔══╝  ██║   ██║██║╚██╗██║██╔══╝  ██║     ██╔══██║██║   ██║
██║ ╚████║███████╗╚██████╔╝██║ ╚████║███████╗╚██████╗██║  ██║╚██████╔╝
╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝
`;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function bootSequence() {
  console.clear();
  console.log(chalk.cyanBright(logo));

  const messages = [
    { text: '>>> INITIATING NEON ECHO V1.0 CORE...', color: chalk.gray },
    { text: '>>> LOADING COZY CYBERPUNK AESTHETICS...', color: chalk.cyan },
    { text: '>>> CALIBRATING CENTER CIRCULAR ORBITAL TRACK...', color: chalk.magenta },
    { text: '>>> ENFORCING ANTI-CLIPPING SAFE DISTANCE PROTOCOLS...', color: chalk.yellow },
    { text: '>>> HEALING SANCTUARY ENVIRONMENT: ONLINE.', color: chalk.greenBright }
  ];

  for (const msg of messages) {
    await delay(400);
    console.log(msg.color(msg.text));
  }

  await delay(600);
  console.log(chalk.white.bold('\n[ SYSTEM READY ] - Commencing dual-end server startup...\n'));
}

bootSequence();
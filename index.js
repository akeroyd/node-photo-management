const fs = require('fs');
const inquirer = require('inquirer');
const { scanForFiles } = require('./helpers.js');

const run = async () => {
  // scan for SD cards
  const drivelist = require('drivelist');
  const drives = await drivelist.list();
  const cards = drives.filter((d) => d.isCard)

  const { path } = await inquirer.prompt([
    {
      type: 'list',
      name: 'path',
      message: 'Which card do you want to import?',
      choices: cards.map((d) => ({
        name: d.description,
        value: d.mountpoints[0].path,
      })),
    },
  ]);


  // look for folders
  let builtPath = path; // init to drive path
  let content;
  let folder;

  do {
    content = fs.readdirSync(builtPath);
    const { folder } = await inquirer.prompt([
      {
        type: 'list',
        name: 'folder',
        message: 'Where should I search?',
        choices: ['_search here_', ...content],
      },
    ]);
    if (folder === '_search here_') {
      break;
    }
    builtPath = [builtPath, folder].join('/');
  } while (folder !== '_search here_');

  console.log(`I'll start scanning for photos in ${builtPath}`)
  const { images, videos } = await scanForFiles(builtPath);

  console.log(`Found ${images && images.length} images and ${videos && videos.length} videos`);
};

run();
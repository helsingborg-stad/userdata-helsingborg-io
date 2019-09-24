/* eslint-disable no-console */
const fs = require('fs');

const sourceFile = '.env-example';
const createFiles = ['.env', '.env.test'];

createFiles.forEach((createFile) => {
  try {
    if (!fs.existsSync(createFile) && fs.existsSync(sourceFile)) {
      fs.createReadStream(sourceFile).pipe(fs.createWriteStream(createFile));
      console.log(`Created file ${createFile} from sourceFile`);
    } else {
      console.error(`File ${createFile} already exists.`);
    }
  } catch (err) {
    console.error(err);
  }
});

// Done
console.log('Setup completed. Additional log information above.');

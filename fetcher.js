const request = require('request');
const fs = require('node:fs');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const file = 'index.html';

const writeToFile = (data) => {
  fs.writeFile(`./${file}`, data, { flag: 'r+' }, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
      fs.stat(`./${file}`, (err, stats) => {
        if (err) {
          console.error(err);
        }
        // we have access to the file stats in `stats`
        console.log(
          `\nDownloaded and saved ${stats.size} bytes to ./index.html\n`
        );
        process.exit();
      });
    }
  });
};

const handleFileOverwrite = (data) => {
  rl.question(
    `\nThe file ${file} already exists, would you like to overwrite it? Press Y for Yes and N for No. `,
    (answer) => {
      let overwrite = answer === 'Y' || answer === 'y';
      let notOverwrite = answer === 'N' || answer === 'n';
      if (overwrite) {
        console.log('\nProceeding to overwrite index.html.\n');
        writeToFile(data);
      }
      if (notOverwrite) {
        console.log('\nProceeding to exit without overwriting index.html.\n');
        process.exit();
      }

      rl.close();
    }
  );
};

request('http://www.example.edu/', (error, response, body) => {
  if (error || response.statusCode !== 200) {
    console.log(
      `\nThere was an error ${response.statusCode} operation failed.\n`
    );
    process.exit();
  }

  fs.open(file, 'r+', (err, fd) => {
    if (err) {
      console.log(err.message);
      process.exit();
    }

    try {
      handleFileOverwrite(body);
    } finally {
      fs.close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});

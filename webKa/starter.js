const { exec } = require('child_process');
const fs = require("fs");
require('log-timestamp');

try {
    var config = JSON.parse(fs.readFileSync('../meta/config.json'))
} catch (err) {
    console.error(`Error read file: ${err}`)
    //log_file(`Error read file: ${err}`, '../logs/player_log.txt')
    process.exit(1);
}

exec(`echo "playerok" | sudo -S ifconfig`, (error, stdout, stderr) => {
    if ((error) || (stderr)) {
      console.warn(error)
      //reject(error + stderr)
    }
    console.log("sudo OK")
  })

  var webKa_proc = exec(`sudo 


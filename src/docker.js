import { exec } from "child_process";

module.exports = {
  up: () => {
    exec("docker-compose up -d --build");
  },

  down: () => {
    exec("docker-compose down");
  },

  // these two are not working currently - I think I need to pipe the output back to the console.
  status: () => {
    exec("docker ps");
  },

  log: option => {
    //
    console.log(option);
    exec(`docker logs -f ${option}`);
  }
};

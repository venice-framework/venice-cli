import { exec } from "child_process";

const dockerUp = () => {
  exec("docker-compose up -d --build");
};

const dockerDown = () => {
  exec("docker-compose down");
};

const dockerView = () => {
  exec("docker ps -a");
};

const dockerLog = option => {
  exec(`docker log -f ${option.service}`);
};

module.exports = docker;

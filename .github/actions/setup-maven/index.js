const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const path = require('path');
const https = require('https');
const tar = require('tar');

async function download(url, dest) {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve); // close() is async, call resolve after close completes.
      });
    }).on('error', (err) => {
      fs.unlink(dest); // Delete the file if we encounter an error
      reject(err);
    });
  });
}

async function run() {
  try {
    const version = core.getInput('version') || '3.8.6';
    const downloadUrl = `https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${version}/apache-maven-${version}-bin.tar.gz`;
    const dest = path.join(__dirname, 'maven.tar.gz');

    // Download and extract Maven
    await download(downloadUrl, dest);
    await tar.extract({ file: dest, C: '/opt' });
    core.exportVariable('M2_HOME', `/opt/apache-maven-${version}`);
    core.exportVariable('MAVEN_HOME', `/opt/apache-maven-${version}`);
    core.addPath(`/opt/apache-maven-${version}/bin`);

    // Verify installation
    await exec.exec('mvn -version');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

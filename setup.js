const shell = require('shelljs')
const { exec } = require('child_process')

function cleanRepo() {
  console.log('正在重置git版本库')
  shell.rm('-rf', '.git/')
  checkNodeVersion()
}

function initGit() {
  shell.exec('git init && git add . && git commit -m "Initial commit"')
}

function checkNodeVersion() {
  shell.exec('node --version', function(code, stdout, stderr) {
    if (code !== 0) {
      console.log(stderr)
      process.exit(1)
    } else {
      const nodeVersion = stdout && parseFloat(stdout.substring(1))
      if (nodeVersion < 5) {
        console.error('Node 版本过低(' + nodeVersion + ')')
      } else {
        checkYarn((code, stderr, stdout) => {
          if (code !== 0) {
            console.error('初始化失败')
          } else {
            shell.rm('./setup.js')
            initGit()
            console.error('初始化成功')
          }
        })
      }
    }
  })
}

function checkYarn(cb) {
  shell.exec('yarn --version', function(code, stdout, stderr) {
    if (
      code !== 0 ||
      parseFloat(stdout) < 0.15 ||
      process.env.USE_YARN === 'false'
    ) {
      // npm
      shell.exec('npm install', cb)
    } else {
      // yarn
      shell.exec('yarn install', cb)
    }
  })
}

cleanRepo()

const fs = require('fs')

function createDirectory(path){
	if (!fs.existsSync(path)){ fs.mkdirSync(path); }
}

function removeDirectory(path){
	if (!fs.existsSync(path)){ fs.rmdirSync(path, { recursive: true, force: true }); }
}

module.exports.createDirectory = createDirectory
module.exports.removeDirectory = removeDirectory
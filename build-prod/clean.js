var rm = require('rimraf')
var cfg = require('./config')

module.exports = function () {
	return new Promise((resolve, reject) => {
		rm(cfg.dist, [], function (err) {
			if (!err) resolve()
			reject(err)
		})
	})
}

var webpack = require('webpack')
var cfg = require('../webpack.prod')

module.exports = function () {
	return new Promise((resolve, reject) => {
		webpack(cfg, function (err, stats) {
			var jsonStats = stats.toJson()
			if (err) return handleFatalError(err)
			if (jsonStats.errors.length > 0) reject(jsonStats.errors)
			resolve(jsonStats.hash)
		})
	})
}

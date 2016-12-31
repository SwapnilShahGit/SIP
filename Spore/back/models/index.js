const fs = require('fs');

fs.readdirSync('./models').forEach(function(file) {
	if (file.substr(-3) == '.js' && file != 'index.js') {
		require('./' + file);
	}
});

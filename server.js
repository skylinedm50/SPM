'use strict'

var app = require('./app.js'),
	server = app.listen(app.get('port'), () => {
		console.log(`Iniciando el NOG en el puerto ${app.get('port')}`)
	})
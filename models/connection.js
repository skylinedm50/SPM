'use strict'

const mssql = require('mssql')

module.exports = {
	conectar: (username, password, callbak) => {

		let config = require('../config/config.json')
		delete require.cache[require.resolve('../config/config.json')]

		config.user = username
		config.password = password
		
		let pool = new mssql.ConnectionPool(config)

		pool.connect().then( () => {
			pool.close()
			callbak(config)
		}).catch( (err) => {
			console.log(err)
			callbak(null)
		})
	},
	query: (config, strQuery, callback) => {
		console.log(strQuery)
		new mssql.ConnectionPool(config).connect().then(pool => {		
			return pool.request().query(strQuery)			
		}).then(result => {			
			callback(result)
		}).catch(err => {
			console.log('NO SE PUEDO OBTENER LA INFORMACIÓN DE LA BASE DE DATOS, ERROR ' + err)
		})
	},
	obtenerScalar: (config, strQuery, callback) => {},
	ejecutarProcedimiento: (config, procedimiento, parametros, callback) => {}
}
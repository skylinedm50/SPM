'use strict'

var express = require('express'),
	favicon = require('serve-favicon'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	pug = require('pug'),
	moment = require('moment'),
	session = require('express-session'),
	faviconURL = `${__dirname}/public/img/node-favicon.ico`,
	publicDir = express.static(`${__dirname}/public`),
	viewDir = `${__dirname}/views`,
	port = (process.env.PORT || 3000),
	
	//ENRUTADORES
	index = require('./controllers/index'),
	pym = require('./controllers/pym'),
	fn = require('./controllers/fn'),
	app = express()

app
	//configurando app
	.set('views', viewDir)
	.set('view engine', 'pug')
	.set('port', port)
	//ejecutando middlewares
	.use( favicon(faviconURL) )
	// parse application/json
	//.use( bodyParser.json() )
	// parse application/x-www-form-urlencoded
	//.use( bodyParser.urlencoded({extended: false}) )
	.use(bodyParser.json({limit: '50mb'}))
	.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
	.use( session({
		secret: 'esto es secreto',
		resave: false,
    	saveUninitialized: true
	}) )
	.use( morgan('dev') )
	.use(publicDir)
	//ejecuto el middleware Enrutador
	.use(index)
	.use(pym)
	.use(fn)

module.exports = app
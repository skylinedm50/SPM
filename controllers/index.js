'use strict'

var express = require('express'),
	router = express.Router(),
	login = require('../models/login.js')
	

router
	.get('/', (req, res) => {
		req.session.destroy()
		let locals = {
			title : 'NOG',
			description : 'PANTALLA DE INICIO DEL NOG'
		}

		res.render('index', locals)
	})
	.get('/login', (req, res) => {

		req.session.destroy()
		let locals = {
			title : 'LOGIN NOG',
			description : 'LOGIN DEL NOG',
			username : '',
			estado : ''
		}

		res.render('login', locals)
	})
	
	.post('/login', (req, res) => {

		let user = req.body.txtUser,
			pass = req.body.txtPassword

		login.verificarConexion(user, pass, (config) => {
			if (config || req.session.config) {

				req.session.config = config
				login.verificarUsuario(config, user, (rows) => {
					req.session.cod_usuario = rows[0][0].cod_usuario
					req.session.nombre_usuario = rows[0][0].nombre

					if (rows[0][0].clave_def_usuario) {
						req.session.modulos = rows[1]
						res.redirect('/inicioNOG')
					} else {
						req.session.nombreAnterior = rows[0][0].nombre_usuario
						res.redirect('/cambioClave')
					}
				})
			} else {
				let locals = {
					title : 'NOG',
					descripcion : 'login',
					username : user,
					message : 'El usuario o la contraseña con incorrectos'
				}
				res.render('login', locals)
			}
		})
	})
	.get('/cambioClave', (req, res) => {

		login.datosUsuario(req.session.config, req.session.cod_usuario, (usuario) => {

			let locals = {
				title : 'NOG',
				description : 'MENÚ DEL NOG',
				username : req.session.nombre_usuario,
				usuario : usuario[0]
			}

			res.render('cambioClave', locals)

		})
	})
	.post('/verificarUsuario', (req, res) => {

		let usuario = req.body.nombreUsuario

		login.verificarNombreUsuario(req.session.config, usuario, (recorset) => {

			if (recorset[0].nro_usuarios == 0) {
				res.json({valido: true})
			} else {
				res.json({valido: false})
			}
			
		})

	})
	.post('/actualizarDatosUsuario', (req, res) => {

		let usuario = req.body.usuario,
			contraseña = req.body.contraseña
		console.log(usuario+' '+contraseña)
		login.actualizarDatosUsuario(req.session.nombreAnterior, usuario, contraseña, (rowsAffected) => {
			res.json({valido: true})
		})
	})
	.get('/inicioNOG', (req, res) => {

		let locals = {
			title : 'NOG',
			description : 'MENÚ DEL NOG',
			username : req.session.nombre_usuario,
			menuPrincipal: true,
			modulos: req.session.modulos
		}

		res.render('inicioNOG', locals)
	})
	.get('/movil', (req, res) => {
		
		//poner validación para ver si posee permisos para acceder a esta parte, sino redirigir a la página normal
		let locals = {
			title : 'NOG',
			description : 'MENÚ DEL NOG',
			username : req.session.nombre_usuario,
			modulos: req.session.modulos
		}

		res.render('movil', locals)
	})

	.get('/loguot', (req, res) => {
		
		req.session.destroy()
		res.redirect('/')
	});

module.exports = router
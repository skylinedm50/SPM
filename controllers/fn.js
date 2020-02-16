'use strict'

var express = require('express'),
	router = express.Router(),
	login = require('../models/login.js'),
	fn = require('../models/fn.js')

router

	.get('/fn/v_index', (req, res) => {

		if (req.session.cod_usuario) {
			if (login.validarModulo(req.session.modulos, 3)) {
				login.obtenerMenuModulo(req.session.config, req.session.cod_usuario, 3, (recordset) => {

					req.session.subModulos = recordset[0]
					req.session.formularios = recordset[1]

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					let locals = {
						title: 'NOG',
						description: 'PANTALLA DE INICIO DEL SPM',
						username: req.session.nombre_usuario,
						subModulos: recordset[0],
						formularios: newForm
					}

					res.render('FN/v_index', locals)
				})
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	
	/////////////////////////////////////////////////////////////
	//ADMINISTRACIÓN
	//----------------------------------------------------------
	//Direcciones
	.get('/fn/administracion/v_listadoDDTs', (req, res) => {

		if (req.session.cod_usuario) {
			if (login.validarModulo(req.session.modulos, 3)) {
				if (login.validarURL(req.session.formularios, '/fn/administracion/v_listadoDDTs')) {

					fn.obtenerDDTs(req.session.config, (recordset) => {

						let newArray = []
						var newForm = []
						for (let i = 0; i < req.session.formularios.length; i++) {
							if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
								newArray.push(req.session.formularios[i].desc_formulario)
								newForm.push(req.session.formularios[i])
							}
						}

						let locals = {
							title: 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							username: req.session.nombre_usuario,
							subModulos: req.session.subModulos,
							formularios: newForm,
							direcciones: recordset[0],
							DDTs: recordset[1]
						}

						res.render('fn/Administracion/v_listadoDDTs', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/fn/administracion/guardarDDT', (req, res) => {

		let data = req.body

		fn.guardarDDT(req.session.config, data, (recordset) => {

			if (data.cod_direccion == 0) {
				res.json(recordset[0][0])
			} else {
				res.json({ codigo: data.cod_direccion })
			}

		})

	})
	//----------------------------------------------------------
	//Unidades ejecutoras
	.get('/fn/administracion/v_listadoGerenciasAdministrativas', (req, res) => {
		if (req.session.cod_usuario) {
			if (login.validarModulo(req.session.modulos, 3)) {
				if (login.validarURL(req.session.formularios, '/fn/administracion/v_listadoGerenciasAdministrativas') ) {

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					fn.obtenerGerenciasAdministrativas(req.session.config , (recordset) => {
						let locals = {
							title : 'NOG',
							description : 'PANTALLA DE ADMINISTRACIÓN DEL FN',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios :newForm,
							gerencias: recordset
						}
						res.render('FN/Administracion/v_listadoGerenciasAdministrativas', locals )
					})
				}					
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.get('/fn/administracion/nuevaGerenciaAdministrativa', (req, res) => {
		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 3) ) {				
				if ( login.validarURL(req.session.formularios, '/fn/administracion/v_listadoGerenciasAdministrativas') ) {	
						let newArray = []
						var newForm = []
						for (let i = 0; i < req.session.formularios.length; i++) {
							if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
								newArray.push(req.session.formularios[i].desc_formulario)
								newForm.push(req.session.formularios[i])
							}
						}

						let locals = {
							title : 'NOG',
							description : 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios : newForm,
							gerencia : {
								cod_gerencia : 0,
								numero_gerencia :'' ,
								nombre_gerencia :'' ,
								año_gerencia: '' ,
								monto_aprobado_gerencia:''
							}
						}
						res.render('FN/Administracion/v_nuevaGerenciaAdministrativa' , locals)					
				}else{
					res.redirect('/inicioNOG')	
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/fn/administracion/guardarGerenciaAdministrativa' , (req, res) => {

		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		fn.guardarGerenciaAdministrativa(req.session.config, data, (recordset) => {

			if (data.codigo == 0) {
				res.json(recordset[0][0])
			} else {
				res.json({ codigo: data.codigo })
			}
		})
	})
	.get('/fn/administracion/actualizarGerenciaAdministrativa/:codigo',(req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 3) ) {				
				if (login.validarURL(req.session.formularios, '/fn/administracion/v_listadoGerenciasAdministrativas') ) {

					let codigo = req.params.codigo

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					fn.obtenerGerenciaAdministrativa(req.session.config, codigo, (recordset) => {

						let locals = {
							title : 'NOG',
							description : 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios : newForm,				
							gerencia : recordset[0]
						}

						res.render('FN/Administracion/v_nuevaGerenciaAdministrativa', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/fn/administracion/pv_dgdUnidades', (req, res) => {

		let cod_unidad = req.body.cod_unidad

		fn.obtenerUnidadesEjecutoras(req.session.config, cod_unidad, (recordset) => {

			let locals = { unidades: recordset }

			res.render('FN/administracion/pv_dgdUnidades', locals, (err, html) => {
				res.send(html)
			})
		})

	})
	.post('/fn/administracion/guardarUnidadesEjecutoras', (req, res) => {

		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		fn.guardarUnidadesEjecutoras(req.session.config, data, (recordset) => {
			res.json(recordset)
		})
	})
	.post('/fn/administracion/pv_dgdProgramas', (req,res) => {

		let cod_gerencia = req.body.cod_gerencia 
	
		fn.obtenerProgramas(req.session.config, cod_gerencia , (recordsets) => {

			let locals = {
				unidades: recordsets[0],
				programas: recordsets[1]
			}

			res.render('FN/administracion/pv_dgdProgramas', locals, (err, html) => {				
				res.send(html)
			})
		})
	})
	.post('/fn/administracion/guardarProgramas', (req, res) => {

		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		fn.guardarPrograma(req.session.config, data, (recordset) => {
			res.json( recordset )
		})
	})
	.post('/fn/administracion/pv_dgdSubProgramas', (req,res) => {

		let cod_gerencia = req.body.cod_gerencia 
	
		fn.obtenerSubProgramas(req.session.config, cod_gerencia , (recordset) => {

			let locals = {
				programas:recordset[0],
				Subprogramas: recordset[1]
			}
			res.render('FN/administracion/pv_dgdSubProgramas', locals, (err, html) => {				
				res.send(html)
			})

		})
	})
	.post('/fn/administracion/guardarSubProgramas', (req, res) => {
		let data = req.body
		data.cod_usuario = req.session.cod_usuario
		fn.guardarSubPrograma(req.session.config, data, (recordset) => {
			res.json( recordset )
		})
	})
	.post('/fn/administracion/pv_dgdProyectos', (req,res) => {

		let cod_gerencia = req.body.cod_gerencia 
	
		fn.obtenerProyectos(req.session.config, cod_gerencia, (recordsets) => {
			let locals = {
				programas: recordsets[0],
				subprogramas:recordsets[1],
				proyectos: recordsets[2]
			}

			res.render('FN/administracion/pv_dgdProyectos', locals, (err, html) => {				
				res.send(html)
			})
		})
	})
	.post('/fn/administracion/guardarProyectos', (req, res) => {
		let data = req.body
		data.cod_usuario = req.session.cod_usuario
		fn.guardarProyectos(req.session.config, data, (recordset) => {
			res.json( recordset )
		})
	})
	.post('/fn/administracion/pv_dgdAct_Obras', (req,res) => {

		let cod_gerencia = req.body.cod_gerencia
	
		fn.obtenerAct_Obras(req.session.config, cod_gerencia, (recordsets) => {

			let locals = {
				programas: recordsets[0],
				proyectos: recordsets[1],
				act_obras: recordsets[2]
			}

			res.render('FN/administracion/pv_dgdAct_Obras', locals, (err, html) => {				
				res.send(html)
			})
		})
	})
	.post('/fn/administracion/guardarAct_Obra', (req, res) => {

		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		fn.guardarAct_Obras(req.session.config, data, (recordset) => {
			res.json( recordset )
		})
	})
	/////////////////////////////////////////////////////////////
	//ACTIVIDADES
	//----------------------------------------------------------
	//Actividades
	.get('/fn/actividades/v_actividades', (req, res) => {

		if (req.session.cod_usuario) {
			if (login.validarModulo(req.session.modulos, 3)) {
				if (login.validarURL(req.session.formularios, '/fn/actividades/v_actividades')) {
					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					fn.obtenerDatosActividades(req.session.config, (recordsets) => {
						let locals = {
							title: 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							username: req.session.nombre_usuario,
							subModulos: req.session.subModulos,
							formularios: newForm,
							gerencias: recordsets[0],
							direcciones: recordsets[1],
							responsables: recordsets[2],
							//departamentos: recordsets[3],
							//municipios: recordsets[4],
							gruposGastos: recordsets[3],
							subgruposGastos: recordsets[4],
							objetosGastos: recordsets[5]
						}

						res.render('FN/Actividades/v_actividades', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/fn/actividades/pv_dgdActividades', (req, res) => {

		let filtros = req.body

		fn.obtenerActividades(req.session.config, filtros, (recordsets) => {

			let locals = {
				unidades: recordsets[0],
				programas: recordsets[1],
				subProgramas: recordsets[2],
				proyectos: recordsets[3],
				actividadesObras: recordsets[4],
				actividades: recordsets[5],
			}

			res.render('FN/Actividades/pv_dgdActividades', locals, (err, html) => {
				res.send(html)
			})
		})
	})
	.post('/fn/actividades/guardarActividades', (req, res) => {

		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		fn.guardarActividades(req.session.config, data, (recordset) => {
			res.json(recordset)
		})

	})
	.post('/fn/actividades/eliminarActividad', (req, res) => {

		let codigo = req.body.codigo

		fn.eliminarActividad(req.session.config, codigo, (rowAffected) => {
			if (rowAffected == 1) {
				res.json({ codigo: codigo })
			} else {
				res.json({ codigo: 0 })
			}
		})
	})
	.post('/fn/actividades/json_regionalizacion', (req, res) => {

		let codigo = req.body.cod_actividad

		fn.obtenerRegionalizacionActividad(req.session.config, codigo, (recordset) => {
			res.json(recordset)
		})

	})
	.post('/fn/actividades/guardarRegionalizacion', (req, res) => {

		let data = req.body
		
		fn.guardarRegionalizacion(req.session.config, data, (rowsAffected) => {
			res.json(rowsAffected)
		})
	})
	/////////////////////////////////////////////////////////////
	//REPORTES
	//----------------------------------------------------------
	//POA
	.get('/fn/reportes/v_poa', (req, res) => {

		if (req.session.cod_usuario) {
			if (login.validarModulo(req.session.modulos, 3)) {
				if (login.validarURL(req.session.formularios, '/fn/reportes/v_poa')) {

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					fn.obtenerPOA(req.session.config, (recordset) => {
						let locals = {
							title: 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							username: req.session.nombre_usuario,
							subModulos: req.session.subModulos,
							formularios: newForm,
							gerencias: recordset
						}

						res.render('FN/Reportes/v_poa', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/fn/reportes/pv_dgdActividadesPOA', (req, res) => {

		let filtros = req.body

		fn.obtenerActividadesPOA(req.session.config, filtros, (recordset) => {

			let locals = {
				actividades: recordset
			}

			res.render('FN/Reportes/pv_dgdActividadesPOA', locals, (err, html) => {
				res.send(html)
			})
		})
	})

module.exports = router
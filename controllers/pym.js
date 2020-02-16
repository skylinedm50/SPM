'use strict'

var express = require('express'),
	router = express.Router(),
	login = require('../models/login.js'),
	pym = require('../models/pym.js')
	
router	
	.get('/pym/v_index', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				console.log("---usuarios ---")
				login.obtenerMenuModulo(req.session.config, req.session.cod_usuario, 2, (recorset) => {

					req.session.subModulos = recorset[0]
					req.session.formularios = recorset[1]
					req.session.subformularios = recorset[2]

					let newArray = []
					var newForm = []
					// Menú sin elementos repetidos
					for (let i = 0; i < recorset[1].length; i++) {
						if (newArray.indexOf(recorset[1][i].desc_formulario) === -1) {
							newArray.push(recorset[1][i].desc_formulario)
							newForm.push(recorset[1][i])
						}
					}
					let locals = {
						title : 'NOG',
						description : 'PANTALLA DE INICIO DEL SPM',
						username : req.session.nombre_usuario,
						subModulos : recorset[0],
						formularios: newForm,
						subformularios: req.session.subformularios,
					}

					res.render('PYM/v_index', locals)
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
	//Direcciones, Departamentos y Temas
	.get('/pym/administracion/v_listadoDDTs', (req, res) => {
		
		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/administracion/v_listadoDDTs') ) {

					pym.obtenerDDTs(req.session.config, (recorset) => {

						let newArray = []
						var newForm = []
						for (let i = 0; i <  req.session.formularios.length; i++) {
							if (newArray.indexOf( req.session.formularios[i].desc_formulario) === -1) {
								newArray.push( req.session.formularios[i].desc_formulario)
								newForm.push( req.session.formularios[i])
							}
						}

						let locals = {
							title : 'NOG',
							description : 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios : newForm,
							direcciones : recorset[0],
							DDTs : recorset[1]
						}

						res.render('PYM/Administracion/v_listadoDDTs', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/pym/administracion/guardarDDT', (req, res) => {

		let data = req.body
		
		pym.guardarDDT(req.session.config, data, (recorset) => {

			if (data.cod_direccion == 0) {
				res.json( recorset[0][0] )
			} else {
				res.json( {codigo : data.cod_direccion} )
			}

		})

	})
	//----------------------------------------------------------
	//Operaciones
	.get('/pym/administracion/v_listadoOperaciones', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/administracion/v_listadoOperaciones') ) {

					pym.obtenerOperaciones(req.session.config, (operaciones) => {

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
							operaciones : operaciones
						}

						res.render('PYM/Administracion/v_listadoOperaciones', locals)
					})

				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.get('/pym/administracion/nuevaOperacion', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/administracion/v_listadoOperaciones') ) {

					pym.obtenerOrganismosFinancieros(req.session.config, (recorset) => {

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
							niveles: {},
							organismos : recorset,
							operacion : {
								cod_operacion : 0,
								fecha_inicio_operacion : null,
								fecha_fin_operacion : null,
								monto_operacion : ''
							}
						}

						res.render('PYM/Administracion/v_editarOperacion', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.get('/pym/administracion/actualizarOperacion/:codigo', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/administracion/v_listadoOperaciones') ) {

					let codigo = req.params.codigo

					pym.obtenerOperacion(req.session.config, codigo, (recorsets) => {

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
							//niveles : recorset[0],
							organismos : recorsets[0],
							operacion : recorsets[1][0],
							componentes : recorsets[2],
							subcomponentes : recorsets[3],
							indicadoresProductos : recorsets[4]
						}

						res.render('PYM/Administracion/v_editarOperacion', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/pym/administracion/guardarOperacion', (req, res) => {

		let codigo = req.body.codigo,
			estado = 0
		if (req.body.estado === 'true')
			estado = 1

		let operacion = {
			codigo : codigo,
			organismo : req.body.organismo,
			nombre : req.body.nombre,
			numero : req.body.nro,
			monto : req.body.monto,
			estado : estado,
			inicio : req.body.inicio,
			fin : req.body.fin,
			desc : req.body.desc,
			usuario : req.session.cod_usuario
		}

		pym.guardarOperacion(req.session.config, operacion, (recorset) => {
			if (codigo == 0) {
				res.json( recorset[0][0] )
			} else {
				res.json( {codigo : codigo} )
			}
		})
	})
	.post('/pym/administracion/pv_dgdComponentes', (req, res) => {

		let cod_operacion = req.body.cod_operacion

		pym.obtenerComponentes(req.session.config, cod_operacion, (recorset) => {

			let locals = {
				componentes: recorset
			}

			res.render('PYM/administracion/pv_dgdComponentes', locals, (err, html) => {
				res.send(html)
			})

		})

	})
	.post('/pym/administracion/guardarComponentes', (req, res) => {

		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		pym.guardarComponentes(req.session.config, data, (recorset) => {
			res.json( recorset )
		})
	})
	.post('/pym/administracion/pv_dgdSubcomponentes', (req, res) => {

		let cod_operacion = req.body.cod_operacion
		
		pym.obtenerSubcomponentes(req.session.config, cod_operacion, (recorsets) => {

			let locals = {
				componentes: recorsets[0],
				subcomponentes: recorsets[1]
			}

			res.render('PYM/administracion/pv_dgdSubcomponentes', locals, (err, html) => {
				res.send(html)
			})

		})		
	})
	.post('/pym/administracion/guardarSubcomponentes', (req, res) => {

		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		pym.guardarSubcomponentes(req.session.config, data, (recorset) => {
			res.json( recorset )
		})
	})
	.post('/pym/administracion/pv_dgdIndcProd', (req, res) => {

		let cod_operacion = req.body.cod_operacion
		
		pym.obtenerIndicadoresProductos(req.session.config, cod_operacion, (recorsets) => {

			let locals = {
				productos: recorsets[0],
				componentesSub: recorsets[1]
			}

			res.render('PYM/administracion/pv_dgdIndcProd', locals, (err, html) => {
				res.send(html)
			})

		})	
		
	})
	.post('/pym/administracion/guardarIndcProd', (req, res) => {

		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		pym.guardarIndicadoresProductos(req.session.config, data, (recorset) => {
			res.json( recorset )
		})

	})
	/////////////////////////////////////////////////////////////
	//POA/PEP
	//----------------------------------------------------------
	//Actividades
	.get('/pym/poapep/v_listadoActividades', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/poapep/v_listadoActividades') ) {

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerDatosActividades(req.session.config, (recorsets) => {
						let locals = {
							title : 'NOG',
							description : 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios : newForm,
							operaciones : recorsets[0],
							direcciones : recorsets[1],
							responsables : recorsets[2]
						}

						res.render('PYM/PoaPep/v_listadoActividades', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/pym/poapep/pv_dgdActividades', (req, res) => {

		let filtros = req.body

		pym.obtenerActividades(req.session.config, filtros, (recorsets) => {

			let locals = {
				componentes: recorsets[0],
				subcomponentes: recorsets[1],
				indic_prod: recorsets[2],
				actividades: recorsets[3]
			}
			res.render('PYM/poapep/pv_dgdActividades', locals, (err, html) => {
				res.send(html)
			})
		})
	})


	.post('/pym/poapep/guardarActividades', (req, res) => {
		let data = req.body
		data.cod_usuario = req.session.cod_usuario

		pym.guardarActividades(req.session.config, data, (recorset) => {
			res.json( recorset )
		})

	})

	
	.post('/pym/poapep/eliminarActividad', (req, res) => {
		
		let codigo = req.body.codigo

		pym.eliminarActividad(req.session.config, codigo, (rowAffected) => {
			if (rowAffected == 1) {
				res.json({codigo: codigo})
			} else {
				res.json({codigo: 0})
			}
		})
	})
	/////////////////////////////////////////////////////////////
	//REPORTES

	.get('/pym/reportes/v_resumenOperaciones', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/reportes/v_resumenOperaciones') ) {

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerDatosResumenPrograma(req.session.config, (recorsets) => {
						let locals = {
							title: 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							manual: '/content/Manual_de_usuario_Reportes_Sistema_M&E.pdf',
							username: req.session.nombre_usuario,
							subModulos: req.session.subModulos,
							formularios: newForm,
							subformularios: req.session.subformularios,
							organismos: recorsets[0],
							operaciones: recorsets[1],
							dependencias: recorsets[2],
							resumen: recorsets[3],
							mesEjecución: recorsets[4],
							datosOperaciones: recorsets[5],
							año: recorsets[6][0].año
						}

						res.render('PYM/Reportes/v_resumenOperaciones', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})



	.post('/pym/reportes/json_resumenPrograma', (req, res) => {

		let filtros = req.body
		pym.obtenerResumenPrograma(req.session.config, filtros, (recorset) => {
			res.json(recorset)
			
		})

	})

	.get('/pym/reportes/v_detalleDireccion', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/reportes/v_detalleDireccion') ) {

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerDatosDetalleDireccion(req.session.config, (recorset) => {
						let locals = {
							title : 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							manual: '/content/Manual_de_usuario_Reportes_Sistema_M&E.pdf',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios : newForm,
							resumenOperaciones : recorset[0],
							mes: recorset[1][0].desc_mes,
							DDTs : recorset[2],
							operaciones : recorset[3],
							meses: recorset[4]

						}

						res.render('PYM/Reportes/v_detalleDireccion', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})

	.get('/pym/reportes/v_acumuladoDireccion', (req, res) => {
		if (req.session.cod_usuario) {
			if (login.validarModulo(req.session.modulos, 2)) {
				if (login.validarURL(req.session.formularios, '/pym/reportes/v_acumuladoDireccion')) {
					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerDatosAcumuladoDireccion(req.session.config, (recorset) => {
						let locals = {
							title: 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							manual: '/content/Manual_de_usuario_Reportes_Sistema_M&E.pdf',
							username: req.session.nombre_usuario,
							subModulos: req.session.subModulos,
							formularios: newForm,
							subformularios: req.session.subformularios,
							resumenOperaciones: recorset[0],
							mes: recorset[1][0].desc_mes,
							DDTs: recorset[2],
							operaciones: recorset[3],
							meses: recorset[4],
							dataDirecciones: recorset[5] 

						}

						res.render('PYM/Reportes/v_acumuladoDireccion', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})

	.get('/pym/reportes/v_mensualDireccion', (req, res) => {
		if (req.session.cod_usuario) {
			if (login.validarModulo(req.session.modulos, 2)) {
				if (login.validarURL(req.session.formularios, '/pym/reportes/v_mensualDireccion')) {
					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerDatosAcumuladoDireccion(req.session.config, (recorset) => {
						let locals = {
							title: 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							manual: '/content/Manual_de_usuario_Reportes_Sistema_M&E.pdf',
							username: req.session.nombre_usuario,
							subModulos: req.session.subModulos,
							formularios: newForm,
							subformularios: req.session.subformularios,
							resumenOperaciones: recorset[0],
							mes: recorset[1][0].desc_mes,
							DDTs: recorset[2],
							operaciones: recorset[3],
							meses: recorset[4],
							dataDirecciones: recorset[5]

						}

						res.render('PYM/Reportes/v_mensualDireccion', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})

	.post('/pym/reportes/pv_detalleAcumuladoDireccion', (req, res) => {

		let filtros = req.body

		pym.obtenerDetalleActividades(req.session.config, filtros, (recorsets) => {

			let locals = {
				actividades: recorsets[0],
				resumenOperaciones: recorsets[1],
				mes: recorsets[2][0].desc_mes
			}

			res.render('PYM/Reportes/pv_detalleDireccion', locals, (err, html) => {
				res.send(html)
			})
		})
	})

	.post('/pym/reportes/pv_detalleDireccion', (req, res) => {

		let filtros = req.body

		pym.obtenerDetalleActividades(req.session.config, filtros, (recorsets) => {

			let locals = {
				actividades: recorsets[0],
				resumenOperaciones: recorsets[1],
				mes: recorsets[2][0].desc_mes
			}

			res.render('PYM/Reportes/pv_detalleDireccion', locals, (err, html) => {
				res.send(html)
			})
		})
	})
	.get('/pym/reportes/v_poapep', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/reportes/v_poapep') ) {

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerOperaciones(req.session.config, (recorset) => {
						let locals = {
							title : 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							manual: '/content/Manual_de_usuario_Reportes_Sistema_M&E.pdf',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios : newForm,
							operaciones : recorset
						}

						res.render('PYM/Reportes/v_poapep', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}

	})
	.post('/pym/reportes/pv_dgdActividades', (req, res) => {
		
		let filtros = req.body

		pym.obtenerActividadesPOAPEP(req.session.config, filtros, (recorset) => {

			let locals = {
				actividades : recorset
			}

			res.render('PYM/Reportes/pv_dgdActividades', locals, (err, html) => {
				res.send(html)
			})
		})
	})

	///////////////////////////////////////////PRESUPUESTO EN RIESGO///////////////////////////////////////////////////////////////////////////////////////
	.get('/pym/reportes/v_presupuestoRiesgo', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/reportes/v_presupuestoRiesgo') ) {

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerDatosPresupuestoRiesgo(req.session.config, (recorsets) => {
						let locals = {
							title : 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							manual: '/content/Manual_de_usuario_Reportes_Sistema_M&E.pdf',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios : newForm,
							organismos: recorsets[0],
							operaciones: recorsets[1],
							dependencias: recorsets[2],
							dependenciasRiesgo: recorsets[3],
							mes: recorsets[4][0].desc_mes
						}

						res.render('PYM/Reportes/v_presupuestoRiesgo', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}

	})
	
	.post('/pym/reportes/json_actividadRiesgo', (req, res) => {

		let filtros = req.body

		pym.obtenerActividadesPresupuestoRiesto(req.session.config, filtros, (recorset) => {
			res.json(recorset)
		})

	})

	///////////////////////////////////////////ACTIVIDADES VENCIDAS///////////////////////////////////////////////////////////////////////////////////////
	.get('/pym/reportes/v_ActividadesVencidas', (req, res) => {
		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/reportes/v_ActividadesVencidas') ) {
					
					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerDatosActividadesVencidas(req.session.config, (recordsets) => {
						let locals = {
							title : 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							manual: '/content/Manual_de_usuario_Reportes_Sistema_M&E.pdf',
							username : req.session.nombre_usuario,
							subModulos : req.session.subModulos,
							formularios: newForm,
							subformularios: req.session.subformularios,
							organismos: recordsets[0],
							operaciones: recordsets[1],
							dependencias: recordsets[2],
							dependenciasRiesgo: recordsets[3],
							mes: recordsets[4][0].desc_mes,
							organismoOperacion: recordsets[5],							
							dataOrganismoActividades: recordsets[6],
							dataActividadesVencidas: recordsets[7],
							valorPresupuestoAnual: recordsets[8]							
						}
						res.render('PYM/Reportes/v_ActividadesVencidas', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}

	})

	.post('/pym/reportes/json_actividadVencidas', (req, res) => {

		let filtros = req.body

		pym.obtenerActividadesVencidas(req.session.config, filtros, (recordsets) => {
			res.json(recordsets)
		})

	})

	.get('', (req, res) => {

	})

	////////////////////////////////////////////COMPARATIVO DE EJECUCIÓN ////////////////////////////////////////////////////
	.get('/pym/reportes/v_ComparativoEjecucion', (req, res) => {

		if (req.session.cod_usuario) {
			if ( login.validarModulo(req.session.modulos, 2) ) {
				if ( login.validarURL(req.session.formularios, '/pym/reportes/v_ComparativoEjecucion') ) {

					let newArray = []
					var newForm = []
					for (let i = 0; i < req.session.formularios.length; i++) {
						if (newArray.indexOf(req.session.formularios[i].desc_formulario) === -1) {
							newArray.push(req.session.formularios[i].desc_formulario)
							newForm.push(req.session.formularios[i])
						}
					}

					pym.obtenerComparativoEjecucion(req.session.config, (recorsets) => {
						let locals = {
							title: 'NOG',
							description: 'PANTALLA DE ADMINISTRACIÓN DEL SPM',
							manual: '/content/Manual_de_usuario_Reportes_Sistema_M&E.pdf',
							username: req.session.nombre_usuario,
							subModulos: req.session.subModulos,
							formularios: newForm,
							subformularios: req.session.subformularios,
							organismos: recorsets[0],
							operaciones: recorsets[1],
							dependencias: recorsets[2],
						//	mesEjecución: recorsets[4],
							datosOperaciones: recorsets[3],
							año: recorsets[4][0].año
						}

						res.render('PYM/Reportes/v_comparativoEjecucion', locals)
					})
				}
			} else {
				res.redirect('/inicioNOG')
			}
		} else {
			res.redirect('/login')
		}
	})
	.post('/pym/reportes/json_ComparativoEjecutado', (req, res) => {

		let filtros = req.body
		pym.obtenerComparativo(req.session.config, filtros, (recorset) => {
			res.json(recorset)
			
		})

	})	

////////////////////////////////////////////////////TERMINA ACTIVIDADES VENCIDAS ///////////////////////////

	//REPORTES PARA MOVILES
	.post('/pym/reportes/mResumenPrograma', (req, res) => {
		
		let filtros = req.body

		pym.mResumenPrograma(req.session.config, filtros, (recorsets) => {
			
			let locals = {
				operaciones: recorsets[0],
				año: recorsets[1][0].año
			}

			if (filtros.json === 'false') {
				res.render('PYM/Reportes/pvm_resumenPrograma', locals, (err, html) => {
					res.send(html)
				})
			} else {
				res.json(locals.operaciones)
			}
		})
	})
	.post('/pym/reportes/mProgEjecMensual', (req, res) => {

		let filtros = req.body,
			locals
		
		if (filtros.json === 'false') {
			
			pym.obtenerOperaciones(req.session.config, (recorset) => {
	
				locals = {
					operaciones: recorset
				}
				
				res.render('PYM/Reportes/pvm_progEjecMensual', locals, (err, html) => {
					res.send(html)
				})
			})			
		} else {			
			pym.mProgEjecMensual(req.session.config, filtros, (recorset) => {
				res.json(recorset)
			})
		}
	})
	.post('/pym/reportes/mResumenMensual', (req, res) => {

		let filtros = req.body

		pym.mResumenMes(req.session.config, filtros, (recorset) => {

			let locals = {
				resumenMes: recorset
			}

			if (filtros.json === 'false') {
				res.render('PYM/Reportes/pvm_resumenMensual', locals, (err, html) => {
					res.send(html)
				})
			} else {
				res.json(locals.resumenMes)
			}

		})
	})
	.post('/pym/reportes/mDetalleDireccion', (req, res) => {

		let filtros = req.body,
			locals

		if (filtros.json === 'false') {

			pym.obtenerDDTs(req.session.config, (recorsets) => {

				locals = {
					direcciones: recorsets[0]
				}

				res.render('PYM/Reportes/pvm_detalleDireccion', locals, (err, html) => {
					res.send(html)
				})
				
			})		
		} else {
			pym.mdetalleDireccion(req.session.config, filtros, (recorset) => {
				res.json(recorset)
			})
		}
	})
	.post('/pym/reportes/mAcumuladoMensual', (req, res) => {

		let filtros = req.body,
			locals

		if (filtros.json === 'false') {

			pym.mAcumuladoMes(req.session.config, filtros, (recorset) => {

				locals = {
					acumulado: recorset
				}

				res.render('PYM/Reportes/pvm_acumuladoMensual', locals, (err, html) => {
					res.send(html)
				})
				
			})
		} else {
			pym.mAcumuladoMes(req.session.config, filtros, (recorset) => {
				res.json(recorset)
			})
		}

	})
	.post('/pym/reportes/mPresupuestoRiesgo', (req, res) => {
		
		pym.obtenerDatosPresupuestoRiesgo(req.session.config, (recorsets) => {
			
			let locals = {
				organismos: recorsets[0],
				operaciones: recorsets[1],
				dependencias: recorsets[2],
				dependenciasRiesgo: recorsets[3],
				mes: recorsets[4][0].desc_mes
			}

			res.render('PYM/Reportes/pvm_presupuestoRiesgo', locals, (err, html) => {
				res.send(html)
			})
			
		})

	})
	
module.exports = router;
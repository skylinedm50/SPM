'use strict'

var connection = require('../models/connection.js')

module.exports = {

	verificarConexion: (user, pass, callback) => {
		connection.conectar(user, pass, (config) => {
			callback(config)
		})
	},
	verificarUsuario: (config, user, callback) => {
		
		let sql = `
			SELECT cod_usuario, nombre1_usuario + ' ' + apellido1_usuario AS 'nombre', clave_def_usuario, nombre_usuario
				FROM NOG_T.dbo.t_seg_usuarios
				WHERE nombre_usuario = '${user}'

			SELECT DISTINCT modu.cod_modulo, modu.nombre_modulo, modu.url_modulo
				FROM NOG_T.dbo.t_seg_usuarios AS usu
					INNER JOIN NOG_T.dbo.t_seg_usuarios_roles AS usur ON usur.cod_usuario = usu.cod_usuario
					INNER JOIN NOG_T.dbo.t_seg_roles AS rol ON rol.cod_rol = usur.cod_rol
					INNER JOIN NOG_T.dbo.t_seg_modulos AS modu ON modu.cod_modulo = rol.cod_modulo
				WHERE usu.nombre_usuario = '${user}'`

		connection.query(config, sql, (result) => {
			console.log(sql)
			callback(result.recordsets)
		})
	},
	datosUsuario: (config, codigo, callback) => {

		let sql = `
			SELECT	cod_usuario
					,identidad_usuario
					,nombre1_usuario
					,nombre2_usuario
					,apellido1_usuario
					,apellido2_usuario
					,telefono_usuario
					,correo_usuario
					,nombre_usuario
				FROM NOG_T.dbo.t_seg_usuarios
				WHERE cod_usuario = ${codigo}`
		
		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},
	verificarNombreUsuario: (config, usuario, callback) => {
		let sql = `
			SELECT	COUNT(*) AS 'nro_usuarios'
				FROM NOG_T.dbo.t_seg_usuarios
				WHERE nombre_usuario = '${usuario}'`
		
		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	},
	actualizarDatosUsuario: (nombreAnterior, nombreNuevo, pass, callback) => {

		let config = require('../config/config.json')
		delete require.cache[require.resolve('../config/config.json')]

		let sql = `

			ALTER LOGIN ${nombreAnterior}
				WITH  NAME = ${nombreNuevo}
					, PASSWORD = '${pass}';

			ALTER USER ${nombreAnterior}
				WITH  NAME = ${nombreNuevo}
					, LOGIN = ${nombreNuevo};

			UPDATE NOG_T.dbo.t_seg_usuarios
				SET clave_def_usuario = 1
					,nombre_usuario = '${nombreNuevo}'
				WHERE nombre_usuario = '${nombreAnterior}'
		`
		
		connection.query(config, sql, (result) => {
			callback(result.rowsAffected[0])
		})
	},
	validarModulo: (modulos, moduloActual) => {
		for (var i = 0, len = modulos.length; i < len; i++) {
			if (modulos[i].cod_modulo === moduloActual)
				return true
		}
	},
	//tiene que ser llamado en la ventanta de inicio de cada módulo
	obtenerMenuModulo: (config, usuario, modulo, callback) => {

		let sql = `
			SELECT DISTINCT subm.cod_sub_modulo, subm.desc_sub_modulo
				FROM NOG_T.dbo.t_seg_usuarios_roles AS usu
					INNER JOIN NOG_T.dbo.t_seg_roles_formularios AS rol_form ON rol_form.cod_rol = usu.cod_rol
					INNER JOIN NOG_T.dbo.t_seg_formularios AS form ON form.cod_formulario = rol_form.cod_formulario
					INNER JOIN NOG_T.dbo.t_seg_sub_modulos AS subm ON subm.cod_sub_modulo = form.cod_sub_modulo
				WHERE subm.estado_sub_modulo = 1
					AND usu.cod_usuario = ${usuario}
					AND subm.cod_modulo = ${modulo}
			
			SELECT subm.cod_sub_modulo, form.desc_formulario, form.url_formulario, form.cod_formulario
				FROM NOG_T.dbo.t_seg_usuarios_roles AS usu
					INNER JOIN NOG_T.dbo.t_seg_roles_formularios AS rol_form ON rol_form.cod_rol = usu.cod_rol
					INNER JOIN NOG_T.dbo.t_seg_formularios AS form ON form.cod_formulario = rol_form.cod_formulario
					INNER JOIN NOG_T.dbo.t_seg_sub_modulos AS subm ON subm.cod_sub_modulo = form.cod_sub_modulo
				WHERE subm.estado_sub_modulo = 1
					AND usu.cod_usuario = ${usuario}
					AND subm.cod_modulo = ${modulo}
				ORDER BY form.orden_formulario

				SELECT subm.cod_sub_modulo, form.desc_formulario, form.url_formulario, subform.desc_sub_formulario, subform.url_sub_formulario, subform.fk_cod_formulario
				FROM NOG_T.dbo.t_seg_usuarios_roles AS usu
					INNER JOIN NOG_T.dbo.t_seg_roles_formularios AS rol_form ON rol_form.cod_rol = usu.cod_rol
					INNER JOIN NOG_T.dbo.t_seg_formularios AS form ON form.cod_formulario = rol_form.cod_formulario
					INNER JOIN NOG_T.dbo.t_seg_sub_modulos AS subm ON subm.cod_sub_modulo = form.cod_sub_modulo
					INNER JOIN NOG_T.dbo.t_seg_sub_formularios AS subform ON subform.fk_cod_formulario = form.cod_formulario
				WHERE subm.estado_sub_modulo = 1
					AND usu.cod_usuario = ${usuario}
					AND subm.cod_modulo = ${modulo}
				ORDER BY form.orden_formulario
		`
		console.log(sql)
		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	validarURL: (formularios, url) => {
		for (var i = 0, len = formularios.length; i < len; i++) {
			if (formularios[i].url_formulario === url)
				return true
		}
	}
}
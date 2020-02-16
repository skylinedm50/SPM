'use strict'

var connection = require('../models/connection.js')

module.exports = {
	/////////////////////////////////////////////////////////////
	//SHARED
	obtenerTiposDDT: (config, callback) => {
		let sql = `
			SELECT cod_tipo_direccion, nombre_tipo_direccion
				FROM NOG_T.dbo.t_pym_tipos_direcciones`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	},
	/////////////////////////////////////////////////////////////
	//ADMINISTRACIÓN
	//----------------------------------------------------------
	//Direcciones, Departamentos y Temas
	obtenerDDTs: (config, callback) => {

		let sql = `
			SELECT	cod_direccion
					,cod_tipo_direccion
					,nombre_direccion
					,responsable_direccion
					,cargo_responsable
					,correo_responsable
					,telefono_responsable
				FROM NOG_T.dbo.t_pym_direcciones

			SELECT	[cod_tipo_direccion]
      				,[nombre_tipo_direccion]
				 FROM [NOG_T].[dbo].[t_pym_tipos_direcciones]
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	obtenerDDT: (config, codigo, callback) => {

		let sql = `
			SELECT cod_tipo_direccion, nombre_tipo_direccion
				FROM NOG_T.dbo.t_pym_tipos_direcciones

			SELECT cod_direccion, cod_tipo_direccion, nombre_direccion, responsable_direccion
				FROM NOG_T.dbo.t_pym_direcciones
				WHERE cod_direccion = ${codigo}`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	guardarDDT: (config, data, callback) => {

		let sql

		if (data.cod_direccion == 0) {
			sql = `
				INSERT INTO NOG_T.dbo.t_pym_direcciones (cod_tipo_direccion, nombre_direccion, responsable_direccion, cargo_responsable, correo_responsable, telefono_responsable)
					VALUES (${data.cod_tipo_direccion}, '${data.nombre_direccion}', '${data.responsable_direccion}', '${data.cargo_responsable}', '${data.correo_responsable}', '${data.telefono_responsable}')
				
				SELECT @@IDENTITY AS 'codigo'`
		} else {
			sql = `
				UPDATE NOG_T.dbo.t_pym_direcciones
					SET cod_tipo_direccion = ${data.cod_tipo_direccion},
						nombre_direccion = '${data.nombre_direccion}',
						responsable_direccion = '${data.responsable_direccion}',
						cargo_responsable = '${data.cargo_responsable}',
						correo_responsable = '${data.correo_responsable}',
						telefono_responsable = ${data.telefono_responsable}
					WHERE cod_direccion = ${data.cod_direccion}`
		}

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	//----------------------------------------------------------
	//Operaciones
	obtenerOrganismosFinancieros: (config, callback) => {
		let sql = `
			SELECT cod_organismo_financiero, nombre_organismo_financiero
				FROM NOG_T.dbo.t_pym_organismos_financieros`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	},
	obtenerOperaciones: (config, callback) => {

		let sql = `
			SELECT 	cod_operacion
					,abrev_organismo_financiero
					,nro_operacion
					,nombre_operacion
					,CONVERT(NVARCHAR(10),fecha_inicio_operacion) AS 'fecha_inicio_operacion'
					,CONVERT(NVARCHAR(10),fecha_fin_operacion) AS 'fecha_fin_operacion'
					,desc_operacion
					,monto_operacion
					,estado_operacion
				FROM NOG_T.dbo.t_pym_operaciones AS oper
					INNER JOIN NOG_T.dbo.t_pym_organismos_financieros AS org
						ON org.cod_organismo_financiero = oper.cod_organismo_financiero`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	},
	obtenerOperacion: (config, codigo, callback) => {

		let sql = `
		/*	
			WITH cte_niveles
					(cod_nivel_operacion
					,nro_nivel_operacion
					,nro_final_nivel_operacion
					,nombre_nivel_operacion
					,desc_nivel_operacion
					,estado_nivel_operacion
					,cod_padre_nivel_operacion
					,nro_final_padre_nivel_operacion
					,nombre_padre_nivel_operacion
					,nivel)
			AS (

				SELECT	cod_nivel_operacion
						,nro_nivel_operacion
						,CONVERT(NVARCHAR(50),nro_nivel_operacion)
						,nombre_nivel_operacion
						,desc_nivel_operacion
						,estado_nivel_operacion
						,cod_padre_nivel_operacion
						,CONVERT(NVARCHAR(50),nro_nivel_operacion)
						,nombre_nivel_operacion
						, 0 AS 'nivel'
					FROM NOG_T.dbo.t_pym_niveles_operaciones
					WHERE cod_padre_nivel_operacion IS NULL AND cod_operacion = ${codigo}
				UNION ALL
				SELECT	niv.cod_nivel_operacion
						,niv.nro_nivel_operacion
						,CONVERT(NVARCHAR(50), nro_final_nivel_operacion + '.' + CONVERT(NVARCHAR(50), niv.nro_nivel_operacion))
						,niv.nombre_nivel_operacion
						,niv.desc_nivel_operacion
						,niv.estado_nivel_operacion
						,niv.cod_padre_nivel_operacion
						,nro_final_nivel_operacion
						,cte.nombre_nivel_operacion
						,cte.nivel + 1
					FROM NOG_T.dbo.t_pym_niveles_operaciones AS niv
						INNER JOIN cte_niveles AS cte ON cte.cod_nivel_operacion = niv.cod_padre_nivel_operacion
			)

			SELECT 	cod_nivel_operacion
					,nro_nivel_operacion
					,nro_final_nivel_operacion
					,nombre_nivel_operacion
					,ISNULL(desc_nivel_operacion,'') AS 'desc_nivel_operacion'
					,estado_nivel_operacion
					,cod_padre_nivel_operacion
					,nro_final_padre_nivel_operacion
					,nombre_padre_nivel_operacion
					,nivel
				FROM cte_niveles
				ORDER BY nro_final_nivel_operacion, cod_nivel_operacion
		*/

			SELECT	cod_organismo_financiero
					,nombre_organismo_financiero
				FROM NOG_T.dbo.t_pym_organismos_financieros

			SELECT	cod_operacion
					,cod_organismo_financiero
					,nombre_operacion
					,nro_operacion
					,fecha_inicio_operacion
					,fecha_fin_operacion
					,desc_operacion
					,monto_operacion
					,estado_operacion
				FROM NOG_T.dbo.t_pym_operaciones
				WHERE cod_operacion = ${codigo}
			
			SELECT	cod_componente
					,nro_componente
					,nombre_componente
					,desc_componente
				FROM NOG_T.dbo.t_pym_componentes
				WHERE cod_operacion = ${codigo}
			
			SELECT	cod_subcomponente
					,nro_componente
					,nro_subcomponente
					,nombre_subcomponente
					,desc_subcomponente
				FROM NOG_T.dbo.t_pym_subcomponentes AS sub
					INNER JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
				WHERE comp.cod_operacion = ${codigo}
		`


		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	guardarOperacion: (config, operacion, callback) => {

		let sql

		if (operacion.codigo == 0) {
			sql = `
				INSERT INTO [NOG_T].[dbo].[t_pym_operaciones]
						([cod_organismo_financiero]
						,[nombre_operacion]
						,[nro_operacion]
						,[fecha_inicio_operacion]
						,[fecha_fin_operacion]
						,[desc_operacion]
						,[monto_operacion]
						,[estado_operacion]
						,[cod_usuario])
					VALUES
						(${operacion.organismo}
						,'${operacion.nombre}'
						,'${operacion.numero}'
						,'${operacion.inicio}'
						,'${operacion.fin}'
						,'${operacion.desc}'
						,${operacion.monto}
						,${operacion.estado}
						,${operacion.usuario})
				
				SELECT @@IDENTITY AS 'codigo'`
		} else {
			sql = `
				UPDATE [NOG_T].[dbo].[t_pym_operaciones]
					SET [cod_organismo_financiero] = ${operacion.organismo}
						,[nombre_operacion] = '${operacion.nombre}'
						,[nro_operacion] = '${operacion.numero}'
						,[fecha_inicio_operacion] = '${operacion.inicio}'
						,[fecha_fin_operacion] = '${operacion.fin}'
						,[desc_operacion] = '${operacion.desc}'
						,[monto_operacion] = ${operacion.monto}
						,[estado_operacion] = ${operacion.estado}
					WHERE [cod_operacion] = ${operacion.codigo}`
		}

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	obtenerComponentes: (config, cod_operacion, callback) => {

		let sql = `
		SELECT	cod_componente
				,nro_componente
				,nombre_componente
				,desc_componente
			FROM NOG_T.dbo.t_pym_componentes
			WHERE cod_operacion = ${cod_operacion}
		`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},
	guardarComponentes: (config, data, callback) => {

		let sql = ''

		for (let i = 0, len = data.componentes.length; i < len; i++) {

			if (data.componentes[i].cod_componente != null) {

				sql += `
				PRINT('ACTUALIZO UN COMPONENTE')
					UPDATE [NOG_T].[dbo].[t_pym_componentes]
						SET [nro_componente] = ${data.componentes[i].nro_componente}
							,[nombre_componente] = '${data.componentes[i].nombre_componente}'`

				if (data.componentes[i].desc_componente != null && data.componentes[i].desc_componente.length > 0) {
					sql += `
							,[desc_componente] = '${data.componentes[i].desc_componente}'`
				} else {
					sql += `
							,[desc_componente] = NULL`
				}

				sql += `
						WHERE [cod_componente] = ${data.componentes[i].cod_componente}
				`

			} else {

				sql += `
					PRINT('INSERTO UN NUEVO COMPONENTE')
					INSERT INTO [NOG_T].[dbo].[t_pym_componentes]
							([cod_operacion]
							,[nro_componente]
							,[nombre_componente]`


				if (data.componentes[i].desc_componente != null)
					sql += `
							,[desc_componente]`

				sql += `
							,[cod_usuario])
						VALUES
							(${data.cod_operacion}
							,${data.componentes[i].nro_componente}
							,'${data.componentes[i].nombre_componente}'`

				if (data.componentes[i].desc_componente != null)
					sql += `
							,'${data.componentes[i].desc_componente}'`

				sql += `
							,${data.cod_usuario})
				`

			}

		}

		connection.query(config, sql, (result) => {
			callback(result.rowsAffected)
		})
	},
	obtenerSubcomponentes: (config, cod_operacion, callback) => {

		let sql = `
			SELECT	cod_componente
					,nro_componente
				FROM NOG_T.dbo.t_pym_componentes
				WHERE cod_operacion = ${cod_operacion}
		
			SELECT	cod_subcomponente
					,comp.cod_componente
					,nro_subcomponente
					,nombre_subcomponente
					,desc_subcomponente
				FROM NOG_T.dbo.t_pym_subcomponentes AS sub
					INNER JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
				WHERE comp.cod_operacion = ${cod_operacion}
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	guardarSubcomponentes: (config, data, callback) => {

		let sql = ''

		for (let i = 0, len = data.subcomponentes.length; i < len; i++) {

			if (data.subcomponentes[i].cod_subcomponente != null) {

				sql += `
					UPDATE [NOG_T].[dbo].[t_pym_subcomponentes]
						SET [cod_componente] = ${data.subcomponentes[i].cod_componente}
							,[nro_subcomponente] = ${data.subcomponentes[i].nro_subcomponente}
							,[nombre_subcomponente] = '${data.subcomponentes[i].nombre_subcomponente}'`

				if (data.subcomponentes[i].desc_subcomponente != null && data.subcomponentes[i].desc_subcomponente.length > 0) {
					sql += `
						,[desc_subcomponente] = '${data.subcomponentes[i].desc_subcomponente}'`
				} else {
					sql += `
						,[desc_subcomponente] = NULL`
				}

				sql += `						
					WHERE [cod_subcomponente] = ${data.subcomponentes[i].cod_subcomponente}
				`

			} else {

				sql += `
					INSERT INTO [NOG_T].[dbo].[t_pym_subcomponentes]
							([cod_componente]
							,[nro_subcomponente]
							,[nombre_subcomponente]`

				if (data.subcomponentes[i].desc_subcomponente != null)
					sql += `
							,[desc_subcomponente]`

				sql += `
							,[cod_usuario])
						VALUES
							(${data.subcomponentes[i].cod_componente}
							,${data.subcomponentes[i].nro_subcomponente}
							,'${data.subcomponentes[i].nombre_subcomponente}'`

				if (data.subcomponentes[i].desc_subcomponente != null)
					sql += `
						,'${data.subcomponentes[i].desc_subcomponente}'`

				sql += `
						,${data.cod_usuario})
				`

			}

		}

		connection.query(config, sql, (result) => {
			callback(result.rowsAffected)
		})

	},
	obtenerIndicadoresProductos: (config, cod_operacion, callback) => {

		let sql = `
			SELECT	cod_ind_prod
					,CASE 
						WHEN ind_pro.cod_componente IS NULL THEN '2-' + CONVERT(NVARCHAR(10),sub.cod_subcomponente)
						WHEN ind_pro.cod_subcomponente IS NULL THEN '1-' + CONVERT(NVARCHAR(10),comp2.cod_componente)
					END AS 'cod_comp_sub'
					,nombre_ind_prod
					,descripcion_ind_prod
				FROM NOG_T.dbo.t_pym_indicadores_productos AS ind_pro
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_pro.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_pro.cod_componente
				WHERE comp.cod_operacion = ${cod_operacion} OR comp2.cod_operacion = ${cod_operacion}
				
			SELECT	'1-' + CONVERT(NVARCHAR(10),cod_componente) AS 'codigo'
					,nro_componente AS 'nro'
				FROM NOG_T.dbo.t_pym_componentes
				WHERE cod_operacion = ${cod_operacion}
			UNION
			SELECT	'2-' + CONVERT(NVARCHAR(10),cod_subcomponente)
					,nro_subcomponente
				FROM NOG_T.dbo.t_pym_componentes AS comp
					INNER JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_componente = comp.cod_componente
				WHERE cod_operacion = ${cod_operacion}
			ORDER BY nro
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	guardarIndicadoresProductos: (config, data, callback) => {

		/*
			data.fuente, tiene el código de la fuente de financiamiento para distinguir si el BM o BID
			el código cod_comp_sub, esta compuesto por #-codigo, el # representa el tipo de registro para el código
				1 para componente
				2 para subcomponente
				codigo es el código del componente o subcomponente
		*/
		let sql = ''

		for (let i = 0, len = data.indc_prod.length; i < len; i++) {

			let array = data.indc_prod[i].cod_comp_sub.split('-'),
				tipo = array[0],
				codigo = array[1]

			if (data.indc_prod[i].cod_ind_prod != null) {

				sql += `
					UPDATE [NOG_T].[dbo].[t_pym_indicadores_productos]
						SET [nombre_ind_prod] = '${data.indc_prod[i].nombre_ind_prod}'`


				if (data.indc_prod[i].descripcion_ind_prod != null && data.indc_prod[i].descripcion_ind_prod.length > 0) {
					sql += `
								,[descripcion_ind_prod] = '${data.indc_prod[i].descripcion_ind_prod}'`
				} else {
					sql += `
								,[descripcion_ind_prod] = NULL`
				}

				if (tipo == 1) {
					sql += `
								,[cod_componente] = ${codigo}
								,[cod_subcomponente] = NULL`
				} else {
					sql += `
								,[cod_componente] = NULL
								,[cod_subcomponente] = ${codigo}`
				}

				sql += `
						WHERE [cod_ind_prod] = ${data.indc_prod[i].cod_ind_prod}
				`

			} else {

				sql += `
					INSERT INTO [NOG_T].[dbo].[t_pym_indicadores_productos]
							([nombre_ind_prod]`

				if (data.indc_prod[i].descripcion_ind_prod != null && data.indc_prod[i].descripcion_ind_prod.length > 0) {
					sql += `
								,[descripcion_ind_prod]
					`
				}

				if (tipo == 1) {
					sql += `
								,[cod_componente]`
				} else {
					sql += `
								,[cod_subcomponente]`
				}

				sql += `
							,[cod_usuario])
						VALUES
							('${data.indc_prod[i].nombre_ind_prod}'`

				if (data.indc_prod[i].descripcion_ind_prod != null && data.indc_prod[i].descripcion_ind_prod.length > 0) {
					sql += `
								,'${data.indc_prod[i].descripcion_ind_prod}'
					`
				}

				sql += `
							,${codigo}
							,${data.cod_usuario})
				`
			}
		}

		connection.query(config, sql, (result) => {
			callback(result.rowsAffected)
		})

	},
	/////////////////////////////////////////////////////////////
	//POA/PEP
	//----------------------------------------------------------
	//Actvidades
	obtenerDatosActividades: (config, callback) => {

		let sql = `
			SELECT 	cod_operacion
					,nro_operacion
					,cod_organismo_financiero
				FROM NOG_T.dbo.t_pym_operaciones
			
			SELECT DISTINCT nombre_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			
			SELECT cod_direccion, nombre_direccion, responsable_direccion
				FROM NOG_T.dbo.t_pym_direcciones
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	obtenerActividades: (config, filtros, callback) => {

		let sql = `
			SELECT	'1-' + CONVERT(NVARCHAR(10),cod_componente) AS 'cod_componente'
					,nro_componente
				FROM NOG_T.dbo.t_pym_componentes
				WHERE cod_operacion = ${filtros.cod_operacion}

			SELECT	'2-' + CONVERT(NVARCHAR(10),cod_subcomponente) AS 'cod_subcomponente'
					,'1-' + CONVERT(NVARCHAR(10),comp.cod_componente) AS 'cod_componente'
					,nro_subcomponente
				FROM NOG_T.dbo.t_pym_subcomponentes AS sub
					INNER JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
				WHERE comp.cod_operacion = ${filtros.cod_operacion}

			SELECT	cod_ind_prod
					,CASE 
						WHEN ind_pro.cod_componente IS NULL THEN '2-' + CONVERT(NVARCHAR(10),sub.cod_subcomponente)
						WHEN ind_pro.cod_subcomponente IS NULL THEN '1-' + CONVERT(NVARCHAR(10),comp2.cod_componente)
					END AS 'cod_comp_sub'
					,nombre_ind_prod
					,descripcion_ind_prod
				FROM NOG_T.dbo.t_pym_indicadores_productos AS ind_pro
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_pro.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_pro.cod_componente
				WHERE comp.cod_operacion = ${filtros.cod_operacion} OR comp2.cod_operacion = ${filtros.cod_operacion}
		
				SELECT	act.cod_actividad, act.actividad_vencidas
						,CASE
							WHEN comp.cod_componente IS NOT NULL THEN '1-' + CONVERT(NVARCHAR(10),comp.cod_componente)
							WHEN comp2.cod_componente IS NOT NULL THEN '1-' + CONVERT(NVARCHAR(10),comp2.cod_componente)
						END AS 'cod_componente'
						,CASE
							WHEN comp.cod_componente IS NOT NULL THEN '2-' + CONVERT(NVARCHAR(10),sub.cod_subcomponente)
							ELSE NULL
						END AS 'cod_subcomponente'
						,CASE 
							WHEN ind_pro.cod_componente IS NULL THEN '2-' + CONVERT(NVARCHAR(10),sub.cod_subcomponente)
							WHEN ind_pro.cod_subcomponente IS NULL THEN '1-' + CONVERT(NVARCHAR(10),comp2.cod_componente)
						END AS 'cod_comp_sub'
						,ind_pro.cod_ind_prod
						,act.nro_orden_actividad
						,act.nro_actividad
						,act.nombre_actividad
						,act.fecha_inicio_actividad
						,act.fecha_fin_actividad
						,dir.nombre_direccion
						,dir.cod_direccion
						,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
						,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12					
					FROM NOG_T.dbo.t_pym_actividades AS act
						INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_pro ON ind_pro.cod_ind_prod = act.cod_ind_prod
						INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
						LEFT JOIN (
							SELECT	act.cod_actividad
								,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_01'
								,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
								,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_02'
								,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
								,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_03'
								,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
								,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_04'
								,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
								,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_05'
								,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
								,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_06'
								,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
								,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_07'
								,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
								,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_08'
								,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
								,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_09'
								,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
								,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_10'
								,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
								,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_11'
								,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
								,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_12'
								,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
							FROM NOG_T.dbo.t_glo_meses AS meses
								LEFT JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
								INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
							WHERE pagos.estado_pago = 1
								AND act.estado_actividad = 1
								AND act.año_actividad = ${filtros.año_actividad}
							GROUP BY act.cod_actividad
						) MESES_PAGOS ON MESES_PAGOS.cod_actividad = act.cod_actividad
						LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_pro.cod_subcomponente
						LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
						LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_pro.cod_componente
					WHERE act.estado_actividad = 1
						AND act.año_actividad = ${filtros.año_actividad}
						AND (comp.cod_operacion = ${filtros.cod_operacion} OR comp2.cod_operacion = ${filtros.cod_operacion})
					ORDER BY nro_actividad
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	guardarActividades: (config, data, callback) => {

		let sql = `
			DECLARE @actividad INT
		`
		let actividades = (data.keys.length == 0) ? "0" : ""
		function insertPago(tipoMonto, mes, monto) {

			if (monto) {
				sql += `
						INSERT INTO NOG_T.dbo.t_pym_pagos_actividades ([cod_actividad],[cod_mes],[cod_tipo_monto],[monto_pago],[estado_pago],[cod_usuario])
							VALUES (@actividad,${mes},${tipoMonto},${monto},1,${data.cod_usuario})
					`
			} else {
				sql += `
						INSERT INTO NOG_T.dbo.t_pym_pagos_actividades ([cod_actividad],[cod_mes],[cod_tipo_monto],[estado_pago],[cod_usuario])
							VALUES (@actividad,${mes},${tipoMonto},0,${data.cod_usuario})
					`
			}

		}

		function updatePago(codActividad, tipoMonto, mes, monto) {

			if (monto) {
				sql += `
					UPDATE [NOG_T].[dbo].[t_pym_pagos_actividades]
						SET [monto_pago] = ${monto}
							,[estado_pago] = 1
						WHERE [cod_actividad] = ${codActividad}
							AND [cod_mes] = ${mes}
							AND [cod_tipo_monto] = ${tipoMonto}
				`
			} else {
				sql += `
					UPDATE [NOG_T].[dbo].[t_pym_pagos_actividades]
						SET [monto_pago] = NULL
							,[estado_pago] = 0
						WHERE [cod_actividad] = ${codActividad}
							AND [cod_mes] = ${mes}
							AND [cod_tipo_monto] = ${tipoMonto}
				`
			}

		}



		for (let i = 0, len = data.actividades.length; i < len; i++) {

			if (data.actividades[i].cod_actividad != null) {

				sql += `
					UPDATE [dbo].[t_pym_actividades]
						SET [cod_ind_prod] = ${data.actividades[i].cod_ind_prod}
							,[cod_direccion] = ${data.actividades[i].cod_direccion}`

				if (data.actividades[i].nro_orden_actividad) {
					sql += `
							,[nro_orden_actividad] = ${data.actividades[i].nro_orden_actividad}`
				}

				sql += `
							,[nro_actividad] = '${data.actividades[i].nro_actividad}'
							,[nombre_actividad] = '${data.actividades[i].nombre_actividad}'
							,[fecha_inicio_actividad] = '${data.actividades[i].fecha_inicio_actividad}'
							,[fecha_fin_actividad] = '${data.actividades[i].fecha_fin_actividad}'
							,[año_actividad] = ${data.filtros.año_actividad}
						WHERE [cod_actividad] = ${data.actividades[i].cod_actividad}
				`

				//PROGRAMADO
				updatePago(data.actividades[i].cod_actividad, 1, 1, data.actividades[i].prog_01)
				updatePago(data.actividades[i].cod_actividad, 1, 2, data.actividades[i].prog_02)
				updatePago(data.actividades[i].cod_actividad, 1, 3, data.actividades[i].prog_03)
				updatePago(data.actividades[i].cod_actividad, 1, 4, data.actividades[i].prog_04)
				updatePago(data.actividades[i].cod_actividad, 1, 5, data.actividades[i].prog_05)
				updatePago(data.actividades[i].cod_actividad, 1, 6, data.actividades[i].prog_06)
				updatePago(data.actividades[i].cod_actividad, 1, 7, data.actividades[i].prog_07)
				updatePago(data.actividades[i].cod_actividad, 1, 8, data.actividades[i].prog_08)
				updatePago(data.actividades[i].cod_actividad, 1, 9, data.actividades[i].prog_09)
				updatePago(data.actividades[i].cod_actividad, 1, 10, data.actividades[i].prog_10)
				updatePago(data.actividades[i].cod_actividad, 1, 11, data.actividades[i].prog_11)
				updatePago(data.actividades[i].cod_actividad, 1, 12, data.actividades[i].prog_12)

				//EJECUTADO
				updatePago(data.actividades[i].cod_actividad, 2, 1, data.actividades[i].ejec_01)
				updatePago(data.actividades[i].cod_actividad, 2, 2, data.actividades[i].ejec_02)
				updatePago(data.actividades[i].cod_actividad, 2, 3, data.actividades[i].ejec_03)
				updatePago(data.actividades[i].cod_actividad, 2, 4, data.actividades[i].ejec_04)
				updatePago(data.actividades[i].cod_actividad, 2, 5, data.actividades[i].ejec_05)
				updatePago(data.actividades[i].cod_actividad, 2, 6, data.actividades[i].ejec_06)
				updatePago(data.actividades[i].cod_actividad, 2, 7, data.actividades[i].ejec_07)
				updatePago(data.actividades[i].cod_actividad, 2, 8, data.actividades[i].ejec_08)
				updatePago(data.actividades[i].cod_actividad, 2, 9, data.actividades[i].ejec_09)
				updatePago(data.actividades[i].cod_actividad, 2, 10, data.actividades[i].ejec_10)
				updatePago(data.actividades[i].cod_actividad, 2, 11, data.actividades[i].ejec_11)
				updatePago(data.actividades[i].cod_actividad, 2, 12, data.actividades[i].ejec_12)

			} else {

				sql += `
					INSERT INTO [NOG_T].[dbo].[t_pym_actividades]
						([cod_ind_prod]
						,[cod_direccion]`

				if (data.actividades[i].nro_orden_actividad) {
					sql += `
						,[nro_orden_actividad]`
				}
				/////////////////////////////////////////////////INGRESAR EL VALOR DEL CHECK /////////////////////////////////////////
				sql += `
						,[nro_actividad]
						,[nombre_actividad]
						,[fecha_inicio_actividad]
						,[fecha_fin_actividad]
						,[año_actividad]
						,[cod_usuario]
						)
					VALUES
						(${data.actividades[i].cod_ind_prod},
						${data.actividades[i].cod_direccion}
						`

				if (data.actividades[i].nro_orden_actividad) {
					sql += `
							,${data.actividades[i].nro_orden_actividad}`
				}

				sql += `
						,'${data.actividades[i].nro_actividad}'
						,'${data.actividades[i].nombre_actividad}'
						,'${data.actividades[i].fecha_inicio_actividad}'
						,'${data.actividades[i].fecha_fin_actividad}'
						,${data.filtros.año_actividad}
						,${data.cod_usuario})
				
					SET @actividad =  @@IDENTITY
				`

				//PROGRAMADO
				insertPago(1, 1, data.actividades[i].prog_01)
				insertPago(1, 2, data.actividades[i].prog_02)
				insertPago(1, 3, data.actividades[i].prog_03)
				insertPago(1, 4, data.actividades[i].prog_04)
				insertPago(1, 5, data.actividades[i].prog_05)
				insertPago(1, 6, data.actividades[i].prog_06)
				insertPago(1, 7, data.actividades[i].prog_07)
				insertPago(1, 8, data.actividades[i].prog_08)
				insertPago(1, 9, data.actividades[i].prog_09)
				insertPago(1, 10, data.actividades[i].prog_10)
				insertPago(1, 11, data.actividades[i].prog_11)
				insertPago(1, 12, data.actividades[i].prog_12)

				//EJECUTADO
				insertPago(2, 1, data.actividades[i].ejec_01)
				insertPago(2, 2, data.actividades[i].ejec_02)
				insertPago(2, 3, data.actividades[i].ejec_03)
				insertPago(2, 4, data.actividades[i].ejec_04)
				insertPago(2, 5, data.actividades[i].ejec_05)
				insertPago(2, 6, data.actividades[i].ejec_06)
				insertPago(2, 7, data.actividades[i].ejec_07)
				insertPago(2, 8, data.actividades[i].ejec_08)
				insertPago(2, 9, data.actividades[i].ejec_09)
				insertPago(2, 10, data.actividades[i].ejec_10)
				insertPago(2, 11, data.actividades[i].ejec_11)
				insertPago(2, 12, data.actividades[i].ejec_12)

			}
		}


		for (let i = 0, len = data.keys.length; i < len; i++) {

			actividades = (i == 0) ? actividades + data.keys[i] : actividades + "," + data.keys[i];
		}

		sql += `
					UPDATE NOG_T.DBO.T_PYM_ACTIVIDADES 
						SET ACTIVIDAD_VENCIDAS = CASE 
													WHEN COD_ACTIVIDAD IN ( ${actividades}) THEN 1
													ELSE 0
											END 
					WHERE COD_ACTIVIDAD IN (
						
											SELECT DISTINCT act.cod_actividad 
											FROM NOG_T.dbo.t_pym_actividades AS act
													INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_pro ON ind_pro.cod_ind_prod = act.cod_ind_prod
													INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
													LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_pro.cod_subcomponente
													LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
													LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_pro.cod_componente
											WHERE act.estado_actividad = 1
													AND act.año_actividad = ${data.filtros.año_actividad}
													AND (comp.cod_operacion = ${data.filtros.cod_operacion} OR comp2.cod_operacion = ${data.filtros.cod_operacion})
						
					)
	
	    `

		connection.query(config, sql, (result) => {

			callback(result.rowsAffected)
		})

	},
	eliminarActividad: (config, codigo, callback) => {

		let sql = `
			UPDATE [NOG_T].[dbo].[t_pym_actividades]
				SET [estado_actividad] = 0
				WHERE [cod_actividad] = ${codigo}
		`

		connection.query(config, sql, (result) => {
			callback(result.rowsAffected[0])
		})
	},
	/////////////////////////////////////////////////////////////
	//REPORTES
	//----------------------------------------------------------
	//Resumen
	obtenerDatosResumenPrograma: (config, callback) => {

		let sql = `
			SELECT	cod_organismo_financiero
					,abrev_organismo_financiero
				FROM NOG_T.dbo.t_pym_organismos_financieros

			SELECT	cod_operacion
					,nro_operacion
				FROM NOG_T.dbo.t_pym_operaciones

			SELECT DISTINCT nombre_direccion
				FROM NOG_T.dbo.t_pym_direcciones

			SELECT	año_actividad
					,SUM(CASE WHEN pagos.cod_tipo_monto = 1 AND estado_pago = 1 AND monto_pago IS NOT NULL THEN monto_pago ELSE 0 END) AS 'monto_programado'
					,SUM(CASE WHEN pagos.cod_tipo_monto = 2 AND estado_pago = 1 AND monto_pago IS NOT NULL THEN monto_pago ELSE 0 END) AS 'monto_ejecutado'
					,( (SUM(CASE WHEN pagos.cod_tipo_monto = 2 AND estado_pago = 1 AND monto_pago IS NOT NULL THEN monto_pago ELSE 0 END) * 100) 
						/ SUM(CASE WHEN pagos.cod_tipo_monto = 1 AND estado_pago = 1 AND monto_pago IS NOT NULL THEN monto_pago ELSE 0 END) ) AS 'porc_ejecucion'
				FROM NOG_T.dbo.t_pym_actividades AS act
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
				WHERE act.estado_actividad = 1
				GROUP BY act.año_actividad
			
			SELECT año_actividad, desc_mes
				FROM (
					SELECT	ROW_NUMBER() OVER(PARTITION BY act.año_actividad ORDER BY mes.cod_mes DESC) AS 'nro'
							,act.año_actividad
							,mes.cod_mes
							,mes.desc_mes
						FROM NOG_T.dbo.t_pym_actividades AS act
							INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
							INNER JOIN NOG_T.dbo.t_glo_meses AS mes ON mes.cod_mes = pagos.cod_mes
						WHERE act.estado_actividad = 1 AND pagos.cod_tipo_monto = 2 AND pagos.monto_pago IS NOT NULL
				) TMP
				WHERE nro = 1
				ORDER BY cod_mes DESC
			
			DECLARE @año INT
			SET @año = CASE WHEN MONTH(GETDATE()) = 1 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END
			
			SELECT	ope.nro_operacion
					,SUM(CASE WHEN pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejecutado'
					,SUM(CASE WHEN pagos.cod_mes = 1 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_01'
					,SUM(CASE WHEN pagos.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
					,SUM(CASE WHEN pagos.cod_mes = 2 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_02'
					,SUM(CASE WHEN pagos.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
					,SUM(CASE WHEN pagos.cod_mes = 3 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_03'
					,SUM(CASE WHEN pagos.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
					,SUM(CASE WHEN pagos.cod_mes = 4 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_04'
					,SUM(CASE WHEN pagos.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
					,SUM(CASE WHEN pagos.cod_mes = 5 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_05'
					,SUM(CASE WHEN pagos.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
					,SUM(CASE WHEN pagos.cod_mes = 6 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_06'
					,SUM(CASE WHEN pagos.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
					,SUM(CASE WHEN pagos.cod_mes = 7 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_07'
					,SUM(CASE WHEN pagos.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
					,SUM(CASE WHEN pagos.cod_mes = 8 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_08'
					,SUM(CASE WHEN pagos.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
					,SUM(CASE WHEN pagos.cod_mes = 9 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_09'
					,SUM(CASE WHEN pagos.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
					,SUM(CASE WHEN pagos.cod_mes = 10 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_10'
					,SUM(CASE WHEN pagos.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
					,SUM(CASE WHEN pagos.cod_mes = 11 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_11'
					,SUM(CASE WHEN pagos.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
					,SUM(CASE WHEN pagos.cod_mes = 12 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_12'
					,SUM(CASE WHEN pagos.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
				FROM NOG_T.dbo.t_pym_pagos_actividades AS pagos
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
						ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
				WHERE act.estado_actividad = 1
					AND act.año_actividad =	@año
				GROUP BY ope.nro_operacion
			
			SELECT @año AS 'año'
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	obtenerResumenPrograma: (config, filtros, callback) => {

		let sql

		if (filtros.cod_organismo_financiero || filtros.cod_operacion || filtros.año_actividad)
			sql = `
				SELECT ope.nro_operacion
			`

		if (filtros.nombre_direccion)
			sql = `
				SELECT dir.nombre_direccion
			`

		sql += `
					,SUM(CASE WHEN pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejecutado'
					,SUM(CASE WHEN pagos.cod_mes = 1 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_01'
					,SUM(CASE WHEN pagos.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
					,SUM(CASE WHEN pagos.cod_mes = 2 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_02'
					,SUM(CASE WHEN pagos.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
					,SUM(CASE WHEN pagos.cod_mes = 3 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_03'
					,SUM(CASE WHEN pagos.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
					,SUM(CASE WHEN pagos.cod_mes = 4 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_04'
					,SUM(CASE WHEN pagos.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
					,SUM(CASE WHEN pagos.cod_mes = 5 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_05'
					,SUM(CASE WHEN pagos.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
					,SUM(CASE WHEN pagos.cod_mes = 6 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_06'
					,SUM(CASE WHEN pagos.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
					,SUM(CASE WHEN pagos.cod_mes = 7 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_07'
					,SUM(CASE WHEN pagos.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
					,SUM(CASE WHEN pagos.cod_mes = 8 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_08'
					,SUM(CASE WHEN pagos.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
					,SUM(CASE WHEN pagos.cod_mes = 9 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_09'
					,SUM(CASE WHEN pagos.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
					,SUM(CASE WHEN pagos.cod_mes = 10 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_10'
					,SUM(CASE WHEN pagos.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
					,SUM(CASE WHEN pagos.cod_mes = 11 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_11'
					,SUM(CASE WHEN pagos.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
					,SUM(CASE WHEN pagos.cod_mes = 12 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_12'
					,SUM(CASE WHEN pagos.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
				FROM NOG_T.dbo.t_pym_pagos_actividades AS pagos
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
						ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
				WHERE act.estado_actividad = 1`

		if (filtros.cod_organismo_financiero)
			sql += `
						AND ope.cod_organismo_financiero = ${filtros.cod_organismo_financiero}
			`

		if (filtros.cod_operacion)
			sql += `
						AND ope.cod_operacion = ${filtros.cod_operacion}
			`

		if (filtros.nombre_direccion)
			sql += `
						AND dir.nombre_direccion = '${filtros.nombre_direccion}'
			`

		if (filtros.año_actividad)
			sql += `		
						AND act.año_actividad = ${filtros.año_actividad}
			`

		if (filtros.nombre_direccion) {
			sql += `
				GROUP BY dir.nombre_direccion
			`
		} else if (filtros.cod_organismo_financiero || filtros.cod_operacion || filtros.año_actividad) {
			sql += `
				GROUP BY ope.nro_operacion
			`
		}

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},
	obtenerDetalleActividades: (config, filtros, callback) => {

		let sql = `
			DECLARE @mes INT
			SET @mes = ${filtros.cod_mes};
			
			SELECT	act.cod_actividad
					,act.nombre_actividad
					,SUM(CASE WHEN pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN pagos.cod_mes <= @mes AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejecutado'
					,SUM(CASE WHEN pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END)
						- SUM(CASE WHEN pagos.cod_mes <= @mes AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'diferencia'
					,CONVERT(NVARCHAR(10), act.fecha_inicio_actividad, 103) AS 'fecha_inicio_actividad'
					,CONVERT(NVARCHAR(10), act.fecha_fin_actividad, 103) AS 'fecha_fin_actividad'
					,ope.nro_operacion
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				FROM NOG_T.dbo.t_pym_actividades AS act
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS indi_prod ON indi_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = indi_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = indi_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
						ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
					INNER JOIN (
						SELECT	act.cod_actividad
								,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_01'
								,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
								,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_02'
								,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
								,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_03'
								,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
								,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_04'
								,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
								,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_05'
								,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
								,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_06'
								,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
								,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_07'
								,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
								,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_08'
								,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
								,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_09'
								,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
								,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_10'
								,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
								,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_11'
								,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
								,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_12'
								,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
							FROM NOG_T.dbo.t_glo_meses AS meses
								LEFT JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
								INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
								INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
							--WHERE dir.cod_direccion = ${filtros.cod_direccion}
							WHERE dir.nombre_direccion = '${filtros.nombre_direccion}'
								AND act.año_actividad = ${filtros.año}
							GROUP BY act.cod_actividad
					) MESES ON MESES.cod_actividad = act.cod_actividad
				WHERE act.estado_actividad = 1
					--AND dir.cod_direccion = ${filtros.cod_direccion}
					AND dir.nombre_direccion = '${filtros.nombre_direccion}'
					AND ope.cod_operacion = ${filtros.cod_operacion}
					AND act.año_actividad = ${filtros.año}
				GROUP BY act.cod_actividad,nombre_actividad,act.fecha_inicio_actividad,act.fecha_fin_actividad,ope.nro_operacion
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
			
			SELECT	ROW_NUMBER() OVER(ORDER BY dir.nombre_direccion ASC) AS 'cod_direccion'
					,dir.nombre_direccion
					,CASE
						WHEN @mes = 1 THEN MESES_PAGOS.prog_01
						WHEN @mes = 2 THEN MESES_PAGOS.prog_02
						WHEN @mes = 3 THEN MESES_PAGOS.prog_03
						WHEN @mes = 4 THEN MESES_PAGOS.prog_04
						WHEN @mes = 5 THEN MESES_PAGOS.prog_05
						WHEN @mes = 6 THEN MESES_PAGOS.prog_06
						WHEN @mes = 7 THEN MESES_PAGOS.prog_07
						WHEN @mes = 8 THEN MESES_PAGOS.prog_08
						WHEN @mes = 9 THEN MESES_PAGOS.prog_09
						WHEN @mes = 10 THEN MESES_PAGOS.prog_10
						WHEN @mes = 11 THEN MESES_PAGOS.prog_11
						WHEN @mes = 12 THEN MESES_PAGOS.prog_12
					END AS 'programado'
					,CASE
						WHEN @mes = 1 THEN MESES_PAGOS.ejec_01
						WHEN @mes = 2 THEN MESES_PAGOS.ejec_02
						WHEN @mes = 3 THEN MESES_PAGOS.ejec_03
						WHEN @mes = 4 THEN MESES_PAGOS.ejec_04
						WHEN @mes = 5 THEN MESES_PAGOS.ejec_05
						WHEN @mes = 6 THEN MESES_PAGOS.ejec_06
						WHEN @mes = 7 THEN MESES_PAGOS.ejec_07
						WHEN @mes = 8 THEN MESES_PAGOS.ejec_08
						WHEN @mes = 9 THEN MESES_PAGOS.ejec_09
						WHEN @mes = 10 THEN MESES_PAGOS.ejec_10
						WHEN @mes = 11 THEN MESES_PAGOS.ejec_11
						WHEN @mes = 12 THEN MESES_PAGOS.ejec_12
					END AS 'ejecutado'
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				FROM NOG_T.dbo.t_pym_tipos_direcciones AS tipos
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_tipo_direccion = tipos.cod_tipo_direccion
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_direccion = dir.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
					INNER JOIN (
						SELECT	dir.nombre_direccion
							,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_01'
							,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
							,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_02'
							,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
							,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_03'
							,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
							,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_04'
							,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
							,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_05'
							,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
							,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_06'
							,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
							,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_07'
							,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
							,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_08'
							,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
							,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_09'
							,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
							,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_10'
							,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
							,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_11'
							,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
							,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_12'
							,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
						FROM NOG_T.dbo.t_glo_meses AS meses
							LEFT JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
							INNER JOIN NOG_T.dbo.t_glo_tipos_montos AS montos ON montos.cod_tipo_monto = pagos.cod_tipo_monto
							INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
							INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
						WHERE pagos.estado_pago = 1
							AND act.estado_actividad = 1
							AND act.año_actividad = ${filtros.año}
						GROUP BY dir.nombre_direccion
					) MESES_PAGOS ON MESES_PAGOS.nombre_direccion = dir.nombre_direccion
				WHERE act.estado_actividad = 1 AND pagos.estado_pago = 1
					AND act.año_actividad = ${filtros.año}
					AND pagos.cod_mes = ${filtros.cod_mes}
				GROUP BY dir.nombre_direccion
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				ORDER BY dir.nombre_direccion
						
			SELECT 	[desc_mes]
				FROM [NOG_T].[dbo].[t_glo_meses]
				WHERE [cod_mes] = @mes
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	obtenerDatosDetalleDireccion: (config, callback) => {

		let sql = `

			DECLARE @mes INT
			DECLARE @año INT
			
			SET @mes = CASE WHEN MONTH(GETDATE()) = 1 THEN 12 ELSE MONTH(GETDATE()) - 1 END
			SET @año = CASE WHEN MONTH(GETDATE()) = 1 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END
			
			SELECT	ROW_NUMBER() OVER(ORDER BY dir.nombre_direccion ASC) AS 'cod_direccion'
					,dir.nombre_direccion
					,CASE
						WHEN @mes = 1 THEN MESES_PAGOS.prog_01
						WHEN @mes = 2 THEN MESES_PAGOS.prog_02
						WHEN @mes = 3 THEN MESES_PAGOS.prog_03
						WHEN @mes = 4 THEN MESES_PAGOS.prog_04
						WHEN @mes = 5 THEN MESES_PAGOS.prog_05
						WHEN @mes = 6 THEN MESES_PAGOS.prog_06
						WHEN @mes = 7 THEN MESES_PAGOS.prog_07
						WHEN @mes = 8 THEN MESES_PAGOS.prog_08
						WHEN @mes = 9 THEN MESES_PAGOS.prog_09
						WHEN @mes = 10 THEN MESES_PAGOS.prog_10
						WHEN @mes = 11 THEN MESES_PAGOS.prog_11
						WHEN @mes = 12 THEN MESES_PAGOS.prog_12
					END AS 'programado'
					,CASE
						WHEN @mes = 1 THEN MESES_PAGOS.ejec_01
						WHEN @mes = 2 THEN MESES_PAGOS.ejec_02
						WHEN @mes = 3 THEN MESES_PAGOS.ejec_03
						WHEN @mes = 4 THEN MESES_PAGOS.ejec_04
						WHEN @mes = 5 THEN MESES_PAGOS.ejec_05
						WHEN @mes = 6 THEN MESES_PAGOS.ejec_06
						WHEN @mes = 7 THEN MESES_PAGOS.ejec_07
						WHEN @mes = 8 THEN MESES_PAGOS.ejec_08
						WHEN @mes = 9 THEN MESES_PAGOS.ejec_09
						WHEN @mes = 10 THEN MESES_PAGOS.ejec_10
						WHEN @mes = 11 THEN MESES_PAGOS.ejec_11
						WHEN @mes = 12 THEN MESES_PAGOS.ejec_12
					END AS 'ejecutado'
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				FROM NOG_T.dbo.t_pym_tipos_direcciones AS tipos
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_tipo_direccion = tipos.cod_tipo_direccion
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_direccion = dir.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
					INNER JOIN (
						SELECT	dir.nombre_direccion
							,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_01'
							,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
							,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_02'
							,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
							,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_03'
							,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
							,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_04'
							,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
							,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_05'
							,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
							,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_06'
							,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
							,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_07'
							,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
							,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_08'
							,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
							,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_09'
							,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
							,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_10'
							,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
							,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_11'
							,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
							,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_12'
							,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
						FROM NOG_T.dbo.t_glo_meses AS meses
							LEFT JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
							INNER JOIN NOG_T.dbo.t_glo_tipos_montos AS montos ON montos.cod_tipo_monto = pagos.cod_tipo_monto
							INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
							INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
						WHERE pagos.estado_pago = 1
							AND act.estado_actividad = 1
							AND act.año_actividad = @año
						GROUP BY dir.nombre_direccion
					) MESES_PAGOS ON MESES_PAGOS.nombre_direccion = dir.nombre_direccion
				WHERE act.estado_actividad = 1
					AND pagos.estado_pago = 1
					AND act.año_actividad = @año
				GROUP BY dir.nombre_direccion
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				ORDER BY nombre_direccion
			
			SELECT 	[desc_mes]
				FROM [NOG_T].[dbo].[t_glo_meses]
				WHERE [cod_mes] = @mes

			/*
			SELECT cod_direccion, cod_tipo_direccion, nombre_direccion, responsable_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			*/
			SELECT DISTINCT nombre_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			
			SELECT 	cod_operacion
					,nro_operacion
				FROM NOG_T.dbo.t_pym_operaciones AS oper
			
			SELECT 	[cod_mes]
					,[desc_mes]
				FROM [NOG_T].[dbo].[t_glo_meses]
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	obtenerDatosAcumuladoDireccion: (config, callback) => {
		let sql = `

			DECLARE @mes INT
			DECLARE @año INT
			
			SET @mes = CASE WHEN MONTH(GETDATE()) = 1 THEN 12 ELSE MONTH(GETDATE()) - 1 END
			SET @año = CASE WHEN MONTH(GETDATE()) = 1 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END
			
			SELECT	ROW_NUMBER() OVER(ORDER BY dir.nombre_direccion ASC) AS 'cod_direccion'
					,dir.nombre_direccion
					,CASE
						WHEN @mes = 1 THEN MESES_PAGOS.prog_01
						WHEN @mes = 2 THEN MESES_PAGOS.prog_02
						WHEN @mes = 3 THEN MESES_PAGOS.prog_03
						WHEN @mes = 4 THEN MESES_PAGOS.prog_04
						WHEN @mes = 5 THEN MESES_PAGOS.prog_05
						WHEN @mes = 6 THEN MESES_PAGOS.prog_06
						WHEN @mes = 7 THEN MESES_PAGOS.prog_07
						WHEN @mes = 8 THEN MESES_PAGOS.prog_08
						WHEN @mes = 9 THEN MESES_PAGOS.prog_09
						WHEN @mes = 10 THEN MESES_PAGOS.prog_10
						WHEN @mes = 11 THEN MESES_PAGOS.prog_11
						WHEN @mes = 12 THEN MESES_PAGOS.prog_12
					END AS 'programado'
					,CASE
						WHEN @mes = 1 THEN MESES_PAGOS.ejec_01
						WHEN @mes = 2 THEN MESES_PAGOS.ejec_02
						WHEN @mes = 3 THEN MESES_PAGOS.ejec_03
						WHEN @mes = 4 THEN MESES_PAGOS.ejec_04
						WHEN @mes = 5 THEN MESES_PAGOS.ejec_05
						WHEN @mes = 6 THEN MESES_PAGOS.ejec_06
						WHEN @mes = 7 THEN MESES_PAGOS.ejec_07
						WHEN @mes = 8 THEN MESES_PAGOS.ejec_08
						WHEN @mes = 9 THEN MESES_PAGOS.ejec_09
						WHEN @mes = 10 THEN MESES_PAGOS.ejec_10
						WHEN @mes = 11 THEN MESES_PAGOS.ejec_11
						WHEN @mes = 12 THEN MESES_PAGOS.ejec_12
					END AS 'ejecutado'
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				FROM NOG_T.dbo.t_pym_tipos_direcciones AS tipos
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_tipo_direccion = tipos.cod_tipo_direccion
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_direccion = dir.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
					INNER JOIN (
						SELECT	dir.nombre_direccion
							,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_01'
							,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
							,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_02'
							,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
							,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_03'
							,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
							,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_04'
							,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
							,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_05'
							,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
							,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_06'
							,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
							,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_07'
							,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
							,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_08'
							,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
							,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_09'
							,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
							,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_10'
							,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
							,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_11'
							,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
							,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_12'
							,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
						FROM NOG_T.dbo.t_glo_meses AS meses
							LEFT JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
							INNER JOIN NOG_T.dbo.t_glo_tipos_montos AS montos ON montos.cod_tipo_monto = pagos.cod_tipo_monto
							INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
							INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
						WHERE pagos.estado_pago = 1
							AND act.estado_actividad = 1
							AND act.año_actividad = @año
						GROUP BY dir.nombre_direccion
					) MESES_PAGOS ON MESES_PAGOS.nombre_direccion = dir.nombre_direccion
				WHERE act.estado_actividad = 1
					AND pagos.estado_pago = 1
					AND act.año_actividad = @año
				GROUP BY dir.nombre_direccion
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				ORDER BY nombre_direccion
			
			SELECT 	[desc_mes]
				FROM [NOG_T].[dbo].[t_glo_meses]
				WHERE [cod_mes] = @mes

			/*
			SELECT cod_direccion, cod_tipo_direccion, nombre_direccion, responsable_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			*/
			SELECT DISTINCT nombre_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			
			SELECT 	cod_operacion
					,nro_operacion
				FROM NOG_T.dbo.t_pym_operaciones AS oper
			
			SELECT 	[cod_mes]
					,[desc_mes]
				FROM [NOG_T].[dbo].[t_glo_meses]

			SELECT	dir.cod_direccion, dir.nombre_direccion, act.año_actividad, operaciones.cod_operacion, operaciones.nombre_operacion
			,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_01'
			,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
			,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_02'
			,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
			,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_03'
			,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
			,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_04'
			,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
			,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_05'
			,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
			,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_06'
			,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
			,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_07'
			,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
			,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_08'
			,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
			,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_09'
			,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
			,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_10'
			,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
			,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_11'
			,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
			,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_12'
			,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
			FROM NOG_T.dbo.t_glo_meses AS meses
			LEFT JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
			INNER JOIN NOG_T.dbo.t_glo_tipos_montos AS montos ON montos.cod_tipo_monto = pagos.cod_tipo_monto
			INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
			INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
			INNER JOIN NOG_T.dbo.t_pym_indicadores_productos as indicadores_productos ON indicadores_productos.cod_ind_prod = act.cod_ind_prod
			FULL JOIN NOG_T.dbo.t_pym_componentes as componentes ON componentes.cod_componente = indicadores_productos.cod_componente
			
			INNER JOIN NOG_T.dbo.t_pym_operaciones as operaciones ON operaciones.cod_operacion = componentes.cod_operacion
			--INNER JOIN NOG_T.dbo.t_pym_subcomponentes as subcomponentes ON subcomponentes.cod_subcomponente = indicadores_productos.cod_subcomponente
			WHERE pagos.estado_pago = 1
			AND act.estado_actividad = 1
			GROUP BY dir.nombre_direccion, act.año_actividad, dir.cod_direccion,operaciones.cod_operacion, operaciones.nombre_operacion
			ORDER BY nombre_direccion
			
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	obtenerActividadesPOAPEP: (config, filtros, callback) => {

		let sql = `
			SELECT	nro_orden_actividad
					,nro_actividad
					,nombre_actividad
					,fecha_inicio_actividad
					,fecha_fin_actividad
					,nombre_direccion
					,responsable_direccion
					,indi_prod.nombre_ind_prod
					,SUM(CASE WHEN cod_tipo_monto = 1 AND pagos.estado_pago = 1 THEN pagos.monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN cod_tipo_monto = 2 AND pagos.estado_pago = 1 THEN pagos.monto_pago ELSE 0 END) AS 'pagado'
					,SUM(CASE WHEN cod_tipo_monto = 1 AND pagos.estado_pago = 1 THEN pagos.monto_pago ELSE 0 END)
						- SUM(CASE WHEN cod_tipo_monto = 2 AND pagos.estado_pago = 1 THEN pagos.monto_pago ELSE 0 END) AS 'por_ejecutar'
					,ejec_01,ejec_02,ejec_03,ejec_04,ejec_05,ejec_06
					,ejec_07,ejec_08,ejec_09,ejec_10,ejec_11,ejec_12
				FROM NOG_T.dbo.t_pym_actividades AS act
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_tipos_direcciones AS tipo ON tipo.cod_tipo_direccion = dir.cod_tipo_direccion
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS indi_prod ON indi_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = indi_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = indi_prod.cod_componente
					INNER JOIN (
						SELECT	act.cod_actividad
							,SUM(CASE WHEN meses.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
							,SUM(CASE WHEN meses.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
							,SUM(CASE WHEN meses.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
							,SUM(CASE WHEN meses.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
							,SUM(CASE WHEN meses.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
							,SUM(CASE WHEN meses.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
							,SUM(CASE WHEN meses.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
							,SUM(CASE WHEN meses.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
							,SUM(CASE WHEN meses.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
							,SUM(CASE WHEN meses.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
							,SUM(CASE WHEN meses.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
							,SUM(CASE WHEN meses.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
						FROM NOG_T.dbo.t_glo_meses AS meses
							INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
							INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
						WHERE act.estado_actividad = 1
							--AND pagos.estado_pago = 1
							AND act.año_actividad = ${filtros.año_actividad}
						GROUP BY act.cod_actividad
					) MESES_PAGOS ON MESES_PAGOS.cod_actividad = act.cod_actividad
				WHERE act.estado_actividad = 1
					--AND pagos.estado_pago = 1
					AND act.año_actividad = ${filtros.año_actividad}
					AND (comp.cod_operacion = ${filtros.cod_operacion} OR comp2.cod_operacion = ${filtros.cod_operacion})
				GROUP BY act.cod_actividad, nro_actividad,
					nombre_actividad, fecha_inicio_actividad, fecha_fin_actividad, nombre_tipo_direccion,
					nombre_direccion, responsable_direccion, nro_subcomponente, act.fecha_ing_registro, nro_orden_actividad, indi_prod.nombre_ind_prod
					,ejec_01,ejec_02,ejec_03,ejec_04,ejec_05,ejec_06
					,ejec_07,ejec_08,ejec_09,ejec_10,ejec_11,ejec_12
				ORDER BY nro_orden_actividad, nro_actividad
		`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},

	////////////EJEMPLO REPORTE PRESUPUESTO EN RIESGO//////////////////
	obtenerDatosPresupuestoRiesgo: (config, callback) => {

		let sql = `
			SELECT	cod_organismo_financiero
					,abrev_organismo_financiero
				FROM NOG_T.dbo.t_pym_organismos_financieros

			SELECT	cod_operacion
					,nro_operacion
				FROM NOG_T.dbo.t_pym_operaciones

			SELECT DISTINCT nombre_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			
			DECLARE @mes INT,
					@año INT
			
			SET @mes = CASE WHEN MONTH(GETDATE()) = 1 THEN 12 ELSE MONTH(GETDATE()) - 1 END
			SET @año = CASE WHEN @mes = 12 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END

			SELECT ROW_NUMBER() OVER(ORDER BY nombre_direccion ASC) AS 'numero'
					,org.abrev_organismo_financiero
					,ope.nro_operacion
					,dir.nombre_direccion
					,SUM(act.programado) AS 'programado_total'
					,SUM(act.programado_al_mes) AS 'programado_al_mes'
					,SUM(act.ejecutado_al_mes) AS 'ejecutado_al_mes'
					,SUM(act.por_ejecutar) AS 'por_ejecutar'
					,SUM(CASE WHEN act.flagRiesgo = 1 THEN act.riesgo ELSE 0 END) AS 'riesgo'
				FROM (
					SELECT  act.cod_actividad
							,act.cod_direccion
							,act.cod_ind_prod
							,SUM(CASE WHEN pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END) AS 'programado'
							,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END) AS 'programado_al_mes'
							,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) AS 'ejecutado_al_mes'
							,SUM(CASE WHEN pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
								- SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END) AS 'por_ejecutar'
							,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
								- SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) AS 'riesgo'
							,CASE WHEN
									SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
										- SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) > 0
								THEN 1 ELSE 0 
							END AS 'flagRiesgo'
						FROM NOG_T.dbo.t_pym_actividades AS act
							INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pago ON pago.cod_actividad = act.cod_actividad
						WHERE act.estado_actividad = 1
							AND act.año_actividad = @año
						GROUP BY act.cod_actividad
							,act.cod_direccion
							,act.cod_ind_prod
				) act
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
						ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
					INNER JOIN NOG_T.dbo.t_pym_organismos_financieros AS org ON org.cod_organismo_financiero = ope.cod_organismo_financiero
				GROUP BY org.abrev_organismo_financiero
					,ope.nro_operacion
					,dir.nombre_direccion

			SELECT desc_mes
				FROM NOG_T.dbo.t_glo_meses
				WHERE cod_mes = @mes
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	// ---------------------------ACTIVIDADES VENCIDAS-------------------------------------

	obtenerDatosActividadesVencidas: (config, callback) => {

		let sql = `
			SELECT	cod_organismo_financiero
					,abrev_organismo_financiero
				FROM NOG_T.dbo.t_pym_organismos_financieros

			SELECT	cod_operacion
					,nro_operacion
				FROM NOG_T.dbo.t_pym_operaciones

			SELECT DISTINCT nombre_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			
			DECLARE @mes INT,
					@año INT
			
			SET @mes = CASE WHEN MONTH(GETDATE()) = 1 THEN 12 ELSE MONTH(GETDATE()) END
			SET @año = CASE WHEN @mes = 12 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END

			SELECT ROW_NUMBER() OVER(ORDER BY nombre_direccion ASC) AS 'numero'
					,org.abrev_organismo_financiero
					,ope.nro_operacion
					,dir.nombre_direccion
					,SUM(act.programado) AS 'programado_total'
					,SUM(act.programado_al_mes) AS 'programado_al_mes'
					,SUM(act.ejecutado_al_mes) AS 'ejecutado_al_mes'
					,SUM(act.por_ejecutar) AS 'por_ejecutar'
					,SUM(CASE WHEN act.flagRiesgo = 1 THEN act.riesgo ELSE 0 END) AS 'riesgo'
				FROM (
					SELECT  act.cod_actividad
							,act.cod_direccion
							,act.cod_ind_prod
							,SUM(CASE WHEN pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END) AS 'programado'
							,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END) AS 'programado_al_mes'
							,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) AS 'ejecutado_al_mes'
							,SUM(CASE WHEN pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
								- SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END) AS 'por_ejecutar'
							,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
								- SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) AS 'riesgo'
							,CASE WHEN
									SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
										- SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) > 0
								THEN 1 ELSE 0 
							END AS 'flagRiesgo'
						FROM NOG_T.dbo.t_pym_actividades AS act
							INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pago ON pago.cod_actividad = act.cod_actividad
						WHERE act.actividad_vencidas = 0
						--	AND act.año_actividad = @año
						GROUP BY act.cod_actividad
							,act.cod_direccion
							,act.cod_ind_prod
				) act
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
						ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
					INNER JOIN NOG_T.dbo.t_pym_organismos_financieros AS org ON org.cod_organismo_financiero = ope.cod_organismo_financiero
				GROUP BY org.abrev_organismo_financiero
					,ope.nro_operacion
					,dir.nombre_direccion

			SELECT desc_mes
				FROM NOG_T.dbo.t_glo_meses
				WHERE cod_mes = @mes

				--organismoOperacion
			Select t_pym_organismos_financieros.abrev_organismo_financiero,  t_pym_operaciones.nro_operacion  , cod_operacion 
			from NOG_T.dbo.t_pym_organismos_financieros
			inner join NOG_T.dbo.t_pym_operaciones on t_pym_organismos_financieros.cod_organismo_financiero = t_pym_operaciones.cod_organismo_financiero

				--Data organismo actividades
			SELECT nombre_organismo_financiero, abrev_organismo_financiero, t_pym_operaciones.cod_operacion , nro_operacion, fecha_fin_operacion, fecha_inicio_operacion,
			nro_actividad, nombre_actividad,fecha_inicio_actividad,  fecha_fin_actividad, DATEDIFF(day, fecha_inicio_actividad, CAST(GETDATE() AS DATE)) as dias_retraso, 
			actividad_vencidas, cod_mes, monto_pago, estado_pago, cod_tipo_monto
			FROM NOG_T.dbo.t_pym_organismos_financieros
			FULL JOIN NOG_T.dbo.t_pym_operaciones ON t_pym_organismos_financieros.cod_organismo_financiero = t_pym_operaciones.cod_organismo_financiero
			FULL JOIN NOG_T.dbo.t_pym_componentes ON t_pym_operaciones.cod_operacion = t_pym_componentes.cod_operacion
			FULL JOIN NOG_T.dbo.t_pym_indicadores_productos ON t_pym_componentes.cod_componente = t_pym_indicadores_productos.cod_componente
			FULL JOIN NOG_T.dbo.t_pym_actividades ON t_pym_indicadores_productos.cod_ind_prod = t_pym_actividades.cod_ind_prod
			FULL JOIN NOG_T.dbo.t_pym_pagos_actividades ON t_pym_actividades.cod_actividad = t_pym_pagos_actividades.cod_actividad
			WHERE estado_actividad = 1	
			AND fecha_inicio_actividad < CAST(GETDATE() AS DATE) 
			AND actividad_vencidas = 0
			AND cod_tipo_monto = 1

			--Actividades Vencidas
			  (SELECT nro_actividad, nro_orden_actividad,  nombre_actividad, nro_operacion, nombre_direccion, abrev_organismo_financiero, t_pym_operaciones.cod_operacion, fecha_inicio_actividad, fecha_fin_actividad, 
				SUM(monto_pago) as monto_programado_vencido, DATEDIFF(day, fecha_inicio_actividad, CAST(GETDATE() AS DATE)) as dias_retraso
			FROM NOG_T.dbo.t_pym_organismos_financieros
			FULL JOIN NOG_T.dbo.t_pym_operaciones ON t_pym_organismos_financieros.cod_organismo_financiero = t_pym_operaciones.cod_organismo_financiero
			FULL JOIN NOG_T.dbo.t_pym_componentes ON t_pym_operaciones.cod_operacion = t_pym_componentes.cod_operacion
			FULL JOIN NOG_T.dbo.t_pym_subcomponentes AS subcomponente ON subcomponente.cod_componente = t_pym_componentes.cod_componente
			FULL JOIN NOG_T.dbo.t_pym_indicadores_productos ON t_pym_componentes.cod_componente = t_pym_indicadores_productos.cod_componente
			FULL JOIN NOG_T.dbo.t_pym_actividades ON t_pym_indicadores_productos.cod_ind_prod = t_pym_actividades.cod_ind_prod
			FULL JOIN NOG_T.dbo.t_pym_pagos_actividades ON t_pym_actividades.cod_actividad = t_pym_pagos_actividades.cod_actividad
			FULL JOIN NOG_T.dbo.t_pym_direcciones ON t_pym_actividades.cod_direccion = t_pym_direcciones.cod_direccion
			WHERE estado_actividad = 1	
			AND fecha_inicio_actividad < CAST(GETDATE() AS DATE) 
			AND actividad_vencidas = 0
			AND cod_tipo_monto = 1
			group by nombre_actividad, nro_orden_actividad, t_pym_operaciones.nro_operacion, nombre_direccion, abrev_organismo_financiero, t_pym_operaciones.cod_operacion, nro_actividad,  fecha_inicio_actividad, fecha_fin_actividad
			)
			Union 
			(select nro_actividad, nro_orden_actividad, nombre_actividad, nro_operacion, nombre_direccion, abrev_organismo_financiero, operacion.cod_operacion,  fecha_inicio_actividad, fecha_fin_actividad, 
				SUM(monto_pago) as monto_programado_vencido, DATEDIFF(day, fecha_inicio_actividad, CAST(GETDATE() AS DATE)) as dias_retraso
				 FROM NOG_T.dbo.t_pym_subcomponentes AS subcomponente
					full JOIN NOG_T.dbo.t_pym_componentes AS componente ON componente.cod_componente = subcomponente.cod_componente
					full JOIN NOG_T.dbo.t_pym_operaciones as operacion ON operacion.cod_operacion = componente.cod_operacion
					full JOIN NOG_T.dbo.t_pym_indicadores_productos as indicadores ON indicadores.cod_subcomponente = subcomponente.cod_subcomponente
					full JOIN NOG_T.dbo.t_pym_actividades as actividades ON actividades.cod_ind_prod = indicadores.cod_ind_prod
					full JOIN NOG_T.dbo.t_pym_organismos_financieros as organismo ON organismo.cod_organismo_financiero = operacion.cod_organismo_financiero
					FULL JOIN NOG_T.dbo.t_pym_direcciones as direccion ON direccion.cod_direccion = actividades.cod_direccion
					FULL JOIN NOG_T.dbo.t_pym_pagos_actividades as pagos ON pagos.cod_actividad = actividades.cod_actividad
					WHERE estado_actividad = 1		
					AND fecha_inicio_actividad < CAST(GETDATE() AS DATE) 		
				AND actividad_vencidas = 0 
				AND cod_tipo_monto = 1
				AND abrev_organismo_financiero = 'BM' 
				group by nombre_actividad, nro_orden_actividad, nro_operacion, nombre_direccion, abrev_organismo_financiero, operacion.cod_operacion, nro_actividad,  fecha_inicio_actividad, fecha_fin_actividad
				)
				order by nro_actividad


			 --Presupuesto Anual
			 SELECT sum(monto_pago) as presupuesto_anual FROM NOG_T.dbo.t_pym_pagos_actividades 
			 WHERE cod_tipo_monto = 1 
			 AND estado_pago = 1 
			 AND YEAR( fecha_ing_registro ) = YEAR( getDate() )

		`
		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},

	obtenerActividadesVencidas: (config, filtros, callback) => {

		let mes = new Date().getMonth(),
			sql

		sql = `
			SELECT	act.nro_actividad
					,nombre_actividad
					,Convert(varchar(10),CONVERT(date,act.fecha_inicio_actividad,106),103) fecha_inicio_actividad
					,SUM(CASE WHEN pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END) programado 
					,DATEDIFF(  DAY , CAST( Convert(varchar(10),CONVERT(date,act.fecha_inicio_actividad,106),103)  AS DATETIME) , GETDATE()  ) retraso
				FROM (
					SELECT	act.cod_actividad`

		for (let i = 1; i <= mes; i++) {
			if (i < 10) {
				sql += `
									,SUM(CASE WHEN pagos.cod_mes = ${i} AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_0${i}'
									,SUM(CASE WHEN pagos.cod_mes = ${i} AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_0${i}'`
			} else {
				sql += `
									,SUM(CASE WHEN pagos.cod_mes = ${i} AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_${i}'
									,SUM(CASE WHEN pagos.cod_mes = ${i} AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_${i}'`
			}
		}

		sql += `
						FROM NOG_T.dbo.t_pym_pagos_actividades AS pagos
						INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
							WHERE act.actividad_vencidas = 0
							GROUP BY act.cod_actividad
				) TMP
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = TMP.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pago ON pago.cod_actividad = act.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
						ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
					INNER JOIN NOG_T.dbo.t_pym_organismos_financieros AS org ON org.cod_organismo_financiero = ope.cod_organismo_financiero
				WHERE act.actividad_vencidas = 0
					AND org.abrev_organismo_financiero = '${filtros.abrev_organismo_financiero}'
					AND ope.nro_operacion = '${filtros.nro_operacion}'
					AND dir.nombre_direccion = '${filtros.nombre_direccion}'
				GROUP BY act.nro_actividad
					,nombre_actividad
					,Convert(varchar(10),CONVERT(date,act.fecha_inicio_actividad,106),103)
		`
		console.log(sql)

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},

	// obtenerOrganismos: (config, filtros, callback) => {
	// 	let sql = "Select t_pym_organismos_financieros.abrev_organismo_financiero as 'Organismo',  t_pym_operaciones.nro_operacion as 'No.Operacion' from t_pym_organismos_financieros inner join t_pym_operaciones on t_pym_organismos_financieros.cod_organismo_financiero = t_pym_operaciones.cod_organismo_financiero"
	// 	console.log(sql)

	// 	connection.query(config, sql, (result) => {
	// 		callback(result.recordset)
	// 	})
	// },
	///////////////COMPARATIVO DE EJECUCIÓN///////////////////////////////////////////
	obtenerComparativoEjecucion: (config, callback) => {

		let sql = `
				SELECT  cod_organismo_financiero
				,abrev_organismo_financiero
			FROM NOG_T.dbo.t_pym_organismos_financieros

			SELECT  cod_operacion
				,nro_operacion
			FROM NOG_T.dbo.t_pym_operaciones

			SELECT DISTINCT nombre_direccion
			FROM NOG_T.dbo.t_pym_direcciones



			DECLARE @año INT
			SET @año = CASE WHEN MONTH(GETDATE()) = 1 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END

		SELECT  act.año_actividad
			,SUM(CASE WHEN pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejecutado'
			,SUM(CASE WHEN pagos.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'
			,SUM(CASE WHEN pagos.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'
			,SUM(CASE WHEN pagos.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'
			,SUM(CASE WHEN pagos.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'
			,SUM(CASE WHEN pagos.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'
			,SUM(CASE WHEN pagos.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'
			,SUM(CASE WHEN pagos.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'
			,SUM(CASE WHEN pagos.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'
			,SUM(CASE WHEN pagos.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'
			,SUM(CASE WHEN pagos.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'
			,SUM(CASE WHEN pagos.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'
			,SUM(CASE WHEN pagos.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
		FROM NOG_T.dbo.t_pym_pagos_actividades AS pagos
			INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
			INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
			LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_prod.cod_subcomponente
			LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
			LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
			INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
					ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
		WHERE act.estado_actividad = 1
			AND act.año_actividad in( @año , (@año-1))
		GROUP BY act.año_actividad

		SELECT @año AS 'año'



	`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},

	obtenerComparativo: (config, filtros, callback) => {

		let sql

		if (filtros.cod_organismo_financiero || filtros.cod_operacion || filtros.año_actividad)
			sql = `
			SELECT act.año_actividad
		`

		if (filtros.nombre_direccion)
			sql = `
			SELECT act.año_actividad
		`

		sql += `
				,SUM(CASE WHEN pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejecutado'				
				,SUM(CASE WHEN pagos.cod_mes = 1 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_01'				
				,SUM(CASE WHEN pagos.cod_mes = 2 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_02'				
				,SUM(CASE WHEN pagos.cod_mes = 3 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_03'				
				,SUM(CASE WHEN pagos.cod_mes = 4 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_04'				
				,SUM(CASE WHEN pagos.cod_mes = 5 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_05'				
				,SUM(CASE WHEN pagos.cod_mes = 6 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_06'				
				,SUM(CASE WHEN pagos.cod_mes = 7 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_07'				
				,SUM(CASE WHEN pagos.cod_mes = 8 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_08'				
				,SUM(CASE WHEN pagos.cod_mes = 9 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_09'				
				,SUM(CASE WHEN pagos.cod_mes = 10 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_10'				
				,SUM(CASE WHEN pagos.cod_mes = 11 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_11'				
				,SUM(CASE WHEN pagos.cod_mes = 12 AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_12'
			FROM NOG_T.dbo.t_pym_pagos_actividades AS pagos
				INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
				INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
				INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
				LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_prod.cod_subcomponente
				LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
				LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
				INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
					ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
			WHERE act.estado_actividad = 1`

		if (filtros.cod_organismo_financiero)
			sql += `
					AND ope.cod_organismo_financiero = ${filtros.cod_organismo_financiero}
		`

		if (filtros.cod_operacion)
			sql += `
					AND ope.cod_operacion = ${filtros.cod_operacion}
		`

		if (filtros.nombre_direccion)
			sql += `
					AND dir.nombre_direccion = '${filtros.nombre_direccion}'
		`

		if (filtros.año_actividad)
			sql += `		
					AND act.año_actividad = ${filtros.año_actividad}
		`

		if (filtros.nombre_direccion) {
			sql += `
			GROUP BY act.año_actividad
		`
		} else if (filtros.cod_organismo_financiero || filtros.cod_operacion || filtros.año_actividad) {
			sql += `
			GROUP BY act.año_actividad
		`
		}

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},

	///////////////TERMINA OBTENER LAS ACTIVIDADES VENCIDAS //////////////////////////



	obtenerActividadesPresupuestoRiesto: (config, filtros, callback) => {

		let mes = new Date().getMonth(),
			sql

		sql = `
			DECLARE @mes INT,
					@año INT

			SET @mes = CASE WHEN MONTH(GETDATE()) = 1 THEN 12 ELSE MONTH(GETDATE()) - 1 END
			SET @año = CASE WHEN @mes = 12 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END

			SELECT	act.nro_actividad
					,nombre_actividad
					,SUM(CASE WHEN pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) AS 'ejecutado'
					,SUM(CASE WHEN pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
						- SUM(CASE WHEN pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) AS 'riesgo'
				FROM (
					SELECT	act.cod_actividad`

		for (let i = 1; i <= mes; i++) {
			if (i < 10) {
				sql += `
									,SUM(CASE WHEN pagos.cod_mes = ${i} AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_0${i}'
									,SUM(CASE WHEN pagos.cod_mes = ${i} AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_0${i}'`
			} else {
				sql += `
									,SUM(CASE WHEN pagos.cod_mes = ${i} AND pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'prog_${i}'
									,SUM(CASE WHEN pagos.cod_mes = ${i} AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejec_${i}'`
			}
		}

		sql += `
						FROM NOG_T.dbo.t_pym_pagos_actividades AS pagos
						INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
							WHERE act.estado_actividad = 1
								--AND pagos.estado_pago = 1
								AND act.año_actividad = @año
							GROUP BY act.cod_actividad
				) TMP
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = TMP.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pago ON pago.cod_actividad = act.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = ind_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
						ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
					INNER JOIN NOG_T.dbo.t_pym_organismos_financieros AS org ON org.cod_organismo_financiero = ope.cod_organismo_financiero
				WHERE act.estado_actividad = 1
					AND act.año_actividad = @año
					AND pago.cod_mes <= @mes
					AND org.abrev_organismo_financiero = '${filtros.abrev_organismo_financiero}'
					AND ope.nro_operacion = '${filtros.nro_operacion}'
					AND dir.nombre_direccion = '${filtros.nombre_direccion}'
				GROUP BY act.nro_actividad
					,nombre_actividad
				HAVING (SUM(CASE WHEN pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
					- SUM(CASE WHEN pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END)) > 0
		`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},




	//------------------------------------------------------------
	//Reportes móvil
	mResumenPrograma: (config, filtros, callback) => {

		let sql = ""

		if (filtros.json === 'false') {
			sql += `
				DECLARE @año INT
				SET @año = CASE WHEN MONTH(GETDATE()) = 1 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END
			`
		}

		sql += `
			SELECT	nro_operacion
					,SUM(CASE WHEN montos.cod_tipo_monto = 1 AND estado_pago = 1 AND monto_pago IS NOT NULL THEN monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN montos.cod_tipo_monto = 2 AND estado_pago = 1 AND monto_pago IS NOT NULL THEN monto_pago ELSE 0 END) AS 'ejecutado'
				FROM NOG_T.dbo.t_pym_pagos_actividades AS pagos
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
					INNER JOIN NOG_T.dbo.t_glo_meses AS mes ON mes.cod_mes = pagos.cod_mes
					INNER JOIN NOG_T.dbo.t_glo_tipos_montos AS montos ON montos.cod_tipo_monto = pagos.cod_tipo_monto
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS indi_prod ON indi_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = indi_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp
						ON comp.cod_componente = sub.cod_componente
						OR comp.cod_componente = indi_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope ON ope.cod_operacion = comp.cod_operacion
				WHERE act.estado_actividad = 1`

		if (filtros.json === 'true') {

			if (filtros.organismo)
				sql += `
						AND ope.cod_organismo_financiero = ${filtros.organismo}`

			sql += `
						AND act.año_actividad = ${filtros.año}
					GROUP BY nro_operacion

				SELECT ${filtros.año} AS 'año'`

		} else {
			sql += `
						AND act.año_actividad =	@año
					GROUP BY nro_operacion

				SELECT @año AS 'año'
			`
		}

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	mProgEjecMensual: (config, filtros, callback) => {

		let sql = `
			SELECT	mes.cod_mes, desc_mes
					,SUM(CASE WHEN montos.cod_tipo_monto = 1 AND estado_pago = 1 AND monto_pago IS NOT NULL THEN monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN montos.cod_tipo_monto = 2 AND estado_pago = 1 AND monto_pago IS NOT NULL THEN monto_pago ELSE 0 END) AS 'ejecutado'
				FROM NOG_T.dbo.t_pym_pagos_actividades AS pagos
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS indi_prod ON indi_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_subcomponente = indi_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = indi_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_glo_meses AS mes ON mes.cod_mes = pagos.cod_mes
					INNER JOIN NOG_T.dbo.t_glo_tipos_montos AS montos ON montos.cod_tipo_monto = pagos.cod_tipo_monto
				WHERE act.estado_actividad = 1
					AND act.año_actividad = ${filtros.año}
					AND (comp.cod_operacion = ${filtros.operacion} OR comp2.cod_operacion = ${filtros.operacion})
				GROUP BY mes.cod_mes, desc_mes
				ORDER BY mes.cod_mes
		`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	},
	mResumenMes: (config, filtros, callback) => {

		let sql = `
			DECLARE @mes INT
			DECLARE @año INT
		`

		if (filtros.json === 'false') {
			sql += `
				SET @mes = CASE WHEN MONTH(GETDATE()) = 1 THEN 12 ELSE MONTH(GETDATE()) - 1 END
				SET @año = CASE WHEN MONTH(GETDATE()) = 1 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END
			`
		} else {
			sql += `
				SET @mes = ${filtros.mes}
				SET @año = ${filtros.año}
			`
		}

		sql += `
			SELECT	dir.cod_direccion
					,dir.nombre_direccion
					,SUM(CASE WHEN pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejecutado'
				FROM NOG_T.dbo.t_glo_meses AS meses
					LEFT JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
					INNER JOIN NOG_T.dbo.t_glo_tipos_montos AS montos ON montos.cod_tipo_monto = pagos.cod_tipo_monto
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pagos.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
				WHERE pagos.estado_pago = 1
					AND act.estado_actividad = 1
					AND act.año_actividad = @año
					AND meses.cod_mes = @mes
				GROUP BY dir.cod_direccion
					,dir.nombre_direccion
				ORDER BY dir.nombre_direccion`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},
	mAcumuladoMes: (config, filtros, callback) => {

		let sql = `
			DECLARE @mes INT
			DECLARE @año INT
		`

		if (filtros.json === 'false') {
			sql += `
				SET @mes = CASE WHEN MONTH(GETDATE()) = 1 THEN 12 ELSE MONTH(GETDATE()) - 1 END
				SET @año = CASE WHEN MONTH(GETDATE()) = 1 THEN YEAR(GETDATE()) - 1 ELSE YEAR(GETDATE()) END
			`
		} else {
			sql += `
				SET @mes = ${filtros.mes}
				SET @año = ${filtros.año}
			`
		}

		sql += `
			SELECT	dir.nombre_direccion
					,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) AS 'ejecutado'
					,SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 1 THEN pago.monto_pago ELSE 0 END)
						- SUM(CASE WHEN pago.cod_mes <= @mes AND pago.cod_tipo_monto = 2 THEN pago.monto_pago ELSE 0 END) AS 'por_ejecutar'
				FROM NOG_T.dbo.t_pym_pagos_actividades AS pago
					INNER JOIN NOG_T.dbo.t_pym_actividades AS act ON act.cod_actividad = pago.cod_actividad
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_indicadores_productos AS ind_prod ON ind_prod.cod_ind_prod = act.cod_ind_prod
					LEFT JOIN NOG_T.dbo.t_pym_subcomponentes AS sub ON sub.cod_componente = ind_prod.cod_subcomponente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp ON comp.cod_componente = sub.cod_componente
					LEFT JOIN NOG_T.dbo.t_pym_componentes AS comp2 ON comp2.cod_componente = ind_prod.cod_componente
					INNER JOIN NOG_T.dbo.t_pym_operaciones AS ope
						ON ope.cod_operacion = comp.cod_operacion OR ope.cod_operacion = comp2.cod_operacion
					INNER JOIN NOG_T.dbo.t_pym_organismos_financieros AS org ON org.cod_organismo_financiero = ope.cod_organismo_financiero
				WHERE act.estado_actividad = 1
					AND act.año_actividad = @año
					AND cod_mes <= @mes
				GROUP BY dir.nombre_direccion
		`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},
	mdetalleDireccion: (config, filtros, callback) => {

		let sql = `
			SELECT	nombre_actividad
					,SUM(CASE WHEN pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'programado'
					,SUM(CASE WHEN pagos.cod_mes <= ${filtros.mes} AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejecutado'
				FROM NOG_T.dbo.t_pym_actividades AS act
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
				WHERE act.estado_actividad = 1 
					AND dir.cod_direccion = ${filtros.direccion}
					AND act.año_actividad = ${filtros.año}
				GROUP BY nombre_actividad`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},
	// obtener las actividades selecionadas como vencidas ////////////////////////////////////////////////////////////++++++++++++++++++++++++++
	reporteActividadesVencidas: (config, filtros, callback) => {
		let sql = `
			SELECT	nombre_actividad
						,SUM(CASE WHEN pagos.cod_tipo_monto = 1 THEN pagos.monto_pago ELSE 0 END) AS 'programado'
						,SUM(CASE WHEN pagos.cod_mes <= ${filtros.mes} AND pagos.cod_tipo_monto = 2 THEN pagos.monto_pago ELSE 0 END) AS 'ejecutado'
					FROM NOG_T.dbo.t_pym_actividades AS act
						INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
						INNER JOIN NOG_T.dbo.t_pym_pagos_actividades AS pagos ON pagos.cod_actividad = act.cod_actividad
					WHERE act.estado_actividad = 1 
						AND dir.cod_direccion = ${filtros.direccion}
						AND act.año_actividad = ${filtros.año}
					GROUP BY nombre_actividad`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	}
}
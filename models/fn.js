'use strict'

var connection = require('../models/connection.js')

module.exports = {
	/////////////////////////////////////////////////////////////
	//ADMINISTRACIÓN
	//----------------------------------------------------------
	//Direcciones
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
	//Unidades ejecutoras
	obtenerGerenciasAdministrativas: (config, callback) => {

		let sql = `
            SELECT	cod_gerencia, numero_gerencia, nombre_gerencia, año_gerencia, monto_aprobado_gerencia
				FROM NOG_T.dbo.t_fn_gerencias_administrativas`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	},
	guardarGerenciaAdministrativa: (config, gerencia, callback) => {

		let sql

		if (gerencia.codigo == 0) {
			sql = `
				INSERT INTO NOG_T.dbo.t_fn_gerencias_administrativas (numero_gerencia, nombre_gerencia, año_gerencia, monto_aprobado_gerencia)
                    VALUES('${gerencia.numero}', '${gerencia.nombre}', ${gerencia.año}, ${gerencia.monto}) 
                    
                SELECT @@IDENTITY AS 'codigo' `
		} else {
			sql = `
				UPDATE NOG_T.dbo.t_fn_gerencias_administrativas
					SET numero_gerencia = '${gerencia.numero}' ,
						nombre_gerencia = '${gerencia.nombre}' ,
						año_gerencia	  = ${gerencia.año} ,
						monto_aprobado_gerencia = ${gerencia.monto} ,
					WHERE cod_gerencia = ${gerencia.codigo}`
		}

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})

	},
	obtenerGerenciaAdministrativa: (config, codigo, callback) => {

		let sql = `
            SELECT	cod_gerencia, numero_gerencia, nombre_gerencia, año_gerencia, monto_aprobado_gerencia
				FROM NOG_T.dbo.t_fn_gerencias_administrativas
				WHERE cod_gerencia = ${codigo}`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})

	},
    obtenerUnidadesEjecutoras: (config, codigo, callback) => {
        
        let sql = `
            SELECT cod_unidad, numero_unidad, nombre_unidad, descripcion_unidad
				 FROM NOG_T.dbo.t_fn_unidades_ejecutoras
				 WHERE cod_gerencia = ${codigo}`
				 
        connection.query(config, sql, (result) => {
            callback(result.recordset)
        })
    },
	guardarUnidadesEjecutoras: (config, data, callback) => {
		
		let sql = ''

		for (let i = 0, len = data.unidades.length; i < len; i++) {

			if (data.unidades[i].cod_unidad == null) {

				sql += `
					INSERT INTO NOG_T.dbo.t_fn_unidades_ejecutoras (
						cod_gerencia
						,numero_unidad
						,nombre_unidad`

				if (data.unidades[i].descripcion_unidad != null && data.unidades[i].descripcion_unidad.length > 0) {
					sql += `
						,descripcion_unidad`
				}

				sql += `
					)
						VALUES (
							${data.cod_gerencia}
							,'${data.unidades[i].numero_unidad}'
							,'${data.unidades[i].nombre_unidad}'`

				if (data.unidades[i].descripcion_unidad != null && data.unidades[i].descripcion_unidad.length > 0) {
					sql += `
						,'${data.unidades[i].descripcion_unidad}'`
				}

				sql += `
					)
				`

			} else {

				sql += `
					UPDATE NOG_T.dbo.t_fn_unidades_ejecutoras
						SET numero_unidad = '${data.unidades[i].numero_unidad}'
							,nombre_unidad = '${data.unidades[i].nombre_unidad}'`

				if (data.unidades[i].descripcion_unidad != null && data.unidades[i].descripcion_unidad.length > 0) {
					sql += `
							,descripcion_unidad = '${data.unidades[i].descripcion_unidad}'`
				} else {
					sql += `
							,descripcion_unidad = NULL`
				}

				sql += `
						WHERE cod_unidad = ${data.unidades[i].cod_unidad}
				`
			}
		}

        connection.query(config, sql ,(result) => {
            callback(result.recordsets)
		})
		
	},
    obtenerProgramas: (config, codigo, callback) => {

		let sql = `
			SELECT cod_unidad, numero_unidad
				 FROM NOG_T.dbo.t_fn_unidades_ejecutoras
				 WHERE cod_gerencia = ${codigo}

            SELECT cod_programa, uni.cod_unidad, numero_programa, nombre_programa, descripcion_programa 
				FROM NOG_T.DBO.t_fn_programas AS prog
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad        
				WHERE cod_gerencia = ${codigo}`
				
        connection.query(config, sql, (result) => {
            callback(result.recordsets)
        })        
    },
    guardarPrograma: (config, data, callback) => {

		let sql = ''
		
        for(let i = 0, len = data.programas.length; i < len; i++) {

            if(data.programas[i].cod_programa == null){

                sql += `
                    INSERT INTO NOG_T.DBO.t_fn_programas (
						cod_unidad
						,numero_programa
						,nombre_programa`
				
				if (data.programas[i].descripcion_programa != null && data.programas[i].descripcion_programa.length > 0) {
					sql += `
						,descripcion_programa`
				}

				sql += `
					)
                    	VALUES (
							${data.programas[i].cod_unidad}
							,'${data.programas[i].numero_programa}'
							,'${data.programas[i].nombre_programa}'
				`

				if (data.programas[i].descripcion_programa != null && data.programas[i].descripcion_programa.length > 0) {
					sql += `
							,'${data.programas[i].descripcion_programa}'`
				}

				sql += `
					)
				`

            } else {

                sql += `
                   	UPDATE NOG_T.DBO.t_fn_programas 
                        SET numero_programa=   '${data.programas[i].numero_programa}'
                            ,nombre_programa=   '${data.programas[i].nombre_programa}'`
				
				if (data.programas[i].descripcion_programa != null && data.programas[i].descripcion_programa.length > 0) {
					sql += `
							,descripcion_programa = '${data.programas[i].descripcion_programa}'`
				} else {
					sql += `
							,descripcion_programa = NULL`
				}

				sql += `
						WHERE cod_programa = ${data.programas[i].cod_programa}
				`
            }
		}
		
        connection.query(config, sql,(result) => {
            callback(result.rowsAffected)
		})
		     
    },
    obtenerSubProgramas: (config, codigo, callback) => {

        let sql = `
			SELECT cod_programa, numero_programa
				FROM NOG_T.DBO.t_fn_programas AS prog
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
				WHERE cod_gerencia = ${codigo}

			SELECT sub.cod_sub_programa, sub.cod_programa, sub.numero_sub_programa, sub.nombre_sub_programa, sub.descripcion_sub_programa
				FROM NOG_T.DBO.t_fn_sub_programas AS sub
					INNER JOIN NOG_T.DBO.t_fn_programas AS prog	ON prog.cod_programa = sub.cod_programa
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
				WHERE uni.cod_gerencia  =  ${codigo}`
					
        connection.query(config, sql, (result) => {
            callback(result.recordsets)
        })        
    },
    guardarSubPrograma: (config, data, callback) => {

		let sql =''
		
        for(let i = 0, len = data.Subprogramas.length; i < len; i++){

            if (data.Subprogramas[i].cod_sub_programa == null) {

                sql += `
                    INSERT INTO NOG_T.dbo.t_fn_sub_programas (
						cod_programa
						,numero_sub_programa
						,nombre_sub_programa`
				
				if (data.Subprogramas[i].descripcion_sub_programa != null && data.Subprogramas[i].descripcion_sub_programa.length > 0) {
					sql += `
						,descripcion_sub_programa`
				}

				sql += `
					)
                    	VALUES (
							${data.Subprogramas[i].cod_programa}
							,'${data.Subprogramas[i].numero_sub_programa}'
							,'${data.Subprogramas[i].nombre_sub_programa}'`
				
				if (data.Subprogramas[i].descripcion_sub_programa != null && data.Subprogramas[i].descripcion_sub_programa.length > 0) {
					sql += `
							,'${data.Subprogramas[i].descripcion_sub_programa}'`
				}

				sql += `
					)
				`

            } else {

                sql += `
                   	UPDATE NOG_T.DBO.t_fn_sub_programas 
                        SET cod_programa = ${data.Subprogramas[i].cod_programa}
                            ,numero_sub_programa = '${data.Subprogramas[i].numero_sub_programa}'
                            ,nombre_sub_programa = '${data.Subprogramas[i].nombre_sub_programa}'`
				
				if (data.Subprogramas[i].descripcion_sub_programa != null && data.Subprogramas[i].descripcion_sub_programa.length > 0) {
					sql += `
							,descripcion_sub_programa = '${data.Subprogramas[i].descripcion_sub_programa}'`
				} else {
					sql += `
							,descripcion_sub_programa = NULL`
				}

				sql += `
						WHERE cod_sub_programa = ${data.Subprogramas[i].cod_sub_programa}
				`
            }

		}
		
        connection.query(config, sql,(result) => {
            callback(result.rowsAffected)
        })        
    },
    obtenerProyectos: (config, codigo, callback) => {

		let sql = `
			SELECT cod_programa, numero_programa
				FROM NOG_T.DBO.t_fn_programas AS prog
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
				WHERE cod_gerencia = ${codigo}

			SELECT sub.cod_sub_programa, sub.numero_sub_programa
				FROM NOG_T.DBO.t_fn_sub_programas AS sub
					INNER JOIN NOG_T.DBO.t_fn_programas AS prog	ON prog.cod_programa = sub.cod_programa
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
				WHERE uni.cod_gerencia  =  ${codigo}
			
			SELECT prog2.cod_programa, sub.cod_sub_programa, cod_proyecto, numero_proyecto, nombre_proyecto, descripcion_proyecto
				FROM NOG_T.dbo.t_fn_proyectos AS proy
					LEFT JOIN NOG_T.dbo.t_fn_sub_programas AS sub ON sub.cod_sub_programa = proy.cod_sub_programa
					LEFT JOIN NOG_T.dbo.t_fn_programas As prog
						ON prog.cod_programa = sub.cod_programa OR prog.cod_programa = proy.cod_programa
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
				WHERE uni.cod_gerencia = ${codigo}`

        connection.query(config, sql, (result) => {
            callback(result.recordsets)
        })        
    },
    guardarProyectos: (config, data, callback) => {

		let sql = ''
		
        for(let i = 0, len = data.proyectos.length; i < len; i++){

            if (data.proyectos[i].cod_proyecto == null) {

				sql += `
					INSERT INTO NOG_T.dbo.t_fn_proyectos (`

				if (data.proyectos[i].cod_programa != null) {
					sql += `
						[cod_programa]`
				} else if (data.proyectos[i].cod_sub_programa != null) {
					sql += `
						[cod_sub_programa]`
				}
				
				sql += `
						,[numero_proyecto]
						,[nombre_proyecto]`

				if (data.proyectos[i].descripcion_proyecto != null && data.proyectos[i].descripcion_proyecto.length > 0) {
					sql += `
						,[descripcion_proyecto]`
				}

				sql += `
					)
						VALUES (`
				
				if (data.proyectos[i].cod_programa != null) {
					sql += `
							${data.proyectos[i].cod_programa}`
				} else if (data.proyectos[i].cod_sub_programa != null) {
					sql += `
							${data.proyectos[i].cod_sub_programa}`
				}

				sql += `
							,'${data.proyectos[i].numero_proyecto}'
							,'${data.proyectos[i].nombre_proyecto}'`
				
				if (data.proyectos[i].descripcion_proyecto != null && data.proyectos[i].descripcion_proyecto.length > 0) {
					sql += `
						,'${data.proyectos[i].descripcion_proyecto}'`
				}

				sql += `
					)
				`
				
            } else {

				sql += `
					UPDATE NOG_T.DBO.t_fn_proyectos`

				if (data.proyectos[i].cod_programa != null) {
					sql += `
						SET [cod_programa] = ${data.proyectos[i].cod_programa}
							,[cod_sub_programa] = NULL`
				} else if (data.proyectos[i].cod_sub_programa != null) {
					sql += `
						SET [cod_programa] = NULL
							,[cod_sub_programa] = ${data.proyectos[i].cod_sub_programa}`
				}

				sql += `
							,[numero_proyecto] = '${data.proyectos[i].numero_proyecto}'
							,[nombre_proyecto] = '${data.proyectos[i].nombre_proyecto}'`
				
				if (data.proyectos[i].descripcion_proyecto != null && data.proyectos[i].descripcion_proyecto.length > 0) {
					sql += `
							,[descripcion_proyecto] = '${data.proyectos[i].descripcion_proyecto}'`
				} else {
					sql += `
							,[descripcion_proyecto] = NULL`
				}

				sql += `
						WHERE [cod_proyecto] = ${data.proyectos[i].cod_proyecto}
				`
            }
		}
		
		connection.query(config, sql,(result) => {
            callback(result.rowsAffected)
        })        
    },
    obtenerAct_Obras: (config, codigo, callback) => {

		let sql = `
			SELECT cod_programa, numero_programa
				FROM NOG_T.DBO.t_fn_programas AS prog
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
				WHERE cod_gerencia = ${codigo}

			SELECT cod_proyecto, numero_proyecto
				FROM NOG_T.dbo.t_fn_proyectos AS proy
					LEFT JOIN NOG_T.dbo.t_fn_sub_programas AS sub ON sub.cod_sub_programa = proy.cod_sub_programa
					LEFT JOIN NOG_T.dbo.t_fn_programas As prog
						ON prog.cod_programa = sub.cod_programa OR prog.cod_programa = proy.cod_programa
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
				WHERE uni.cod_gerencia = ${codigo}

			SELECT act.cod_act_obra, act.cod_programa, act.cod_proyecto, act.numero_act_obra, act.nombre_act_obra, act.descripcion_act_obra
				FROM NOG_T.dbo.t_fn_actividades_obras AS act
					LEFT JOIN NOG_T.dbo.t_fn_proyectos	AS proy	ON proy.cod_proyecto = act.cod_proyecto
					LEFT JOIN NOG_T.dbo.t_fn_sub_programas AS sub ON sub.cod_sub_programa = proy.cod_sub_programa
					LEFT JOIN NOG_T.dbo.t_fn_programas As prog
						ON prog.cod_programa = sub.cod_programa
						OR prog.cod_programa = proy.cod_programa
						OR prog.cod_programa = act.cod_programa
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
				WHERE uni.cod_gerencia = ${codigo}`
         
        connection.query(config, sql, (result) => {            
            callback(result.recordsets)
        })
    },
    guardarAct_Obras: (config, data, callback) => {

		let sql =''
		
        for (let i = 0, len = data.act_obras.length; i < len; i++) {

            if (data.act_obras[i].cod_act_obra == null) {

                sql += `
                    INSERT INTO NOG_T.DBO.t_fn_actividades_obras (`
				
				if (data.act_obras[i].cod_programa != null) {
					sql += `
						cod_programa`
				} else if (data.act_obras[i].cod_proyecto != null) {
					sql += `
						cod_proyecto`
				}

				sql += `
						,numero_act_obra
						,nombre_act_obra`
				
				if (data.act_obras[i].descripcion_act_obra != null && data.act_obras[i].descripcion_act_obra.length > 0) {
					sql += `
						,[descripcion_act_obra]`
				}

				sql += `
					)
                    	VALUES(`
				
				if (data.act_obras[i].cod_programa != null) {
					sql += `
						${data.act_obras[i].cod_programa}`
				} else if (data.act_obras[i].cod_proyecto != null) {
					sql += `
						${data.act_obras[i].cod_proyecto}`
				}
				
				sql += `
							,'${data.act_obras[i].numero_act_obra}'
							,'${data.act_obras[i].nombre_act_obra}'`

				if (data.act_obras[i].descripcion_act_obra != null && data.act_obras[i].descripcion_act_obra.length > 0) {
					sql += `
							,'${data.act_obras[i].descripcion_act_obra}'`
				}

				sql += `
						)`

            } else {

                sql += `
				   UPDATE NOG_T.dbo.t_fn_actividades_obras`
				
				if (data.act_obras[i].cod_programa != null) {
					sql += `
						SET cod_programa = ${data.act_obras[i].cod_programa}
							,cod_proyecto = NULL`
				} else if (data.act_obras[i].cod_proyecto != null) {
					sql += `
						SET cod_programa = NULL
							,cod_proyecto = ${data.act_obras[i].cod_proyecto}`
				}
				
				sql += `
                            ,numero_act_obra = '${data.act_obras[i].numero_act_obra}' 
                            ,nombre_act_obra = '${data.act_obras[i].nombre_act_obra}'`
				
				if (data.act_obras[i].descripcion_act_obra != null && data.act_obras[i].descripcion_act_obra.length > 0) {
					sql += `
							,descripcion_act_obra = '${data.act_obras[i].descripcion_act_obra}'`
				} else {
					sql += `
							,descripcion_act_obra = NULL`
				}

				sql += `
					WHERE cod_act_obra = ${data.act_obras[i].cod_act_obra}
				`
			}
		}
		
        connection.query(config, sql,(result) => {
            callback(result.rowsAffected)
        })        
	},
	/////////////////////////////////////////////////////////////
	//ACTIVIDADES
	//----------------------------------------------------------
	//Actividades
	obtenerDatosActividades: (config, callback) => {

		let sql = `
			SELECT DISTINCT nombre_gerencia, año_gerencia
				FROM NOG_T.dbo.t_fn_gerencias_administrativas

			SELECT DISTINCT nombre_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			
			SELECT cod_direccion, nombre_direccion, responsable_direccion
				FROM NOG_T.dbo.t_pym_direcciones
			
			/*
			SELECT cod_departamento, desc_departamento
				FROM NOG_T.dbo.t_glo_departamentos
			
			SELECT cod_municipio, desc_municipio, cod_departamento
				FROM NOG_T.dbo.t_glo_municipios
			*/
			
			SELECT cod_grupo_gasto, nombre_grupo_gasto
				FROM NOG_T.dbo.t_fn_grupos_gastos
			
			SELECT cod_sub_grupo_gasto, nombre_sub_grupo_gasto, cod_grupo_gasto
				FROM NOG_T.dbo.t_fn_sub_grupos_gastos
			
			SELECT cod_objeto_gasto, desc_objeto_gasto, cod_sub_grupo_gasto
				FROM NOG_T.dbo.t_fn_objetos_gastos
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	obtenerActividades: (config, filtros, callback) => {

		let sql = `
			DECLARE @gerencia INT
			DECLARE @unidades TABLE (
				cod_unidad INT,
				nombre_unidad NVARCHAR(200)
			)
			DECLARE @programas TABLE (
				cod_programa INT,
				nombre_programa NVARCHAR (200),
				cod_unidad INT
			)
			DECLARE @sub_programas TABLE (
				cod_sub_programa INT,
				nombre_sub_programa NVARCHAR (200),
				cod_programa INT
			)
			DECLARE @proyectos TABLE (
				cod_proyecto INT,
				nombre_proyecto NVARCHAR(200),
				cod_programa INT,
				cod_sub_programa INT
			)
			DECLARE @act_obras TABLE (
				cod_act_obra INT,
				nombre_act_obra NVARCHAR(200),
				cod_proyecto INT,
				cod_programa INT
			)

			SET @gerencia = (SELECT cod_gerencia
				FROM NOG_T.dbo.t_fn_gerencias_administrativas
				WHERE nombre_gerencia = '${filtros.cod_gerencia}'
					AND año_gerencia = ${filtros.año_gerencia}
				)
			
			INSERT INTO @unidades
			SELECT cod_unidad, nombre_unidad
				FROM NOG_T.dbo.t_fn_unidades_ejecutoras
				WHERE cod_gerencia = @gerencia

			INSERT INTO @programas
			SELECT cod_programa, nombre_programa, cod_unidad
				FROM NOG_T.dbo.t_fn_programas
				WHERE cod_unidad IN (
					SELECT cod_unidad
						FROM @unidades
				)

			INSERT INTO @sub_programas
			SELECT cod_sub_programa, nombre_sub_programa, cod_programa
				FROM NOG_T.dbo.t_fn_sub_programas
				WHERE cod_programa IN (
					SELECT cod_programa
						FROM @programas
				)

			INSERT INTO @proyectos
			SELECT cod_proyecto, nombre_proyecto, cod_programa, cod_sub_programa
				FROM NOG_T.dbo.t_fn_proyectos
				WHERE cod_sub_programa IN (
					SELECT cod_sub_programa
						FROM @sub_programas
				) OR cod_programa IN (
					SELECT cod_programa
						FROM @programas
				)

			INSERT INTO @act_obras
			SELECT cod_act_obra, nombre_act_obra, cod_proyecto, cod_programa
				FROM NOG_T.dbo.t_fn_actividades_obras
				WHERE cod_proyecto IN (
					SELECT cod_proyecto
						FROM @proyectos
				) OR cod_programa IN (
					SELECT cod_programa
						FROM @programas
				)
			
			SELECT cod_unidad, nombre_unidad
				FROM @unidades

			SELECT cod_programa, nombre_programa, cod_unidad
				FROM @programas

			SELECT cod_sub_programa, nombre_sub_programa, cod_programa
				FROM @sub_programas

			SELECT cod_proyecto, nombre_proyecto, cod_programa, cod_sub_programa
				FROM @proyectos

			SELECT cod_act_obra, nombre_act_obra, cod_proyecto, cod_programa
				FROM @act_obras

			SELECT	act.cod_actividad
					,obra.cod_act_obra
					,proy.cod_proyecto
					,sub.cod_sub_programa
					,prog.cod_programa
					,uni.cod_unidad
					,obj.cod_objeto_gasto
					,obj.desc_objeto_gasto
					,subg.cod_sub_grupo_gasto
					,subg.nombre_sub_grupo_gasto
					,gru.cod_grupo_gasto
					,gru.nombre_grupo_gasto
					,dir.cod_direccion
					,dir.nombre_direccion
					,act.fecha_inicio_actividad
					,act.fecha_fin_actividad
					--,mun.cod_departamento
					--,mun.cod_municipio
					,obj.desc_objeto_gasto
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				FROM NOG_T.dbo.t_fn_actividades AS act
					INNER JOIN NOG_T.dbo.t_fn_actividades_obras AS obra ON obra.cod_act_obra = act.cod_act_obra
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_fn_objetos_gastos AS obj ON obj.cod_objeto_gasto = act.cod_objeto_gasto
					INNER JOIN NOG_T.dbo.t_fn_sub_grupos_gastos AS subg ON subg.cod_sub_grupo_gasto = obj.cod_sub_grupo_gasto
					INNER JOIN NOG_T.dbo.t_fn_grupos_gastos AS gru ON gru.cod_grupo_gasto = subg.cod_grupo_gasto
					--INNER JOIN NOG_T.dbo.t_glo_municipios AS mun ON mun.cod_municipio = act.cod_municipio
					LEFT JOIN NOG_T.dbo.t_fn_proyectos AS proy ON proy.cod_proyecto = obra.cod_proyecto
					LEFT JOIN NOG_T.dbo.t_fn_sub_programas AS sub ON sub.cod_sub_programa = proy.cod_sub_programa
					LEFT JOIN NOG_T.dbo.t_fn_programas As prog
						ON prog.cod_programa = sub.cod_programa
						OR prog.cod_programa = proy.cod_programa
						OR prog.cod_programa = obra.cod_programa
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
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
								LEFT JOIN NOG_T.dbo.t_fn_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
								INNER JOIN NOG_T.dbo.t_fn_actividades AS act ON act.cod_actividad = pagos.cod_actividad
							WHERE act.estado_actividad = 1
								AND act.cod_act_obra IN (
									SELECT cod_act_obra
										FROM @act_obras
								)
							GROUP BY act.cod_actividad
					) MESES_PAGOS ON MESES_PAGOS.cod_actividad = act.cod_actividad
				WHERE act.estado_actividad = 1
					AND act.cod_act_obra IN (
						SELECT cod_act_obra
							FROM @act_obras
					)
		`

		connection.query(config, sql, (result) => {
			callback(result.recordsets)
		})
	},
	guardarActividades: (config, data, callback) => {

		let sql = `
			DECLARE @actividad INT
		`

		function insertPago(tipoMonto, mes, monto) {

			if (monto) {
				sql += `
						INSERT INTO NOG_T.dbo.t_fn_pagos_actividades ([cod_actividad],[cod_mes],[cod_tipo_monto],[monto_pago])
							VALUES (@actividad,${mes},${tipoMonto},${monto})
					`
			} else {
				sql += `
						INSERT INTO NOG_T.dbo.t_fn_pagos_actividades ([cod_actividad],[cod_mes],[cod_tipo_monto])
							VALUES (@actividad,${mes},${tipoMonto})
					`
			}

		}

		function updatePago(codActividad, tipoMonto, mes, monto) {

			if (monto) {
				sql += `
					UPDATE [NOG_T].[dbo].[t_fn_pagos_actividades]
						SET [monto_pago] = ${monto}
						WHERE [cod_actividad] = ${codActividad}
							AND [cod_mes] = ${mes}
							AND [cod_tipo_monto] = ${tipoMonto}
				`
			} else {
				sql += `
					UPDATE [NOG_T].[dbo].[t_fn_pagos_actividades]
						SET [monto_pago] = NULL
						WHERE [cod_actividad] = ${codActividad}
							AND [cod_mes] = ${mes}
							AND [cod_tipo_monto] = ${tipoMonto}
				`
			}

		}

		for (let i = 0, len = data.actividades.length; i < len; i++) {

			if (data.actividades[i].cod_actividad != null) {

				sql += `
					UPDATE [NOG_T].[dbo].[t_fn_actividades]
						SET [cod_act_obra] = ${data.actividades[i].cod_act_obra}
							,[cod_objeto_gasto] = ${data.actividades[i].cod_objeto_gasto}
							,[cod_direccion] = ${data.actividades[i].cod_direccion}
							--,[cod_municipio] = '${data.actividades[i].cod_municipio}'
							,[fecha_inicio_actividad] = '${data.actividades[i].fecha_inicio_actividad}'
							,[fecha_fin_actividad] = '${data.actividades[i].fecha_fin_actividad}'
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
					INSERT INTO [NOG_T].[dbo].[t_fn_actividades]
							([cod_act_obra]
							,[cod_objeto_gasto]
							,[cod_direccion]
							--,[cod_municipio]
							,[fecha_inicio_actividad]
							,[fecha_fin_actividad])
						VALUES
							(${data.actividades[i].cod_act_obra}
							,${data.actividades[i].cod_objeto_gasto}
							,${data.actividades[i].cod_direccion}
							--,'${data.actividades[i].cod_municipio}'
							,'${data.actividades[i].fecha_inicio_actividad}'
							,'${data.actividades[i].fecha_fin_actividad}')
						
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

		connection.query(config, sql, (result) => {
			callback(result.rowsAffected)
		})

	},
	eliminarActividad: (config, codigo, callback) => {

		let sql = `
			UPDATE [NOG_T].[dbo].[t_fn_actividades]
				SET [estado_actividad] = 0
				WHERE [cod_actividad] = ${codigo}
		`

		connection.query(config, sql, (result) => {
			callback(result.rowsAffected[0])
		})
	},
	obtenerRegionalizacionActividad: (config, codigo, callback) => {

		let sql = `
			SELECT	CONVERT(INT,cod_departamento) AS 'codigo'
					,'0000' AS 'cod_municipio'
					,desc_departamento AS 'nombre'
					,'00' AS 'padre'
					,NULL AS 'monto'
					,NULL AS 'existe'
				FROM NOG_T.dbo.t_glo_departamentos
			UNION
			SELECT	CONVERT(INT,mun.cod_municipio)
					,mun.cod_municipio
					,desc_municipio
					,CONVERT(INT,cod_departamento)
					,monto_region
					,CASE WHEN monto_region IS NOT NULL THEN 1 ELSE 0 END
				FROM NOG_T.dbo.t_glo_municipios AS mun
					LEFT JOIN NOG_T.dbo.t_fn_regionalizacion AS reg
						ON reg.cod_municipio = mun.cod_municipio
						AND cod_actividad = ${codigo}
		`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	},
	guardarRegionalizacion: (config, data, callback) => {

		let sql = ""

		function guardarRegion(cod_municipio, monto) {
			
			sql += `
				INSERT INTO [NOG_T].[dbo].[t_fn_regionalizacion] ([cod_actividad],[cod_municipio],[monto_region])
					VALUES (${data.cod_actividad}, '${cod_municipio}', ${monto})
			`
		}

		function actualizarRegion(cod_municipio, monto) {

			if (monto > 0) {
				sql += `
					UPDATE NOG_T.dbo.t_fn_regionalizacion
						SET monto = ${monto}
						WHERE cod_actividad = ${data.cod_actividad} AND cod_municipio = '${cod_municipio}'
				`
			} else {
				sql += `
					DELETE
						FROM NOG_T.dbo.t_fn_regionalizacion
						WHERE cod_actividad = ${data.cod_actividad} AND cod_municipio = '${cod_municipio}'
				`
			}
		}

		for (let i = 0, len = data.regionalizacion.length; i < len; i++) {
			if (data.regionalizacion[i].existe === 0) {
				guardarRegion(data.regionalizacion[i].cod_municipio, data.regionalizacion[i].monto)
			} else {
				actualizarRegion(data.regionalizacion[i].cod_municipio, data.regionalizacion[i].monto)
			}
		}

		connection.query(config, sql, (result) => {
			callback(result.rowsAffected)
		})

	},
	/////////////////////////////////////////////////////////////
	//REPORTES
	//----------------------------------------------------------
	//POA
	obtenerPOA: (config, callback) => {

		let sql = `
			SELECT DISTINCT nombre_gerencia, año_gerencia
				FROM NOG_T.dbo.t_fn_gerencias_administrativas
		`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	},
	obtenerActividadesPOA: (config, filtros, callback) => {

		let sql = `
			SELECT	uni.numero_unidad
					--,uni.nombre_unidad
					,SUBSTRING(prog.numero_programa,1,2) AS 'numero_programa'
					--,prog.nombre_programa
					,ISNULL(sub.numero_sub_programa,'00') AS 'numero_sub_programa'
					--,sub.nombre_sub_programa
					,ISNULL(proy.numero_proyecto,'000') AS 'numero_proyecto'
					--,proy.nombre_proyecto
					,obra.numero_act_obra
					,obra.nombre_act_obra
					,gru.cod_grupo_gasto
					,gru.nombre_grupo_gasto
					,subg.cod_sub_grupo_gasto
					,subg.nombre_sub_grupo_gasto
					,obj.cod_objeto_gasto
					,obj.desc_objeto_gasto
					,prog_01,ejec_01,prog_02,ejec_02,prog_03,ejec_03,prog_04,ejec_04,prog_05,ejec_05,prog_06,ejec_06
					,prog_07,ejec_07,prog_08,ejec_08,prog_09,ejec_09,prog_10,ejec_10,prog_11,ejec_11,prog_12,ejec_12
				FROM NOG_T.dbo.t_fn_actividades AS act
					INNER JOIN NOG_T.dbo.t_fn_actividades_obras AS obra ON obra.cod_act_obra = act.cod_act_obra
					INNER JOIN NOG_T.dbo.t_pym_direcciones AS dir ON dir.cod_direccion = act.cod_direccion
					INNER JOIN NOG_T.dbo.t_fn_objetos_gastos AS obj ON obj.cod_objeto_gasto = act.cod_objeto_gasto
					INNER JOIN NOG_T.dbo.t_fn_sub_grupos_gastos AS subg ON subg.cod_sub_grupo_gasto = obj.cod_sub_grupo_gasto
					INNER JOIN NOG_T.dbo.t_fn_grupos_gastos AS gru ON gru.cod_grupo_gasto = subg.cod_grupo_gasto
					LEFT JOIN NOG_T.dbo.t_fn_proyectos AS proy ON proy.cod_proyecto = obra.cod_proyecto
					LEFT JOIN NOG_T.dbo.t_fn_sub_programas AS sub ON sub.cod_sub_programa = proy.cod_sub_programa
					LEFT JOIN NOG_T.dbo.t_fn_programas As prog
						ON prog.cod_programa = sub.cod_programa
						OR prog.cod_programa = proy.cod_programa
						OR prog.cod_programa = obra.cod_programa
					INNER JOIN NOG_T.dbo.t_fn_unidades_ejecutoras AS uni ON uni.cod_unidad = prog.cod_unidad
					INNER JOIN NOG_T.dbo.t_fn_gerencias_administrativas AS ger ON ger.cod_gerencia = uni.cod_gerencia
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
							INNER JOIN NOG_T.dbo.t_fn_pagos_actividades AS pagos ON pagos.cod_mes = meses.cod_mes
							INNER JOIN NOG_T.dbo.t_fn_actividades AS act ON act.cod_actividad = pagos.cod_actividad
						WHERE act.estado_actividad = 1
						GROUP BY act.cod_actividad
					) MESES_PAGOS ON MESES_PAGOS.cod_actividad = act.cod_actividad
				WHERE nombre_gerencia = '${filtros.cod_gerencia}'
					AND año_gerencia = ${filtros.año_gerencia}
				ORDER BY numero_unidad, numero_programa, numero_sub_programa, numero_proyecto, numero_act_obra
		`

		connection.query(config, sql, (result) => {
			callback(result.recordset)
		})
	}
}
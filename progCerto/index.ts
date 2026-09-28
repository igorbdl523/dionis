import { db } from "./db"

const srv = Bun.serve({
    port: 3000,

    routes: {
        "/user": {

            GET: () => {
                const query = db.query(`
                    SELECT * FROM users
                `)
                const data = query.all()
                return Response.json(data)
            },

            POST: async (req) => {
                let body
                try {
                    body = await req.body.json()
                } catch (error: any) {
                    return Response.json({
                        message: "JSON mal formado",
                        parseError: error
                    }, { status: 400 })
                }

                if (!body.username)
                    return Response.json({
                        message: "Falta da informação: username"
                    }, { status: 400 })

                if (!body.email)
                    return Response.json({
                        message: "Falta da informação: email"
                    }, { status: 400 })

                if (!body.password)
                    return Response.json({
                        message: "Falta da informação: password"
                    }, { status: 400 })

                const query = db.query(`
                    INSERT INTO users(username, email, password_hash)
                    VALUES(:username, :email, :password_hash)
                `)

                try {

                    const dbResp = query.run({
                        ':username': body.username,
                        ':email': body.email,
                        ':password_hash': body.password
                    })
                    return Response.json({
                        message: "Usuário cadastrado com sucesso",
                        dbResp
                    })

                } catch (e: any) {
                    if (e.code == "SQLITE_CONSTRAINT_UNIQUE") {
                        return Response.json({
                            message: "Username e Email precisam ser únicos",
                            code: "UNIQUE:CONSTRAINT"
                        }, { status: 400 })
                    }
                    return Response.json({
                        message: "Erro ao inserir no banco de dados",
                        dbError: e
                    }, { status: 500 })
                }
            }
        },


        "/user/:id": {
            GET: (req) => {
                const id = req.params.id
                const query = db.query(`
                    SELECT * FROM users
                    WHERE id = :id
                `)
                const data = query.get({
                    ':id': id
                })
                return Response.json(data)
            },

            PUT: async (req) => {
                const body = await req.body.json()
                const query = db.query(`
                    UPDATE users
                    SET username = :username,
                        email = :email,
                        password_hash = :password
                    WHERE id = :id
                `)

                const dbResp = query.run({
                    ':username': body.username,
                    ':email': body.email,
                    ':password': body.password,
                    ':id': req.params.id
                })
                return Response.json(dbResp)
            },

            DELETE: (req) => {
                const query = db.query(`
                    DELETE FROM users
                    WHERE id = :id
                `)
                const data = query.run({
                    ':id': req.params.id
                })
                return Response.json(data)
            }
        },

        "/musica": {
            GET: () => {
                const query = db.query(`
                    SELECT * FROM musicas
                `)
                const data = query.all()
                return Response.json(data)
            },

            POST: async (req) => {
                let body
                try {
                    body = await req.body.json()
                } catch (error: any) {
                    return Response.json({
                        message: "JSON mal formado",
                        parseError: error
                    }, { status: 400 })
                }

                if (!body.nome)
                    return Response.json({
                        message: "Falta da informação: nome"
                    }, { status: 400 })

                if (!body.autor)
                    return Response.json({
                        message: "Falta da informação: autor"
                    }, { status: 400 })

                if (!body.genero)
                    return Response.json({
                        message: "Falta da informação: genero"
                    }, { status: 400 })

                const query = db.query(`
                    INSERT INTO musicas(nome, autor, genero)
                    VALUES(:nome, :autor, :genero)
                `)

                try {
                    const dbResp = query.run({
                        ':nome': body.nome,
                        ':autor': body.autor,
                        ':genero': body.genero
                    })
                    return Response.json({
                        message: "Música cadastrada com sucesso",
                        dbResp
                    })

                } catch (e: any) {

                    return Response.json({
                        message: "Erro ao inserir no banco de dados",
                        dbError: e
                    }, { status: 500 })
                }
            }
        },


        "/musica/:id": {
            GET: (req) => {
                const id = req.params.id
                const query = db.query(`
                    SELECT * FROM musicas
                    WHERE id = :id
                `)
                const data = query.get({
                    ':id': id
                })
                return Response.json(data)
            },

            PUT: async (req) => {
                const body = await req.body.json()
                const query = db.query(`
                    UPDATE musicas
                    SET nome = :nome,
                        autor = :autor,
                        genero = :genero
                    WHERE id = :id
                `)
                const dbResp = query.run({
                    ':nome': body.nome,
                    ':autor': body.autor,
                    ':genero': body.genero,
                    ':id': req.params.id
                })
                return Response.json(dbResp)
            },

            DELETE: (req) => {
                const query = db.query(`
                    DELETE FROM musicas
                    WHERE id = :id
                `)
                const data = query.run({
                    ':id': req.params.id
                })
                return Response.json(data)
            }
        }

    }
})

console.log(`Servidor em ${srv.url}`)
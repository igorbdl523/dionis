//            BANCO DE DADOS     HTTP
// [C]reat    insert             post
// [R]read    select             get
// [U]pdate   update             put
// [U]pdate   update             patch
// [D]elete   delete             delete

import frontend from "./index.html"
import { db } from "./db"

const srv = Bun.serve({
    port: 3000,
    routes: {
        "/": frontend,

        "/user": {
            GET: () => {
                const query = db.query(`SELECT * FROM users`)
                const data = query.all()
                return Response.json(data)
            },

            POST: async (req) => {
                const body = await req.body.json()
                const query = db.query(`
                    INSERT INTO users(username, email, password_hash)
                    VALUES(:username, :email, :password_hash)
                `)
                const dbResp = query.run({
                    ':username': body.username,
                    ':email': body.email,
                    ':password_hash': body.password
                })
                return Response.json({
                    "message": "deu boa garote!",
                    dbResp
                })
            },
        },

        "/user/:id": {
            GET: (req) => {
                const id = req.params.id
                const query = db.query(`SELECT * FROM users WHERE id=:id`)
                const data = query.get({ ':id': id })
                return Response.json(data)
            },

            PUT: async(req) => {
                const body = await req.body.json()
                const query = db.query(`UPDATE users SET username = :username, email = :email, password_hash = :password WHERE id = :id`)
                const dbResp = query.run({
                    ':username': body.username,
                    ':email': body.email,
                    ':password': body.password,
                    ':id': req.params.id
                })
                return Response.json(dbResp)
            },

            DELETE: (req) => {
                const query = db.query(`DELETE FROM users WHERE id=:id`)
                const data = query.run({ ':id': req.params.id })
                return Response.json(data)
            },
        },

        "/coisa": {
            GET: () => Response.json({}, { status: 501 }),
            POST: () => Response.json({}, { status: 501 }),
        },

        "/coisa/:id": {
            GET: () => Response.json({}, { status: 501 }),
            PUT: () => Response.json({}, { status: 501 }),
            DELETE: () => Response.json({}, { status: 501 }),
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
    }}
)

console.log(`Servidor em ${srv.url}`)
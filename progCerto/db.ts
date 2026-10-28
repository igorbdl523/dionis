import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");

db.query(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NULL UNIQUE,
        password_hash TEXT NOT NULL
    )
`).run();

db.query(`
    CREATE TABLE IF NOT EXISTS musicas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        autor TEXT NOT NULL,
        genero TEXT NOT NULL
    )
`).run();

export { db };
export default db
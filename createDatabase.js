const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db');

db.serialize(()=>{
  db.run('CREATE TABLE users (email NOT NULL TEXT PRIMARY KEY, designer NOT NULL INTEGER, picture BLOB, password NOT NULL TEXT )');
  db.run("CREATE TABLE projects (projectId NOT NULL INTEGER, )")
});
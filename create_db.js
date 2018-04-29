//to create a database

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run("CREATE TABLE users_account (name TEXT, email TEXT)");

  //insert 2 rows of data using sql codes:
  db.run("INSERT INTO users_account VALUES('Kyle', 'k1burt@ucsd.edu')");
  db.run("INSERT INTO users_account VALUES('Tom', 'tksmith@ucsd.edu')");

  console.log('succesffully created users table in users.db');

  db.each("SELECT name, email FROM users_account", (err,row)=>{
    console.log(row.name + ":" + row.email + '.');
  });
});


db.close();

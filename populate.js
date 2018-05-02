const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('3', '7')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('3', '9')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('4', '1')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('4', '7')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('4', '3')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('5', '2')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('5', '9')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('5', '5')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('5', '8')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('6', '3')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('6', '6')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('6', '2')");
  db.run("INSERT INTO following_projects(userId, projectId) VALUES('6', '7')");

});
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run("UPDATE projects SET mainImg = 'interior_design1.jpg' WHERE projectId = 1");
  db.run("UPDATE projects SET mainImg = 'interior_design2.jpg' WHERE projectId = 2");
  db.run("UPDATE projects SET mainImg = 'interior_design3.jpg' WHERE projectId = 3");
  db.run("UPDATE projects SET mainImg = 'interior_design4.jpg' WHERE projectId = 4");
  db.run("UPDATE projects SET mainImg = 'interior_design5.jpg' WHERE projectId = 5");
  db.run("UPDATE projects SET mainImg = 'interior_design6.jpg' WHERE projectId = 6");
  db.run("UPDATE projects SET mainImg = 'interior_design7.jpg' WHERE projectId = 7");
  db.run("UPDATE projects SET mainImg = 'interior_design8.jpg' WHERE projectId = 8");
  db.run("UPDATE projects SET mainImg = 'interior_design9.jpg' WHERE projectId = 9");


});
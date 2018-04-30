//to create a database

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  //user table
  db.run("CREATE TABLE users_account (userId INTEGER PRIMARY KEY, firstName TEXT, email TEXT, lastName TEXT, isDeveloper INTEGER)", (err, row) => {
    if(err) {
      console.log("first");
    }
  });
  db.run("CREATE TABLE projects(projectId INTEGER PRIMARY KEY, projectTitle TEXT, projectDescription TEXT, userId INTEGER, FOREIGN KEY(userId) REFERENCES users_account(userId))", (err, row) => {
    if(err) {
      console.log("seocnd");
    }
  });
  //picture table
  db.run("CREATE TABLE pictures(pictureId INTEGER PRIMARY KEY, picture BLOB, projectId INTEGER, FOREIGN KEY(projectId) REFERENCES projects(projectId))", (err, row) => {
    if(err) {
      console.log("third");
    }
  });
  //table of projects followed by users
  db.run("CREATE TABLE following_projects(followRelationshipId INTEGER PRIMARY KEY, userId INTEGER, projectId INTEGER, FOREIGN KEY(userId) REFERENCES users_account(userId), FOREIGN KEY(projectId) REFERENCES projects(projectId))", (err, row) => {
    if(err) {
      console.log("fourth");
    }
  });
  //table of projects created by users
  db.run("CREATE TABLE created_projects(createdRelationshipId INTEGER PRIMARY KEY, userId INTEGER, projectId INTEGER, FOREIGN KEY(userId) REFERENCES users_account(userId), FOREIGN KEY(projectId) REFERENCES projects(projectId))", (err, row) => {
    if(err) {
      console.log("fifth");
    }
  });
  //table of messages
  db.run("CREATE TABLE messages(messageId INTEGER PRIMARY KEY, subject TEXT, content TEXT, senderId INTEGER, FOREIGN KEY(senderId) REFERENCES users_account(userId))", (err, row) => {
    if(err) {
      console.log("sixth");
    }
  });
  //table of messages sent to users
  /**
  db.run("CREATE TABLE message_to_user(messageId INTEGER, receiverId INTEGER, FOREIGN KEY messageId REFERENCES messages(messageId), FOREIGN KEY receiverId REFERENCES users_account(userId), PRIMARY KEY(messageId, receiverId)))", (err, row) => {
    if(err) {
      console.log("seventh");
    }
  });
  */
  //primary key of table
  var id;
  //insert 2 rows of data using sql codes:
  db.run("BEGIN TRANSACTION");
  db.run("INSERT INTO users_account(firstName, email, lastName, isDeveloper) VALUES('Kyle', 'k1burt@ucsd.edu', 'Burt', '0')", function(err, row) {
    //get id of inserted user
    if (err) {
      console.log("error");
    }
    id = this.lastID + '';
    console.log(id);
  });  
  db.run("INSERT INTO projects(projectTitle, projectDescription, userId) VALUES('Blue House', 'This is a blue house'," + id + ")", (err, row) => {
    if (err) {
      console.log("aaaa");
    }
  });
  db.run("END TRANSACTION;");
  
  /**
  //checking if this works
  db.each("SELECT userId, firstName, lastName, email, isDeveloper FROM users_account", (err,row) => {
    console.log(row.userId + " " + row.firstName + " " + row.lastName + ":" + row.email + '.');
  });
  
  db.each("SELECT projectId, projectTitle, projectDescription, userId FROM projects", (err, row) => {
    console.log(row.projectId + " " + row.projectTitle + " " + row.projectDescription + " " +row.userId);
  });
  */
  
  /**
  db.run("BEGIN TRANSACTION");
  db.run("INSERT INTO users_account(firstName, email, lastName, isDeveloper) VALUES('Tom', 'tksmith@ucsd.edu', 'Tierra', '1')");
  db.run("END TRANSACTION;")
  console.log('succesffully created users table in users.db');

  db.each("SELECT userId, firstName, lastName, email, isDeveloper FROM users_account", (err,row)=>{
    console.log(row.userId + " " + row.firstName + " " + row.lastName + ":" + row.email + '.');
  });
  */
});


db.close();

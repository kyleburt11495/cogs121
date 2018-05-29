const express = require('express');
const app = express();

//multer for file upload
const multer = require('multer');

//const upload = multer({dest: 'static_files/'});

//set file destination to static_files and give each file unique name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static_files/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({storage: storage});

const bodyParser = require('body-parser');


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

app.use(express.static('static_files'));
//to insert new accounts
app.use(bodyParser.urlencoded({extended: true})); //hook to the app

app.listen(3000, () => {
  console.log('Server started');
});

app.get('/home', (req, res) => {
  console.log('Running home');
});

app.get('/messages', (req, res) => {
  console.log('Running messages');

});

app.get('/picview', (req, res) => {
  console.log('Running picview');

});

app.get('/profile', (req, res) => {
  console.log('Running profile');

});

app.get('/project', (req, res) => {
  console.log('Running project');

});


app.get('/upload', (req, res) => {
  console.log('Running upload');

});

//multer file upload
app.post('/uploadFile', upload.single('image'), (req, res) => {
  console.log(req.file.filename);
  //TODO get userId
  const userId = req.body.userId;
  console.log(req.body.userId);
  console.log(req.body.projectDescription);
  console.log(req.body.projectTitle);
  //
  db.serialize(() => {

    //insert project into the databaser
    db.run('INSERT INTO projects(projectTitle, projectDescription, mainImg, isTrending, isPopular, userId) VALUES($projectTitle, $projectDescription, $mainImg, $isTrending, $isPopular, $userId)',{
      $projectTitle: req.body.projectTitle,
      $projectDescription: req.body.projectDescription,
      $mainImg: req.file.filename,
      $isTrending: 0,
      $isPopular: 0,
      $userId: req.body.userId
    }, (err, row) => {
      if(err) {
        console.err(err.message);
      }
      /**
      db.get('SELECT * FROM projects WHERE projectId = (SELECT MAX(projectId))', (err, row) => {
        if(err) {
          console.err(err.message);
        }
        let lastInsertedId = row.projectId;
        console.log(lastInsertedId);
      });
      */
      return res.redirect('/profile.html');
    });
  });

});

//follow project
app.post('/likeProject', (req, res) => { 
  db.run("INSERT INTO likes(userId, projectId, date) VALUES($userId, $projectId, julianday('now'))", {
    $userId: req.body.userId,
    $projectId: req.body.projectId
  }, (err, row) => {
    if(err) {
      console.error(err.message);
    }
    return res.redirect('/profile.html');
  });
});

app.post('/followPerson', (req, res) => {
  db.run("INSERT INTO followed_people(userFollowingId, userFollowedId, date) VALUES($userFollowingId, $userFollowedId, julianday('now'))", {
    $userFollowingId: req.body.userFollowingId,
    $userFollowedId: req.body.userFollowedId
  }, (err, row) => {
    if(err) {
      console.error(err.message);
    }
    return res.redirect('/profile.html');
  });
});


app.get('/trending', (req, res) => {
  db.all("SELECT projects.*, users_account.firstName, users_account.lastName FROM projects INNER JOIN users_account ON projects.userId = users_account.userId WHERE isTrending = 1", (err, row)=> {
    if(err) {
      console.error(err.message);
    }
    else {
      res.send(row);
    }
  });
  /*db.all("SELECT * FROM projects WHERE isTrending = 1", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    else {
      row.forEach((e)=>{
        db.all("SELECT firstName, lastName FROM users_account WHERE userId= $userId",{$userId: e.userId},(err,row)=>{
          res.write(e);
          res.write(row);
        });
      });
      res.end();
    }
  });*/
});

app.get('/popular', (req, res) =>{
  db.all("SELECT * FROM projects WHERE isPopular = 1", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    else {
      console.log(row);
      res.send(row);
    }
  });
});

app.get('/following/:userId', (req, res) =>{
  //res.send(database);
  let userId = req.params.userId;

  //perform query to get followed images
  db.all("SELECT * FROM projects WHERE projects.projectId IN (SELECT projectId FROM following_projects WHERE userId = $userId)", {$userId: userId}, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    else {
      console.log(userId);
      console.log(row);
      res.send(row); //failed so return empty string instead of undefined
    }
  });
});

app.get('/loadProfile/:userid', (req, res) => {
  const userId = req.params.userid;
  console.log(userId);
  db.all("SELECT * FROM users_account WHERE userId=$userId", {$userId: userId}, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    if (row.length > 0) {
      console.log(row[0]);
      res.send(row[0]);
    }
    else {
      res.send({}); //failed so return empty string instead of undefined
    }
  });
});

app.get('/loadProjects/:userid', (req, res) => {
  const userId = req.params.userid;
  db.all("SELECT * FROM projects WHERE userId=$userId", {$userId: userId}, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    if (row.length > 0) {
      console.log(row);
      res.send(row);
    }
    else {
	  console.log("no projects found");
      res.send({}); //failed so return empty string instead of undefined
    }
  });
});

app.get('/search/:searchKey',(req,res) => {
  const key = req.params.searchKey;
  db.all("SELECT * FROM projects INNER JOIN users_account ON projects.userId = users_account.userId WHERE projects.projectDescription LIKE ", {$key: key}, (err,row)=>{
    if(err){
      console.error(err.message);
    } else{
      res.send(row);
    }
  });
});

//used to get userId of logged in user
app.post('/users', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.all("SELECT * FROM users_account WHERE (email = $username AND password = $password)", {$username: username, $password: password}, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    if (row.length > 0) {
      console.log(row[0]);
      res.send(row[0]);
    }
    else {
      res.send({});
    }
  });
});

app.post('/signup', (req, res)=>{
  // let match = false;
  db.all('SELECT email from users_account', (err,row)=> {
    let match = false;
    row.forEach((e) =>{
      if(e.email == req.body.email){
        console.log('match');
        match = true;
        return match;
      }
      });
    /*if(req.body.email == row.email){
      console.log("match");
      return false;
    } */


    if(match){
      console.log('user already exists');
      // res.send({});
      return;
    }
    else{
      db.run(
        'INSERT INTO users_account(firstName, email, lastName, isDesigner, password) VALUES ($firstName, $email, $lastName, $isDesigner, $password)',
        {
          $firstName: req.body.firstName,
          $email: req.body.email,
          $lastName: req.body.lastName,
          $isDesigner: req.body.isDesigner,
          $password: req.body.password,
        },
        (err) => {
          if(err) {
            console.log('error creating new user');
          } else{
            console.log("hi");
            db.each("SELECT userId, firstName, email, isDesigner FROM users_account", (err,row)=>{
              console.log(row.userId + " " + row.firstName + ":" + row.email + '.');
            });
            res.send({message:'successfuly run app.post(/signup)'});
          }
        }
      );
    }
  });
});

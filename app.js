// This file serves as the backend for our web application that calls the database to access user information.
// These calls include projects, projects likes, user follows, and user account information.

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

//edit profile (bio & picture)
// app.post('/editbio', upload.single('image'), (req, res) => {
app.post('/editbio', upload.single('image'), (req, res) =>{
  console.log(req.body.userId);
  console.log(req.body.editName);
  console.log(req.body.editLastname);
  console.log(req.body.userBio);

  const userId = req.body.userId;

  db.run("UPDATE users_account SET firstName = $firstName, lastName = $lastName, bio = $userBio, profilePicture = $profilePicture WHERE userId=$userId",
{
  $firstName: req.body.editName,
  $lastName: req.body.editLastname,
  $userBio: req.body.userBio,
  $profilePicture: req.file.filename,
  $userId: req.body.userId,
},
(err, row) => {
  if(err){
    console.log(err.message);
    res.send({}) //send empty string
  } else {
    console.log("HELLO");
    db.all("SELECT * FROM users_account WHERE userId=$userId", {$userId: userId},
    (err, row) =>{
      if(err) {
        console.log(err.message);
      } else {
        console.log('bye');
        console.log(row[0]);
        return res.redirect('/profile.html');
                // res.send(row[0]);
      }
    }
  )

  }
});
//return res.redirect('/profile.html');
});

//like project
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

//dislike project
app.post('/dislikeProject', (req, res) => {
  db.run("DELETE FROM likes WHERE userId = $userId AND projectId = $projectId", {
    $userId: req.body.userId,
    $projectId: req.body.projectId
  }, (err, row) => {
    if(err) {
      console.error(err.message);
    }
    console.log("deleted");
    return res.redirect('/profile.html');
  });
});

app.get('/isProjectLiked/:userId/:projectId', (req, res) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  db.all("SELECT * FROM likes WHERE userId = $userId AND projectId = $projectId", {
    $userId: userId,
    $projectId: projectId
  }, (err, row) => {
    if (err) {
      console.err(err.message);
    }
    if(row.length > 0) {
      res.send(row[0]);
    }
    else {
      res.send(null);
    }
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
  db.all("SELECT likes.projectId, projects.projectTitle, projects.projectDescription, projects.mainImg, projects.userId, users_account.firstName, users_account.lastName, COUNT(*) FROM likes INNER JOIN projects ON projects.projectId = likes.projectId INNER JOIN users_account ON projects.userId = users_account.userId WHERE likes.date BETWEEN julianday('now', '-7 days') AND julianday('now') GROUP BY likes.projectId ORDER BY count(*)", (err, row)=> {
    if(err) {
      console.error(err.message);
    }
    else {
      res.send(row);
    }
  });
});

app.get('/popular', (req, res) =>{
  db.all("SELECT likes.projectId AS projectId, projects.projectTitle AS projectTitle, projects.projectDescription AS projectDescription, projects.mainImg AS mainImg, projects.userId AS userId, users_account.firstName AS firstName, users_account.lastName AS lastName, COUNT(*) FROM likes INNER JOIN projects ON projects.projectId = likes.projectId INNER JOIN users_account ON projects.userId = users_account.userId GROUP BY likes.projectId ORDER BY COUNT(*) DESC", (err, row) => {
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
  db.all("SELECT projects.*, users_account.firstName, users_account.lastName FROM projects INNER JOIN users_account ON projects.userId = users_account.userId WHERE projects.projectId IN (SELECT projectId FROM following_projects WHERE userId = $userId)", {$userId: userId}, (err, row) => {
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

app.get('/getFollows/:userId', (req, res) => {
  db.all("SELECT followedPeopleId, userFollowingId, userFollowedId, date(date) AS date FROM followed_people WHERE userFollowedId = $userId ORDER BY date DESC LIMIT 10", {$userId: req.params.userId}, (err, row) => {
    if(err) {
      console.error(err.message);
    }
    res.send(row);
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

app.get('/getProject/:projId',(req,res)=>{
  const projId = req.params.projId;
  db.all("SELECT projects.*, users_account.firstName, users_account.lastName FROM projects INNER JOIN users_account ON projects.userId=users_account.userId WHERE projectId=$projId",{$projId: projId}, (err,row) => {
    if(err) {
      console.error(err.message);
    } else {
      console.log(row);
      res.send(row);
    }
  });
});

app.get('/getAmountOfLikes/:projectId', (req, res) => {
  db.all("SELECT * FROM likes where projectId = $projectId LIMIT 10", {$projectId: req.params.projectId}, (err, row) => {
    if(err) {
      console.error(err.message);
    }
    res.send(row);
  });
});

app.post('/postComment', (req, res) => {
  console.log(req.body.userId);
  console.log(req.body.projectId);
  console.log(req.body.commentText);
  db.run("INSERT INTO comments(userId, projectId, commentText, time) VALUES($userId, $projectId, $commentText, julianday('now'))", {
    $userId: req.body.userId,
    $projectId: req.body.projectId,
    $commentText: req.body.commentText
  }, (err, row) => {
    if(err) {
      console.error(err);
    }
    res.send({message: 'successfully inserted comment into database'});
  });
});

app.get('/getComments/:projectId', (req, res) => {
  db.all("SELECT comments.userId AS userId, comments.commentText AS commentText, users_account.firstName as firstName, users_account.lastName AS lastName FROM comments LEFT JOIN users_account ON users_account.userId = comments.userId WHERE projectId = $projectId ORDER BY comments.time DESC", {$projectId: req.params.projectId}, (err, row) => {
    if(err) {
      console.error(err);
    }
    console.log(row);
    res.send(row);
  });
});
app.post('/createNewConversation', (req, res) => {
  //order ids so that smaller id is userId1 and larger is userId2
  let userId1;
  let userId2;

  if(req.body.userId < req.body.profileClickedId) {
    userId1 = req.body.userId;
    userId2 = req.body.profileClickedId;
  }
  else {
    userId1 = req.body.profileClickedId;
    userId2 = req.body.userId;
  }

  db.run("INSERT INTO conversations(userId1, userId2) VALUES($userId1, $userId2)", {
    $userId1: userId1, $userId2: userId2
  }, (err, row) => {
    if (err) {
      console.error(err);
    }
    res.send({message: 'sucees'});

  });
});

app.get('/getProjectsAndLikes/:userId', (req, res) => {
  db.all("SELECT * FROM projects LEFT OUTER JOIN likes ON (likes.userId = projects.userId) WHERE projects.userId = $userId", {$userId: req.params.userId}, (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    if(row.length > 0) {
      console.log(row);
      res.send(row);
    }
    else {
      res.send({});
    }
  });
});


app.get('/getConversations/:userId', (req, res) => {
  const userId = req.params.userId;
  db.all("SELECT userId1, userId2, firstName, lastName FROM conversations INNER JOIN users_account ON (conversations.userId1 = users_account.userId or conversations.userId2 = users_account.userId) WHERE ((conversations.userId1 = $userId OR conversations.userId2 = $userId) AND (users_account.userId != $userId))", {$userId: userId}, (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    if (rows.length > 0) {
      console.log(rows);
      res.send(rows);
    }
    else {
      console.log("no projects found");
      res.send([]); //failed so return empty string instead of undefined
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
  const key = '%' + req.params.searchKey + '%';
  console.log("BACK " + req.params.searchKey);
  db.all("SELECT users_account.userId, users_account.firstName, users_account.email, users_account.lastName, users_account.isDesigner, users_account.profilePicture, users_account.bio, projects.projectId, projects.projectTitle, projects.projectDescription, projects.isTrending, projects.isPopular, projects.mainImg FROM users_account LEFT JOIN projects ON projects.userId = users_account.userId WHERE projects.projectDescription LIKE $key OR projects.projectTitle LIKE $key OR users_account.firstName || ' ' || users_account.lastName LIKE $key OR users_account.lastName LIKE $key OR users_account.firstName LIKE $key", {$key: key}, (err,row)=>{
    if(err){
      console.error(err.message);
    } else{
      console.log("SEARCH: ");
      console.log(row);
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
    if(match){
      console.log('user already exists');
      res.send({});
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
        (err, row) => {
          if(err) {
            console.log(err.message);
            res.send({}) //send empty string
          }
          else{
            const user_email = req.body.email;
            db.all('SELECT * from users_account WHERE email = $user_email', {$user_email: user_email},
            (err, row) => {
              if(err){
                console.log(err.message);
              } else{
                console.log('New user');
                console.log(row[0]);
                res.send(row[0]);

              };
            });

          };
        }
      );
    };
  });
});

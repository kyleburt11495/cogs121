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

// //send bird api
// import * as SendBird from 'SendBird';
// const sb = new SendBird({'appId': '02CF44A7-02AA-4F78-82EA-93CEE2CC5FCF'
// });
//
// sb.connect(userId, (user, error) => {
//
// });



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

app.get('/getFollows/:userId', (req, res) => {
  db.all("SELECT followedPeopleId, userFollowingId, userFollowedId, date FROM followed_people WHERE userFollowedId = $userId ORDER BY date DESC", {$userId: req.params.userId}, (err, row) => {
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

app.get('/getAmountOfLikes/:projectId', (req, res) => {
  db.all("SELECT * FROM likes where projectId = $projectId", {$projectId: req.params.projectId}, (err, row) => {
    if(err) {
      console.error(err.message);
    }
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
  
  db.run("INSERT INTO conversations(userId1, userId2, date) VALUES($userId1, $userId2, $date)", {
    $userId1: userId1, $userId2: userId2
  }, (err, row) => {
    if (err) {
      console.error(err);
    }
    return res.redirect('/messages.html');
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


app.get('/searchForUsers/:searchValue', (req, res) => {
  const userId = '%' + req.params.searchValue + '%';
  console.log(userId);
  db.all("SELECT * FROM users_account WHERE firstName LIKE $userId", {$userId: userId}, (err, row) => {
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

// app.get('firstName/:lastName', (req, res) => {
//   const firstName = req.params.firstName;
//   const lastName = req.params.lastName;
//
//   console.log(firstName);
//   console.log(lastName);
//
//   db.all('SELECT * FROM users_account WHERE (firstName = $firstName OR lastName = $lastName',{
//     $firstName:firstName,
//     $lastName:lastName
//   },(err, row) => {
//     if(err) {
//       console.error(err.message);
//       console.log('err');
//     }
//     if (row.length > 0) {
//       console.log(row[0]);
//       res.send(row[0]);
//
//       console.log('hello');
//     }
//     else {
//       res.send({}); //failed so return empty string
//       console.log('failed');
//     }
//   });
// })



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
  db.all("SELECT * FROM users_account LEFT JOIN projects ON projects.userId = users_account.userId WHERE projects.projectDescription LIKE $key OR projects.projectTitle LIKE $key OR users_account.firstName LIKE $key OR users_account.lastName LIKE $key", {$key: key}, (err,row)=>{
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

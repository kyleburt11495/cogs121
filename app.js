const express = require('express');
const app = express();

const bodyParser = require('body-parser');


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

app.use(express.static('static_files'));
//to insert new accounts
app.use(bodyParser.urlencoded({extented: true})); //hook to the app

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

//Simulate database in memory
//Trending, popular, following
const trending = {
  img1:'interior_design1.jpg', img2:'interior_design2.jpg', img3:'interior_design3.jpg', img4:'interior_design5.jpg'
};

const popular = {
  img1:'interior_design4.jpg', img2:'interior_design5.jpg', img3:'interior_design6.jpg', img4: 'interior_design2.jpg'
};

const following = {
  img1:'interior_design7.jpg', img2:'interior_design8.jpg', img3: 'interior_design9.jpg', img4: 'interior_design6.jpg'
};

const trendingStories = {
  img1:'story1.jpg', img2:'story2.jpg', img3:'story3.jpg', img4:'story4.jpg',
  img5:'story5.jpg'
};

const popularStories = {
  img1:'story3.jpg', img2:'story7.jpg', img3:'story8.jpg', img4:'story9.jpg',
  img5:'story2.jpg'
};

const followingStories = {
  img1:'story4.jpg', img2:'story1.jpg', img3:'story8.jpg', img4:'story6.jpg',
  img5:'story5.jpg'
};

const database = {
  trendingProjects: trending,
  popularProjects: popular,
  followingProjects: following,
  trendingStories: trendingStories,
  popularStories: popularStories,
  followingStories: followingStories
};

app.get('/trending', (req, res) => {
  db.all("SELECT * FROM projects WHERE isTrending = 1", (err, row) => {
    if (err) {
      console.error(err.message);
    }
    else {
      console.log(row);
      res.send(row);
    }
  });
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
  db.all("SELECT mainImg FROM projects WHERE userId=$userId", {$userId: userId}, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    if (row.length > 0) {
      console.log(row);
      res.send(row);
    }
    else {
      res.send({}); //failed so return empty string instead of undefined
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
    })
    console.log('it exist', match);
    // console.log(match);
    if(match){
      console.log('user already exist');
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
 //  else{
 //    // let match = false;
 //    // db.all("SELECT email FROM users_account", (err,row)=>{
 //    //     row.forEach((e)=> {
 //    //     if(e.email == req.body.email){
 //    //       console.log("match");
 //    //       res.send({});
 //    //
 //    //     }
 //    //     };
 //    //   /*if(req.body.email == row.email){
 //    //     console.log("match");
 //    //     return false;
 //    //   } */
 //    //   if(match){
 //    //     res.send({});
 //    //   } else {
 //    db.run(
 //      'INSERT INTO users_account(firstName, email, lastName, isDesigner, password) VALUES ($firstName, $email, $lastName, $isDesigner, $password)',
 //      {
 //        $firstName: req.body.firstName,
 //        $email: req.body.email,
 //        $lastName: req.body.lastName,
 //        $isDesigner: req.body.isDesigner,
 //        $password: req.body.password,
 //      },
 //      (err) => {
 //        if(err) {
 //          console.log('error creating new user');
 //        } else{
 //          console.log("hi");
 //          db.each("SELECT userId, firstName, email, isDesigner FROM users_account", (err,row)=>{
 //            console.log(row.userId + " " + row.firstName + ":" + row.email + '.');
 //          });
 //          res.send({message:'successfuly run app.post(/signup)'});
 //        }
 //      }
 //    );
 // }
//  }
//  });
});

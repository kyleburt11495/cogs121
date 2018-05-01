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
  res.send(database);
});

app.get('/popular', (req, res) =>{
  res.send(database);
});

app.get('/following', (req, res) =>{
  res.send(database);
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
  console.log(req.body);
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
});

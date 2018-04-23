const express = require('express');
const app = express();

app.use(express.static('static_files'));

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
                 }

app.get('/trending', (req, res) => {
  res.send(database);
});

app.get('/popular', (req, res) =>{
  res.send(database);
});

app.get('/following', (req, res) =>{
  res.send(database);
});

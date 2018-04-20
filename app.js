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
  console.log('Running home');

});

app.get('/picview', (req, res) => {
  console.log('Running home');

});

app.get('/profile', (req, res) => {
  console.log('Running home');

});

app.get('/project', (req, res) => {
  console.log('Running home');

});

app.get('/upload', (req, res) => {
    console.log('Running home');

});
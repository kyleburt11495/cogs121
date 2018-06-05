# Final.md

Link to demo video:
https://youtu.be/6BPU7R9hVV4

Revised Version:
https://youtu.be/04IK8EtuNxA

Group Members:
Vincent Tierra
Kyle Burt
Lynley Yamaguchi
Sumedha Gupta

Contributions:
Sumedha: Took care of all the logistical work for all the milestones including creating the markdown files. Did styling for all the pages in the web application and minor functionality. Also created most of the html/css templates. Took care of all the video components for the final deadline.

Lynley: Implemented search functionality and created templates to load projects and profiles for both the home page and the search results page. Implemented hovering functionality on homepage and display of project modals with correct redirection to project owner profiles.

Vincent: Implemented sign up and login. Implemented the edit profile modal for the end user to edit their bio and upload a profile picture. Assisted with both the front-end and backend development of the web application. Worked with sumedha with styling the pages and minor application.

Kyle: Implemented most of the back end code. Designed database model. Implemented data visualization, file upload, following designers, liking projects. Used sendbird API to implement messaging. Did some front end HTML design

Source Files:

Home.html
This is the homepage of the web application that displays projects for exploration including trending projects, popular projects, and projects of the people you follow. Trending projects are the projects that have the most likes over the current week period. Popular projects are the projects that have the most likes overall. When you hover over a project, the project creator will appear, as well as a like button. Users can click on the project creators name to view their profile and check out their other projects. From the homepage, users can view their profile or messages in the nav bar menu. Users can also search key words or names to find related projects and other designers.

Home.css
This file contains all of the styling for the homepage found in home.html.

Profile.html
This is the user profile page. When a logged in user views their profile page, they can edit their bio information and add new projects. When a user views another users profile, they can view their projects. Clicking on a project shows more of the project information as well as gives users the ability to like a project. The profile page ‘stats’ tab displays the tables that show the number of likes each of the projects has, as well as the number of followers. These tables are created using the c3 API.

Profile.css
This file contains all of the styling for the profile page found in profile.html.

App.js
This file serves as the backend for our web application that calls the database to access user information. These calls include projects, projects likes, user follows, and user account information.

 Login.html
This file serves as the login page for the web application. After filling out a form containing email and password, a SQL query will be made to check if these fields match a profile saved in the database. If it does, the user will be redirected to the home page

Login.css
This file contains the stylesheet for the login html page.

Signup.html
This file serves as the sign up page for the web application.  In this page, the user can create a new account. The new users are then stored in the database using a SQL query. This page also includes an error check to prevent the users from creating an account with the same email.

Signup.css
This file contains all the styling for the signup page

Search.html
This is the search results page that contains all related results from the user searching up a certain term. The word searched will provide all the results including the users associated with the term and the projects/photos associated with it.

Search.css
This file contains all the styling for the search results page.

Messages.html
This file contains the code used for instant messaging between users. A user can switch between different conversations with users. Messaging is implemented using sendbird API

Messages.css
This file contains the style sheet for the messages.html.

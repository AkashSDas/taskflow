# taskflow

Minimalist task management app for managing your 🧤 tasks. It's a full-stack app built with JavaScript, ReactJS, ExpressJS, and MongoDB.

## Features

- Create and delete tasks
- Tasks have status (to-do, in-progress, done)
- Add multiple todos to a task
- Todos have status (to-do, done)
- Signup and login with email and password
- Signup with AppWrite email and password (just for developement stage)

## Getting started

Setting up front-end and back-end info are included in the respective folders README.

## Tech stack

`🖥️` Front-end

- ReactJS
- React router dom
- React query
- Chakra UI
- Jotai
- React hook form
- FontSource (Urbanist font)

`💽` Back-end

- ExpressJS
- MongoDB (Mongoose)
- Argon2
- JsonWebToken

## Authentication

Authentication is done with JWTs where access token is sent to the user and refresh token is stored in the cookie.

## AppWrite

AppWrite is used in the front-end for signing up the user. It takes the user email and password, signs up the user using AppWrite and saves the user in the database and use access token and refresh token for auth purpose.

/*----------------------------importing-------------------*/
// include express
const express = require('express');
/* create an express instance */
const app = express();
/* include  HTTP module and create HTTP server */
const server = require('http').Server(app);
/* include uuid to create short non-sequential url-friendly unique ids */
const { v4: uuidV4 } = require('uuid');
const io = require('socket.io')(server);
//create peer server
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
/*------------------------x----------------importing----------------x----------------*/
/*-----------------------firebase----------------------------------*/
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Use the absolute path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/*-----------x--------------firebase----------------x------------*/
/*--------------------------middlewares----------*/
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const csrfMiddleware = csrf({ cookie: true });
/*-------------x-----------middlewares------------x--------------*/
app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});
/*---------------------------app-routes----------------------------*/
app.get('/', (req, res) => {
   //validate authenticated user
   const sessionCookie = req.cookies.session || "";

   admin
     .auth()
     .verifySessionCookie(sessionCookie, true /** checkRevoked */)
     .then(() => {
       // if valid user
       res.render('home');
     })
     .catch((error) => {
       // not valid
       res.render('home2');
     });
  
})
app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});
app.get('/rooms', function (req, res) {
  //validate authenticated user
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      // if valid user
      res.redirect(`/${uuidV4()}`);
    })
    .catch((error) => {
      // not valid
      res.redirect("/login");
    });
});
app.post("/sessionLogin", (req, res) => {
  // create idToken
  const idToken = req.body.idToken.toString();
  //lasts for 5 days
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  //create session cookie to keep user information persistent for 5 days
     admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});
app.get("/sessionLogout", (req, res) => {
    //clear all cookies
    res.clearCookie("session");
    //stop showing protected pages
    res.redirect("/login");
});
app.get('/:room', (req, res) => {
  //validate user
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      // if valid render room resource
      res.render('room', { roomId: req.params.room })
    })
    .catch((error) => {
      // not valid redirect
      res.redirect("/login");
    });
    
})
/*-----------------x---------------app-routes-----------------x-----------------*/
// map current users with thier username name
const users={}
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId,username) => {
    socket.join(roomId)
    //map each userid with username
    users[socket.id]=username
    // if user connected notify all other users of room
    socket.broadcast.to(roomId).emit('user-connected', userId);
    // listen on receiving  a message input 
    socket.on('message', (message) => {
    //send message to the same room
    // emit message to all participants
    //console.log(users[socket.id])
    io.to(roomId).emit('createMessage', {messages:message,username:users[socket.id]})
    })
    //handle disconnect event
    socket.on('disconnect', () => {
      // if user connected notify all other users of room
    socket.broadcast.to(roomId).emit('user-disconnected', userId)
    delete users[socket.id]
  
  }); 


   
  })
})
//server listening on port 
server.listen(process.env.PORT||3000);
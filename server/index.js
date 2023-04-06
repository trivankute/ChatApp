require('dotenv').config()
const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const ExpressError = require('./utils/ExpressError')
const socket_io = require("socket.io")
const cors = require("cors");
const bodyParser = require("body-parser")

const io = new socket_io.Server(httpServer, {
  cors: {
    
    // origin: "http://localhost:3000",
    origin: "*",
    methods:['GET',"POST"]
  },
});

app.use(cors({
  // origin: "http://localhost:3000", // allow to server to accept request from different origin
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // allow session cookie from browser to pass through
}))
// //////////////////////////////////////////
const mongoose = require("mongoose")
const dbUrl = process.env.DB_URL 
|| "mongodb://localhost:27017/small-chat-app"
const User = require('./models/users')
mongoose.connect(dbUrl,{
})
  .then(() => console.log("Connection to mongoDB opens"))
  .catch(error => handleError(error));
function handleError(error) {
    console.log(error)
}
// //////////////////////////////////////////
// Routes
const userRoutes = require('./routes/users')
const chatroomsRoutes = require('./routes/chatrooms')
const profileRoutes = require('./routes/profile')
// /////////////////////////////////////////
app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true })) // handle URL-encoded data
app.use(express.urlencoded({extended:true}))

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
// const MongoDBStore =  require('connect-mongo')


const secret = "trivandeptrai"
// const options = {
//   mongoUrl:dbUrl,
//   secret,
//   touchAfter: 24*60*60
// }
app.use(session({
  // store:MongoDBStore.create({...options}),
  // name:"_van",
  resave:false,
  saveUninitialized:true,
  secret,
  cookie:{
      httpOnly:true,
      secure: (process.env.NODE_ENV && process.env.NODE_ENV == 'production') ? true:false,
      expires: Date.now() + 1000*60*60*24*7,
      maxAge:1000*60*60*24*7
  }
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// passport not working in create the session in client
app.get('/',(req,res)=>{
  // console.log(req.user)
  if(req.user)
  res.json({state:"success",user:req.user})
  else
  {
    res.json({state:"fail",user:""})
  }
})

app.post('/',async (req,res)=>{
  // console.log(req.user)
  const {id} = req.body
  const user = await User.findById(id)
  res.json({state:"success",user:user})
})


app.use('/',userRoutes)
app.use('/profile',profileRoutes)
app.use('/chatrooms',chatroomsRoutes)

let allUsersArray = {}
io.on('connection', (socket)=>{
  console.log("a user connected", socket.id)
  socket.on('forSetUser',(friendName, forFlash="", state="success", signal=false)=>{
    if(allUsersArray[friendName])
    {
      io.sockets.to(allUsersArray[friendName]).emit("forSetUser", signal, forFlash, state)
    }
  })
  socket.on('addFriendSuccess',(friendName)=>{
    io.sockets.to(allUsersArray[friendName]).emit("addFriendSuccess", friendName)
  })
  socket.on('sendText',(chatPageID)=>{
    let room = io.sockets.adapter.rooms.get(chatPageID)
    if(room)
    {
      let roomSocketID = [...room]
      let userSocketID = socket.id
      let fenSocketID
      if(roomSocketID[0]===userSocketID)
        fenSocketID = roomSocketID[1]
      else
        fenSocketID = roomSocketID[0]
      io.sockets.to(fenSocketID).emit("afterFirstPersonSendText")
    }
  })
  socket.on('joinRoom',(chatPageID)=>{
    socket.join(chatPageID)
  })
  socket.on('checkFriendOnline',async (username)=>{
    try{
        if(username)
        {
          const user = await User.findOne({username:username})
          user.friends.forEach((friend)=>{
            if(allUsersArray[friend.username])
            {
              friend.online=true;
            }
            else
            {
              friend.online=false;
            }
          })
          await user.save()
          io.sockets.to(allUsersArray[username]).emit('afterCheckFriendOnline',user)
        }
    }
    catch(e)
    {
      console.log(e)
    }
  })
  socket.on('aUserOnline',(username)=>{
    allUsersArray[username] = socket.id
    io.emit('afterAUserOnlineOrOff')
  })
  socket.on('aUserOffline',(username)=>{
    allUsersArray[username] = false
    io.emit('afterAUserOnlineOrOff')
  })
})

// chan. loi~ voi all and *, khi tat ca path deu ko vao, hoac match vs bat ki cai tren hoac path strange
app.all('*',(req,res,next)=>{
  next(new ExpressError("Page not found",404))
})
app.use((err,req,res,next)=>{
  const {message = "Syntax error",status = 500} = err
  res.json({state:"fail",status,message})
})

httpServer.listen(process.env.PORT||3001,(res,req)=>{
  console.log('server is on')
})

const User = require('../models/users')

const forRegister = async (req,res,next)=>{
    const {username,password} = req.body
    const user = await new User({username:username})
    const newUser = await User.register(user, password)
    req.logIn(newUser,(err)=>{
      if(err) return next(err)
      else
      {
          let result = {state:'success',user:req.user}
          res.send(JSON.stringify(result))
      }
    })
}

const forLogout = (req,res,next)=>{
    if(req.user)
    {
      req.logOut((err)=>{
        if(err) {next(err)}
        else
        {
          res.json('success')
        }
      })
    }
    else
    {
      let err = {state:"fail",status:404, message:"You are not logged in"}
      next(err)
    }
}

const forLogin = async (req,res,next)=>{
  // req.login(req.user, (err) => 
  //   {if(err) {err.message="Username or password was not correct.";next(err)}
  //   else
  //   {
      res.json({state:'success',user: req.user})
    // }}
    // )
}

module.exports = {
    forRegister,
    forLogout,
    forLogin,
}
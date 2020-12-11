const localStrategy = require('passport-local').Strategy
const userFunction = require("./userFunctions")

function initialize(passport){
    const authenticateUser = (email,password,done) =>{
        const user = userFunction.userEmail(email)
        if (user==null){
            return done(null,false,{message:"User Not Found"})
        }
        else{
            userFunction.checkPassword(password).then((status)=>{
                if(status){
                    return done(null,user)
                }else{
                    return done(null,false,{message:"Password Incorrect"})
                }
            })
        }
    } 
passport.use(new LocalStrategy({usernameField:Email}),authenticateUser)
passport.serializeUser((user, done)=>{ })
passport.deserializeUser((id, done)=>{ })

}
module.exports = initialize
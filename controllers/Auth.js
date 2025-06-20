const User = require("../models/userModel.js")
const argon2 = require("argon2")

const Login = async(req,res)=>{
    const user = await User.findOne({
        where:{
            email:req.body.email
        }
    });
    if (!user) return res.status(404).json({msg:"User not  found"});
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({msg:"wrong password"});
    const uuid=user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    const profileImage=user.profileImage;
    res.status(200).json({uuid,name,email,role,profileImage});
 
}

const Me = async(req,res)=>{
    if(!req.session.userId){
        return res.status(401).json({msg:"please log in to yourt account"});
    }
    const user = await User.findOne({
        attributes:['uuid','name','email','role','profileImage'],
        where:{
            uuid:req.session.userId
        }
    });
    if (!user) return res.status(404).json({msg:"User not  found"});
    res.status(200).json(user);
}

const logOut = (req,res)=>{
    req.session.destroy((err)=>{
        if (err) return res.status(400).json({msg:"canot log out"});
        res.status(200).json({msg:"Logged out"});
    });
}

module.exports = {
    Login,
    Me,
    logOut
};
import bcrypt from "bcrypt";
import User from "../models/user.model.js"
import generateJWTTokenAndSetCookie from "../utils/generateToken.js";

const signup = async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);       
        const foundUser = await User.findOne({username});
        if(foundUser) {
            res.status(201).json({message: 'Username already exists'});
        } else {
            const user = new User({username: username, password: hashedPassword});
            console.log(user);
            await user.save();
            generateJWTTokenAndSetCookie(user._id, res);
            res.status(201).json({message: 'User signed up successfully'});
        }
 
        
    } catch (error) {
        console.log(error);
    }
}


export const login = async (req, res) => {
    try {
        const {username, password} = req.body;      
        const foundUser = await User.findOne({username});
        if(!foundUser) {
            res.status(401).json({message: 'Auth failed'});
        } else {
            const hashpasswordMatch = await bcrypt.compare(password, foundUser?.password); 
            if(!hashpasswordMatch) {
                res.status(401).json({message: 'Auth failed'});
            }            
            generateJWTTokenAndSetCookie(foundUser._id, res);
            res.status(201).json({_id:foundUser._id, username: foundUser.username, message: 'User logged in successfully'});
        }
 
        
    } catch (error) {
        console.log(error);
    }
}

export default signup;
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/error.js";

const signup = async (req, res, next) => {    
    console.log('Signup request received:', req.body);  

    const { name, email, password } = req.body;

    if (!name || !email || !password) {  
        return res.status(400).json({ message: 'Please fill all the fields!' });
    }
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists!' });
      }
      if (existingUser.name === name) {
        return res.status(400).json({ message: 'username already exists!' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = new   User({  
        name,
        email,
        password : hashedPassword,
    });  

   newUser.save()
        .then(() => {
            console.log('User saved successfully:', newUser);
            res.status(201).json({ message: 'User signed up successfully!' });
        })
        .catch((err) => {
           next(errorHandler(500, 'Error saving user to database')); 
        });
  }
  catch (error) {
    next(error)
  }
}       
export default signup; 
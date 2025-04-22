import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";

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


export const signin = async (req, res, next) => {
  const { email, password } = req.body; 

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all the fields!' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) { 
      return res.status(400).json({ message: 'Invalid Email or Password!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid Email or Password!' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
    user.password = undefined; // Remove password from the user object before sending it in the response

    res.status(200).json({ message: 'User signed in successfully!', user });

  } catch (error) {
    next(error);
  }
}


export const googleSignIn = async (req, res, next) => { 
  const { name, email, profilePic } = req.body; 

  if (!name || !email || !profilePic) {
    return res.status(400).json({ message: 'Please fill all the fields!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
      existingUser.password = undefined; // Remove password from the user object before sending it in the response

      return res.status(200).json({ message: 'User signed in successfully!', user: existingUser });
    }

    const generatedPassword = Math.random().toString(36).slice(-8); // Generate a random password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10); // Hash the generated password
    const newUser = new User({
      name : req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), // Remove spaces and convert to lowercase
      email,
      password: hashedPassword,
      profilePic,
    });

    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '100h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
    newUser.password = undefined; // Remove password from the user object before sending it in the response
    
    res.status(201).json({ message: 'User signed up successfully!', user: newUser });

  } catch (error) {
    next(error);
  }
}

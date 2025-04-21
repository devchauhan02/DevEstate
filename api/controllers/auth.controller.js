import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const signup = async (req, res, next) => {    
    console.log('Signup request received:', req.body);  

    const { name, email, password } = req.body;

    if (!name || !email || !password) {  
        return res.status(400).json({ message: 'Please fill all the fields!' });
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
        })
        .catch((err) => {
           next(err); 
        });

    res.status(201).json({ message: 'User signed up successfully!' });
}       
export default signup; 
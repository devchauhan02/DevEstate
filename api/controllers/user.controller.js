import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';



export const updateProfilePic = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user.id; // Assuming you have user authentication

  try {
    const user = await User.findByIdAndUpdate(userId, { profilePic }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile picture updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile picture', error });
  }
};


export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, profilePic } = req.body;

  try {
    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (profilePic) updatedFields.profilePic = profilePic;

    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10); 
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    updatedUser.password = undefined;
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
import User from '../models/user.model.js';

const test = (req, res) => {     
  res.send('Api is working!');
}   

export default test

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
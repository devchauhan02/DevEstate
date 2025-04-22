import express from 'express';
import { updateProfilePic , updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.put('/updateProfilePic' , updateProfilePic)
router.post('/update/:id' ,verifyToken, updateUser);

export default router;
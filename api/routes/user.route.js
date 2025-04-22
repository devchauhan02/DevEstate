import express from 'express';
import test  from '../controllers/user.controller.js';
import { updateProfilePic } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);
router.put('/updateProfilePic' , updateProfilePic)

export default router;
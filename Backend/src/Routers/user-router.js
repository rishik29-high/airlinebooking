import express from "express";

import { create } from '../Controllers/user-controller.js';

const router=express.Router()

router.post('/signup', create)

export default router;



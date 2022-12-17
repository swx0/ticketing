import express from 'express';
import { currentUser } from '@ticx/common';

const router = express.Router();

// middleware currentUser is used
router.get('/api/users/currentuser', currentUser, (req, res) => {
  // send back null if req.currentUser is undefined
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

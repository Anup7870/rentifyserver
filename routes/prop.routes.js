import express from 'express';
import { createProperty } from '../controllers/prop.controllers.js';
import { getProp } from '../controllers/prop.controllers.js';
import { like } from '../controllers/prop.controllers.js';
import { contact } from '../controllers/prop.controllers.js';
import { deleteProp } from '../controllers/prop.controllers.js';
const router = express.Router();

router.post('/create',createProperty) 
router.get('/get',getProp )
router.post("/like",like);
router.post("/contact",contact);
router.delete("/delete",deleteProp);
export default router;
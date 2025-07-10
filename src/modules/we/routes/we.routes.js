import { Router } from 'express';
import weController from '../controllers/we.controller.js';

const router = Router();

router.get("/dm/:username", weController.getChatRoomPartial);

router.get("/", weController.chatHome);



export default router;

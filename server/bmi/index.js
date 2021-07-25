import { Router } from 'express';
const router = new Router();
import * as controller from './bmi.controller';

router.post('/processdata',controller.processdata);



module.exports = router;
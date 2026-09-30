import { Router } from 'express';
import { DataController } from '../controllers/DataController';
import { ProcessData } from '../../application/useCases/ProcessData';
import { GetUserOwnData } from '../../application/useCases/GetUserOwnData';
import { SqliteUserRepository } from '../../infrastructure/repositories/SqliteUserRepository';
import { SqliteDataRepository } from '../../infrastructure/repositories/SqliteDataRepository';
import { authenticate, authorizeOwner } from '../middleware/AuthMiddleware';

const router = Router();
const userRepo = new SqliteUserRepository();
const dataRepo = new SqliteDataRepository();
const processData = new ProcessData(dataRepo);
const getUserOwnData = new GetUserOwnData(userRepo, dataRepo);
const controller = new DataController(processData, getUserOwnData);

router.post('/process', authenticate, (req, res) => controller.process(req, res));
router.get('/user/:userId', authenticate, authorizeOwner, (req, res) => controller.getOwn(req, res));

export default router;

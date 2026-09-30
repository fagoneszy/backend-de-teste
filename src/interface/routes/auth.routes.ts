import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RegisterUser } from '../../application/useCases/RegisterUser';
import { LoginUser } from '../../application/useCases/LoginUser';
import { SqliteUserRepository } from '../../infrastructure/repositories/SqliteUserRepository';
import { antiFraudChain } from '../middleware/AntiFraudValidators';

const router = Router();
const userRepo = new SqliteUserRepository();
const registerUser = new RegisterUser(userRepo);
const loginUser = new LoginUser(userRepo);
const controller = new AuthController(registerUser, loginUser);

router.post('/register', ...antiFraudChain, (req, res) => controller.register(req, res));
router.post('/login', (req, res) => controller.login(req, res));

export default router;

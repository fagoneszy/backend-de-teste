import { Request, Response } from 'express';
import { RegisterUser } from '../../application/useCases/RegisterUser';
import { LoginUser } from '../../application/useCases/LoginUser';

export class AuthController {
  constructor(private registerUser: RegisterUser, private loginUser: LoginUser) {}

  async register(req: Request, res: Response) {
    try {
      const user = await this.registerUser.execute(req.body);
      res.status(201).json({ message: 'Registro confirmado', id: user.id, email: user.email, name: user.name });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.loginUser.execute(req.body);
      res.json({ message: 'Login confirmado', ...result });
    } catch (e: any) {
      res.status(401).json({ error: e.message });
    }
  }
}

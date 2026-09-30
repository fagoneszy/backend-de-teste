import { Request, Response } from 'express';
import { ProcessData } from '../../application/useCases/ProcessData';
import { GetUserOwnData } from '../../application/useCases/GetUserOwnData';

export class DataController {
  constructor(private processData: ProcessData, private getUserOwnData: GetUserOwnData) {}

  async process(req: Request, res: Response) {
    try {
      const ownerId = (req as any).userId;
      const record = await this.processData.execute({ ownerId, rawData: req.body });
      res.status(201).json({ message: 'Dados processados e salvos', record: record.toJSON() });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async getOwn(req: Request, res: Response) {
    try {
      const requesterId = (req as any).userId;
      const targetUserId = req.params.userId;
      const result = await this.getUserOwnData.execute(requesterId, targetUserId);
      res.json({ message: 'Dados do usuário recuperados', ...result });
    } catch (e: any) {
      res.status(403).json({ error: e.message });
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorizeOwner = (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).userId;
  const targetId = req.params.userId || req.body.ownerId;
  if (!userId || userId !== targetId) {
    return res.status(403).json({ error: 'Forbidden: owner only' });
  }
  next();
};

import { Request, Response, NextFunction } from 'express';

export const disposableEmailValidator = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  if (email && /(tempmail|disposable|10minutemail)/i.test(email)) {
    return res.status(400).json({ error: 'Email descartável não permitido' });
  }
  next();
};

function isValidCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  if (rev !== parseInt(clean.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev >= 10) rev = 0;
  return rev === parseInt(clean.charAt(10));
}

export const cpfValidator = (req: Request, res: Response, next: NextFunction) => {
  const cpf = req.body.cpf;
  if (!cpf) return next();
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11 || !isValidCPF(cpf)) return res.status(400).json({ error: 'CPF inválido' });
  next();
};

export const namePatternValidator = (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name;
  if (name && !/^[A-Za-zÀ-ÿ\s'-]{3,100}$/.test(name)) {
    return res.status(400).json({ error: 'Nome inválido' });
  }
  next();
};

export const passwordStrengthValidator = (req: Request, res: Response, next: NextFunction) => {
  const password = req.body.password;
  if (!password) return res.status(400).json({ error: 'Senha obrigatória' });
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,}$/.test(password);
  if (!strong) {
    return res.status(400).json({ error: 'Senha fraca: mínimo 10 caracteres com maiúscula, minúscula, número e símbolo' });
  }
  next();
};

export const antiFraudChain = [disposableEmailValidator, cpfValidator, namePatternValidator, passwordStrengthValidator];

/**
 * Middleware para realizar a verificação de autenticação do usuário
 * baseado no token recebido no header da requisição
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTMzNjQxMzYsImV4cCI6MTU5MzQ1MDUzNiwic3ViIjoiMTU3ZjFmMTgtODBmNC00ZWRjLWJjZWItMzliNTdhOTVkNGI1In0.88dOhQL9X_vQ2zjKAC_9pP_cDkKm5N8FBtrAgKesDE8
 */
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface DecodedTokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authorization.split(' ');

  try {
    // Valida e decodifica o token recebido na requisição
    const tokenDecoded = verify(token, authConfig.jwt.secret);

    const { sub } = tokenDecoded as DecodedTokenPayload;

    // Adiciona o id do usuŕio extraído do token na propriedade user da request
    // que foi adicionada utilizando uma sobrescrita na interface Request do Express
    // feita no arquivo /src/@types/express.d.ts
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
};

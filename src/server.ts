// Necessário esse import para funcionar as anotações do typeORM
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';

// Esse import é necessário para que as rotas que usam async/await façam
// o throw das exceções senão o erro não sobe e tem que fazer try/catch na rota.
// Como foi criado um middleware para gerenciar todos os erros da aplicação essa
// lib é necessária e tem que ser importada logo após o express
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database';

const app = express();
app.use(express.json());
app.use(routes);

// Rota para servir de forma estatica os arquivos que estão
// na pasta de upload
app.use('/files', express.static(uploadConfig.directory));

// Middleware Global Exception Handling
app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  },
);

app.listen(3333, () => {
  console.log('Server listening on port 3333');
});

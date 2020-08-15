// Necessário esse import para funcionar as anotações do typeORM
import 'reflect-metadata';

// Importando as configurações da biblioteca dotenv
import 'dotenv/config';

import express from 'express';

// Esse import é necessário para que as rotas que usam async/await façam
// o throw das exceções senão o erro não sobe e tem que fazer try/catch na rota.
// Como foi criado um middleware para gerenciar todos os erros da aplicação essa
// lib é necessária e tem que ser importada logo após o express
import 'express-async-errors';

import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import globalExceptionHandler from '@shared/errors/GlobalExceptionHandler';
import routes from '@shared/infra/http/routes';

// Importando a configuração do typeorm (conexão com o banco de dados)
import '@shared/infra/typeorm';

// Importando o mecanismo que permite utilizar a injeção de dependências
import '@shared/container';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

// Rota para servir de forma estatica os arquivos que estão
// na pasta de upload
app.use('/files', express.static(uploadConfig.tempDirectory));

// Configurando para que os erros de validação do celebrate sejam retornados
app.use(errors());

// Middleware Global Exception Handling que deve ser
// definido após a definição de todas as rotas
app.use(globalExceptionHandler);

app.listen(3333, () => {
  console.log('Server listening on port 3333');
});

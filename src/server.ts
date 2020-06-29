// Necessário esse import para funcionar as anotações do typeORM
import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import uploadConfig from './config/upload';

import './database';

const app = express();
app.use(express.json());
app.use(routes);

// Rota para servir de forma estatica os arquivos que estão
// na pasta de upload
app.use('/files', express.static(uploadConfig.directory));

app.listen(3333, () => {
  console.log('Server listening on port 3333');
});

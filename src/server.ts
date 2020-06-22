import express from 'express';

const app = express();

app.get('/', (request, response) => {
  response.json({ message: 'Hello World TS Node'});
})

app.listen(3333, () => {
  console.log('Server listening on port 3333');
});

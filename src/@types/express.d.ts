// Nesse arquivo está sendo feita a sobrescrita de definições do express
declare namespace Express {
  // Nesse caso adicionamos na definição da interface Request o atributo user
  // que será populado após a autenticação do usuário e portanto todas as rotas
  // protegidas terão esse atributo no objeto request
  export interface Request {
    user: {
      id: string;
    };
  }
}

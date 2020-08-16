// Aqui é realizado o registro do que será gerenciado pelo tsyringe para realizar
// a injeção dessas dependências.
// Esse arquivo é importado no server.ts
import './providers';
import '@modules/notifications/providers';
import '@modules/appointments/providers';
import '@modules/users/providers';

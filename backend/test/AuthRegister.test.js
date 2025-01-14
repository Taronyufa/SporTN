// Importa le librerie necessarie
const request = require('supertest');
const app = require('../auth'); // Assumendo che 'auth.js' sia il file principale per l'API di autenticazione

describe('Auth - Register API', () => {
  it('dovrebbe registrare un nuovo utente con successo', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('testuser');
    expect(response.body.email).toBe('test@example.com');
  });

  it("dovrebbe restituire errore se l'email esiste già", async () => {
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(409);
    expect(response.text).toBe('email already exists');
  });

  it("dovrebbe restituire errore per dati mancanti", async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('username is required');
  });
});

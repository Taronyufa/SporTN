// Importa le librerie necessarie
const request = require('supertest');
const app = require('../auth'); // Assumendo che 'auth.js' sia il file principale per l'API di autenticazione

describe('Auth - Login API', () => {
  it('dovrebbe autenticare un utente con credenziali corrette', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.email).toBe('test@example.com');
  });

  it('dovrebbe restituire errore per email inesistente', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(404);
    expect(response.text).toBe('user not found');
  });

  it('dovrebbe restituire errore per password non valida', async () => {
    await request(app)
      .post('/register') // Registrazione iniziale per il test
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.text).toBe('invalid password');
  });

  it("dovrebbe restituire errore per dati mancanti nell'autenticazione", async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('password is required');
  });
});

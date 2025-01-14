// Importa le librerie necessarie
const request = require('supertest');
const app = require('../users'); // Assumendo che 'users.js' sia il file principale per l'API utenti
const jwt = require('jsonwebtoken');

describe('Users - Get Me API', () => {
  let token;

  beforeAll(() => {
    // Genera un token di esempio per un utente autenticato
    token = jwt.sign(
      { id: 'user123', email: 'test@example.com', username: 'testuser' },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );
  });

  it("dovrebbe restituire i dati dell'utente autenticato", async () => {
    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'test@example.com');
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it("dovrebbe restituire errore se il token non è presente", async () => {
    const response = await request(app).get('/me');

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it("dovrebbe restituire errore se il token è invalido", async () => {
    const response = await request(app)
      .get('/me')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });
});

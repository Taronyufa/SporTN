// Importa le librerie necessarie
const request = require('supertest');
const app = require('../users'); // Assumendo che 'users.js' sia il file principale per l'API utenti
const jwt = require('jsonwebtoken');

describe('Users - Update Me API', () => {
  let token;

  beforeAll(() => {
    // Genera un token di esempio per un utente autenticato
    token = jwt.sign(
      { id: 'user123', email: 'test@example.com', username: 'testuser' },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );
  });

  it("dovrebbe aggiornare i dati del profilo utente", async () => {
    const updatedData = {
      username: 'updateduser',
      email: 'updated@example.com',
      profile_image_url: 'http://example.com/image.png',
      favorite_sports: ['football', 'tennis'],
      preferred_location: 'New York'
    };

    const response = await request(app)
      .put('/me')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedData);
  });

  it("dovrebbe restituire errore per dati mancanti", async () => {
    const response = await request(app)
      .put('/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'updated@example.com' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('username is required');
  });

  it("dovrebbe restituire errore per token assente", async () => {
    const response = await request(app)
      .put('/me')
      .send({
        username: 'updateduser',
        email: 'updated@example.com'
      });

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it("dovrebbe restituire errore per token invalido", async () => {
    const response = await request(app)
      .put('/me')
      .set('Authorization', 'Bearer invalidtoken')
      .send({
        username: 'updateduser',
        email: 'updated@example.com'
      });

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });
});

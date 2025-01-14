// Importa le librerie necessarie
const request = require('supertest');
const app = require('../reservations'); // Assumendo che 'reservations.js' sia il file principale per l'API prenotazioni

describe('Reservations - Get API', () => {
  it('dovrebbe restituire tutte le prenotazioni pubbliche', async () => {
    const response = await request(app)
      .get('/')
      .query({ public_only: true });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach(reservation => {
      expect(reservation).toHaveProperty('is_public', true);
    });
  });

  it("dovrebbe restituire tutte le prenotazioni di un utente specifico", async () => {
    const userId = 'user123';
    const response = await request(app)
      .get('/')
      .query({ user_id: userId });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach(reservation => {
      expect(reservation).toHaveProperty('user_id', userId);
    });
  });

  it('dovrebbe restituire errore per valore non valido in public_only', async () => {
    const response = await request(app)
      .get('/')
      .query({ public_only: 'invalid' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid value for public_only, must be true or false');
  });

  it('dovrebbe restituire tutte le prenotazioni senza filtri', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

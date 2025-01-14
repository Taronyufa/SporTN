// Importa le librerie necessarie
const request = require('supertest');
const app = require('../reservations'); // Assumendo che 'reservations.js' sia il file principale per l'API prenotazioni
const jwt = require('jsonwebtoken');

describe('Reservations - Create API', () => {
  let token;

  beforeAll(() => {
    // Genera un token di esempio per un utente autenticato
    token = jwt.sign(
      { id: 'user123', email: 'test@example.com', username: 'testuser' },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );
  });

  it('dovrebbe creare una nuova prenotazione con successo', async () => {
    const reservationData = {
      field_id: 'field123',
      date: '2025-01-15',
      start_time: '10:00',
      end_time: '12:00',
      participants: 5,
      is_public: true,
      sport: 'football'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(reservationData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(reservationData);
  });

  it("dovrebbe restituire errore per dati mancanti nella prenotazione", async () => {
    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send({ field_id: 'field123' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('date is required');
  });

  it("dovrebbe restituire errore per token assente", async () => {
    const reservationData = {
      field_id: 'field123',
      date: '2025-01-15',
      start_time: '10:00',
      end_time: '12:00',
      participants: 5,
      is_public: true,
      sport: 'football'
    };

    const response = await request(app)
      .post('/')
      .send(reservationData);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it("dovrebbe restituire errore per token invalido", async () => {
    const reservationData = {
      field_id: 'field123',
      date: '2025-01-15',
      start_time: '10:00',
      end_time: '12:00',
      participants: 5,
      is_public: true,
      sport: 'football'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', 'Bearer invalidtoken')
      .send(reservationData);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it("dovrebbe restituire errore se il campo non è disponibile", async () => {
    const reservationData = {
      field_id: 'unavailableField',
      date: '2025-01-15',
      start_time: '10:00',
      end_time: '12:00',
      participants: 5,
      is_public: true,
      sport: 'football'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${token}`)
      .send(reservationData);

    expect(response.status).toBe(400);
    expect(response.text).toBe('The field is not available at the specified time');
  });
});

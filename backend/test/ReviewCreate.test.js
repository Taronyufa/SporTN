// Importa le librerie necessarie
const request = require('supertest');
const app = require('../reviews'); // Assumendo che 'reviews.js' sia il file principale per l'API recensioni
const jwt = require('jsonwebtoken');

describe('Reviews - Create API', () => {
  let userToken;

  beforeAll(() => {
    // Genera un token di esempio per un utente autenticato
    userToken = jwt.sign(
      { id: 'user123', email: 'test@example.com', username: 'testuser' },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );
  });

  it('dovrebbe creare una nuova recensione con successo', async () => {
    const reviewData = {
      field_id: 'field123',
      title: 'Recensione Test',
      rating: 5,
      description: 'Ottimo campo per giocare a calcio.'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reviewData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      titolo: reviewData.title,
      testo: reviewData.description,
      rating: reviewData.rating
    });
  });

  it('dovrebbe restituire errore per dati mancanti', async () => {
    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ field_id: 'field123', title: 'Recensione Test' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid data');
  });

  it('dovrebbe restituire errore per token assente', async () => {
    const reviewData = {
      field_id: 'field123',
      title: 'Recensione Test',
      rating: 5,
      description: 'Ottimo campo per giocare a calcio.'
    };

    const response = await request(app)
      .post('/')
      .send(reviewData);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it("dovrebbe restituire errore se l'utente ha già recensito il campo", async () => {
    const reviewData = {
      field_id: 'field123',
      title: 'Recensione Test',
      rating: 5,
      description: 'Ottimo campo per giocare a calcio.'
    };

    await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reviewData);

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reviewData);

    expect(response.status).toBe(400);
    expect(response.text).toBe('You have already reviewed this field');
  });

  it("dovrebbe restituire errore se l'utente non ha una prenotazione nel campo", async () => {
    const reviewData = {
      field_id: 'unreservedField',
      title: 'Recensione Test',
      rating: 5,
      description: 'Ottimo campo per giocare a calcio.'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reviewData);

    expect(response.status).toBe(400);
    expect(response.text).toBe('You must have at least one reservation in the field to review it');
  });
});

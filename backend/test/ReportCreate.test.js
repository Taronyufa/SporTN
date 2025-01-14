// Importa le librerie necessarie
const request = require('supertest');
const app = require('../reports'); // Assumendo che 'reports.js' sia il file principale per l'API segnalazioni
const jwt = require('jsonwebtoken');

describe('Reports - Create API', () => {
  let userToken;

  beforeAll(() => {
    // Genera un token di esempio per un utente autenticato
    userToken = jwt.sign(
      { id: 'user123', email: 'test@example.com', username: 'testuser' },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );
  });

  it('dovrebbe creare una nuova segnalazione con successo', async () => {
    const reportData = {
      name: 'Test Report',
      field_id: 'field123',
      description: 'Problema segnalato sul campo',
      image_url: 'http://example.com/image.png'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reportData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      titolo: reportData.name,
      testo: reportData.description,
      foto_url: reportData.image_url
    });
  });

  it('dovrebbe restituire errore per dati mancanti', async () => {
    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Test Report' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid data');
  });

  it('dovrebbe restituire errore per token assente', async () => {
    const reportData = {
      name: 'Test Report',
      field_id: 'field123',
      description: 'Problema segnalato sul campo'
    };

    const response = await request(app)
      .post('/')
      .send(reportData);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it('dovrebbe restituire errore se il campo non esiste', async () => {
    const reportData = {
      name: 'Test Report',
      field_id: 'nonexistentField',
      description: 'Problema segnalato su un campo inesistente'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(reportData);

    expect(response.status).toBe(404);
    expect(response.text).toBe('Field not found');
  });
});
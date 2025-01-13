// Importa le librerie necessarie
const request = require('supertest');
const app = require('../events'); // Assumendo che 'events.js' sia il file principale per l'API eventi
const jwt = require('jsonwebtoken');

describe('Events - Create API', () => {
  let adminToken;

  beforeAll(() => {
    // Genera un token di esempio per un utente admin
    adminToken = jwt.sign(
      { id: 'admin123', email: 'admin@example.com', username: 'adminuser', admin: true },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );
  });

  it('dovrebbe creare un nuovo evento con successo', async () => {
    const eventData = {
      name: 'Test Event',
      location: 'Event Location',
      start_datetime: '2025-01-20T10:00:00Z',
      end_datetime: '2025-01-20T12:00:00Z',
      image_url: 'http://example.com/event.png',
      description: 'Descrizione evento di test'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(eventData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      nome: eventData.name,
      posizione: eventData.location,
      data_inizio: eventData.start_datetime,
      data_fine: eventData.end_datetime,
      foto_url: eventData.image_url,
      descrizione: eventData.description
    });
  });

  it('dovrebbe restituire errore per dati mancanti', async () => {
    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Event' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('location is required');
  });

  it('dovrebbe restituire errore per token assente', async () => {
    const eventData = {
      name: 'Test Event',
      location: 'Event Location',
      start_datetime: '2025-01-20T10:00:00Z',
      end_datetime: '2025-01-20T12:00:00Z',
      description: 'Descrizione evento di test'
    };

    const response = await request(app)
      .post('/')
      .send(eventData);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it('dovrebbe restituire errore per token non admin', async () => {
    const userToken = jwt.sign(
      { id: 'user123', email: 'user@example.com', username: 'testuser', admin: false },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );

    const eventData = {
      name: 'Test Event',
      location: 'Event Location',
      start_datetime: '2025-01-20T10:00:00Z',
      end_datetime: '2025-01-20T12:00:00Z',
      description: 'Descrizione evento di test'
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(eventData);

    expect(response.status).toBe(403);
    expect(response.text).toBe('Forbidden');
  });
});

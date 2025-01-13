// Importa le librerie necessarie
const request = require('supertest');
const app = require('../fields'); // Assumendo che 'fields.js' sia il file principale per l'API campi
const jwt = require('jsonwebtoken');

describe('Fields - Create API', () => {
  let adminToken;

  beforeAll(() => {
    // Genera un token di esempio per un utente admin
    adminToken = jwt.sign(
      { id: 'admin123', email: 'admin@example.com', username: 'adminuser', admin: true },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );
  });

  it('dovrebbe creare un nuovo campo con successo', async () => {
    const fieldData = {
      name: 'Test Field',
      location: 'Test Location',
      image_url: 'http://example.com/field.png',
      google_maps_link: 'http://maps.example.com/field',
      is_available: true,
      sports_supported: ['football', 'tennis']
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(fieldData);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(fieldData);
  });

  it('dovrebbe restituire errore per dati mancanti', async () => {
    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Field' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('location is required');
  });

  it('dovrebbe restituire errore per token assente', async () => {
    const fieldData = {
      name: 'Test Field',
      location: 'Test Location',
      image_url: 'http://example.com/field.png',
      google_maps_link: 'http://maps.example.com/field',
      is_available: true,
      sports_supported: ['football', 'tennis']
    };

    const response = await request(app)
      .post('/')
      .send(fieldData);

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it('dovrebbe restituire errore per token non admin', async () => {
    const userToken = jwt.sign(
      { id: 'user123', email: 'user@example.com', username: 'testuser', admin: false },
      process.env.SUPER_SECRET,
      { expiresIn: '1h' }
    );

    const fieldData = {
      name: 'Test Field',
      location: 'Test Location',
      image_url: 'http://example.com/field.png',
      google_maps_link: 'http://maps.example.com/field',
      is_available: true,
      sports_supported: ['football', 'tennis']
    };

    const response = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(fieldData);

    expect(response.status).toBe(403);
    expect(response.text).toBe('Forbidden');
  });
});
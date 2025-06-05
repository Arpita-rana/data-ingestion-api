// test/ingest.test.js

const request = require('supertest');
const app = require('../app'); // your Express app (must export the instance)

describe('Data Ingestion API', () => {
  let ingestionIdHigh = '';
  let ingestionIdMedium = '';

  test('POST /ingest - HIGH priority', async () => {
    const res = await request(app)
      .post('/ingest')
      .send({
        ids: [1, 2, 3, 4, 5],
        priority: 'HIGH'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.ingestion_id).toBeDefined();
    ingestionIdHigh = res.body.ingestion_id;
  });

  test('POST /ingest - MEDIUM priority', async () => {
    const res = await request(app)
      .post('/ingest')
      .send({
        ids: [101, 102, 103, 104, 105],
        priority: 'MEDIUM'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.ingestion_id).toBeDefined();
    ingestionIdMedium = res.body.ingestion_id;
  });

  test('GET /status/:ingestion_id - structure check (HIGH)', async () => {
    const res = await request(app).get(`/status/${ingestionIdHigh}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.ingestion_id).toBe(ingestionIdHigh);
    expect(res.body.batches).toBeInstanceOf(Array);
  });

  test('GET /status/:ingestion_id - structure check (MEDIUM)', async () => {
    const res = await request(app).get(`/status/${ingestionIdMedium}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.ingestion_id).toBe(ingestionIdMedium);
    expect(res.body.batches).toBeInstanceOf(Array);
  });

  test('Wait for batches to complete', async () => {
    console.log('⏳ Waiting 16 seconds for batches to process...');
    await new Promise((resolve) => setTimeout(resolve, 16000));
  });

  test('GET /status/:ingestion_id - final status check (HIGH)', async () => {
    const res = await request(app).get(`/status/${ingestionIdHigh}`);
    expect(res.body.status).toBe('completed');
  });

  test('GET /status/:ingestion_id - final status check (MEDIUM)', async () => {
    const res = await request(app).get(`/status/${ingestionIdMedium}`);
    expect(res.body.status).toBe('completed');
  });
});

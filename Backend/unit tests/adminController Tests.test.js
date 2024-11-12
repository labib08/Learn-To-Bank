const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User } = require('../models/models');
const { app } = require('../server');
let server;

describe('adminController API Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach((done) => {
    server = app.listen(0, () => done());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  test('should soft delete an account if it exists', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      phoneNo: '0412345678',
      login: { username: 'testuser', password: 'password123' },
      isDeleted: false,
    });

    const res = await request(app)
      .post('/api/admin/delete')
      .send({ username: 'testuser' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(`Account with user testuser soft deleted successfully`);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.isDeleted).toBe(true);
  });

  test('should delete an account if it is already soft deleted', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      phoneNo: '0412345678',
      login: { username: 'testuser', password: 'password123' },
      isDeleted: true,
    });

    const res = await request(app)
      .post('/api/admin/delete')
      .send({ username: 'testuser' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(`Account with user testuser deleted successfully`);

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });

  test('should return 404 if account to delete is not found', async () => {
    const res = await request(app)
      .post('/api/admin/delete')
      .send({ username: 'nonexistentuser' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Account not found');
  });

  test('should reactivate a soft deleted account', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      phoneNo: '0412345678',
      login: { username: 'testuser', password: 'password123' },
      isDeleted: true,
    });

    const res = await request(app)
      .post('/api/admin/reactivate')
      .send({ username: 'testuser' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(`Account with user testuser reactivated successfully`);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.isDeleted).toBe(false);
  });

  test('should return 404 if account to reactivate is not found', async () => {
    const res = await request(app)
      .post('/api/admin/reactivate')
      .send({ username: 'nonexistentuser' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Account not found');
  });

});
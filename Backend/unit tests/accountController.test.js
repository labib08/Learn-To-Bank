const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User } = require('../models/models');
const { app } = require('../server');
let server;

afterAll(() => {
  server.close(); // Close the server instance after all tests
});

jest.mock('node-cron', () => ({
  schedule: jest.fn(), // Mock schedule so it doesn't run
}));

describe('accountController API Tests', () => {
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

  test('should return 400 if username and email are already registered', async () => {
    await User.create({
      name: 'Existing User',
      email: 'existing@example.com',
      phoneNo: '0412345678',
      login: { username: 'existinguser', password: 'hashedPassword' },
    });

    const res = await request(app)
      .post('/api/accounts/create')
      .send({
        name: 'Test User',
        email: 'existing@example.com',
        username: 'existinguser',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Username and email are already registered to an account');
  });

  test('should return 400 if username is taken', async () => {
    await User.create({
      name: 'Existing User',
      email: 'unique@example.com',
      phoneNo: '0412345678',
      login: { username: 'existinguser', password: 'hashedPassword' },
    });

    const res = await request(app)
      .post('/api/accounts/create')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        username: 'existinguser',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Username has been taken');
  });

  test('should return 400 if email is already registered', async () => {
    await request(app)
      .post('/api/accounts/create')
      .send({
        name: 'imposter',
        email: 'existing@example.com',
        username: 'imposterman',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/accounts/create')
      .send({
        name: 'Test User',
        email: 'existing@example.com',
        username: 'testuser',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      'This email already has an registered account, please login instead'
    );
  });

  test('should create a new user when data is valid', async () => {
    // Mock external dependencies to return consistent values
    const res = await request(app)
      .post('/api/accounts/create')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');

    // Verify that the user was saved in the database
    const user = await User.findOne({ 'login.username': 'newuser' });
    expect(user).not.toBeNull();
    expect(user.email).toBe('newuser@example.com');
  });

  test('should return 400 if username is invalid', async () => {
    await request(app)
    .post('/api/accounts/create')
    .send({
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
    });

    const res = await request(app)
    .post('/api/accounts/login')
    .send({
        username: 'differentusername',
        password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid Username');
  });

  test('should return 403 if user account is inactive or deleted', async () => {
    await request(app)
    .post('/api/accounts/create')
    .send({
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
    });

    await request(app)
    .post('/api/admin/delete')
    .send({
        username: 'testuser'
    });

    const res = await request(app)
    .post('/api/accounts/login')
    .send({
        username: 'testuser',
        password: 'password123',
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('User account is inactive or deleted.');
  });

  test('should return 400 if password is invalid', async () => {
    await request(app)
    .post('/api/accounts/create')
    .send({
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
    });

    const res = await request(app)
    .post('/api/accounts/login')
    .send({
        username: 'testuser',
        password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid Password');
  });

  test('should return 200 if login is successful', async () => {
    await request(app)
    .post('/api/accounts/create')
    .send({
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
    });

    const res = await request(app)
    .post('/api/accounts/login')
    .send({
        username: 'testuser',
        password: 'password123',
    });

    expect(res.statusCode).toBe(200);
  });

});

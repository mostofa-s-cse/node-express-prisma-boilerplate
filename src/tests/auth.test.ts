import request from 'supertest';
import app from '../app'; // Import your Express app

describe('Authentication Tests', () => {
    test('Should register a new user', async () => {
        const response = await request(app).post('/auth/register').send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    test('Should login with valid credentials', async () => {
        const response = await request(app).post('/auth/login').send({
            email: 'testuser@example.com',
            password: 'password123',
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('Should reject login with invalid credentials', async () => {
        const response = await request(app).post('/auth/login').send({
            email: 'testuser@example.com',
            password: 'wrongpassword',
        });
        expect(response.statusCode).toBe(401);
    });

    test('Should fetch the authenticated user', async () => {
        const loginResponse = await request(app).post('/auth/login').send({
            email: 'testuser@example.com',
            password: 'password123',
        });
        const response = await request(app)
            .get('/auth/me')
            .set('Authorization', `Bearer ${loginResponse.body.token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });
});

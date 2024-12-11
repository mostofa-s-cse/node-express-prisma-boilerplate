describe('User Management Tests', () => {
    test('Should fetch all users', async () => {
        const loginResponse = await request(app).post('/auth/login').send({
            email: 'admin@example.com',
            password: 'adminpassword',
        });
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${loginResponse.body.token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('Should update a user', async () => {
        const loginResponse = await request(app).post('/auth/login').send({
            email: 'admin@example.com',
            password: 'adminpassword',
        });
        const response = await request(app)
            .put('/users/1')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({ name: 'Updated Name' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('name', 'Updated Name');
    });

    test('Should delete a user', async () => {
        const loginResponse = await request(app).post('/auth/login').send({
            email: 'admin@example.com',
            password: 'adminpassword',
        });
        const response = await request(app)
            .delete('/users/1')
            .set('Authorization', `Bearer ${loginResponse.body.token}`);
        expect(response.statusCode).toBe(204);
    });
});

const request = require('supertest');
const User = require('../../models/user.mode');
const mongoose = require('mongoose');

let server;

describe('/api/users', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => {
        server.close();
    });

    describe('GET /', () => {
        it('should return all users', async () => {
            const users = [
                { name: 'user1', email: 'some3@yopmail.com', password: "some" },
                { name: 'user2', email: 'some4@yopmail.com', password: "some1" },
            ];

            await User.collection.insertMany(users);

            const res = await request(server).get('/api/users');

            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'user1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'user1')).toBeTruthy();
        });
    });

    describe('POST /', () => {
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/users')
                .send({ name });
        }


        beforeEach(() => {
            name = 'user1';
        })


        it('should save the user if it is valid', async () => {
            await exec();

            const user = await User.find({ name: 'user1' });

            expect(user).not.toBeNull();
        });
    });
});
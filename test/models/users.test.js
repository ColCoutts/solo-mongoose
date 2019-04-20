const request = require('supertest');
const app = require('../../lib/app.js');
const User = require('../../lib/models/User');
const mongoose = require('mongoose');

describe('User routes', () => {
    beforeAll(() => {
        return mongoose.connect('mongodb://localhost:27017/users', {
            useFindAndModify: false,
            useNewUrlParse: true,
            useCreateIndex: true
        });
    });
    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });
    afterAll(() => {
        return mongoose.connection.close();
    });
    it('creates a user', () => {
        return request(app)
            .post('/users')
            .send({
                handle: 'Blimpy',
                image: 'something'
            })
            .then(createdUser => {
                expect(createdUser.body).toEqual({
                    handle: 'Blimpy',
                    image: 'something',
                    _id: expect.any(String),
                    __v: 0
                });
            });
    });
    it('returns all users', () => {
        return User.create({ handle: 'Some', image: 'Something' })
            .then(() => {
                return request(app)
                .get('/users')
            })
            .then(foundUser => {
                expect(foundUser.body).toEqual([{
                    handle: 'Some',
                    image: 'Something',
                    _id: expect.any(String)
                }]);
            });
    });
    it('returns a user by id', () => {
        return User.create({ handle: 'Some', image: 'Something' })
            .then(createdUser => {
                return request(app)
                    .get(`/users/${createdUser._id}`)
            })
            .then(returnedTweet => {
                expect(returnedTweet.body).toEqual({
                    handle: 'Some',
                    image: 'Something',
                    _id: expect.any(String)
                });
            });
    });
    it('updates a user by id', () => {
        return User.create({ handle: 'Some', image: 'Something' })
            .then(createdUser => {
                return request(app)
                    .patch(`/users/${createdUser.id}`)
                    .send({
                        handle: 'New',
                        image: 'Something'
                    })
            })
            .then(updatedUser => {
                expect(updatedUser.body).toEqual({
                    handle: 'New',
                    image: 'Something',
                    _id: expect.any(String)
                });
            });
    });
    it('deletes a user', () => {
        return User.create({ handle: 'Some', image: 'Something' })
            .then(createdUser => {
            request(app)
                .delete(`/users/${createdUser._id}`)
                .then(deletedTweet => {
                    expect(deletedTweet.body).toEqual({})
                })
            })
    })

});

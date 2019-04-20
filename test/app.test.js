const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

describe('tweet routes', () => {
    const createTweet = () => {
        return User.create({ handle: 'Colin', image: '' })
        .then(user => {
            return Tweet.create({ user: user._id, body: 'my tweet' });
        });
    };

    beforeAll(() => {
        return mongoose.connect('mongodb://localhost:27017/tweets', {
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
    })

    it('creates a new tweet', () => {
        return User.create({ handle: 'Colin', image: ''})
            .then(createdUser => {
                return request(app)
                    .post('/tweets')
                    .send({
                        user: createdUser._id,
                        body: 'my first tweet'
                    });
            })
            .then(createdTweet => {
                expect(createdTweet.body).toEqual({
                    user: expect.any(String),
                    body: 'my first tweet',
                    __v: 0,
                    _id: expect.any(String)
                });
            });
    });
    it('returns all tweets', () => {
        return createTweet()
            .then(() => {
                return request(app)
                    .get('/tweets')
            })
            .then(res => {
                expect(res.body).toHaveLength(1);
            });
    })
    it('returns a tweet by id', () => {
        return createTweet()
            .then(createdTweet => {
                return request(app)
                    .get(`/tweets/${createdTweet._id}`)
            })
            .then(returnedTweet => {
                expect(returnedTweet.body).toEqual(
                    {
                    user: {handle: 'Colin',
                    image: '',
                    _id: expect.any(String)
                },
                _id: expect.any(String),
                body: 'my tweet'
                });
            });
    });
    it('returns an updated tweet', () => {
        return createTweet()
            .then(createdTweet => {
                return request(app)
                    .patch(`/tweets/${createdTweet.id}`)
                    .send({ body: 'Get this by ID' });
            })
            .then(updatedTweet => {
                expect(updatedTweet.body).toEqual({
                    _id: expect.any(String),
                    user: {
                        _id: expect.any(String),
                        image: '',
                        handle: 'Colin'
                    },
                    body: 'Get this by ID',
                    tag: null
                });
            });
    })
    it('deletes a tweet by id', () => {
        return createTweet()
            .then(createdTweet => {
                return Promise.all([
                    Promise.resolve(createdTweet._id.toString()),
                    request(app)
                        .delete(`/tweets/${createdTweet._id}`)
                ]);
            })
            .then(([_id, res]) => {
                expect(res.body).toEqual({
                    _id
                });
            });
    });
});

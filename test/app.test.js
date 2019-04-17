const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const User = require('../lib/models/User');

describe('tweet routes', () => {
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

    it.only('creates a new tweet', () => {
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
                console.log(createdTweet.body)
                expect(createdTweet.body).toEqual({
                    user: expect.any(String),
                    body: 'my first tweet',
                    __v: 0,
                    _id: expect.any(String)
                });
            });
    });
    it('returns all tweets', () => {
        return Tweet.create({ handle: 'Ryan', body: 'Get this', tag: 'cats' })
            .then(() => {
                return request(app)
                    .get('/tweets')
            })
            .then(res => {
                console.log(res.body);
                expect(res.body).toHaveLength(1);
            });
    })
    it('returns a tweet by id', () => {
        return Tweet.create({ handle: 'Frank', body: 'Get this by ID', tag: 'findById'})
            .then(createdTweet => {
                return request(app)
                    .get(`/tweets/${createdTweet._id}`)
            })
            .then(returnedTweet => {
                expect(returnedTweet.body).toEqual({
                    handle: 'Frank',
                    body: 'Get this by ID',
                    tag: 'findById',
                    _id: expect.any(String)
                });
            });
    });
    it('returns an updated tweet', () => {
        return Tweet.create({ handle: 'Frank', body: 'Get this by ID', tag: 'findById'})
            .then(createdTweet => {
                return request(app)
                    .patch(`/tweets/${createdTweet.id}`)
                    .send({
                        handle: 'Gary',
                        body: 'Get this by ID',
                        tag: 'findByIdAndUpdate'
                    })
            })
            .then(updatedTweet => {
                expect(updatedTweet.body).toEqual({
                    handle: 'Gary',
                    body: 'Get this by ID',
                    tag: 'findByIdAndUpdate',
                    _id: expect.any(String)
                });
            });
    })
    it('deletes a tweet by id', () => {
        return Tweet.create({ handle: 'Frank', body: 'Get this by ID', tag: 'findById'})
            .then(createdTweet => {
            request(app)
                    .delete(`/tweets/${createdTweet._id}`)
                    .then(deletedTweet => {
                        expect(deletedTweet.body).toEqual({});
                    });
            });
    });
});

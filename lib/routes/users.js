const User = require('../models/User');
const { Router } = require('express');

module.exports = Router()
    .post('/', (req, res, next) => {
        const {
            handle,
            image
        } = req.body;
        
        User
            .create({ handle, image })
            .then(createdUser => {
                res.send(createdUser);
            })
            .catch(next)
    })
    .get('/', (req, res, next) => {
        User
            .find()
            .select({
                __v: false
            })
            .lean()
            .then(foundUsers => {
                res.send(foundUsers)
            })
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        return User
            .findById(id)
            .select({
                __v: false
            })
            .lean()
            .then(returnedUser => {
                res.send(returnedUser);
            })
            .catch(next);
    })
    .patch('/:id', (req, res, next) => {
        const { id } = req.params;
        const {
            handle,
            image
        } = req.body

        User
            .findByIdAndUpdate(id, { handle, image }, { new: true })
            .select({
                __v: false
            })
            .lean()
            .then(updatedUser => {
                res.send(updatedUser);
            })
            .catch(next)
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;

        User
            .findByIdAndDelete(id)
            .select({
                __v: false
            })
            .lean()
            .then(deletedUser => {
                res.send(deletedUser);
            })
            .catch(next)
    });

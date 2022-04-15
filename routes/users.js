const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const data = require('../data');
const usersData = data.users;

const checkString = (str, variableName) => {
    if (typeof str !== 'string' || str.trim().length === 0)
        throw new Error(`${variableName} must be a non-empty string`);
};
const validUserPass = (username, password) => {
    if (!username) throw new Error('No username provided!');
    if (!password) throw new Error('No password provided!');

    checkString(username, 'username');
    if (!username.match(/^[0-9a-zA-Z]+$/)) throw new Error('Only alphanumeric characters allowed in username!');
    if (username.trim().length < 4) throw new Error('Username must be at least 4 characters long!');

    checkString(password, 'password');
    if (password.indexOf(' ') >= 0) throw new Error('Password cannot contain spaces!');
    if (password.length < 6) throw new Error('Password must be at least 6 characters long!');
};

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/recipes');
    } else {
        res.render('users/login', { title: 'Login Page' });
    }
});

router.get('/signup', async (req, res) => {
    if (req.session.user) {
        res.redirect('/recipes');
    } else {
        res.render('users/signup', { title: 'Sign Up Page' });
    }
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        validUserPass(username, password);
    } catch (e) {
        res.status(400).render('users/signup', { title: 'Sign Up Page', error: e.message });
        return;
    }

    try {
        const inserted = await usersData.createUser(username, password);
        if (inserted.userInserted) {
            res.redirect('/recipes');
        } else {
            res.status(500).render('users/signup', { title: 'Sign Up Page', error: 'Internal Server Error' });
        }
    } catch (e) {
        res.status(400).render('users/signup', { title: 'Sign Up Page', error: e.message });
        return;
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        validUserPass(username, password);
    } catch (e) {
        res.status(400).render('users/login', { title: 'Login Page', error: e.message });
        return;
    }

    try {
        const authorized = await usersData.checkUser(username, password);
    } catch (e) {
        res.status(400).render('users/login', { title: 'Login Page', error: e.message });
        return;
    }
    req.session.user = username.trim().toLowerCase();
    res.redirect('/recipes');
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/recipes');
});

module.exports = router;

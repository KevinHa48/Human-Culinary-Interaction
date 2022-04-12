const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const bcrypt = require('bcryptjs');
const saltRounds = 12;

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

let exportedMethods = {
    async createUser(username, password) {
        validUserPass(username, password);

        const newUsername = username.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userCollection = await users();

        const duplicateUser = await userCollection.findOne({ username: newUsername });
        if (duplicateUser !== null) throw new Error(`User with username: ${newUsername} already exists!`);

        const newUser = {
            username: newUsername,
            password: hashedPassword,
        };
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw new Error('Could not add user.');

        return { userInserted: true };
    },
    async checkUser(username, password) {
        validUserPass(username, password);

        const newUsername = username.trim().toLowerCase();

        const userCollection = await users();
        const user = await userCollection.findOne({ username: newUsername });
        if (user === null) throw new Error('Either the username or password is invalid');
        if (await bcrypt.compare(password, user.password)) {
            return { authenticated: true };
        } else {
            throw new Error('Either the username or password is invalid');
        }
    },
};

module.exports = exportedMethods;

const recipeRoutes = require('./recipes');
const userRoutes = require('./users');

const constructorMethod = (app) => {
    app.use('/recipes', recipeRoutes);
    app.use('/users', userRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;

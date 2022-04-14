const { LoggerLevel } = require('mongodb');
const connection = require('../config/mongoConnection');
const data = require('../data/');
const recipes = data.recipes;
const users = data.users;

async function main() {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    const poster = await users.createUser('masterchef', '123abc');

    // TODO ADD DATA
    const eggs = await recipes.create(poster.id, 'An awesome egg recipe', [
        { food: 'eggs', units: 'grams', quantity: 500 },
    ]);

    const eggsId = eggs._id;

    const chili = await recipes.create(poster.id, 'I need this chili in my bones', [
        { food: 'beans', units: 'grams', quantity: 5000 },
    ]);

    const chiliId = chili._id;

    await recipes.remove(eggsId);

    await recipes.addComment(chiliId, poster.id, 'This chili sucks');
    await recipes.addComment(chiliId, poster.id, 'I lied');

    await recipes.addLike(chiliId);

    console.dir(await recipes.getAll(), { depth: null });

    console.log('Done seeding database');

    await connection.closeConnection();
}

main();

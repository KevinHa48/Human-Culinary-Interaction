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
    const eggs = await recipes.create(
        'Egg recipe',
        'https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg',
        poster.id,
        'An awesome egg recipe',
        [{ food: 'eggs', units: 'grams', quantity: 500 }]
    );

    const eggsId = eggs._id;

    const chili = await recipes.create(
        'Crazy Chili Recipe',
        'https://post.healthline.com/wp-content/uploads/2020/09/kidney-beans-732x549-thumbnail.jpg',
        poster.id,
        'I need this chili in my bones',
        [{ food: 'beans', units: 'grams', quantity: 5000 }]
    );

    const chiliId = chili._id;

    const chili2 = await recipes.create(
        'Crazy Chili Recipe 2',
        'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/delish-200318-seo-how-to-cook-beans-horizontal-final-14288-eb-1585337558.jpg?crop=0.6668421052631579xw:1xh;center,top&resize=480:*',
        poster.id,
        'I need this chili in my bones 2',
        [{ food: 'beans', units: 'grams', quantity: 5000 }]
    );

    const chiliId2 = chili2._id;

    await recipes.remove(eggsId);

    await recipes.addComment(chiliId, poster.id, 'This chili sucks');
    await recipes.addComment(chiliId, poster.id, 'I lied');

    await recipes.addLike(chiliId);

    console.dir(await recipes.getAll(), { depth: null });

    console.log('Done seeding database');

    await connection.closeConnection();
}

main();

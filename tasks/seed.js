const { LoggerLevel } = require('mongodb');
const connection = require('../config/mongoConnection');
const data = require('../data/');
const restaurants = data.restaurants;
const reviews = data.reviews;

async function main() {
    const db = await connection.connectToDb();
    await db.dropDatabase();

    // TODO ADD DATA
    const saffron = await restaurants.create(
        'The Saffron Lounge',
        'New York City, New York',
        '123-456-7890',
        'http://www.saffronlounge.com',
        '$$$$',
        ['Cuban', 'Italian'],
        { dineIn: true, takeOut: true, delivery: false }
    );
    const paprikaCafe = await restaurants.create(
        'The Paprika Cafe',
        'Trenton, New Jersey',
        '999-888-7777',
        'http://www.paprikacafe.com',
        '$$',
        ['American'],
        { dineIn: true, takeOut: false, delivery: false }
    );

    const saffid = saffron._id;
    const papid = paprikaCafe._id;

    restaurants.update(
        saffid,
        'The Amazing Saffron Lounge',
        'New York City, New York',
        '123-666-9999',
        'http://www.amazingsaffronlounge.com',
        '$$',
        ['Cuban', 'Italian'],
        { dineIn: true, takeOut: true, delivery: true }
    );
    //TODO ADD reviews to the restaurants
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    const scaredReview = await reviews.create(
        saffid,
        'This place was great!',
        'scaredycat',
        5,
        today,
        'This place was great! the staff is top notch and the food was delicious!  They really know how to treat their customers.'
    );
    await reviews.create(
        saffid,
        'It was ok I guess!',
        'snobbish1999',
        3,
        today,
        'Might come back again, but also might not.'
    );

    await reviews.create(
        papid,
        'This place was horrible!',
        'angryreviwer',
        1,
        today,
        'This place was awful! the staff is slow and the food was disgusting!  I am never coming back here ever again!'
    );
    await reviews.create(
        papid,
        "I don't know what angry reviewer is talking about!",
        'happyreviewer',
        5,
        today,
        "This is one of the best places around! Don't listen to any of the negativity try it out!"
    );

    //console.dir(await restaurants.getAll(), { depth: null });

    console.log('Done seeding database');

    await connection.closeConnection();
}

main();

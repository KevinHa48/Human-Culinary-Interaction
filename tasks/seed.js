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

    const poster2 = await users.createUser('GarlicBreadLover', 'iL0v3GarlicBread');
    const garlicBread = await recipes.create(
        "Grandma's Garlic Bread",
        'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/5/28/2/TM1A14F_Garlic-Bread_s4x3.jpg.rend.hgtvcom.826.620.suffix/1433523400627.jpeg',
        poster2.id,
        "1. Combine garlic, butter, and oil in a microwave safe dish or in a small saucepan. Heat garlic and butter and oil in microwave for 1 minute or in a small pot over moderate-low heat for 3 minutes. \n 2.Toast split bread under broiler. Remove bread when it is toasted golden brown in color. Brush bread liberally with garlic oil. Sprinkle with cheese, if using, and parsley. If you added cheese, return to broiler and brown 30 seconds. Cut into chunks and serve.",
        [{food:'garlic, crushed', units: 'cloves', quantity: 4},{food:'butter', units: 'tablespoons', quantity: 2},{food:'extra-virgin olive oil', units: 'tablespoons', quantity: 2},{food:'grated Parmigiano cheese', units: 'tablespoons', quantity: 3}]
    );
    const garlicBreadId = garlicBread._id;

    const poster3 = await users.createUser('BobTheCook', 'canW3C00kitYesWeCan');
    const truffleFries = await recipes.create(
        "Homemade Truffle Fries",
        'https://www.greenvalleygrill.com/wp-content/uploads/2017/06/Truffled-Fries.jpg',
        poster3.id,
        `Fry Prep Instructions

        To wash: Fill large bowl ½ way with cold water. Slice potatoes into 1/4 - 3/8 inch strips. Place cut potatoes directly into cold water. Agitate potatoes to remove dirt and excess starch. Put aside. To make a salt water bath, fill a second large bowl 1/4 way with warm water, add Kosher Salt, stir to dissolve. Add ¼ way with cold water. Transfer potatoes from first bowl to salted water bath. Potatoes can be stored in the refrigerator until you are ready to blanch.
        
        To blanch: Heat fry oil in fryer to 300 degrees. Shake excess water from potatoes and place in fry basket in batches. Drop into oil and allow to cook for 2 minutes and 15 seconds. Remove from oil and shake aggressively to separate fries. Place cooked fries on a sheet tray and keep cold until ready for final cooking step. Wait for fry oil temperature to return to 300 degrees before continuing with next batch.
        
        Yields 7 pounds blanched potatoes
        
        Truffle Fries Instructions
        
        Place 1 1/2 cups (12 oz) of blanched potatoes in hot fryer until crisp. Drain well. Place fries in a metal mixing bowl and toss with grated cheese, truffle oil and salt. Enjoy.`,
        [{food:'Idaho Russet Potatoes', units: 'cups', quantity: 1.5},{food:'Kosher Salt', units: 'teaspoon', quantity: 0.25},{food:'Parmesean cheese, grated', units: 'tablespoons', quantity: 2},{food:'Black Truffle Oil', units: 'tablespoons', quantity: 1},{food:'Truffled Sea Salt', units: 'teaspoons', quantity: 1}]
    );
    const truffleFriesId = truffleFries._id;

    const guacamole = await recipes.create(
        "Guacamole",
        'https://imagesvc.meredithcorp.io/v3/jumpstartpure/image?url=https://cf-images.us-east-1.prod.boltdns.net/v1/static/1033249144001/724efeb6-c852-4b5b-b7c5-e38ebbfa7ff0/d9314869-6dd8-468e-bb76-c2193cf36e6d/1280x720/match/image.jpg&w=1280&h=720&q=90&c=cc',
        poster3.id,
        "In a medium bowl, mash together the avocados, lime juice, and salt. Mix in onion, cilantro, tomatoes, and garlic. Stir in cayenne pepper. Refrigerate 1 hour for best flavor, or serve immediately.",
        [{food:'avocado', units: 'whole', quantity: 3},{food:'salt', units: 'teaspoon', quantity: 1},{food:'lime, juiced', units: 'whole', quantity: 1},{food:'diced onion', units: 'cups', quantity: 0.5},{food:'plum tomatoes', units: 'whole', quantity: 2},{food: 'minced garlic', units: 'teaspoon', quantity: 1},{food: 'ground cayenne pepper', units: 'pinch', quantity: 1}]
    );
    const guacamoleId = guacamole._id;

    const funnelCake = await recipes.create(
        "Funnel Cake",
        'https://www.spendwithpennies.com/wp-content/uploads/2020/02/funnel-cakes-SWP-2-of-3.jpg',
        poster3.id,
       `1. In a large liquid measuring cup or batter bowl with a spout, whisk together milk, egg, water and vanilla.
       2. Add sugar, baking powder and salt and whisk until combined.
       3. Add the flour, and whisk until completely smooth. Set aside.
       4. In a medium, deep-sided pan or pot, heat 1" of oil to 375°F over medium-high heat. When you put the end of a wooden spoon in the pot and bubbles form around the spoon, it's ready. Reduce heat to medium.
       5. Drizzle batter from cup in a thin line, swirling around the pan and overlapping as desired. Cook for 2 minutes or until light golden brown, then flip and cook another 2 minutes or until golden brown.
       6. Dust with 2 tablespoons powdered sugar and serve. Repeat one more time with the remaining batter.`,
        [{food:'milk', units: 'cup', quantity: 1},{food:'egg', units: 'whole', quantity: 1},{food:'vanilla extract', units: 'teaspoon', quantity: 1.5},{food:'granulated sugar', units: 'tablespoon', quantity: 1},{food:'baking powder', units: 'teaspoon', quantity: 0.75},{food:'salt', units: 'pinch', quantity: 1},{food:'all purpose flour', units: 'cup', quantity: 0.5},{food:'powdered sugar', units: 'tablespoons', quantity: 4}]
    );
    const funnelCakeId = funnelCake._id;

    const pancakes = await recipes.create(
        "Pancakes",
        'https://static01.nyt.com/images/2017/03/24/dining/24COOKING-CLASSICPANCAKES/24COOKING-CLASSICPANCAKES-articleLarge.jpg',
        poster3.id,
       `1. Heat a griddle or large skillet over medium-low heat. In a bowl, mix together dry ingredients. Beat eggs into 1 1/2 cups milk, then stir in 2 tablespoons melted cooled butter, if using it. Gently stir this mixture into dry ingredients, mixing only enough to moisten flour; don't worry about a few lumps. If batter seems thick, add a little more milk.
       2. Place a teaspoon or 2 of butter or oil on griddle or skillet. When butter foam subsides or oil shimmers, ladle batter onto griddle or skillet, making pancakes of any size you like. Adjust heat as necessary; usually, first batch will require higher heat than subsequent batches. Flip pancakes after bubbles rise to surface and bottoms brown, after 2 to 4 minutes.
       3. Cook until second side is lightly browned. Serve, or hold on an ovenproof plate in a 200-degree oven for up to 15 minutes.`,
        [{food:'all-purpose flour', units: 'cup', quantity: 1},{food:'backing powder', units: 'teaspoon', quantity: 2},{food:'salt', units: 'teaspoon', quantity: 0.25},{food:'sugar', units: 'tablespoon', quantity: 1},{food:'eggs', units: 'whole', quantity: 2},{food:'milk', units: 'cups', quantity: 2},{food:'melted and cooled butter', units: 'tablespoons', quantity: 2}]
    );
    const pancakeId = pancakes._id;

    await recipes.remove(eggsId);

    await recipes.addComment(chiliId, poster.id, 'This chili sucks');
    await recipes.addComment(chiliId, poster.id, 'I lied');
    await recipes.addComment(garlicBreadId, poster.id, 'OMG, I love garlic bread, I cannot wait to try this when I get home from work today!!');
    await recipes.addComment(garlicBreadId, poster2.id, "Thx so much, masterchef. It is my grandma's old recipe!");
    await recipes.addComment(truffleFriesId, poster2.id, "Not as good as garlic bread");
    await recipes.addComment(funnelCakeId, poster2.id, "Not as good as garlic bread");
    await recipes.addComment(guacamoleId, poster2.id, "Not as good as garlic bread");
    await recipes.addComment(pancakeId, poster2.id, "Not as good as garlic bread");
    await recipes.addComment(garlicBreadId, poster3.id, "Not as good as truffle fries");

    await recipes.addLike(chiliId);
    
    await recipes.remove(chiliId);
    await recipes.remove(chiliId2);
    
    



    console.dir(await recipes.getAll(), { depth: null });

    console.log('Done seeding database');

    await connection.closeConnection();
}

main();

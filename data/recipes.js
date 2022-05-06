const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;

let { ObjectId } = require('mongodb');

const checkString = (str, variableName) => {
    if (typeof str !== 'string' || str.trim().length === 0)
        throw new Error(`${variableName} must be a non-empty string`);
};

function stringToId(id) {
    if (!id) throw new Error('Id parameter must be supplied');

    if (typeof id !== 'string') throw new Error('Id must be a string');

    let parsedId = ObjectId(id);
    return parsedId;
}

module.exports = {
    // data functions go here

    async create(title, img, poster, description, directions, ingredients) {
        if (!title) throw new Error('No title provided.');
        if (!img) throw new Error('No title provided.');
        if (!poster) throw new Error('No poster provided.');
        if (!description) throw new Error('No description provided.');
        if (!directions) throw new Error('No directions provided.');

        if (!ingredients) throw new Error('No ingredients provided.');

        checkString(title, 'title');
        checkString(poster, 'poster');
        checkString(description, 'description');
        checkString(img, 'img');
        checkString(directions, 'directions');

        if (!Array.isArray(ingredients)) throw new Error('Ingredients must be an array');

        const newRecipeInfo = {
            title: title,
            img: img,
            poster: poster,
            description: description,
            directions: directions,
            ingredients: ingredients,
            comments: [],
            likes: 0,
        };

        const recipeCollection = await recipes();

        const insertInfo = await recipeCollection.insertOne(newRecipeInfo);
        if (insertInfo.insertedCount === 0) throw new Error('Could not add recipe.');

        const newRecipe = await this.get(insertInfo.insertedId.toString());

        return newRecipe;
    },

    async getAll() {
        const recipeCollection = await recipes();
        const recipeList = await recipeCollection.find({}).toArray();

        // convert all _ids to string
        for (const r of recipeList) {
            r._id = r._id.toString();
        }

        return recipeList;
    },

    async get(id) {
        if (!id) throw new Error('You must provide an id to search for.');
        if (typeof id !== 'string') throw new Error('Id must be a string.');
        if (!ObjectId.isValid(id)) throw new Error('Invalid objectId');

        const queryId = stringToId(id);
        const recipeCollection = await recipes();
        const recipe = await recipeCollection.findOne({ _id: queryId });
        if (recipe === null) throw new Error('No restaurant with that id.');

        recipe._id = recipe._id.toString();

        return recipe;
    },
    async searchByTitle(term) {
        if (!term) throw new Error('You must provide a term to search for.');
        checkString(term, 'search term');

        //const queryId = stringToId(id);

        const recipeCollection = await recipes();
        const recipeList = await recipeCollection.find({ title: term }).toArray();
        if (recipeList === null) throw new Error('No recipe with that title.');
        for (recipe of recipeList) {
            recipe._id = recipe._id.toString();
        }

        return recipeList;
    },

    async remove(id) {
        if (!id) throw new Error('You must provide an id to search for.');
        if (typeof id !== 'string') throw new Error('Id must be a string.');
        if (!ObjectId.isValid(id)) throw new Error('Invalid objectId');

        const queryId = stringToId(id);
        const recipeCollection = await recipes();
        const deletionInfo = await recipeCollection.deleteOne({ _id: queryId });

        if (deletionInfo.deletedCount === 0) {
            throw new Error(`Could not delete recipe with id of ${id}`);
        }

        return { recipeId: id, deleted: true };
    },

    async update(id, title, description, img, ingredients, directions) {
        if (!title) throw new Error('No title provided.');
        if (!description) throw new Error('No description provided.');
        if (!ingredients) throw new Error('No ingredients provided.');
        if (!img) throw new Error('No title provided.');
        if (!directions) throw new Error('No directions provided.');

        checkString(title, 'title');
        checkString(description, 'description');
        checkString(img, 'img');
        checkString(directions, 'directions');

        if (!Array.isArray(ingredients)) throw new Error('Ingredients must be an array');

        const updatedRecipeInfo = {
            title: title,
            img: img,
            description: description,
            directions: directions,
            ingredients: ingredients,
        };

        const recipeCollection = await recipes();
        const queryId = stringToId(id);

        const updatedInfo = await recipeCollection.updateOne({ _id: queryId }, { $set: updatedRecipeInfo });

        if (updatedInfo.modifiedCount === 0) throw new Error('Could not update recipe sucessfully.');

        return await this.get(id);
    },

    async addComment(recipeId, poster, commentText) {
        if (!recipeId) throw new Error('You must provide a recipeId to search for.');
        if (typeof recipeId !== 'string') throw new Error('recipeId must be a string.');
        if (!ObjectId.isValid(recipeId)) throw new Error('Invalid objectId');

        if (!poster) throw new Error('You must provide a poster.');
        if (typeof poster !== 'string') throw new Error('poster must be a string.');

        if (!commentText) throw new Error('No commentText provided.');
        checkString(commentText, 'commentText');

        const recipeCollection = await recipes();
        const queryId = stringToId(recipeId);

        recipe = await this.get(recipeId);

        const newComment = {
            poster: poster,
            text: commentText,
        };

        const updatedRecipeInfo = {
            comments: [newComment, ...recipe.comments],
        };

        const updatedInfo = await recipeCollection.updateOne({ _id: queryId }, { $set: updatedRecipeInfo });

        if (updatedInfo.modifiedCount === 0) throw new Error('Could not update recipe sucessfully.');

        return await this.get(recipeId);
    },

    async addLike(recipeId) {
        if (!recipeId) throw new Error('You must provide an recipeId to search for.');
        if (typeof recipeId !== 'string') throw new Error('recipeId must be a string.');
        if (!ObjectId.isValid(recipeId)) throw new Error('Invalid objectId');

        const recipeCollection = await recipes();
        const queryId = stringToId(recipeId);

        recipe = await this.get(recipeId);

        const updatedRecipeInfo = {
            likes: recipe.likes + 1,
        };

        const updatedInfo = await recipeCollection.updateOne({ _id: queryId }, { $set: updatedRecipeInfo });

        if (updatedInfo.modifiedCount === 0) throw new Error('Could not update recipe sucessfully.');

        return await this.get(recipeId);
    },
};

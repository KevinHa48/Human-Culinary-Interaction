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

    async create(title, poster, description, ingredients) {
        if (!title) throw new Error('No title provided.');
        if (!poster) throw new Error('No poster provided.');
        if (!description) throw new Error('No description provided.');
        if (!ingredients) throw new Error('No ingredients provided.');

        checkString(title, 'title');
        checkString(poster, 'poster');
        checkString(description, 'description');

        if (!Array.isArray(ingredients)) throw new Error('Ingredients must be an array');

        const newRecipeInfo = {
            title: title,
            poster: poster,
            description: description,
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

    async update(title, poster, description, ingredients, comments, likes) {
        if (!title) throw new Error('No title provided.');
        if (!poster) throw new Error('No poster provided.');
        if (!description) throw new Error('No description provided.');
        if (!ingredients) throw new Error('No ingredients provided.');

        checkString(title, 'title');
        checkString(poster, 'poster');
        checkString(description, 'description');

        if (!Array.isArray(ingredients)) throw new Error('Ingredients must be an array');

        const updatedRecipeInfo = {
            title: title,
            poster: poster,
            description: description,
            ingredients: ingredients,
            comments: comments,
            likes: likes,
        };

        const recipeCollection = await recipes();
        const queryId = stringToId(id);

        const updatedInfo = await recipeCollection.updateOne({ _id: queryId }, { $set: updatedRecipeInfo });

        if (updatedInfo.modifiedCount === 0) throw new Error('Could not update recipe sucessfully.');

        return await this.get(id);
    },

    async addComment(recipeId, posterId, commentText) {
        if (!recipeId) throw new Error('You must provide a recipeId to search for.');
        if (typeof recipeId !== 'string') throw new Error('recipeId must be a string.');
        if (!ObjectId.isValid(recipeId)) throw new Error('Invalid objectId');

        if (!posterId) throw new Error('You must provide a posterId.');
        if (typeof posterId !== 'string') throw new Error('posterId must be a string.');
        if (!ObjectId.isValid(posterId)) throw new Error('Invalid objectId');

        if (!commentText) throw new Error('No commentText provided.');
        checkString(commentText, 'commentText');

        const recipeCollection = await recipes();
        const queryId = stringToId(recipeId);

        recipe = await this.get(recipeId);

        const newComment = {
            poserId: posterId,
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

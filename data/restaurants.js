const mongoCollections = require('../config/mongoCollections');
const restaurants = mongoCollections.restaurants;

let { ObjectId } = require('mongodb');

function stringToId(id) {
    //Code from lab4 assignment
    //check to make sure we have input at all
    if (!id) throw new Error('Id parameter must be supplied');

    //check to make sure it's a string
    if (typeof id !== 'string') throw new Error('Id must be a string');

    //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
    //if it fails, it will throw an error (you do not have to throw the error, it does it automatically and the catch where you call the function will catch the error just as it catches your other errors).
    let parsedId = ObjectId(id);
    return parsedId;
}

const checkString = (str, variableName) => {
    if (typeof str !== 'string' || str.trim().length === 0)
        throw new Error(`${variableName} must be a non-empty string`);
};

module.exports = {
    async create(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions) {
        // TODO handle computing oerall rating;
        if (!name) throw new Error('No name provided.');
        if (!location) throw new Error('No location provided.');
        if (!phoneNumber) throw new Error('No phoneNumber provided.');
        if (!website) throw new Error('No website provided.');
        if (!priceRange) throw new Error('No priceRange provided.');
        if (!cuisines) throw new Error('No cuisines provided.');
        if (!serviceOptions) throw new Error('No serviceOptions provided.');

        checkString(name, 'name');
        checkString(location, 'location');
        checkString(phoneNumber, 'phoneNumber');
        checkString(website, 'website');
        checkString(priceRange, 'priceRange');

        //https://stackoverflow.com/questions/18375929/validate-phone-number-using-javascript
        let phoneno = new RegExp(/^([0-9]{3})-([0-9]{3})-([0-9]{4})$/);
        if (!phoneno.test(phoneNumber)) throw new Error('Phone number does not match format: xxx-xxx-xxxx.');

        let webs = new RegExp(/^(http:\/\/www.)[a-zA-Z]{5,}(.com)$/);
        if (!webs.test(website)) throw new Error('Invalid website.');

        let prange = new RegExp(/^\${1,4}$/);
        if (!prange.test(priceRange)) throw new Error('Invalid price range not in range $-$$$$.');

        if (!Array.isArray(cuisines)) throw new Error('Cuisines must be an array.');
        if (cuisines.length === 0) throw new Error('Cuisines cannot be empty.');
        for (const c of cuisines) {
            if (typeof c !== 'string') throw Error('Cuisines must only contain strings');
            if (c.trim().length === 0) throw Error('Cuisines cannot contain empty strings.');
        }

        if (typeof serviceOptions !== 'object') throw new Error('serviceOptions must be an object');
        if (
            typeof serviceOptions.dineIn !== 'boolean' ||
            typeof serviceOptions.takeOut !== 'boolean' ||
            typeof serviceOptions.delivery !== 'boolean'
        )
            throw new Error('Service options should contain booleans');

        const restaurantCollection = await restaurants();

        //changed overall rating to be initialzed to 0 will change when reviews are added
        //added reviews array starts empty
        let newRestaurantInfo = {
            name: name,
            location: location,
            phoneNumber: phoneNumber,
            website: website,
            priceRange: priceRange,
            cuisines: cuisines,
            overallRating: 0,
            serviceOptions: serviceOptions,
            reviews: [],
        };

        const insertInfo = await restaurantCollection.insertOne(newRestaurantInfo);
        if (insertInfo.insertedCount === 0) throw new Error('Could not add restaurant.');

        const newRestaurant = await this.get(insertInfo.insertedId.toString());

        return newRestaurant;
    },

    async getAll() {
        const restaurantCollection = await restaurants();
        const restaurantList = await restaurantCollection.find({}).toArray();

        // TODO convert all _ids to string
        for (const r of restaurantList) {
            r._id = r._id.toString();
            for (const rev of r.reviews) {
                rev._id = rev._id.toString();
            }
        }

        return restaurantList;
    },

    async get(id) {
        if (!id) throw new Error('You must provide an id to search for.');
        if (typeof id !== 'string') throw new Error('Id must be a string.');
        if (!ObjectId.isValid(id)) throw new Error('Invalid objectId');
        // TODO more error checking

        const queryId = stringToId(id);
        const restaurantCollection = await restaurants();
        const restaurant = await restaurantCollection.findOne({ _id: queryId });
        if (restaurant === null) throw new Error('No restaurant with that id.');

        restaurant._id = restaurant._id.toString();
        for (const rev of restaurant.reviews) {
            rev._id = rev._id.toString();
        }
        return restaurant;
    },

    async remove(id) {
        if (!id) throw new Error('You must provide an id to search for.');
        if (typeof id !== 'string') throw new Error('Id must be a string.');
        if (!ObjectId.isValid(id)) throw new Error('Invalid objectId');

        const queryId = stringToId(id);
        const restaurantCollection = await restaurants();
        const restaurant = await this.get(id);
        const deletionInfo = await restaurantCollection.deleteOne({ _id: queryId });

        if (deletionInfo.deletedCount === 0) {
            throw new Error(`Could not delete restaurant with id of ${id}`);
        }

        return { restaurantId: id, deleted: true };
    },

    async update(id, name, location, phoneNumber, website, priceRange, cuisines, serviceOptions) {
        if (!id) throw new Error('You must provide an id to search for.');
        if (typeof id !== 'string') throw new Error('Id must be a string.');
        if (!ObjectId.isValid(id)) throw new Error('Invalid objectId');

        if (!name) throw new Error('No name provided.');
        if (!location) throw new Error('No location provided.');
        if (!phoneNumber) throw new Error('No phoneNumber provided.');
        if (!website) throw new Error('No website provided.');
        if (!priceRange) throw new Error('No priceRange provided.');
        if (!cuisines) throw new Error('No cuisines provided.');
        if (!serviceOptions) throw new Error('No serviceOptions provided.');

        checkString(name, 'name');
        checkString(location, 'location');
        checkString(phoneNumber, 'phoneNumber');
        checkString(website, 'website');
        checkString(priceRange, 'priceRange');

        //https://stackoverflow.com/questions/18375929/validate-phone-number-using-javascript
        let phoneno = new RegExp(/^([0-9]{3})-([0-9]{3})-([0-9]{4})$/);
        if (!phoneno.test(phoneNumber)) throw new Error('Phone number does not match format: xxx-xxx-xxxx.');

        let webs = new RegExp(/^(http:\/\/www.)[a-zA-Z]{5,}(.com)$/);
        if (!webs.test(website)) throw new Error('Invalid website.');

        let prange = new RegExp(/^\${1,4}$/);
        if (!prange.test(priceRange)) throw new Error('Invalid price range not in range $-$$$$.');

        if (!Array.isArray(cuisines)) throw new Error('Cuisines must be an array.');
        if (cuisines.length === 0) throw new Error('Cuisines cannot be empty.');
        for (const c of cuisines) {
            if (typeof c !== 'string') throw Error('Cuisines must only contain strings');
            if (c.trim().length === 0) throw Error('Cuisines cannot contain empty strings.');
        }

        if (typeof serviceOptions !== 'object') throw new Error('serviceOptions must be an object');
        if (
            typeof serviceOptions.dineIn !== 'boolean' ||
            typeof serviceOptions.takeOut !== 'boolean' ||
            typeof serviceOptions.delivery !== 'boolean'
        )
            throw new Error('Service options should contain booleans');

        const restaurantCollection = await restaurants();

        //changed overall rating to be initialzed to 0 will change when reviews are added
        //added reviews array starts empty
        let updatedRestaurantInfo = {
            name: name,
            location: location,
            phoneNumber: phoneNumber,
            website: website,
            priceRange: priceRange,
            cuisines: cuisines,
            serviceOptions: serviceOptions,
        };

        const queryId = stringToId(id);

        const updatedInfo = await restaurantCollection.updateOne({ _id: queryId }, { $set: updatedRestaurantInfo });

        if (updatedInfo.modifiedCount === 0) throw new Error('Could not update restaurant sucessfully.');

        return await this.get(id);
    },
};

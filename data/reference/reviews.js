const mongoCollections = require('../config/mongoCollections');
const restaurantData = require('./restaurants');
const restaurants = mongoCollections.restaurants;

let { ObjectId } = require('mongodb');

function stringToId(id) {
    //Code from lab4 assignment
    //check to make sure we have input at all
    if (!id) throw 'Id parameter must be supplied';

    //check to make sure it's a string
    if (typeof id !== 'string') throw 'Id must be a string';

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
    async create(restaurantId, title, reviewer, rating, dateOfReview, review) {
        if (!restaurantId) throw new Error('No restaurantId provided.');
        if (!title) throw new Error('No title provided.');
        if (!reviewer) throw new Error('No reviewer provided.');
        if (!rating) throw new Error('No rating provided.');
        if (!dateOfReview) throw new Error('No dateOfReview provided.');
        if (!review) throw new Error('No review provided.');

        checkString(restaurantId, 'restaurantId');
        checkString(title, 'title');
        checkString(reviewer, 'reviewer');
        checkString(dateOfReview, 'dateOfReview');
        checkString(review, 'review');

        if (!ObjectId.isValid(restaurantId)) throw new Error('Invalid objectId');

        const queryId = stringToId(restaurantId);
        const restaurantCollection = await restaurants();
        const restaurant = await restaurantCollection.findOne({ _id: queryId });
        if (restaurant === null) throw new Error('No restaurant with that id.');

        if (typeof rating !== 'number') throw new Error('Rating must be a number');
        if (rating < 1 || rating > 5) throw new Error('Rating must be in range [1-5].');

        const dateChecker = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
        if (!dateChecker.test(dateOfReview)) throw new Error('Invalid date format.');
        const mmddyyyy = dateOfReview.toString().split('/');
        const checkDays = (month, day) => {
            month = parseInt(month);
            day = parseInt(day);
            const validDates = {
                1: { name: 'January', days: 31 },
                2: { name: 'February', days: 28 },
                3: { name: 'March', days: 31 },
                4: { name: 'April', days: 30 },
                5: { name: 'May', days: 31 },
                6: { name: 'June', days: 30 },
                7: { name: 'July', days: 31 },
                8: { name: 'August', days: 31 },
                9: { name: 'September', days: 30 },
                10: { name: 'October', days: 31 },
                11: { name: 'November', days: 30 },
                12: { name: 'December', days: 31 },
            };
            if (month < 1 || month > 12) throw new Error('invalid value for month');
            if (day < 1 || day > validDates[month].days)
                throw new Error(`Error: There are not ${day} days in ${validDates[month].name}`);
        };
        checkDays(mmddyyyy[0], mmddyyyy[1]);

        // How to get current date in javascript
        // https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=1
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear().toString();

        //If the date is anything other than the current date throw an error
        if (mm != mmddyyyy[0] || dd != mmddyyyy[1] || yyyy != mmddyyyy[2])
            throw new Error("dateOfReview is prior or after the current day's date.");

        //Calculate new avg for the rating
        let newAvgRating = 0;
        for (rev of restaurant.reviews) {
            newAvgRating += rev.rating;
        }
        newAvgRating = (newAvgRating + rating) / (restaurant.reviews.length + 1);

        const newReview = {
            _id: ObjectId(),
            title: title,
            reviewer: reviewer,
            rating: rating,
            dateOfReview: dateOfReview,
            review: review,
        };

        let newReviews = restaurant.reviews;
        newReviews.push(newReview);
        let restaurantUpdateInfo = {
            overallRating: newAvgRating,
            reviews: newReviews,
        };

        const updateInfo = await restaurantCollection.updateOne({ _id: queryId }, { $set: restaurantUpdateInfo });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

        return await restaurantData.get(restaurantId);
    },

    async getAll(restaurantId) {
        if (!restaurantId) throw new Error('No restaurantId provided.');
        checkString(restaurantId, 'restaurantId');
        if (!ObjectId.isValid(restaurantId)) throw new Error('Invalid objectId');

        const restaurant = await restaurantData.get(restaurantId);
        if (restaurant === null) throw new Error('No restaurant with that id.');

        return restaurant.reviews;
    },

    async get(reviewId) {
        if (!reviewId) throw new Error('No restaurantId provided.');
        checkString(reviewId, 'restaurantId');
        if (!ObjectId.isValid(reviewId)) throw new Error('Invalid objectId');
        const queryId = stringToId(reviewId);
        const restaurantCollection = await restaurants();
        let review = await restaurantCollection.findOne(
            { 'reviews._id': queryId },
            { projection: { 'reviews.$': 1, _id: 0 } }
        );
        if (review === null) throw new Error(`Review with ${reviewId} does not exist.`);
        review = review.reviews[0];
        review._id = review._id.toString();

        return review;
    },

    async remove(reviewId) {
        if (!reviewId) throw new Error('No restaurantId provided.');
        checkString(reviewId, 'restaurantId');
        if (!ObjectId.isValid(reviewId)) throw new Error('Invalid objectId');

        const queryId = stringToId(reviewId);
        const restaurantCollection = await restaurants();
        let restaurantWithReview = await restaurantCollection.findOne({ 'reviews._id': queryId });
        if (restaurantWithReview === null) throw new Error('There is no restaurant with reviewId.');

        const newReviews = restaurantWithReview.reviews.filter((r) => r._id.toString() != reviewId);
        let newAvgRating = 0;
        for (rev of newReviews) {
            newAvgRating += rev.rating;
        }
        if (newReviews.length != 0) {
            newAvgRating = newAvgRating / newReviews.length;
        }
        const restaurantUpdateInfo = {
            overallRating: newAvgRating,
            reviews: newReviews,
        };

        const updateQueryId = restaurantWithReview._id;
        const updateInfo = await restaurantCollection.updateOne({ _id: updateQueryId }, { $set: restaurantUpdateInfo });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw new Error('Update failed');

        // TODO what to return??
        return { reviewId: reviewId, deleted: true };
    },
};

const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
const restaurantData = data.restaurants;

let { ObjectId } = require('mongodb');

const checkReviewData = (newReviewData, res) => {
    if (!newReviewData.restaurantId) {
        res.status(400).json({ error: 'No restaurantId provided.' });
        return true;
    }
    if (!newReviewData.title) {
        res.status(400).json({ error: 'No title provided.' });
        return true;
    }
    if (!newReviewData.reviewer) {
        res.status(400).json({ error: 'No reviewer provided.' });
        return true;
    }
    if (!newReviewData.rating) {
        res.status(400).json({ error: 'No rating provided.' });
        return true;
    }
    if (!newReviewData.dateOfReview) {
        res.status(400).json({ error: 'No dateOfReview provided.' });
        return true;
    }
    if (!newReviewData.review) {
        res.status(400).json({ error: 'No review provided.' });
        return true;
    }

    if (typeof newReviewData.restaurantId !== 'string' || newReviewData.restaurantId.trim().length === 0) {
        res.status(400).json({ error: 'restaurantId must be a non-empty string.' });
        return true;
    }
    if (typeof newReviewData.title !== 'string' || newReviewData.title.trim().length === 0) {
        res.status(400).json({ error: 'title must be a non-empty string.' });
        return true;
    }
    if (typeof newReviewData.reviewer !== 'string' || newReviewData.reviewer.trim().length === 0) {
        res.status(400).json({ error: 'reviewer must be a non-empty string.' });
        return true;
    }
    if (typeof newReviewData.dateOfReview !== 'string' || newReviewData.dateOfReview.trim().length === 0) {
        res.status(400).json({ error: 'dateOfReview must be a non-empty string.' });
        return true;
    }
    if (typeof newReviewData.review !== 'string' || newReviewData.review.trim().length === 0) {
        res.status(400).json({ error: 'review must be a non-empty string.' });
        return true;
    }

    if (!ObjectId.isValid(newReviewData.restaurantId)) {
        res.status(400).json({ error: 'Invalid objectId.' });
        return true;
    }

    if (typeof newReviewData.rating !== 'number') {
        res.status(400).json({ error: 'rating must be a number.' });
        return true;
    }
    if (newReviewData.rating < 1 || newReviewData.rating > 5) {
        res.status(400).json({ error: 'rating must be in range [1-5].' });
        return true;
    }

    const dateChecker = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
    if (!dateChecker.test(newReviewData.dateOfReview)) {
        res.status(400).json({ error: 'Invalid date format. must be MM/DD/YYYY' });
        return true;
    }
    const mmddyyyy = newReviewData.dateOfReview.toString().split('/');
    const month = parseInt(mmddyyyy[0]);
    const day = parseInt(mmddyyyy[1]);

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

    if (month < 1 || month > 12) {
        res.status(400).json({ error: 'invalid value for month' });
        return true;
    }
    if (day < 1 || day > validDates[month].days) {
        res.status(400).json({ error: `Error: There are not ${day} days in ${validDates[month].name}` });
        return true;
    }

    // How to get current date in javascript
    // https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript?rq=1
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear().toString();

    //If the date is anything other than the current date throw an error
    if (mm != mmddyyyy[0] || dd != mmddyyyy[1] || yyyy != mmddyyyy[2]) {
        res.status(400).json({ error: "dateOfReview is prior or after the current day's date." });
        return true;
    }

    return false;
};

router.get('/:id', async (req, res) => {
    try {
        await restaurantData.get(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
    }

    try {
        let reviews = await reviewData.getAll(req.params.id);
        if (reviews.length === 0) {
            res.status(404).json({ error: 'Restaurant has 0 reviews' });
            return;
        }
        res.status(200).json(reviews);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
    }
});
router.get('/review/:id', async (req, res) => {
    try {
        let review = await reviewData.get(req.params.id);
        res.status(200).json(review);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
    }
});

router.post('/:id', async (req, res) => {
    const newReviewData = { restaurantId: req.params.id, ...req.body };
    const invalidFields = checkReviewData(newReviewData, res);
    if (invalidFields) {
        return;
    }

    try {
        await restaurantData.get(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
    }
    try {
        const { title, reviewer, rating, dateOfReview, review } = newReviewData;
        const newReview = await reviewData.create(req.params.id, title, reviewer, rating, dateOfReview, review);
        res.status(200).json(newReview);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must supply a reviewId to delete' });
        return;
    }
    try {
        await reviewData.get(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        const deleted = await reviewData.remove(req.params.id);
        res.status(200).json(deleted);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

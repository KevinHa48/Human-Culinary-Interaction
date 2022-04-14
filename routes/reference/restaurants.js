const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;

const checkRestaurantData = (newRestaurantData, res) => {
    if (!newRestaurantData.name) {
        res.status(400).json({ error: 'You must provide a restaurant title' });
        return true;
    }
    if (!newRestaurantData.location) {
        res.status(400).json({ error: 'You must provide a restaurant location' });
        return true;
    }
    if (!newRestaurantData.phoneNumber) {
        res.status(400).json({ error: 'You must provide a restaurant phoneNumber' });
        return true;
    }
    if (!newRestaurantData.website) {
        res.status(400).json({ error: 'You must provide a restaurant website' });
        return true;
    }
    if (!newRestaurantData.priceRange) {
        res.status(400).json({ error: 'You must provide a restaurant priceRange' });
        return true;
    }
    if (!newRestaurantData.cuisines) {
        res.status(400).json({ error: 'You must provide a restaurant cuisines' });
        return true;
    }
    if (!newRestaurantData.serviceOptions) {
        res.status(400).json({ error: 'You must provide a restaurant serviceOptions' });
        return true;
    }
    if (typeof newRestaurantData.name !== 'string' || newRestaurantData.name.trim().length === 0) {
        res.status(400).json({ error: 'Restaurant title must be a non-empty string.' });
        return true;
    }
    if (typeof newRestaurantData.location !== 'string' || newRestaurantData.location.trim().length === 0) {
        res.status(400).json({ error: 'Restaurant location must be a non-empty string.' });
        return true;
    }
    if (typeof newRestaurantData.phoneNumber !== 'string' || newRestaurantData.phoneNumber.trim().length === 0) {
        res.status(400).json({ error: 'Restaurant phoneNumber must be a non-empty string.' });
        return true;
    }
    if (typeof newRestaurantData.website !== 'string' || newRestaurantData.website.trim().length === 0) {
        res.status(400).json({ error: 'Restaurant website must be a non-empty string.' });
        return true;
    }
    if (typeof newRestaurantData.priceRange !== 'string' || newRestaurantData.priceRange.trim().length === 0) {
        res.status(400).json({ error: 'Restaurant priceRange must be a non-empty string.' });
        return true;
    }
    let phoneno = new RegExp(/^([0-9]{3})-([0-9]{3})-([0-9]{4})$/);
    if (!phoneno.test(newRestaurantData.phoneNumber)) {
        res.status(400).json({ error: 'Phone number does not match format: xxx-xxx-xxxx.' });
        return true;
    }
    let webs = new RegExp(/^(http:\/\/www.)[a-zA-Z]{5,}(.com)$/);
    if (!webs.test(newRestaurantData.website)) {
        res.status(400).json({ error: 'Invalid website.' });
        return true;
    }
    let prange = new RegExp(/^\${1,4}$/);
    if (!prange.test(newRestaurantData.priceRange)) {
        res.status(400).json({ error: 'Invalid price range not in range $-$$$$.' });
        return true;
    }

    if (!Array.isArray(newRestaurantData.cuisines)) {
        res.status(400).json({ error: 'Cuisines must be an array.' });
        return true;
    }
    if (newRestaurantData.cuisines.length === 0) {
        res.status(400).json({ error: 'Cuisines cannot be empty.' });
        return true;
    }
    for (const c of newRestaurantData.cuisines) {
        if (typeof c !== 'string') {
            res.status(400).json({ error: 'Cuisines must only contain strings' });
            return true;
        }
        if (c.trim().length === 0) {
            res.status(400).json({ error: 'Cuisines cannot contain empty strings.' });
            return true;
        }
    }

    if (typeof newRestaurantData.serviceOptions !== 'object') {
        res.status(400).json({ error: 'serviceOptions must be an object' });
        return true;
    }
    if (
        typeof newRestaurantData.serviceOptions.dineIn !== 'boolean' ||
        typeof newRestaurantData.serviceOptions.takeOut !== 'boolean' ||
        typeof newRestaurantData.serviceOptions.delivery !== 'boolean'
    ) {
        res.status(400).json({ error: 'Service options should contain booleans' });
        return true;
    }
    return false;
};

router.get('/:id', async (req, res) => {
    try {
        let restaurant = await restaurantData.get(req.params.id); // TODO use await to get data
        res.status(200).json(restaurant);
    } catch (e) {
        res.status(404).json({ error: 'Restaurant not found' });
    }
});

router.get('/', async (req, res) => {
    try {
        const restaurantList = await restaurantData.getAll(); // TODO use await to get list of restaurants
        const lessInfoList = [];

        for (const r of restaurantList) {
            lessInfoList.push({ _id: r._id, name: r.name });
        }
        res.status(200).json(lessInfoList);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/', async (req, res) => {
    const newRestaurantData = req.body; // get restauarant data
    // TODO Check each of the fields type check too?
    const invalidFields = checkRestaurantData(newRestaurantData, res);
    //If any of the fields were invalid, return before trying to add restaurant
    if (invalidFields) {
        return;
    }
    try {
        const { name, location, phoneNumber, website, priceRange, cuisines, serviceOptions } = newRestaurantData;
        const newRestaurant = await restaurantData.create(
            name,
            location,
            phoneNumber,
            website,
            priceRange,
            cuisines,
            serviceOptions
        );
        res.status(200).json(newRestaurant);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply a restaurant ID to change' });
        return;
    }
    const updatedData = req.body;
    if (
        !updatedData.name ||
        !updatedData.location ||
        !updatedData.phoneNumber ||
        !updatedData.website ||
        !updatedData.priceRange ||
        !updatedData.cuisines ||
        !updatedData.serviceOptions
    ) {
        res.status(400).json({ error: 'You must provide all fields' });
        return;
    }
    const invalidFields = checkRestaurantData(updatedData, res);
    //If any of the fields were invalid, return before trying to update restaurant
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
        const { name, location, phoneNumber, website, priceRange, cuisines, serviceOptions } = updatedData;
        const updatedRestaurant = await restaurantData.update(
            req.params.id,
            name,
            location,
            phoneNumber,
            website,
            priceRange,
            cuisines,
            serviceOptions
        );
        res.status(200).json(updatedRestaurant);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply a restaurant ID to delete' });
        return;
    }
    try {
        await restaurantData.get(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
    }
    try {
        const removed = await restaurantData.remove(req.params.id);
        res.status(200).json(removed);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

import express from "express";
import axios from "axios";
import schedule from "node-schedule";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { config } from 'dotenv';
import NodeCache from "node-cache";

import { parseCityNameAndCode } from './helpers/cityInfo-helper.js';


const cache = new NodeCache();
config();
const app = express();
const port = process.env.PORT || 3000;
const key = '111';
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: '1222', // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: true // don't create session until something stored
}));


// Get the current filename (this file's URL)
const __filename = fileURLToPath(
    import.meta.url)

// Get the directory name (the folder containing this file)
const __dirname = path.dirname(__filename);

// Set the view engine to EJS (a template engine for rendering HTML)
app.set('view engine', 'ejs');

// Set the directory for views (HTML templates) to the 'views' folder in the current directory
// Points to a folder named "views" in the same directory as your Node.js script.
app.set('views', path.join(__dirname, 'views'));
app.set('public', __dirname + '/public');

// API headers
const headers = {
    'X-RapidAPI-Key': process.env.API_KEY,
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
};
// Home Route
app.get("/", async(req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }

        });
        const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/countries?limit=10', {
            headers
        })
        const countries = response.data.data;
        res.render("index", { data: countries });

    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

// distance route

app.post('/distance', async(req, res) => {

    const cachedData = cache.get(key);

    const startCity = req.body.start;
    const endCity = req.body.end;
    const startCityInfo = parseCityNameAndCode(startCity);
    const endCityInfo = parseCityNameAndCode(endCity);

    const startCityName = startCityInfo.name;
    const startCityCode = startCityInfo.code

    const endCityName = endCityInfo.name;
    const endCityCode = endCityInfo.code

    let distance;

    if (cachedData && cachedData.citySessionData && cachedData.countrySessionData) {
        const cityIdMap = {};
        const allCities = cachedData.citySessionData;
        allCities.forEach(element => { cityIdMap[element.city] = element.id; });


        if (startCityName === endCityName) {
            distance = 0.00;

        } else {
            try {
                const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/places/${cityIdMap[startCityName]}/distance?toPlaceId=${cityIdMap[endCityName]}`, {
                    headers
                });
                distance = response.data.data;

            } catch (error) {
                console.error('Error calculating distance:', error);
                return res.status(500).json({ error: 'An error occurred on the server while calculating distance, please go back to the main page.' });
            }

        }
        res.render('country', { distance, countrySessionData: cachedData.countrySessionData, citySessionData: cachedData.citySessionData });



    } else {
        // Data is not in the cache, you can handle this case
        // res.json({ message: ' any one data missing Error with API server, please go back to home page' });

        const requestOne = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${endCityCode}`, { headers });
        const responseOne = await requestOne;
        const dataOne = responseOne.data.data;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const requestTwo = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${endCityCode}`, { headers });
        const responseTwo = await requestTwo;
        const dataTwo = responseTwo.data.data;

        await new Promise(resolve => setTimeout(resolve, 1500));
        const cityIdMap = {};
        dataTwo.forEach(element => { cityIdMap[element.city] = element.id; });
        try {
            const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/places/${cityIdMap[startCityName]}/distance?toPlaceId=${cityIdMap[endCityName]}`, {
                headers: {
                    'X-RapidAPI-Key': process.env.API_KEY,
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                }
            });
            distance = response.data.data;
        } catch (error) {
            console.error('Error with API server, please go back to the home page and try again after few seconds:', error);
            return res.status(500).json({ error: 'An error occurred on the server while calculating distances, please go back to the main page and try again after few seconds.' });
        }

        res.render('country', { distance, dataOne, dataTwo });
    }


});

// country details route
app.get("/:country", async(req, res) => {


    try {
        const countryName = req.params.country;
        const countryNameInfo = parseCityNameAndCode(countryName);
        const code = countryNameInfo.code;

        const requestOne = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${code}`, { headers });
        const responseOne = await requestOne;
        const dataOne = responseOne.data.data;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const requestTwo = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${code}`, { headers });
        const responseTwo = await requestTwo;
        const dataTwo = responseTwo.data.data;

        const dataToCache = {
            countrySessionData: dataOne,
            citySessionData: dataTwo
        };

        cache.set(key, dataToCache);

        // cache.del(key);
        res.render('country', { dataOne, dataTwo });
    } catch (error) {
        res.send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
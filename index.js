import express from "express";
import axios from "axios";
import schedule from "node-schedule";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { config } from 'dotenv';
import NodeCache from "node-cache";
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


// Home Route
app.get("/", async(req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }

        });
        const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/countries?limit=10', {
            headers: {
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        })
        const countries = response.data.data;
        res.render("index", { data: countries });

    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

// distance route
// Define a cache key for your data

app.post('/distance', async(req, res) => {

    // Check if the data is in the cache

    const cachedData = cache.get(key);

    if (cachedData) {
        // Data is cached, you can use it
        res.json({ message: 'Data is cached', data: cachedData });


    } else {
        // Data is not in the cache, you can handle this case
        res.json({ message: 'Data is not cached' });
    }


});

// country details route
app.get("/:country", async(req, res) => {


    try {
        const countryName = req.params.country;
        const splitCountryName = countryName.split("-");
        const name = splitCountryName[0];
        const code = splitCountryName[1];

        if (!code) {
            return res.status(400).json({ error: 'Invalid country code' });
        }

        const headers = {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
        };

        const requestOne = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${code}`, { headers });
        const responseOne = await requestOne;
        const dataOne = responseOne.data.data;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const requestTwo = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${code}`, { headers });
        const responseTwo = await requestTwo;
        const dataTwo = responseTwo.data.data;
        cache.del(key);
        const dataToCache = {
            countrySessionData: dataOne,
            citySessionData: dataTwo
        };



        cache.set(key, dataToCache, 34600);

        let cachedData = cache.get(key);

        let message;
        if (cachedData) {
            message = "Data cached in country route:"
            res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate');
        } else {
            message = "Data not cached in country route:"
            cachedData = "No cached avail"
        }


        res.render('country', { message, cachedData: cachedData.citySessionData, dataOne, dataTwo });
    } catch (error) {
        res.send(error);
    }
});



app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
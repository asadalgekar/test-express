import express from "express";
import axios from "axios";
import schedule from "node-schedule";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { config } from 'dotenv';

config();
console.log("api", process.env.API_KEY)

const app = express();
const port = process.env.PORT || 3000;
let secretKey = '1234'
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'my-secret', // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false // don't create session until something stored
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

app.get("/", async(req, res) => {


    try {
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
app.get("/distance", (req, res) => {
    // Retrieve data from session or perform any other data retrieval logic
    const renderCitySessionData = req.session.citySessionData;
    const renderCountrySessionData = req.session.countrySessionData;


    res.render("country", { renderCitySessionData, renderCountrySessionData });

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

        req.session.citySessionData = dataTwo;
        req.session.countrySessionData = dataOne;

        res.render('country', { dataOne, dataTwo })
    } catch (error) {
        res.send(error)

    }

})




app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
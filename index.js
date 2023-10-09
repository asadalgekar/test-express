// Import the required modules
import express from "express"; // Import Express.js
import path from 'path'; // Import the path module to handle file paths
import { fileURLToPath } from 'url'; // Import the fileURLToPath function from the url module
import session from "express-session";
import axios from "axios";

// Get the current filename (this file's URL)
const __filename = fileURLToPath(
    import.meta.url);

// Get the directory name (the folder containing this file)
const __dirname = path.dirname(__filename);

// Create an Express application
const app = express();

// Set the view engine to EJS (a template engine for rendering HTML)
app.set('view engine', 'ejs');

// Set the directory for views (HTML templates) to the 'views' folder in the current directory
// Points to a folder named "views" in the same directory as your Node.js script.
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT || 5050;


app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-secret', // a secret string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false // don't create session until something stored
}));

app.get("/home", async(req, res) => {
    if (req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1; // Initialize views to 1
    }

    // axios
    let code = "AF"
    const headers = {
        'X-RapidAPI-Key': '0da6700346msh27f8c33ac7f438cp1c33cajsn6337f1937014',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    };
    try {
        const requestOne = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${code}`, { headers });
        const responseOne = await requestOne;
        const dataOne = responseOne.data.data;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const requestTwo = axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${code}`, { headers });
        const responseTwo = await requestTwo;
        const dataTwo = responseTwo.data.data;

        req.session.country = dataOne;
        req.session.city = dataTwo;

    } catch (error) {
        console.error('Error fetching data:', error);
    }



    res.render("index", { views: req.session.views });
});


app.post("/distance", (req, res) => {
    const countryCached = req.session.country;
    const citiesCached = req.session.city;
    const name = req.body.name;
    req.session.name = name;
    const cacheName = req.session.name;
    const send = "Hello, " + cacheName
    res.render('index', { countryCached, citiesCached, send, views: req.session.views });
});



app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
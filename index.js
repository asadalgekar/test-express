import express from "express";
import ejs from 'ejs';
import path from 'path'; // Import path module to handle paths
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(
    import.meta.url));

const app = express(); // Initialize Express app

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));



const PORT = process.env.PORT || 5050;

app.get("/home", (req, res) => {
    console.log(__dirname)
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
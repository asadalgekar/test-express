import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT || 5050;

app.get("/home", (req, res) => {
    console.log(__dirname);
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
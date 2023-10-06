import express from 'express';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'; // Add this line to import the 'path' module

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Use 'path.join' to set views directory
app.use(express.static(path.join(__dirname, 'public'))); // Use 'path.join' for serving static files

const PORT = process.env.PORT || 5050;

app.get('/home', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
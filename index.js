import express from "express";


const app = express(); // Initialize Express app

// Set the view engine to EJS
app.set('view engine', 'ejs');



const PORT = process.env.PORT || 5050;

app.get("/home", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
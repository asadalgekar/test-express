import express from "express";

const app = express();
const PORT = process.env.PORT || 5050;

app.get("/home", (req, res) => {
    res.send("working fine")
})

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
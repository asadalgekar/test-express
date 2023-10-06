import express from "express";
import res from "express/lib/response";

const app = express();
const PORT = process.env.PORT || 5050;

app.get("/home", () => {
    res.send("<h1>Deployment Succesfully.</h1>")
})

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
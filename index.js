const express = require("express");
const router = require("./api/product");

const app = express();
const PORT = process.env.PORT || 5050;

app.use("/api/product", router);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
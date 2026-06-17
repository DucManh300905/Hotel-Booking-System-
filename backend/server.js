require("dotenv").config({
   path: "./.env"
});

console.log("ENV FILE URI:", process.env.MONGO_URI);

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
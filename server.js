const app = require("./app");
const mongoose = require("mongoose");

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect("mongodb+srv://tetiana:daf210489@cluster0.h3bmdzb.mongodb.net/")
  .then(() =>
    app.listen(PORT, () => {
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error.message);
    process.exit(1);
  });
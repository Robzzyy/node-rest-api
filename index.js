const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require ("dotenv");
const helmet = require ("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true})
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

//middleware
// c'est un analyseur de corps lorsque vous faites une demande de publication,
// il va juste le mettre en mot de passe
app.use(express.json());

app.use(helmet());

app.use(morgan("common"));

app.use("/api/users", userRoute); 
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);




app.listen(8800, () => {
    console.log("Backend server is running")
});
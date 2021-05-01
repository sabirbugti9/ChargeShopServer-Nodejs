const express = require("express");
const app = express();
const mongoose = require('mongoose');
const productRoutes = require("./routes/product_routes");
const categoryRoutes = require("./routes/category_routes");
const userRoutes = require("./routes/user_routes");
const orderRoutes = require("./routes/order_routes");


const morgan = require('morgan');
const authJwt = require("./helper/jwt");
const errorHandler = require("./helper/error_handler");

require('dotenv/config');
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;
const port = process.env.PORT;

app.use(express.json())
app.use(morgan('tiny'));
app.use(authJwt());

app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler);

app.use(`${api}/orders`, orderRoutes);

app.use(`${api}/products`, productRoutes);
app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/users`, userRoutes);




mongoose.connect(connectionString, {
    useCreateIndex: true,
    useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true
}).catch(err => {
    console.log("error ");
    console.log(err);
});
var server = app.listen(port || 3000, () => {
    var ports = server.address.port;
    console.log("Express is working on port " + port);
});

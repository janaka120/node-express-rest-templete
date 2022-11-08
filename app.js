const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Controller-Allow-Origin', '*');
    res.setHeader('Access-Controller-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Controller-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.listen(8080);
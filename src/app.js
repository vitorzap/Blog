require('dotenv').config();

console.log('BLOG STARTED');

const express = require('express');
require('./database');


const app = express();
const server = require('http').createServer(app);
const routes = require('./routes');

app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3333;
server.listen(port, () => console.log(`Server port = (${port})`));

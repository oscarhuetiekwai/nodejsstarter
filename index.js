const keepalive = require('./routes/keepalive');
const auth = require('./routes/auth');
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(express.json());
app.use(helmet());
app.use('/api/keepalive', keepalive);
app.use('/api/login', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
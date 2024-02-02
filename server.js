import express from 'express'
const app = express();

app.use(express.static('./dist'));

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});
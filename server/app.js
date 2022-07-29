import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(express.json());

app.post('/api', (req, res) => {
    res.send('Welcome to Bruno Veiga\'s Simple NodeJS Server. ');
});

/**
 * App Start
 */
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
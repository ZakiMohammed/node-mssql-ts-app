import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>😁 NodeJS team up with MSSQL</h1>');
});

app.use('/api/employees', require('./api/employees'));

app.listen(PORT, () => {
    console.log(`Server started running on ${PORT} and env is ${process.env.NODE_ENV}`);
});

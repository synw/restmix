import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5714;
const app: Express = express();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }))
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send({ "response": "ok" })
});

app.get('/401', (req: Request, res: Response) => {
  res.status(401).send()
});

app.get('/403', (req: Request, res: Response) => {
  res.status(403).send({ "ok": false })
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

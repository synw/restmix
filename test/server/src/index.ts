import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from "morgan";

dotenv.config();

const PORT = process.env.PORT || 5714;
const app: Express = express();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }))
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send({ "response": "ok" })
});

app.get('/text', (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain');
  res.send('plain text response');
});

app.get('/invalid-json', (req: Request, res: Response) => {
  res.set('Content-Type', 'application/json');
  res.send('{ "invalid json');
});

app.get('/204', (req: Request, res: Response) => {
  res.status(204).send()
});

app.get('/401', (req: Request, res: Response) => {
  res.status(401).send()
});

app.get('/403', (req: Request, res: Response) => {
  res.status(403).send({ "ok": false })
});

app.post('/post', function(req, res) {
  res.send({ "response": "ok" });
});

app.put('/put', function(req, res) {
  res.send({ "response": "ok" });
});

app.patch('/patch', function(req, res) {
  res.send({ "response": "ok" });
});

app.delete('/del', (req: Request, res: Response) => {
  res.send({ "response": "ok" });
});

app.delete('/del/404', (req: Request, res: Response) => {
  res.status(404).send({ "error": "not found" });
});

app.get('/csrf-set', (req: Request, res: Response) => {
  res.cookie('csrftoken', 'test-token');
  res.send({ "csrf": "test-token" });
});

app.get('/headers', (req: Request, res: Response) => {
  res.send({ headers: req.headers });
});

app.listen(PORT, () => console.log(`Test server running on ${PORT} ⚡`));

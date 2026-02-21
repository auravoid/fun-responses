import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface FunData {
  [key: string]: string[];
}

const app = express();
const PORT = process.env.PORT || 3000;

const { API_BASE_URL, CDN_BASE_URL } = process.env

const FUN_TYPES = ["joke", "pickup", "roast", "toast", "topic", "quote"];

const ENDPOINTS_HELP = {
  fun: {
    url: `${API_BASE_URL}/fun/:type`,
    path: "/fun/:type",
    types: FUN_TYPES,
  },
  "zero-two": {
    url: `${API_BASE_URL}/zero-two`,
    path: "/zero-two",
  },
  "ai-ohto": {
    url: `${API_BASE_URL}/ai-ohto`,
    path: "/ai-ohto",
  },
};

app.use(cors());
app.use(express.json());

const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: "ok",
    error: null,
    ...ENDPOINTS_HELP,
  });
});


app.get('/fun', (req: Request, res: Response) => {
  res.status(400).json({
    status: "not ok",
    error: "no type specified",
    types: FUN_TYPES,
  });
});


app.get('/fun/:type', async (req: Request, res: Response) => {
  const { type } = req.params;

  if (!FUN_TYPES.includes(type as string)) {
    return res.status(400).json({
      status: "not ok",
      error: `invalid type. Must be one of: ${FUN_TYPES.join(", ")}`,
    });
  }

  try {
    const response = await axios.get(`${CDN_BASE_URL}/data/fun.json`, {
      headers: { "x-requested-with": API_BASE_URL },
    });
    
    const data = response.data as FunData;
    res.json({
      status: "ok",
      error: null,
      type: type,
      data: getRandomItem(data[type as string]),
    });
  } catch (err: any) {
    res.status(500).json({ status: "not ok", error: "Remote data source error" });
  }
});


app.get('/:character', async (req: Request, res: Response, next: NextFunction) => {
  const { character } = req.params;
  
  if (character !== 'zero-two' && character !== 'ai-ohto') {
    return next();
  }

  let folder = character;
  if (folder === "ai-ohto") folder = "ai-ohto/gifs";

  try {
    const response = await axios.get(`${CDN_BASE_URL}/images/${folder}/index.json`, {
      headers: { "x-requested-with": API_BASE_URL },
    });

    const images = response.data as string[];
    res.json({
      status: "ok",
      error: null,
      data: getRandomItem(images),
    });
  } catch (err: any) {
    res.status(500).json({ status: "not ok", error: `Failed to fetch ${character} images` });
  }
});


app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "not ok",
    error: "invalid path",
    ...ENDPOINTS_HELP,
  });
});


app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface FunData {
  [key: string]: string[];
}

class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

const { API_BASE_URL, CDN_BASE_URL } = process.env

const requiredEnvVars = {
  API_BASE_URL,
  CDN_BASE_URL,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

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

const getConfig = () => {
  if (!API_BASE_URL || !CDN_BASE_URL) {
    throw new HttpError(500, 'server configuration error');
  }

  return { API_BASE_URL, CDN_BASE_URL };
};

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

  if (!type) {
    throw new HttpError(400, 'type is required');
  }

  if (!FUN_TYPES.includes(type as string)) {
    throw new HttpError(400, `invalid type. Must be one of: ${FUN_TYPES.join(', ')}`);
  }

  try {
    const { API_BASE_URL, CDN_BASE_URL } = getConfig();
    const response = await axios.get(`${CDN_BASE_URL}/data/fun.json`, {
      headers: { 'x-requested-with': API_BASE_URL },
    });
    
    const data = response.data as FunData;

    if (!data || typeof data !== 'object') {
      throw new HttpError(502, 'invalid upstream response for fun data');
    }

    const typedData = data[type as string];

    if (!Array.isArray(typedData) || typedData.length === 0) {
      throw new HttpError(404, `${type} data not found`);
    }

    res.json({
      status: "ok",
      error: null,
      type: type,
      data: getRandomItem(typedData),
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new HttpError(502, 'remote data source error');
    }

    throw err;
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
    const { API_BASE_URL, CDN_BASE_URL } = getConfig();
    const response = await axios.get(`${CDN_BASE_URL}/images/${folder}/index.json`, {
      headers: { 'x-requested-with': API_BASE_URL },
    });

    const images = response.data as string[];

    if (!Array.isArray(images) || images.length === 0) {
      throw new HttpError(404, `${character} images not found`);
    }

    res.json({
      status: "ok",
      error: null,
      data: getRandomItem(images),
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new HttpError(502, `failed to fetch ${character} images`);
    }

    throw err;
  }
});


app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "not ok",
    error: "invalid path",
    ...ENDPOINTS_HELP,
  });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: 'not ok',
      error: err.message,
    });
  }

  return res.status(500).json({
    status: 'not ok',
    error: 'internal server error',
  });
});


app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
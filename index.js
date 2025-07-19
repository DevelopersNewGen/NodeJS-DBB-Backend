import {config} from "dotenv";
import { createApp } from "./configs/server.js";

config();

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const { initServer } = await import('./configs/server.js');
  initServer();
}

// Para Vercel - exportar la app
export default createApp();
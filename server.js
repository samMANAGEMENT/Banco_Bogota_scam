import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import { Telegraf } from 'telegraf';
import cors from 'cors';

const app = express();
const bot = new Telegraf('7833600678:AAHJZ3sse-M5oslnX8GktBMUCjnkkhrU3-k'); // Reemplaza con tu token
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bogota',
  password: 'root',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Obtener el estado actual
app.get('/estado', async (req, res) => {
  const result = await pool.query('SELECT estado FROM estados WHERE id = 1');
  res.json({ estado: result.rows[0].estado });
});

// Cambiar el estado
bot.action('cambiar_estado', async (ctx) => {
  const result = await pool.query('SELECT estado FROM estados WHERE id = 1');
  const nuevoEstado = result.rows[0].estado === 'inicial' ? 'cambiado' : 'inicial';

  await pool.query('UPDATE estados SET estado = $1 WHERE id = 1', [nuevoEstado]);
  ctx.reply(`Estado cambiado a: ${nuevoEstado}`);
});

// Comando para mostrar el estado
bot.command('estado', async (ctx) => {
  const result = await pool.query('SELECT estado FROM estados WHERE id = 1');
  ctx.reply(`El estado actual es: ${result.rows[0].estado}`);
});

// Iniciar el bot
bot.launch();

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

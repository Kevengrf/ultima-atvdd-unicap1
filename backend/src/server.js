import express from 'express';
import { ENV } from './config/env.js';
import job from './config/cron.js';
import allRoutes from './routes/index.js';
import { logError } from './utils/logger.js';

const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === 'production') {
  job.start();
}

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true });
});

// Rotas da API
app.use('/api', allRoutes);

// Tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada.' });
});

// Tratamento de erros
app.use(async (err, req, res, next) => {
    console.error(err.stack);
    await logError(err);
    res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
});

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
});


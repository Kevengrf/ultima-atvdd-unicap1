import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../../error.log');

const logError = async (error) => {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.stack : JSON.stringify(error);
  const logMessage = `${timestamp} - ERROR: ${errorMessage}\n\n`;

  try {
    await fs.appendFile(logFilePath, logMessage);
  } catch (err) {
    // Log to console if file logging fails
    console.error('Failed to write to log file:', err);
  }
};

export { logError };

/**
 * Express Backend Server for Dekiru Learning System
 * 
 * Provides REST API for persisting learning data across devices/sessions.
 * Uses JSON file storage for simplicity (no database required).
 */
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_DIR = path.join(DATA_DIR, 'users');

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_DIR)) fs.mkdirSync(USERS_DIR, { recursive: true });

app.use(express.json({ limit: '10mb' }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-User-Id');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/**
 * Get user ID from header or use default.
 */
function getUserId(req: express.Request): string {
  return (req.headers['x-user-id'] as string) || 'default';
}

/**
 * Get user data file path.
 */
function getUserDataPath(userId: string): string {
  // Sanitize userId to prevent path traversal
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(USERS_DIR, `${safeId}.json`);
}

/**
 * GET /api/progress — Load all learning data for user.
 */
app.get('/api/progress', (req, res) => {
  try {
    const userId = getUserId(req);
    const filePath = getUserDataPath(userId);
    
    if (!fs.existsSync(filePath)) {
      return res.json({ exists: false, data: null });
    }
    
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    res.json({ exists: true, data });
  } catch (error) {
    console.error('Error loading progress:', error);
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

/**
 * PUT /api/progress — Save all learning data for user.
 */
app.put('/api/progress', (req, res) => {
  try {
    const userId = getUserId(req);
    const filePath = getUserDataPath(userId);
    const data = req.body;
    
    if (!data || !data.version) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    
    // Backup existing data before overwriting
    if (fs.existsSync(filePath)) {
      const backupPath = filePath.replace('.json', `.backup-${Date.now()}.json`);
      fs.copyFileSync(filePath, backupPath);
      
      // Keep only last 5 backups
      cleanOldBackups(USERS_DIR, userId);
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

/**
 * POST /api/progress/review — Record a single review event.
 * Useful for incremental syncing.
 */
app.post('/api/progress/review', (req, res) => {
  try {
    const userId = getUserId(req);
    const filePath = getUserDataPath(userId);
    const { itemId, updatedProgress, reviewLog, dailyStats } = req.body;
    
    let data: any;
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else {
      data = { version: 1, progress: {}, reviewLogs: [], dailyStats: {}, settings: {} };
    }
    
    // Update progress for the reviewed item
    if (itemId && updatedProgress) {
      data.progress[itemId] = updatedProgress;
    }
    
    // Append review log
    if (reviewLog) {
      data.reviewLogs.push(reviewLog);
    }
    
    // Update daily stats
    if (dailyStats) {
      Object.assign(data.dailyStats, dailyStats);
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    console.error('Error recording review:', error);
    res.status(500).json({ error: 'Failed to record review' });
  }
});

/**
 * GET /api/progress/export — Export data as downloadable JSON.
 */
app.get('/api/progress/export', (req, res) => {
  try {
    const userId = getUserId(req);
    const filePath = getUserDataPath(userId);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'No data found' });
    }
    
    res.setHeader('Content-Disposition', `attachment; filename=dekiru-backup-${Date.now()}.json`);
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

/**
 * Clean old backup files, keeping only the last 5.
 */
function cleanOldBackups(dir: string, userId: string): void {
  try {
    const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const backups = fs.readdirSync(dir)
      .filter(f => f.startsWith(`${safeId}.backup-`) && f.endsWith('.json'))
      .sort()
      .reverse();
    
    // Remove all but last 5
    for (const backup of backups.slice(5)) {
      fs.unlinkSync(path.join(dir, backup));
    }
  } catch {
    // Ignore cleanup errors
  }
}

app.listen(PORT, () => {
  console.log(`🌸 Dekiru API server running on port ${PORT}`);
});

export default app;

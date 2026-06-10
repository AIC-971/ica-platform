// /api/login.js - Vercel Serverless Function
// Authentification ICA Platform

const SUPABASE_URL = 'https://xdrlgyqxdbdvzrneujgz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcmxneXF4ZGJkdnpybmV1amd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjM1MDE1NywiZXhwIjoyMDkxOTI2MTU3fQ.1gvVPGSBotPXP_U4_-lLGQ0SfG2HdzLNWY9mRUiSd-A';
const JWT_SECRET = 'ICA_PLATFORM_SECRET_2026_immo_conseil_antilles';

function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createToken(payload) {
  const crypto = require('crypto');
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 86400 * 7 }));
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return header + '.' + body + '.' + sig;
}

function verifyToken(token) {
  try {
    const crypto = require('crypto');
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64').toString());
    if (payload.exp < Math.floor(Date.now()/1000)) return null;
    return payload;
  } catch(e) { return null; }
}

function hashPassword(password) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update('ICA_SALT_2026_' + password).digest('hex');
}

const supaHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json'
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // POST /api/login - Connexion
  if (req.method === 'POST' && !req.query.action) {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
    const hash = hashPassword(password);
    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/users_plateforme?email=eq.' + encodeURIComponent(email) + '&actif=eq.true&select=*', {
        headers: supaHeaders
      });
      const users = await r.json();
      if (!Array.isArray(users) || !users.length || users[0].password_hash !== hash) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      const user = users[0];
      const token = createToken({ id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role, commercial_id: user.commercial_id || null });
      return res.status(200).json({ token, user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role } });
    } catch(e) {
      return res.status(500).json({ error: 'Erreur serveur: ' + e.message });
    }
  }

  // GET /api/login?action=verify - Verification token
  if (req.method === 'GET' && req.query.action === 'verify') {
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '');
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ valid: false });
    return res.status(200).json({ valid: true, user: payload });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

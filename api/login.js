// /api/login.js — Vercel Serverless Function
// Authentification ICA Platform

const SUPABASE_URL = 'https://xdrlgyqxdbdvzrneujgz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcyI6InN1cGFiYXNlIn0.ezJiQTlgUzIgQTAiOiJIUzI1NiIsInR5cCI6IlNVXVBlYXNlIiwiaWF0IjoxNzc2MzUwMTU3LCJleHAiOjIwOTE5MjYxNTcwLCJyb290Ijoic3VpYWN1In0.1gvVPGSBotPXP_U4_-lGQ0SfG2HdzLNY9MRUiSd-A';
const JWT_SECRET = 'ICA_PLATFORM_SECRET_2026_immo_conseil_antilles';

// Simple JWT sans librairie externe
function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createToken(payload) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 86400 * 7 }));
  const crypto = require('crypto');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${header}.${body}.${sig}`;
}

function verifyToken(token) {
  try {
    const [header, body, sig] = token.split('.');
    const crypto = require('crypto');
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64').toString());
    if (payload.exp < Math.floor(Date.now()/1000)) return null;
    return payload;
  } catch(e) { return null; }
}

// Hash password simple (SHA256 + sel)
function hashPassword(password) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update('ICA_SALT_2026_' + password).digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // POST /api/login — Connexion
  if (req.method === 'POST' && !req.query.action) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

    const hash = hashPassword(password);

    const r = await fetch(`${SUPABASE_URL}/rest/v1/users_plateforme?email=eq.${encodeURIComponent(email)}&actif=eq.true&select=**, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const users = await r.json();

    if (!users.length || users[0].password_hash !== hash) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];
    const token = createToken({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role, // 'direction' | 'commercial' | 'comptable'
      commercial_id: user.commercial_id || null
    });

    // Mettre à jour last_login
    await fetch(`${SUPABASE_URL}/rest/v1/users_plateforme?id=eq.${user.id}`, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ last_login: new Date().toISOString() })
    });

    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role }
    });
  }

  // GET /api/login?action=verify — Vérifier un token
  if (req.method === 'GET' && req.query.action === 'verify') {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token manquant' });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return res.status(401).json({ error: 'Token invalide ou expiré' });
    return res.status(200).json({ valid: true, user: payload });
  }

  // POST /api/login?action=init — Créer un utilisateur (direction uniquement)
  if (req.method === 'POST' && req.query.action === 'init') {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Non autorisé' });
    const caller = verifyToken(auth.slice(7));
    if (!caller || caller.role !== 'direction') return res.status(403).json({ error: 'Réservé � la direction' });

    const { email, password, nom, prenom, role, commercial_id } = req.body;
    if (!email || !password || !nom || !role) return res.status(400).json({ error: 'Champs manquants' });

    const hash = hashPassword(password);
    const r = await fetch(`${SUPABASE_URL}/rest/v1/users_plateforme`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
      body: JSON.stringify({ email, password_hash: hash, nom, prenom: prenom||'', role, commercial_id: commercial_id||null, actif: true })
    });
    const data = await r.json();
    if (!r.ok) return res.status(400).json({ error: JSON.stringify(data) });
    return res.status(201).json({ success: true, user: data[0] });
  }

  // POST /api/login?action=change_password
  if (req.method === 'POST' && req.query.action === 'change_password') {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Non autorisé' });
    const caller = verifyToken(auth.slice(7));
    if (!caller) return res.status(401).json({ error: 'Token invalide' });

    const { user_id, new_password } = req.body;
    if (caller.role !== 'direction' && caller.id !== user_id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const hash = hashPassword(new_password);
    await fetch(`${SUPABASE_URL}/rest/v1/users_plateforme?id=eq.${user_id}`, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password_hash: hash })
    });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

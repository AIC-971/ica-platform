export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    const SUPA_URL = 'https://xdrlgyqxdbdvzrneujgz.supabase.co';
    const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcmxneXF4ZGJkdnpybmV1amd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjM1MDE1NywiZXhwIjoyMDkxOTI2MTU3fQ.1gvVPGSBotPXP_U4_-lLGQ0SfG2HdzLNWY9mRUiSd-A';
    const logs = [];
    const log = (msg) => { logs.push(msg); console.log(msg); };
    try {
          log('Login Estale...');
          const loginResp = await fetch('https://api.estale.app/api/login', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: 'agence@immoconseil-gpe.com', password: 'Jeremyaic971!' })
          });
          const cookies = loginResp.headers.get('set-cookie') || '';
          const loginData = await loginResp.json();
                  if (!loginData.id) throw new Error('Login echoue');
          log('OK Connecte: ' + loginData.firstname);
          const coprosResp = await fetch(SUPA_URL + '/rest/v1/coproprietes?select=id,estale_id,nom&o

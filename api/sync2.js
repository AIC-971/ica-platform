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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'agence@immoconseil-gpe.com', password: 'Jeremyaic971!' })
    });
    const cookies = loginResp.headers.get('set-cookie') || '';
    const loginData = await loginResp.json();
    if (!loginData.id) throw new Error('Login Estale echoue: ' + JSON.stringify(loginData));
    log('OK Connecte Estale: ' + loginData.firstname + ' ' + loginData.lastname);

    log('Recuperation coproprietes Supabase...');
    const coprosResp = await fetch(SUPA_URL + '/rest/v1/coproprietes?select=id,estale_id,nom&order=nom', {
      headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
    });
    const copros = await coprosResp.json();
    log('OK ' + copros.length + ' coproprietes dans Supabase');

    let totalOwners = 0;
    let totalUpserted = 0;

    for (const copro of copros) {
      if (!copro.estale_id) { log('SKIP ' + copro.nom + ': pas estale_id'); continue; }
      try {
        const gqlResp = await fetch('https://api.estale.app/graphql/intranet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Cookie': cookies },
          body: JSON.stringify({
            query: 'query { condo(id: "' + copro.estale_id + '") { name owners { id firstname lastname email phone mobile balance } } }'
          })
        });
        const gqlData = await gqlResp.json();
        const owners = gqlData && gqlData.data && gqlData.data.condo && gqlData.data.condo.owners ? gqlData.data.condo.owners : [];
        if (!owners.length) continue;
        totalOwners += owners.length;
        const rows = owners.map(function(o) { return {
          estale_id: o.id,
          copropriete_id: copro.id,
          copropriete_estale_id: copro.estale_id,
          firstname: o.firstname || '',
          lastname: o.lastname || '',
          fullname: ((o.firstname || '') + ' ' + (o.lastname || '')).trim(),
          email: o.email || null,
          phone: o.phone || null,
          mobile: o.mobile || null,
          balance: o.balance || 0,
          synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }; });
        const upsertResp = await fetch(SUPA_URL + '/rest/v1/proprietaires', {
          method: 'POST',
          headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(rows)
        });
        if (upsertResp.ok) {
          totalUpserted += rows.length;
          log('OK ' + copro.nom + ': ' + rows.length + ' proprietaires');
        } else {
          const err = await upsertResp.text();
          log('ERR ' + copro.nom + ': ' + err.substring(0, 100));
        }
        await new Promise(function(r) { setTimeout(r, 150); });
      } catch(e) { log('ERR ' + copro.nom + ': ' + e.message); }
    }

    return res.status(200).json({ success: true, total_coproprietes: copros.length, total_owners: totalOwners, total_upserted: totalUpserted, logs: logs });
  } catch(e) {
    return res.status(500).json({ success: false, error: e.message, logs: logs });
  }
    }

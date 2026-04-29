export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const S = 'https://xdrlgyqxdbdvzrneujgz.supabase.co';
  const K = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcmxneXF4ZGJkdnpybmV1amd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjM1MDE1NywiZXhwIjoyMDkxOTI2MTU3fQ.1gvVPGSBotPXP_U4_-lLGQ0SfG2HdzLNWY9mRUiSd-A';
  const logs = [];
  const log = m => { logs.push(m); console.log(m); };
  try {
    log('Login Estale...');
    const lr = await fetch('https://api.estale.app/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'agence@immoconseil-gpe.com', password: 'Jeremyaic971!' })
    });
    const ck = lr.headers.get('set-cookie') || '';
    const ld = await lr.json();
    if (!ld.id) throw new Error('Login failed');
    log('OK ' + ld.firstname);
    const cr = await fetch(S + '/rest/v1/coproprietes?select=id,estale_id,nom&order=nom', {
      headers: { 'apikey': K, 'Authorization': 'Bearer ' + K }
    });
    const copros = await cr.json();
    log('OK ' + copros.length + ' copros');
    let tot = 0, ups = 0;
    for (const c of copros) {
      if (!c.estale_id) continue;
      try {
        const gr = await fetch('https://api.estale.app/graphql/intranet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Cookie': ck },
          body: JSON.stringify({ query: 'query{condo(id:"' + c.estale_id + '"){name owners{id firstname lastname email phone mobile balance}}}' })
        });
        const gd = await gr.json();
        const ow = gd && gd.data && gd.data.condo ? (gd.data.condo.owners || []) : [];
        if (!ow.length) continue;
        tot += ow.length;
        const rows = ow.map(o => ({
          estale_id: o.id, copropriete_id: c.id, copropriete_estale_id: c.estale_id,
          firstname: o.firstname || '', lastname: o.lastname || '',
          fullname: ((o.firstname || '') + ' ' + (o.lastname || '')).trim(),
          email: o.email || null, phone: o.phone || null, mobile: o.mobile || null,
          balance: o.balance || 0, synced_at: new Date().toISOString(), updated_at: new Date().toISOString()
        }));
        const ur = await fetch(S + '/rest/v1/proprietaires', {
          method: 'POST',
          headers: { 'apikey': K, 'Authorization': 'Bearer ' + K, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(rows)
        });
        if (ur.ok) { ups += rows.length; log('OK ' + c.nom + ': ' + rows.length); }
        else { const e = await ur.text(); log('ERR ' + c.nom + ': ' + e.substring(0, 60)); }
        await new Promise(r => setTimeout(r, 150));
      } catch (e) { log('ERR ' + c.nom + ': ' + e.message); }
    }
    return res.status(200).json({ success: true, total_coproprietes: copros.length, total_owners: tot, total_upserted: ups, logs });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message, logs });
  }
}

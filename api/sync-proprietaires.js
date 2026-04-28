export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPA_URL = 'https://xdrlgyqxdbdvzrneujgz.supabase.co';
  const SUPA_KEY = process.env.SUPABASE_KEY;
  const ESTALE_EMAIL = 'agence@immoconseil-gpe.com';
  const ESTALE_PASS = 'Jeremyaic971!';

  const logs = [];
  const log = (msg) => { logs.push(msg); console.log(msg); };

  try {
    // 1. Login Estale
    log('Login Estale...');
    const loginResp = await fetch('https://api.estale.app/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ESTALE_EMAIL, password: ESTALE_PASS })
    });
    const cookies = loginResp.headers.get('set-cookie') || '';
    const loginData = await loginResp.json();
    if (!loginData.id) throw new Error('Login Estale échoué');
    log(`✅ Connecté Estale: ${loginData.firstname} ${loginData.lastname}`);

    // 2. Récupérer toutes les copropriétés Supabase
    log('Récupération copropriétés Supabase...');
    const coprosResp = await fetch(`${SUPA_URL}/rest/v1/coproprietes?select=id,estale_id,nom&order=nom`, {
      headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` }
    });
    const copros = await coprosResp.json();
    log(`✅ ${copros.length} copropriétés trouvées`);

    // 3. Pour chaque copropriété, récupérer les owners
    let totalOwners = 0;
    let totalUpserted = 0;

    for (const copro of copros) {
      try {
        const gqlResp = await fetch('https://api.estale.app/graphql/intranet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies
          },
          body: JSON.stringify({
            query: `query { condo(id: "${copro.estale_id}") { name owners { id firstname lastname email phone mobile balance } } }`
          })
        });
        const gqlData = await gqlResp.json();
        const owners = gqlData?.data?.condo?.owners || [];
        
        if (owners.length === 0) continue;
        totalOwners += owners.length;

        // Préparer les données
        const rows = owners.map(o => ({
          estale_id: o.id,
          copropriete_id: copro.id,
          copropriete_estale_id: copro.estale_id,
          firstname: o.firstname || '',
          lastname: o.lastname || '',
          fullname: ((o.firstname||'') + ' ' + (o.lastname||'')).trim(),
          email: o.email || null,
          phone: o.phone || null,
          mobile: o.mobile || null,
          balance: o.balance || 0,
          synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        // Upsert dans Supabase par batch
        const upsertResp = await fetch(`${SUPA_URL}/rest/v1/proprietaires`, {
          method: 'POST',
          headers: {
            'apikey': SUPA_KEY,
            'Authorization': `Bearer ${SUPA_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify(rows)
        });

        if (upsertResp.ok) {
          totalUpserted += rows.length;
          log(`✅ ${copro.nom}: ${owners.length} propriétaires synchronisés`);
        } else {
          const err = await upsertResp.text();
          log(`⚠️ ${copro.nom}: erreur upsert - ${err.substring(0,100)}`);
        }

        // Pause pour éviter le rate limiting
        await new Promise(r => setTimeout(r, 200));

      } catch(e) {
        log(`⚠️ ${copro.nom}: ${e.message}`);
      }
    }

    const result = {
      success: true,
      total_coproprietes: copros.length,
      total_owners_trouves: totalOwners,
      total_upserted: totalUpserted,
      logs
    };

    return res.status(200).json(result);

  } catch(e) {
    return res.status(500).json({ success: false, error: e.message, logs });
  }
}

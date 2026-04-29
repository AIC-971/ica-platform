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
    // 1. Login Estale
    log('Login Estale...');
    const loginResp = await fetch('https://api.estale.app/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'agence@immoconseil-gpe.com', password: 'Jeremyaic971!' })
    });
    const cookies = loginResp.headers.get('set-cookie') || '';
    const loginData = await loginResp.json();
    if (!loginData.id) throw new Error('Login Estale échoué');
    log(`✅ Connecté: ${loginData.firstname} ${loginData.lastname}`);

    // 2. Récupérer TOUTES les copropriétés depuis Estale en une seule query GraphQL
    // Avec tous leurs propriétaires et balances — sans UUID codé en dur
    log('Récupération de toutes les copropriétés + propriétaires depuis Estale...');
    const gqlResp = await fetch('https://api.estale.app/graphql/intranet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookies },
      body: JSON.stringify({
        query: `query {
          condos {
            id
            name
            reference
            owners {
              id
              firstname
              lastname
              email
              phone
              mobile
              balance
            }
          }
        }`
      })
    });
    const gqlData = await gqlResp.json();
    const condos = gqlData?.data?.condos || [];
    log(`✅ ${condos.length} copropriétés récupérées depuis Estale`);

    if (condos.length === 0) {
      log('⚠️ Aucune copropriété - vérifier les erreurs GraphQL: ' + JSON.stringify(gqlData?.errors));
      return res.status(200).json({ success: false, logs, errors: gqlData?.errors });
    }

    // 3. Synchroniser les copropriétés dans Supabase (upsert par estale_id)
    let totalOwners = 0;
    let totalUpserted = 0;

    for (const condo of condos) {
      if (!condo.owners || condo.owners.length === 0) continue;

      // Trouver ou créer la copropriété dans Supabase
      const coprosResp = await fetch(
        `${SUPA_URL}/rest/v1/coproprietes?estale_id=eq.${condo.id}&select=id,nom`,
        { headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` } }
      );
      const copros = await coprosResp.json();
      const copro = copros[0];

      if (!copro) {
        log(`⚠️ Copropriété Estale "${condo.name}" (${condo.id}) non trouvée dans Supabase - elle sera ignorée`);
        continue;
      }

      totalOwners += condo.owners.length;

      // Préparer les propriétaires avec le bon copropriete_id et copropriete_estale_id
      const rows = condo.owners.map(o => ({
        estale_id: o.id,
        copropriete_id: copro.id,
        copropriete_estale_id: condo.id,
        firstname: o.firstname || '',
        lastname: o.lastname || '',
        fullname: ((o.firstname || '') + ' ' + (o.lastname || '')).trim(),
        email: o.email || null,
        phone: o.phone || null,
        mobile: o.mobile || null,
        balance: o.balance || 0,
        synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Upsert dans Supabase
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
        log(`✅ ${copro.nom}: ${rows.length} propriétaires`);
      } else {
        const err = await upsertResp.text();
        log(`⚠️ ${copro.nom}: erreur - ${err.substring(0, 150)}`);
      }

      await new Promise(r => setTimeout(r, 100));
    }

    return res.status(200).json({
      success: true,
      condos_estale: condos.length,
      total_owners: totalOwners,
      total_upserted: totalUpserted,
      logs
    });

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message, logs });
  }
}

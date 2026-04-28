export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
      const SUPABASE_URL = 'https://xdrlgyqxdbdvzrneujgz.supabase.co';
        const SUPABASE_KEY = process.env.SUPABASE_KEY;
          const log = [];
            let totalOwners = 0;
              try {
                  const loginResp = await fetch('https://api.estale.app/api/login', {
                        method: 'POST', headers: {'Content-Type':'application/json'},
                              body: JSON.stringify({email:'agence@immoconseil-gpe.com',password:'Jeremyaic971!'})
                                  });
                                      const cookies = loginResp.headers.get('set-cookie') || '';
                                          log.push('Login: ' + loginResp.status);
                                              const coprosResp = await fetch(SUPABASE_URL+'/rest/v1/coproprietes?select=id,estale_id,nom&order=nom', {
                                                    headers: {'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}
                                                        });
                                                            const copros = await coprosResp.json();
                                                                log.push(copros.length+' coproprietes');
                                                                    for (const copro of copros) {
                                                                          if (!copro.estale_id) continue;
                                                                                try {
                                                                                        const q = 'query{condo(id:"'+copro.estale_id+'"){owners{id firstname lastname email phone mobile balance}}}';
                                                                                                const er = await fetch('https://api.estale.app/graphql/intranet', {
                                                                                                          method:'POST', headers:{'Content-Type':'application/json','Cookie':cookies},
                                                                                                                    body: JSON.stringify({query:q})
                                                                                                                            });
                                                                                                                                    const ed = await er.json();
                                                                                                                                            const owners = ed?.data?.condo?.owners || [];
                                                                                                                                                    if (!owners.length) continue;
                                                                                                                                                            const rows = owners.map(o=>({
                                                                                                                                                                      estale_id:o.id, copropriete_id:copro.id, copropriete_estale_id:copro.estale_id,
                                                                                                                                                                                firstname:o.firstname||'', lastname:o.lastname||'',
                                                                                                                                                                                          fullname:((o.firstname||'')+' '+(o.lastname||'')).trim(),
                                                                                                                                                                                                    email:o.email||null, phone:o.phone||null, mobile:o.mobile||null,
                                                                                                                                                                                                              balance:o.balance||0, synced_at:new Date().toISOString(), updated_at:new Date().toISOString()
                                                                                                                                                                                                                      }));
                                                                                                                                                                                                                              await fetch(SUPABASE_URL+'/rest/v1/proprietaires', {
                                                                                                                                                                                                                                        method:'POST',
                                                                                                                                                                                                                                                  headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,
                                                                                                                                                                                                                                                              'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'},
                                                                                                                                                                                                                                                                        body: JSON.stringify(rows)
                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                        totalOwners += rows.length;
                                                                                                                                                                                                                                                                                                log.push(copro.nom+': '+rows.length);
                                                                                                                                                                                                                                                                                                        await new Promise(r=>setTimeout(r,300));
                                                                                                                                                                                                                                                                                                              } catch(e){log.push('ERR '+copro.nom+': '+e.message);}
                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                      return res.status(200).json({success:true, totalOwners, log});
                                                                                                                                                                                                                                                                                                                        } catch(e) {
                                                                                                                                                                                                                                                                                                                            return res.status(500).json({success:false, error:e.message, log});
                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                              }

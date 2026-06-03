import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xdrlgyqxdbdvzrneujgz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { dossier_id, secret } = req.body || {};
  if (secret !== process.env.INTERNAL_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  if (!dossier_id) return res.status(400).json({ error: 'dossier_id requis' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const { data: rows } = await supabase
      .from('dossiers_interventions')
      .select('*,coproprietes(nom,adresse,commune),prestataires(nom,telephone,email,metier)')
      .eq('id', dossier_id);

    if (!rows || !rows.length) return res.status(404).json({ error: 'Dossier non trouve' });
    const d = rows[0];

    const html = buildHTML(d);

    let pdfBuffer;
    const PDF_KEY = process.env.HTML2PDF_API_KEY;
    if (PDF_KEY) {
      const resp = await fetch('https://api.html2pdf.app/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, apiKey: PDF_KEY, marginTop: '10mm', marginBottom: '10mm', marginLeft: '15mm', marginRight: '15mm' })
      });
      pdfBuffer = Buffer.from(await resp.arrayBuffer());
    } else {
      pdfBuffer = Buffer.from(html, 'utf-8');
    }

    const fileName = 'rapports/' + (d.numero_dossier || dossier_id) + '-' + Date.now() + (PDF_KEY ? '.pdf' : '.html');
    await supabase.storage.from('interventions').upload(fileName, pdfBuffer, {
      contentType: PDF_KEY ? 'application/pdf' : 'text/html',
      upsert: true
    });

    const { data: urlData } = supabase.storage.from('interventions').getPublicUrl(fileName);
    const pdfUrl = urlData.publicUrl;

    await supabase.from('dossiers_interventions')
      .update({ rapport_pdf_url: pdfUrl, statut: 'rapport_genere', updated_at: new Date().toISOString() })
      .eq('id', dossier_id);

    return res.status(200).json({ success: true, pdf_url: pdfUrl, numero_dossier: d.numero_dossier });
  } catch (err) {
    console.error('generate-rapport-pdf:', err);
    return res.status(500).json({ error: err.message });
  }
}

function buildHTML(d) {
  const copro = d.coproprietes || {};
  const presta = d.prestataires || {};
  const fmt = (dt) => dt ? new Date(dt).toLocaleDateString('fr-FR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) : 'N/A';
  let duree = 'N/A';
  if (d.date_arrivee_site && d.date_cloture) {
    const ms = new Date(d.date_cloture) - new Date(d.date_arrivee_site);
    const h = Math.floor(ms/3600000), m = Math.round((ms%3600000)/60000);
    duree = h > 0 ? h + 'h' + String(m).padStart(2,'0') : m + ' min';
  }
  const photos = (d.photos_urls||[]).map((u,i) =>
    '<div style="text-align:center"><img src="' + u + '" style="width:100%;max-height:130px;object-fit:cover;border-radius:6px;border:1px solid #ddd"><p style="font-size:10px;color:#888;margin-top:3px">Photo ' + (i+1) + '</p></div>'
  ).join('');

  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>' +
    '*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:12px;color:#1a1a2e}' +
    '.hdr{background:#1a1a2e;color:white;padding:20px 28px;display:flex;justify-content:space-between}' +
    '.logo{font-size:17px;font-weight:700}.acc{color:#e8a838}' +
Module 2B: serverless function generation rapport PDF intervention    '.st{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:10px}' +
    '.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.b{background:#f8f9fa;border-radius:6px;padding:10px 13px}' +
    '.bl{font-size:10px;color:#888;text-transform:uppercase}' +
    '.bv{font-size:13px;font-weight:600}' +
    '.cm{background:#f8f9fa;border-left:3px solid #e8a838;padding:12px;font-style:italic;color:#444;line-height:1.6}' +
    '.ph{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}' +
    '.ftr{padding:14px 28px;background:#f8f9fa;display:flex;justify-content:space-between;font-size:10px;color:#888}' +
    '.div{height:3px;background:linear-gradient(to right,#1a1a2e,#e8a838,#1a1a2e)}' +
    '</style></head><body>' +
    '<div class="hdr"><div><div class="logo">Immo Conseil <span class="acc">Antilles</span></div>' +
    '<div style="font-size:10px;opacity:.7;margin-top:3px">Syndic de copropriete</div></div>' +
    '<div style="text-align:right"><div style="font-size:15px;font-weight:700;color:#e8a838">' + (d.numero_dossier||'N/A') + '</div>' +
    '<div style="font-size:11px;opacity:.8">Rapport intervention</div>' +
    '<div style="font-size:10px;opacity:.6;margin-top:4px">Genere le ' + fmt(new Date()) + '</div></div></div>' +
    '<div class="div"></div>' +
    '<div class="sec"><div class="st">Informations generales</div><div class="g3">' +
    '<div class="b"><div class="bl">Copropriete</div><div class="bv">' + (copro.nom||'N/A') + '</div><div style="font-size:10px;color:#666">' + (copro.commune||'') + '</div></div>' +
    '<div class="b"><div class="bl">Type</div><div class="bv">' + (d.type_intervention||'N/A') + '</div></div>' +
    '<div class="b"><div class="bl">Cloture</div><div class="bv" style="font-size:11px">' + fmt(d.date_cloture) + '</div></div></div></div>' +
    '<div class="sec"><div class="st">Prestataire</div><div class="g3">' +
    '<div class="b"><div class="bl">Nom</div><div class="bv">' + (presta.nom||'N/A') + '</div><div style="font-size:10px;color:#666">' + (presta.metier||'') + '</div></div>' +
    '<div class="b"><div class="bl">Telephone</div><div class="bv acc">' + (presta.telephone||'N/A') + '</div></div>' +
    '<div class="b"><div class="bl">Duree</div><div class="bv acc">' + duree + '</div></div></div></div>' +
    '<div class="sec"><div class="st">Description</div><div class="cm">' + (d.description||'Aucune description.') + '</div></div>' +
    '<div class="sec"><div class="st">Compte-rendu prestataire</div><div class="cm">' + (d.commentaire_cloture||'Aucun commentaire.') + '</div></div>' +
    ((d.photos_urls||[]).length ? '<div class="sec"><div class="st">Photos (' + d.photos_urls.length + ')</div><div class="ph">' + photos + '</div></div>' : '') +
    '<div class="ftr"><span>Immo Conseil Antilles - syndic@immoconseil-gpe.com</span><span>' + (d.numero_dossier||'') + ' - ' + new Date().getFullYear() + '</span></div>' +
    '</body></html>';
    }

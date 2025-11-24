import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    // Récupération des variables d'environnement
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    
    // Déterminer l'URL de base : utiliser le domaine de production en production, sinon VERCEL_URL pour les previews
    let baseUrl = 'https://sauvage-watches.fr'
    if (process.env.VERCEL_ENV === 'production') {
      baseUrl = 'https://sauvage-watches.fr'
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    } else if (process.env.BASE_URL) {
      baseUrl = process.env.BASE_URL
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variables d\'environnement Supabase manquantes')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Récupérer toutes les montres disponibles
    const { data: watches, error: watchesError } = await supabase
      .from('watches')
      .select('id, updated_at')
      .eq('is_available', true)
      .eq('is_sold', false)

    if (watchesError) {
      console.error('Erreur lors de la récupération des montres:', watchesError)
    }

    // Récupérer tous les articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, updated_at')
      .order('created_at', { ascending: false })

    if (articlesError) {
      console.error('Erreur lors de la récupération des articles:', articlesError)
    }

    // Routes statiques
    const staticRoutes = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/collection', priority: '0.9', changefreq: 'weekly' },
      { path: '/blog', priority: '0.8', changefreq: 'weekly' },
      { path: '/recherche', priority: '0.7', changefreq: 'monthly' },
      { path: '/estimation', priority: '0.7', changefreq: 'monthly' },
    ]

    // Générer le XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Ajouter les routes statiques
    staticRoutes.forEach((route) => {
      xml += `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
    })

    // Ajouter les montres
    if (watches && watches.length > 0) {
      watches.forEach((watch) => {
        const lastmod = watch.updated_at
          ? new Date(watch.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
        xml += `  <url>
    <loc>${baseUrl}/watch/${watch.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
      })
    }

    // Ajouter les articles de blog
    if (articles && articles.length > 0) {
      articles.forEach((article) => {
        const lastmod = article.updated_at
          ? new Date(article.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
        xml += `  <url>
    <loc>${baseUrl}/blog/${article.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`
      })
    }

    xml += `</urlset>`

    // Définir les en-têtes de réponse
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).send(xml)
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error)
    res.status(500).json({ 
      error: 'Erreur lors de la génération du sitemap',
      message: error.message 
    })
  }
}


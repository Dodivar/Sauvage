import { supabase } from './supabase'

/**
 * Récupère les articles paginés depuis Supabase
 * @param {number} page - Numéro de page (défaut: 1)
 * @param {number} limit - Nombre d'articles par page (défaut: 10)
 * @param {string} category - Catégorie pour filtrer (optionnel)
 * @returns {Promise<Object>} { articles, total, totalPages }
 */
export async function getAllArticles(page = 1, limit = 10, category = null) {
  try {
    const offset = (page - 1) * limit

    // Construire la requête de base
    let query = supabase.from('articles').select('*', { count: 'exact' })

    // Appliquer le filtre de catégorie si fourni (categories est un array)
    if (category) {
      query = query.contains('categories', [category])
    }

    // Trier par date de création décroissante et paginer
    const { data: articles, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Erreur lors de la récupération des articles: ${error.message}`)
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      articles: articles || [],
      total,
      totalPages,
    }
  } catch (error) {
    console.error('Erreur dans getAllArticles:', error)
    throw error
  }
}

/**
 * Récupère un article par son ID
 * @param {string|number} id - ID de l'article
 * @returns {Promise<Object>} Données de l'article
 */
export async function getArticleById(id) {
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Article non trouvé')
      }
      throw new Error(`Erreur lors de la récupération de l'article: ${error.message}`)
    }

    if (!article) {
      throw new Error('Article non trouvé')
    }

    return article
  } catch (error) {
    console.error('Erreur dans getArticleById:', error)
    throw error
  }
}

/**
 * Récupère toutes les catégories uniques depuis les articles
 * @returns {Promise<Array<string>>} Liste des catégories
 */
export async function getAllCategories() {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('categories')

    if (error) {
      throw new Error(`Erreur lors de la récupération des catégories: ${error.message}`)
    }

    // Extraire toutes les catégories depuis les arrays et créer un Set unique
    const allCategories = []
    articles.forEach((article) => {
      if (article.categories && Array.isArray(article.categories)) {
        allCategories.push(...article.categories)
      }
    })

    // Filtrer les valeurs null/undefined/vides et créer un Set unique
    const uniqueCategories = [...new Set(allCategories.filter(Boolean))]

    return uniqueCategories.sort()
  } catch (error) {
    console.error('Erreur dans getAllCategories:', error)
    throw error
  }
}


import { supabase } from './supabase'

/**
 * Transforme les données de la base de données en format attendu par les composants
 */
function transformWatchData(watchData, details, accessories, images) {
  return {
    id: watchData.id,
    adCode: watchData.ad_code,
    name: watchData.name,
    brand: watchData.brand,
    model: watchData.model,
    reference: watchData.reference,
    price: watchData.price,
    year: watchData.year,
    condition: watchData.condition,
    description: watchData.description || '',
    isAvailable: watchData.is_available !== undefined ? watchData.is_available : true,
    contenu: details?.content || '', // Pour compatibilité avec WatchCard
    images: images.map((img) => img.image_url).filter(Boolean),
    details: {
      content: details?.content || '',
      movement: details?.movement || '',
      caseMaterial: details?.case_material || '',
      braceletMaterial: details?.bracelet_material || '',
      caseSize: details?.case_size || '',
      thickness: details?.thickness || '',
      dialColor: details?.dial_color || '',
      crystal: details?.crystal || '',
      waterResistance: details?.water_resistance || '',
      functions: details?.functions || '',
      powerReserve: details?.power_reserve || '',
      frequency: details?.frequency || '',
      caseCondition: details?.case_condition || '',
      dialCondition: details?.dial_condition || '',
      braceletCondition: details?.bracelet_condition || '',
      guarantee: details?.guarantee || '',
      accessories: accessories.map((acc) => ({
        name: acc.name,
        included: acc.included,
      })),
    },
  }
}

/**
 * Récupère toutes les montres avec leurs détails
 * @returns {Promise<Array>} Liste des montres
 */
export async function getAllWatches() {
  try {
    // Récupérer uniquement les montres disponibles (en vente)
    const { data: watches, error: watchesError } = await supabase
      .from('watches')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })

    if (watchesError) {
      throw new Error(`Erreur lors de la récupération des montres: ${watchesError.message}`)
    }

    if (!watches || watches.length === 0) {
      return []
    }

    // Pour chaque montre, récupérer les détails, accessoires et images
    const watchesWithDetails = await Promise.all(
      watches.map(async (watch) => {
        const [details, accessories, images] = await Promise.all([
          getWatchDetails(watch.id),
          getWatchAccessories(watch.id),
          getWatchImages(watch.id),
        ])

        return transformWatchData(watch, details, accessories, images)
      }),
    )

    return watchesWithDetails
  } catch (error) {
    console.error('Erreur dans getAllWatches:', error)
    throw error
  }
}

/**
 * Récupère une montre par son ID avec tous ses détails
 * @param {string} id - ID de la montre
 * @returns {Promise<Object>} Données de la montre
 */
export async function getWatchById(id) {
  try {
    // Récupérer la montre
    const { data: watch, error: watchError } = await supabase
      .from('watches')
      .select('*')
      .eq('id', id)
      .single()

    if (watchError) {
      if (watchError.code === 'PGRST116') {
        throw new Error('Montre non trouvée')
      }
      throw new Error(`La montre demandée n'existe pas`)
    }

    if (!watch) {
      throw new Error('Montre non trouvée')
    }

    // Vérifier si la montre est disponible
    if (watch.is_available === false) {
      throw new Error('UNAVAILABLE')
    }

    // Récupérer les détails, accessoires et images
    const [details, accessories, images] = await Promise.all([
      getWatchDetails(id),
      getWatchAccessories(id),
      getWatchImages(id),
    ])

    return transformWatchData(watch, details, accessories, images)
  } catch (error) {
    console.error('Erreur dans getWatchById:', error)
    throw error
  }
}

/**
 * Récupère les détails techniques d'une montre
 * @param {string} watchId - ID de la montre
 * @returns {Promise<Object|null>} Détails de la montre
 */
async function getWatchDetails(watchId) {
  const { data, error } = await supabase
    .from('watch_details')
    .select('*')
    .eq('watch_id', watchId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Erreur lors de la récupération des détails:', error)
  }

  return data || null
}

/**
 * Récupère les accessoires d'une montre
 * @param {string} watchId - ID de la montre
 * @returns {Promise<Array>} Liste des accessoires
 */
async function getWatchAccessories(watchId) {
  const { data, error } = await supabase
    .from('watch_accessories')
    .select('*')
    .eq('watch_id', watchId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Erreur lors de la récupération des accessoires:', error)
    return []
  }

  return data || []
}

/**
 * Récupère les images d'une montre depuis Supabase Storage
 * @param {string} watchId - ID de la montre
 * @returns {Promise<Array>} Liste des images avec leurs URLs
 */
export async function getWatchImages(watchId) {
  try {
    // Récupérer les métadonnées des images depuis la table watch_images
    const { data: imageRecords, error: imageRecordsError } = await supabase
      .from('watch_images')
      .select('*')
      .eq('watch_id', watchId)
      .order('image_order', { ascending: true })

    if (imageRecordsError) {
      console.error('Erreur lors de la récupération des métadonnées d\'images:', imageRecordsError)
      return []
    }

    if (!imageRecords || imageRecords.length === 0) {
      return []
    }

    // Si les URLs sont déjà stockées, les utiliser directement
    // Sinon, générer les URLs depuis Supabase Storage
    const imagesWithUrls = await Promise.all(
      imageRecords.map(async (record) => {
        if (record.image_url) {
          return {
            ...record,
            image_url: record.image_url,
          }
        }

        // Générer l'URL publique depuis Supabase Storage
        if (record.image_path) {
          const { data } = supabase.storage.from('watch-images').getPublicUrl(record.image_path)
          return {
            ...record,
            image_url: data.publicUrl,
          }
        }

        return record
      }),
    )

    return imagesWithUrls
  } catch (error) {
    console.error('Erreur dans getWatchImages:', error)
    return []
  }
}


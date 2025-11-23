import { supabase } from './supabase'

/**
 * Transforme les données du formulaire en format base de données
 */
function transformWatchToDB(watchData) {
  return {
    ad_code: watchData.adCode,
    name: watchData.name,
    brand: watchData.brand,
    model: watchData.model,
    reference: watchData.reference,
    price: parseFloat(watchData.price),
    year: watchData.year ? parseInt(watchData.year) : null,
    condition: watchData.condition || null,
    description: watchData.description || null,
    is_available: watchData.isAvailable !== undefined ? watchData.isAvailable : true,
    is_sold: watchData.isSold !== undefined ? watchData.isSold : false,
    sale_date: watchData.saleDate || null,
  }
}

/**
 * Transforme les détails du formulaire en format base de données
 */
function transformDetailsToDB(watchId, details) {
  return {
    watch_id: watchId,
    content: details.content || null,
    movement: details.movement || null,
    case_material: details.caseMaterial || null,
    bracelet_material: details.braceletMaterial || null,
    case_size: details.caseSize || null,
    thickness: details.thickness || null,
    dial_color: details.dialColor || null,
    crystal: details.crystal || null,
    water_resistance: details.waterResistance || null,
    functions: details.functions || null,
    power_reserve: details.powerReserve || null,
    frequency: details.frequency || null,
    case_condition: details.caseCondition || null,
    dial_condition: details.dialCondition || null,
    bracelet_condition: details.braceletCondition || null,
    guarantee: details.guarantee || null,
  }
}

/**
 * Crée une nouvelle montre avec tous ses détails
 * @param {Object} watchData - Données de la montre
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function createWatch(watchData) {
  try {
    // 1. Créer la montre principale
    const watchDB = transformWatchToDB(watchData)
    const { data: watch, error: watchError } = await supabase
      .from('watches')
      .insert(watchDB)
      .select()
      .single()

    if (watchError) {
      throw new Error(`Erreur lors de la création de la montre: ${watchError.message}`)
    }

    const watchId = watch.id

    // 2. Créer les détails techniques
    if (watchData.details) {
      const detailsDB = transformDetailsToDB(watchId, watchData.details)
      const { error: detailsError } = await supabase.from('watch_details').insert(detailsDB)

      if (detailsError) {
        console.error('Erreur lors de la création des détails:', detailsError)
        // Ne pas échouer complètement si les détails échouent
      }
    }

    // 3. Créer les accessoires
    if (watchData.details?.accessories && watchData.details.accessories.length > 0) {
      const accessoriesDB = watchData.details.accessories.map((acc) => ({
        watch_id: watchId,
        name: acc.name,
        included: acc.included || false,
      }))

      const { error: accessoriesError } = await supabase
        .from('watch_accessories')
        .insert(accessoriesDB)

      if (accessoriesError) {
        console.error('Erreur lors de la création des accessoires:', accessoriesError)
      }
    }

    // 4. Les images seront uploadées séparément via uploadWatchImage

    return {
      success: true,
      data: { id: watchId },
    }
  } catch (error) {
    console.error('Erreur dans createWatch:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de la création de la montre',
    }
  }
}

/**
 * Met à jour une montre existante
 * @param {string} watchId - ID de la montre
 * @param {Object} watchData - Nouvelles données de la montre
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateWatch(watchId, watchData) {
  try {
    // Vérifier le statut actuel de la montre avant la mise à jour
    const { data: currentWatch, error: fetchError } = await supabase
      .from('watches')
      .select('is_sold, sale_date')
      .eq('id', watchId)
      .single()

    if (fetchError) {
      throw new Error(`Erreur lors de la récupération de la montre: ${fetchError.message}`)
    }

    // Empêcher de décocher "vendue" si la montre était initialement vendue
    if (currentWatch && currentWatch.is_sold === true && watchData.isSold === false) {
      throw new Error('Impossible de décocher "vendue" pour une montre qui a été vendue. Vous pouvez cependant la remettre en stock en cochant "En vente / Disponible".')
    }

    // 1. Mettre à jour la montre principale
    const watchDB = transformWatchToDB(watchData)
    watchDB.updated_at = new Date().toISOString()

    // Si is_sold passe de false à true, définir sale_date à la date actuelle (seulement si elle n'existe pas déjà)
    if (currentWatch && currentWatch.is_sold === false && watchData.isSold === true) {
      // Ne définir la date que si elle n'existe pas déjà
      if (!currentWatch.sale_date) {
        watchDB.sale_date = new Date().toISOString()
      }
    }

    const { error: watchError } = await supabase
      .from('watches')
      .update(watchDB)
      .eq('id', watchId)

    if (watchError) {
      throw new Error(`Erreur lors de la mise à jour de la montre: ${watchError.message}`)
    }

    // 2. Mettre à jour ou créer les détails techniques
    if (watchData.details) {
      const detailsDB = transformDetailsToDB(watchId, watchData.details)
      detailsDB.updated_at = new Date().toISOString()

      // Vérifier si les détails existent déjà
      const { data: existingDetails } = await supabase
        .from('watch_details')
        .select('id')
        .eq('watch_id', watchId)
        .single()

      if (existingDetails) {
        // Mettre à jour
        const { error: detailsError } = await supabase
          .from('watch_details')
          .update(detailsDB)
          .eq('watch_id', watchId)

        if (detailsError) {
          console.error('Erreur lors de la mise à jour des détails:', detailsError)
        }
      } else {
        // Créer
        const { error: detailsError } = await supabase.from('watch_details').insert(detailsDB)

        if (detailsError) {
          console.error('Erreur lors de la création des détails:', detailsError)
        }
      }
    }

    // 3. Supprimer tous les accessoires existants et les recréer
    if (watchData.details?.accessories !== undefined) {
      const { error: deleteError } = await supabase
        .from('watch_accessories')
        .delete()
        .eq('watch_id', watchId)

      if (deleteError) {
        console.error('Erreur lors de la suppression des accessoires:', deleteError)
      }

      // Recréer les accessoires
      if (watchData.details.accessories.length > 0) {
        const accessoriesDB = watchData.details.accessories.map((acc) => ({
          watch_id: watchId,
          name: acc.name,
          included: acc.included || false,
        }))

        const { error: accessoriesError } = await supabase
          .from('watch_accessories')
          .insert(accessoriesDB)

        if (accessoriesError) {
          console.error('Erreur lors de la création des accessoires:', accessoriesError)
        }
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erreur dans updateWatch:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de la mise à jour de la montre',
    }
  }
}

/**
 * Supprime une montre et toutes ses données associées (cascade)
 * @param {string} watchId - ID de la montre
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteWatch(watchId) {
  try {
    // Récupérer les images pour les supprimer du Storage
    const { data: images } = await supabase
      .from('watch_images')
      .select('image_path')
      .eq('watch_id', watchId)

    // Supprimer les images du Storage
    if (images && images.length > 0) {
      const imagePaths = images
        .map((img) => img.image_path)
        .filter((path) => path !== null && path !== undefined)

      if (imagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('watch-images')
          .remove(imagePaths)

        if (storageError) {
          console.error('Erreur lors de la suppression des images du Storage:', storageError)
        }
      }
    }

    // Supprimer la montre (cascade supprimera automatiquement détails, accessoires, images)
    const { error } = await supabase.from('watches').delete().eq('id', watchId)

    if (error) {
      throw new Error(`Erreur lors de la suppression de la montre: ${error.message}`)
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erreur dans deleteWatch:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de la suppression de la montre',
    }
  }
}

/**
 * Upload une image pour une montre
 * @param {string} watchId - ID de la montre
 * @param {File} imageFile - Fichier image à uploader
 * @param {number} order - Ordre de l'image (optionnel)
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function uploadWatchImage(watchId, imageFile, order = null) {
  try {
    // Générer un nom de fichier unique
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `watches/${watchId}/${fileName}`

    // Upload vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('watch-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Erreur lors de l'upload de l'image: ${uploadError.message}`)
    }

    // Obtenir l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from('watch-images').getPublicUrl(filePath)

    // Déterminer l'ordre (si non fourni, prendre le max + 1)
    let imageOrder = order
    if (imageOrder === null || imageOrder === undefined) {
      const { data: existingImages } = await supabase
        .from('watch_images')
        .select('image_order')
        .eq('watch_id', watchId)
        .order('image_order', { ascending: false })
        .limit(1)

      imageOrder = existingImages && existingImages.length > 0 ? existingImages[0].image_order + 1 : 1
    }

    // Créer l'enregistrement dans la table watch_images
    const { data: imageRecord, error: recordError } = await supabase
      .from('watch_images')
      .insert({
        watch_id: watchId,
        image_path: filePath,
        image_url: publicUrl,
        image_order: imageOrder,
      })
      .select()
      .single()

    if (recordError) {
      // Si l'insertion échoue, supprimer le fichier uploadé
      await supabase.storage.from('watch-images').remove([filePath])
      throw new Error(`Erreur lors de l'enregistrement de l'image: ${recordError.message}`)
    }

    return {
      success: true,
      data: {
        ...imageRecord,
        image_url: publicUrl,
      },
    }
  } catch (error) {
    console.error('Erreur dans uploadWatchImage:', error)
    return {
      success: false,
      error: error.message || "Erreur lors de l'upload de l'image",
    }
  }
}

/**
 * Supprime une image d'une montre
 * @param {string} imageId - ID de l'image dans la table watch_images
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteWatchImage(imageId) {
  try {
    // Récupérer les informations de l'image
    const { data: image, error: fetchError } = await supabase
      .from('watch_images')
      .select('image_path')
      .eq('id', imageId)
      .single()

    if (fetchError) {
      throw new Error(`Image non trouvée: ${fetchError.message}`)
    }

    // Supprimer le fichier du Storage si image_path existe
    if (image.image_path) {
      const { error: storageError } = await supabase.storage
        .from('watch-images')
        .remove([image.image_path])

      if (storageError) {
        console.error('Erreur lors de la suppression du fichier Storage:', storageError)
        // Continuer quand même pour supprimer l'enregistrement
      }
    }

    // Supprimer l'enregistrement de la table
    const { error: deleteError } = await supabase.from('watch_images').delete().eq('id', imageId)

    if (deleteError) {
      throw new Error(`Erreur lors de la suppression de l'enregistrement: ${deleteError.message}`)
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erreur dans deleteWatchImage:', error)
    return {
      success: false,
      error: error.message || "Erreur lors de la suppression de l'image",
    }
  }
}

/**
 * Réorganise l'ordre des images d'une montre
 * @param {Array<{id: string, order: number}>} imageOrders - Tableau d'objets avec id et order
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function reorderWatchImages(imageOrders) {
  try {
    // Mettre à jour chaque image
    const updatePromises = imageOrders.map(({ id, order }) =>
      supabase
        .from('watch_images')
        .update({ image_order: order })
        .eq('id', id),
    )

    const results = await Promise.all(updatePromises)

    // Vérifier s'il y a des erreurs
    const errors = results.filter((result) => result.error)
    if (errors.length > 0) {
      throw new Error(`Erreurs lors de la réorganisation: ${errors.map((e) => e.error.message).join(', ')}`)
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erreur dans reorderWatchImages:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de la réorganisation des images',
    }
  }
}

/**
 * Bascule le statut de disponibilité d'une montre
 * @param {string} watchId - ID de la montre
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function toggleWatchAvailability(watchId) {
  try {
    // Récupérer le statut actuel
    const { data: watch, error: fetchError } = await supabase
      .from('watches')
      .select('is_available')
      .eq('id', watchId)
      .single()

    if (fetchError) {
      throw new Error(`Erreur lors de la récupération de la montre: ${fetchError.message}`)
    }

    // Bascule le statut
    const newStatus = !watch.is_available

    const { data: updatedWatch, error: updateError } = await supabase
      .from('watches')
      .update({ is_available: newStatus })
      .eq('id', watchId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Erreur lors de la mise à jour du statut: ${updateError.message}`)
    }

    return {
      success: true,
      data: updatedWatch,
    }
  } catch (error) {
    console.error('Erreur dans toggleWatchAvailability:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors du changement de statut',
    }
  }
}

/**
 * Marque une montre comme vendue
 * @param {string} watchId - ID de la montre
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function markWatchAsSold(watchId) {
  try {
    // Récupérer le statut actuel pour vérifier si sale_date existe déjà
    const { data: currentWatch, error: fetchError } = await supabase
      .from('watches')
      .select('sale_date')
      .eq('id', watchId)
      .single()

    if (fetchError) {
      throw new Error(`Erreur lors de la récupération de la montre: ${fetchError.message}`)
    }

    // Préparer les données à mettre à jour
    const updateData = { is_sold: true }
    
    // Ne définir sale_date que si elle n'existe pas déjà
    if (!currentWatch.sale_date) {
      updateData.sale_date = new Date().toISOString()
    }

    const { data: updatedWatch, error: updateError } = await supabase
      .from('watches')
      .update(updateData)
      .eq('id', watchId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Erreur lors de la mise à jour du statut: ${updateError.message}`)
    }

    return {
      success: true,
      data: updatedWatch,
    }
  } catch (error) {
    console.error('Erreur dans markWatchAsSold:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors du marquage comme vendue',
    }
  }
}

/**
 * Récupère une montre par son ID pour l'admin (sans filtre de disponibilité)
 * @param {string} watchId - ID de la montre
 * @returns {Promise<Object>} Données complètes de la montre
 */
export async function getWatchByIdForAdmin(watchId) {
  try {
    // Récupérer la montre
    const { data: watch, error: watchError } = await supabase
      .from('watches')
      .select('*')
      .eq('id', watchId)
      .single()

    if (watchError) {
      throw new Error(`Erreur lors de la récupération de la montre: ${watchError.message}`)
    }

    if (!watch) {
      throw new Error('Montre non trouvée')
    }

    // Récupérer les détails techniques
    const { data: details } = await supabase
      .from('watch_details')
      .select('*')
      .eq('watch_id', watchId)
      .single()

    // Récupérer les accessoires
    const { data: accessories } = await supabase
      .from('watch_accessories')
      .select('*')
      .eq('watch_id', watchId)
      .order('name', { ascending: true })

    // Récupérer les images
    const { data: images } = await supabase
      .from('watch_images')
      .select('*')
      .eq('watch_id', watchId)
      .order('image_order', { ascending: true })

    // Transformer les images avec leurs URLs et IDs
    const imagesWithUrls = (images || []).map((img) => {
      let imageUrl = img.image_url
      if (!imageUrl && img.image_path) {
        const { data } = supabase.storage.from('watch-images').getPublicUrl(img.image_path)
        imageUrl = data.publicUrl
      }
      return {
        id: img.id,
        url: imageUrl,
        order: img.image_order,
      }
    })

    // Transformer en format formulaire
    return {
      adCode: watch.ad_code,
      name: watch.name,
      brand: watch.brand,
      model: watch.model,
      reference: watch.reference,
      price: watch.price?.toString() || '',
      year: watch.year?.toString() || '',
      condition: watch.condition || '',
      description: watch.description || '',
      isAvailable: watch.is_available !== undefined ? watch.is_available : true,
      isSold: watch.is_sold !== undefined ? watch.is_sold : false,
      saleDate: watch.sale_date || null,
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
        accessories: (accessories || []).map((acc) => ({
          name: acc.name,
          included: acc.included || false,
        })),
      },
      images: imagesWithUrls,
    }
  } catch (error) {
    console.error('Erreur dans getWatchByIdForAdmin:', error)
    throw error
  }
}

/**
 * Télécharge une image depuis une URL et la convertit en File
 * @param {string} imageUrl - URL de l'image
 * @param {string} fileName - Nom du fichier
 * @returns {Promise<File>} Fichier image
 */
async function downloadImageAsFile(imageUrl, fileName) {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Erreur lors du téléchargement de l'image: ${response.statusText}`)
    }
    const blob = await response.blob()
    return new File([blob], fileName, { type: blob.type })
  } catch (error) {
    console.error('Erreur dans downloadImageAsFile:', error)
    throw error
  }
}

/**
 * Duplique une montre avec toutes ses données et images
 * @param {string} watchId - ID de la montre à dupliquer
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function duplicateWatch(watchId) {
  try {
    // 1. Récupérer toutes les données de la montre originale
    const originalWatch = await getWatchByIdForAdmin(watchId)

    // 2. Générer un nouveau code annonce (ajouter " - Copie" ou un suffixe)
    const newAdCode = `${originalWatch.adCode} - Copie`

    // 3. Créer la nouvelle montre avec toutes les données
    const newWatchData = {
      ...originalWatch,
      adCode: newAdCode,
      isAvailable: false, // La montre dupliquée est toujours hors stock par défaut
      isSold: false, // La montre dupliquée n'est jamais vendue
    }

    const createResult = await createWatch(newWatchData)

    if (!createResult.success) {
      throw new Error(createResult.error || 'Erreur lors de la création de la montre dupliquée')
    }

    const newWatchId = createResult.data.id

    // 4. Dupliquer les images
    if (originalWatch.images && originalWatch.images.length > 0) {
      for (let i = 0; i < originalWatch.images.length; i++) {
        const image = originalWatch.images[i]
        if (image.url) {
          try {
            // Extraire le nom de fichier de l'URL ou générer un nouveau nom
            const urlParts = image.url.split('/')
            const originalFileName = urlParts[urlParts.length - 1].split('?')[0] // Enlever les query params
            const fileExt = originalFileName.split('.').pop() || 'jpg'
            const newFileName = `duplicate-${Date.now()}-${i}.${fileExt}`

            // Télécharger l'image depuis l'URL
            const imageFile = await downloadImageAsFile(image.url, newFileName)

            // Uploader l'image pour la nouvelle montre
            await uploadWatchImage(newWatchId, imageFile, image.order || i + 1)
          } catch (imageError) {
            console.error(`Erreur lors de la duplication de l'image ${i + 1}:`, imageError)
            // Continuer avec les autres images même si une échoue
          }
        }
      }
    }

    return {
      success: true,
      data: { id: newWatchId },
    }
  } catch (error) {
    console.error('Erreur dans duplicateWatch:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de la duplication de la montre',
    }
  }
}

/**
 * Récupère toutes les montres (pour l'admin, avec toutes les données)
 * @returns {Promise<Array>} Liste des montres avec la première image
 */
export async function getAllWatchesForAdmin() {
  try {
    const { data: watches, error } = await supabase
      .from('watches')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erreur lors de la récupération des montres: ${error.message}`)
    }

    if (!watches || watches.length === 0) {
      return []
    }

    // Charger la première image de chaque montre
    const watchesWithImages = await Promise.all(
      watches.map(async (watch) => {
        const { data: firstImage } = await supabase
          .from('watch_images')
          .select('image_url, image_path')
          .eq('watch_id', watch.id)
          .order('image_order', { ascending: true })
          .limit(1)
          .single()

        let imageUrl = null
        if (firstImage) {
          if (firstImage.image_url) {
            imageUrl = firstImage.image_url
          } else if (firstImage.image_path) {
            const { data } = supabase.storage.from('watch-images').getPublicUrl(firstImage.image_path)
            imageUrl = data.publicUrl
          }
        }

        return {
          ...watch,
          images: imageUrl ? [imageUrl] : [],
        }
      }),
    )

    return watchesWithImages
  } catch (error) {
    console.error('Erreur dans getAllWatchesForAdmin:', error)
    throw error
  }
}

/**
 * Récupère les statistiques des montres groupées par jour (créées et vendues)
 * @returns {Promise<Array<{date: string, created: number, sold: number}>>} Tableau des statistiques par jour, trié par date
 */
export async function getWatchStatsByDay() {
  try {
    // Récupérer toutes les montres
    const watches = await getAllWatchesForAdmin()

    if (!watches || watches.length === 0) {
      return []
    }

    // Grouper les montres par jour (créées et vendues)
    const statsMap = new Map()

    watches.forEach((watch) => {
      // Statistiques des montres créées
      if (watch.created_at) {
        const createdDate = new Date(watch.created_at)
        const createdDateKey = createdDate.toISOString().split('T')[0]

        if (!statsMap.has(createdDateKey)) {
          statsMap.set(createdDateKey, { created: 0, sold: 0 })
        }
        const stats = statsMap.get(createdDateKey)
        stats.created += 1
      }

      // Statistiques des montres vendues (utiliser sale_date si disponible, sinon vérifier is_sold)
      if (watch.is_sold === true && watch.sale_date) {
        const soldDate = new Date(watch.sale_date)
        const soldDateKey = soldDate.toISOString().split('T')[0]

        if (!statsMap.has(soldDateKey)) {
          statsMap.set(soldDateKey, { created: 0, sold: 0 })
        }
        const stats = statsMap.get(soldDateKey)
        stats.sold += 1
      }
    })

    // Convertir la Map en tableau d'objets et trier par date
    const stats = Array.from(statsMap.entries())
      .map(([date, counts]) => ({
        date,
        created: counts.created,
        sold: counts.sold,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return stats
  } catch (error) {
    console.error('Erreur dans getWatchStatsByDay:', error)
    throw error
  }
}


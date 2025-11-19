import { supabase } from './supabase'

const STORAGE_KEY = 'admin_authenticated'

/**
 * Vérifie si un email est dans la liste des admins autorisés
 * @param {string} email - L'email à vérifier
 * @returns {Promise<boolean>} - True si l'email est autorisé
 */
async function isAuthorizedAdmin(email) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun résultat trouvé
        return false
      }
      console.error('Erreur lors de la vérification admin:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Erreur dans isAuthorizedAdmin:', error)
    return false
  }
}

/**
 * Connecte un utilisateur admin avec email et mot de passe
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function loginAdmin(email, password) {
  try {
    // Authentifier avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return {
        success: false,
        error: authError.message || 'Erreur lors de la connexion',
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Aucun utilisateur trouvé',
      }
    }

    // Vérifier que l'email est dans la liste des admins autorisés
    const isAuthorized = await isAuthorizedAdmin(email)
    if (!isAuthorized) {
      // Déconnecter l'utilisateur s'il n'est pas autorisé
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Vous n\'êtes pas autorisé à accéder à l\'interface d\'administration',
      }
    }

    // Stocker l'état d'authentification
    sessionStorage.setItem(STORAGE_KEY, 'true')
    localStorage.setItem('admin_email', email)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Erreur dans loginAdmin:', error)
    return {
      success: false,
      error: 'Une erreur est survenue lors de la connexion',
    }
  }
}

/**
 * Vérifie si l'utilisateur admin est actuellement authentifié
 * @returns {Promise<boolean>} - True si l'utilisateur est authentifié et autorisé
 */
export async function isAdminAuthenticated() {
  try {
    // Vérifier la session Supabase
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session || !session.user) {
      return false
    }

    // Vérifier dans sessionStorage
    const sessionAuth = sessionStorage.getItem(STORAGE_KEY)
    if (sessionAuth !== 'true') {
      return false
    }

    // Vérifier que l'email est toujours autorisé (au cas où il aurait été retiré)
    const isAuthorized = await isAuthorizedAdmin(session.user.email)
    if (!isAuthorized) {
      // Déconnecter si plus autorisé
      await logoutAdmin()
      return false
    }

    return true
  } catch (error) {
    console.error('Erreur dans isAdminAuthenticated:', error)
    return false
  }
}

/**
 * Récupère l'utilisateur admin actuellement connecté
 * @returns {Promise<Object|null>} - Les données de l'utilisateur ou null
 */
export async function getCurrentAdmin() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Erreur dans getCurrentAdmin:', error)
    return null
  }
}

/**
 * Déconnecte l'utilisateur admin
 */
export async function logoutAdmin() {
  try {
    await supabase.auth.signOut()
    sessionStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('admin_email')
  } catch (error) {
    console.error('Erreur dans logoutAdmin:', error)
  }
}

/**
 * Vérifie et met à jour la session admin (à appeler périodiquement)
 * @returns {Promise<boolean>} - True si la session est valide
 */
export async function refreshAdminSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error || !session) {
      sessionStorage.removeItem(STORAGE_KEY)
      return false
    }

    // Vérifier que l'email est toujours autorisé
    const isAuthorized = await isAuthorizedAdmin(session.user.email)
    if (!isAuthorized) {
      await logoutAdmin()
      return false
    }

    // Mettre à jour le flag d'authentification
    sessionStorage.setItem(STORAGE_KEY, 'true')
    return true
  } catch (error) {
    console.error('Erreur dans refreshAdminSession:', error)
    return false
  }
}


// Service pour gérer l'authentification de maintenance

const MAINTENANCE_PASSWORD = '@sauvagE2025!' // Mot de passe par défaut - À changer en production
const STORAGE_KEY = 'maintenance_authenticated'

/**
 * Vérifie si le mot de passe de maintenance est correct
 * @param {string} inputPassword - Le mot de passe saisi
 * @returns {boolean} - True si le mot de passe est correct
 */
export function checkMaintenancePassword(inputPassword) {
  return inputPassword === MAINTENANCE_PASSWORD
}

/**
 * Vérifie si l'utilisateur est authentifié pour accéder au site
 * @returns {boolean} - True si l'utilisateur est authentifié
 */
export function isAuthenticated() {
  // Vérifier dans sessionStorage (perdure pendant la session du navigateur)
  const sessionAuth = sessionStorage.getItem(STORAGE_KEY)
  if (sessionAuth === 'true') {
    return true
  }

  // Vérifier dans localStorage (perdure même après fermeture du navigateur)
  const localAuth = localStorage.getItem(STORAGE_KEY)
  if (localAuth === 'true') {
    return true
  }

  return false
}

/**
 * Authentifie l'utilisateur (stocke l'état d'authentification)
 * @param {boolean} remember - Si true, utilise localStorage, sinon sessionStorage
 */
export function authenticate(remember = false) {
  if (remember) {
    localStorage.setItem(STORAGE_KEY, 'true')
  } else {
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }
}

/**
 * Déconnecte l'utilisateur (supprime l'état d'authentification)
 */
export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}


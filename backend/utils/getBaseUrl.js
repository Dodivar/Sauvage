// Fonction pour obtenir l'URL de base selon l'environnement
function getBaseUrl() {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.RENDER === 'true' ||
    process.env.PORT // Render définit toujours PORT

  if (process.env.BASE_URL) {
    return process.env.BASE_URL
  }
  
  if (isProduction) {
    return 'https://sauvage-watches.fr'
  }
  
  return 'http://localhost:5173'
}

module.exports = { getBaseUrl }


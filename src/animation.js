// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  once: true,
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1'
      entry.target.style.transform = 'translateY(0)'
    }
  })
}, observerOptions)

// Observe elements for animation
function scrollAnimation() {
  document.querySelectorAll('section').forEach((section) => {
    section.style.opacity = '0'
    section.style.transform = 'translateY(20px)'
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
    observer.observe(section)
  })
}

export default scrollAnimation

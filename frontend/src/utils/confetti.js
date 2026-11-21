import confetti from 'canvas-confetti'

/**
 * Fires celebratory green & gold eco-confetti
 */
export function fireCelebrationConfetti() {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#10b981', '#15803d', '#a3e635', '#f59e0b', '#3b82f6', '#ffffff'],
    zIndex: 9999
  }

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })
  fire(0.2, {
    spread: 60,
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

/**
 * Fires side confetti cannons (ideal for high-score quiz and level-up)
 */
export function fireCannons() {
  const end = Date.now() + 1500
  const colors = ['#10b981', '#34d399', '#a3e635', '#fbbf24']

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors,
      zIndex: 9999
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors,
      zIndex: 9999
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

/**
 * Star burst when unlocking an achievement badge
 */
export function fireBadgeConfetti() {
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    shapes: ['star'],
    colors: ['#fbbf24', '#f59e0b', '#10b981', '#a3e635'],
    zIndex: 9999
  })
}

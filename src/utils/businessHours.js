export const businessHours = {
  sunday: null,
  monday: [
    { open: '08:00', close: '14:00' },
    { open: '17:00', close: '21:00' },
  ],
  tuesday: [
    { open: '08:00', close: '14:00' },
    { open: '17:00', close: '21:00' },
  ],
  wednesday: [
    { open: '08:00', close: '14:00' },
    { open: '17:00', close: '02:00' },
  ],
  thursday: [
    { open: '08:00', close: '14:00' },
    { open: '17:00', close: '02:00' },
  ],
  friday: [
    { open: '08:00', close: '02:00' },
    { open: '17:00', close: '21:00' },
  ],
  saturday: [{ open: '08:00', close: '14:00' }],
}

const DAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

const DAY_NAMES_ES = {
  sunday: 'domingo',
  monday: 'lunes',
  tuesday: 'martes',
  wednesday: 'miércoles',
  thursday: 'jueves',
  friday: 'viernes',
  saturday: 'sábado',
}

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Un rango "cruza la medianoche" cuando la hora de cierre es menor o igual
// a la de apertura (ej: 17:00 - 02:00).
function isOvernight(range) {
  return toMinutes(range.close) <= toMinutes(range.open)
}

function formatRanges(ranges) {
  if (!ranges || ranges.length === 0) return null
  return ranges.map((range) => `${range.open} - ${range.close}`).join(' y ')
}

// Devuelve el estado actual del comercio: { isOpen, message, todayHours, todayRanges }
export function getStoreStatus(hours = businessHours, now = new Date()) {
  const dayIndex = now.getDay()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const todayKey = DAY_KEYS[dayIndex]
  const todayRanges = hours[todayKey] || []
  const todayHours = formatRanges(todayRanges)

  const previousKey = DAY_KEYS[(dayIndex + 6) % 7]
  const previousRanges = hours[previousKey] || []

  // ¿Está abierto ahora por un rango que empieza hoy?
  const activeRangeToday = todayRanges.find((range) => {
    const openM = toMinutes(range.open)
    const closeM = toMinutes(range.close)
    if (isOvernight(range)) {
      // Ej: 17:00 - 02:00 -> hoy está abierto desde las 17:00 hasta medianoche
      return currentMinutes >= openM
    }
    return currentMinutes >= openM && currentMinutes < closeM
  })

  // ¿Está abierto ahora por un rango de AYER que cruzó la medianoche?
  // Ej: ayer 17:00 - 02:00 -> hoy sigue abierto hasta las 02:00
  const activeRangeFromYesterday = previousRanges.find(
    (range) => isOvernight(range) && currentMinutes < toMinutes(range.close)
  )

  const activeRange = activeRangeToday || activeRangeFromYesterday

  if (activeRange) {
    return {
      isOpen: true,
      message: 'Estamos abiertos · Pedí ahora',
      todayHours,
      todayRanges,
    }
  }

  // ¿Abre más tarde, hoy mismo?
  const nextRangeToday = todayRanges
    .filter((range) => toMinutes(range.open) > currentMinutes)
    .sort((a, b) => toMinutes(a.open) - toMinutes(b.open))[0]
  if (nextRangeToday) {
    return {
      isOpen: false,
      message: `Estamos cerrados`,
      todayHours,
      todayRanges,
    }
  }

  // Buscar el próximo día con horario disponible.
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextIndex = (dayIndex + offset) % 7
    const nextKey = DAY_KEYS[nextIndex]
    const nextRanges = hours[nextKey]

    if (nextRanges && nextRanges.length > 0) {
      const firstOpen = [...nextRanges].sort(
        (a, b) => toMinutes(a.open) - toMinutes(b.open)
      )[0]
      const dayLabel = offset === 1 ? 'mañana' : `el ${DAY_NAMES_ES[nextKey]}`

      return {
        isOpen: false,
        message: `Estamos cerrados`,
        todayHours,
        todayRanges,
      }
    }
  }

  return { isOpen: false, message: 'Estamos cerrados', todayHours, todayRanges }
}
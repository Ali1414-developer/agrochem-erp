export function saveSession(key, value, storage = 'local') {
  try {
    const target = storage === 'session' ? window.sessionStorage : window.localStorage
    target.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Unable to save session', error)
  }
}

export function loadSession(key) {
  try {
    const localItem = window.localStorage.getItem(key)
    if (localItem) {
      return JSON.parse(localItem)
    }

    const sessionItem = window.sessionStorage.getItem(key)
    return sessionItem ? JSON.parse(sessionItem) : null
  } catch (error) {
    console.error('Unable to load session', error)
    return null
  }
}

export function clearSession(key) {
  try {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  } catch (error) {
    console.error('Unable to clear session', error)
  }
}

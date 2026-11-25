export type ThemeMode = 'light' | 'dark' | 'system'
const STORAGE_KEY = 'jj-theme'

/**
 * Three theme modes with system default.
 * The initial value is applied by an inline <head> script (see nuxt.config) so the
 * chosen theme is painted on the first frame and never flashes. This composable
 * only owns state after hydration, which keeps server and client markup identical.
 */
export const useTheme = () => {
  const mode = useState<ThemeMode>('theme-mode', () => 'system')
  const ready = useState<boolean>('theme-ready', () => false)

  const apply = (value: ThemeMode) => {
    if (!import.meta.client) return
    const root = document.documentElement
    if (value === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', value)
  }

  const setMode = (value: ThemeMode) => {
    mode.value = value
    apply(value)
    try { localStorage.setItem(STORAGE_KEY, value) } catch { /* private mode */ }
  }

  const init = () => {
    if (!import.meta.client) return
    let saved: ThemeMode = 'system'
    try { saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system' } catch { /* ignore */ }
    mode.value = saved
    apply(saved)
    ready.value = true
  }

  return { mode, ready, setMode, init }
}

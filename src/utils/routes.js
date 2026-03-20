export const routes = {
  home: '/',
  companyRegistration: '/registro-empresa',
}

export function normalizePathname(pathname = '/') {
  if (!pathname || pathname === '/') {
    return routes.home
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export function navigateTo(pathname) {
  const nextPath = normalizePathname(pathname)
  const currentPath = normalizePathname(window.location.pathname)

  if (currentPath === nextPath) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  window.history.pushState({}, '', nextPath)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function navigateToHomeSection(sectionId) {
  if (normalizePathname(window.location.pathname) !== routes.home) {
    window.location.href = `${routes.home}#${sectionId}`
    return
  }

  const section = document.getElementById(sectionId)
  if (!section) {
    return
  }

  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.history.replaceState({}, '', `${routes.home}#${sectionId}`)
}

import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import CompanyRegistrationPage from './pages/CompanyRegistrationPage'
import { normalizePathname, routes } from './utils/routes'

function App() {
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePathname(window.location.pathname)
  )

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(normalizePathname(window.location.pathname))
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  if (currentPath === routes.companyRegistration) {
    return <CompanyRegistrationPage />
  }

  return <LandingPage />
}

export default App

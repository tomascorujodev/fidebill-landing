import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  navigateTo,
  navigateToHomeSection,
  routes,
} from '../utils/routes'

const landingLinks = [
  { label: 'Inicio', sectionId: 'hero' },
  { label: 'Beneficios', sectionId: 'feac' },
  { label: 'Planes', sectionId: 'pricing' },
  { label: 'Contacto', sectionId: 'cta' },
]

export default function Navbar({ currentPath = routes.home }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isRegistrationPage = currentPath === routes.companyRegistration

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [currentPath])

  const baseLinkClass =
    'text-sm font-medium transition hover:text-sky-300'

  const navbarClass = isScrolled || isRegistrationPage
    ? 'bg-slate-950/88 shadow-lg shadow-slate-950/10 backdrop-blur-xl'
    : 'bg-slate-950/45 backdrop-blur-md'

  const handleLogoClick = () => {
    if (isRegistrationPage) {
      navigateTo(routes.home)
      return
    }

    navigateToHomeSection('hero')
  }

  const handleLandingClick = (sectionId) => {
    navigateToHomeSection(sectionId)
  }

  const mobileLinks = isRegistrationPage
    ? [{ label: 'Volver al inicio', action: () => navigateTo(routes.home) }]
    : landingLinks.map((item) => ({
        label: item.label,
        action: () => handleLandingClick(item.sectionId),
      }))

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navbarClass}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-3"
        >
          <img
            src="assets/LogoFinalFidebillBlanco.png"
            className="h-9 w-auto"
            alt="Fidebill"
          />
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {!isRegistrationPage &&
            landingLinks.map((item) => (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => handleLandingClick(item.sectionId)}
                className={`${baseLinkClass} text-white`}
              >
                {item.label}
              </button>
            ))}

          {isRegistrationPage && (
            <button
              type="button"
              onClick={() => navigateTo(routes.home)}
              className={`${baseLinkClass} text-white`}
            >
              Volver al inicio
            </button>
          )}

          <button
            type="button"
            onClick={() => navigateTo(routes.companyRegistration)}
            className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/30 transition hover:bg-emerald-300"
          >
            Registrate gratis
          </button>
        </div>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setMenuOpen((currentValue) => !currentValue)}
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
        >
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950/96 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5">
            {mobileLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.action()
                  setMenuOpen(false)
                }}
                className="rounded-2xl px-4 py-3 text-left text-white transition hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                navigateTo(routes.companyRegistration)
                setMenuOpen(false)
              }}
              className="mt-2 rounded-2xl bg-emerald-400 px-4 py-3 text-left font-semibold text-slate-950"
            >
              Registrate gratis
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

Navbar.propTypes = {
  currentPath: PropTypes.string,
}

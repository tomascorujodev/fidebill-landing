import { CheckIcon } from '@heroicons/react/20/solid'
import { navigateTo, routes } from '../utils/routes'

const tiers = [
  {
    name: 'Plan Base',
    id: 'tier-hobby',
    priceMonthly: '$48.000',
    priceSuffix: '/mes',
    description: 'La opcion ideal para empezar a fidelizar clientes con una operacion simple y rentable.',
    features: [
      '1 sucursal incluida',
      'Soporte las 24 hs',
      'Clientes ilimitados',
      'Operaciones en puntos sin limite',
      'Beneficios activos sin limite',
      'Catalogo de productos y servicios sin tope',
      '1 usuario administrador incluido',
      '+ $25.000 por cada sucursal extra',
    ],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    priceMonthly: 'Contactanos',
    priceSuffix: '',
    description: 'Una propuesta a medida para empresas con mayor volumen, multiples sucursales o integraciones especiales.',
    features: [
      'Multiples sucursales',
      'Operaciones centralizadas',
      'Integraciones personalizadas',
      'Acompanamiento dedicado',
      'Automatizaciones de marketing',
      'Roadmap conjunto',
    ],
    featured: true,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-28 relative isolate rounded-[2rem] bg-white/80 px-6 py-24 section-shell sm:py-32 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#38bdf8] to-[#34d399] opacity-15"
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold text-sky-600">Elegi tu plan</h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
          Planes pensados para acompanar el crecimiento de tu negocio
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-slate-600 sm:text-xl/8">
        Registrate gratis hoy y deja tu empresa lista para avanzar. Cuando quieras
        activar el servicio, elegis el plan que mejor se adapte a tu operacion.
      </p>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIndex) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-slate-950 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIndex === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none'
                  : 'sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl',
              'rounded-3xl p-8 ring-1 ring-slate-900/10 sm:p-10'
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-emerald-300' : 'text-sky-600',
                'text-base font-semibold'
              )}
            >
              {tier.name}
            </h3>

            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-slate-900',
                  'text-5xl font-semibold tracking-tight'
                )}
              >
                {tier.priceMonthly}
              </span>
              {tier.priceSuffix && (
                <span
                  className={classNames(
                    tier.featured ? 'text-slate-400' : 'text-slate-500',
                    'text-base'
                  )}
                >
                  {tier.priceSuffix}
                </span>
              )}
            </p>

            <p className={classNames(tier.featured ? 'text-slate-300' : 'text-slate-600', 'mt-6 text-base/7')}>
              {tier.description}
            </p>

            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-slate-300' : 'text-slate-600',
                'mt-8 space-y-3 text-sm/6 sm:mt-10'
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(
                      tier.featured ? 'text-emerald-300' : 'text-sky-600',
                      'h-6 w-5 flex-none'
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => navigateTo(routes.companyRegistration)}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-emerald-400 text-slate-950 shadow-xs hover:bg-emerald-300 focus-visible:outline-emerald-400'
                  : 'text-slate-900 ring-1 ring-slate-200 ring-inset hover:ring-slate-300 focus-visible:outline-slate-900',
                'mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
              )}
            >
              Registrate gratis
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

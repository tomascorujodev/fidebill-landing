import { ArrowRight, CircleCheckBig } from 'lucide-react'
import { navigateTo, routes } from '../utils/routes'

const highlights = [
  'Alta online gratuita para nuevas empresas',
  'Correo validado y accesos iniciales listos',
  'Configuracion inicial lista para activacion',
]

const heroPanelHighlights = [
  'Alta inicial gratuita y 100% online',
  'Configuracion base lista para activar tu empresa',
  'Acompanamiento comercial cuando lo necesites',
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 pb-20 pt-32 sm:pb-24 lg:px-8 lg:pt-40"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.18),_transparent_24%)]"
      />

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Nuevo: alta online para empresas
          </div>

          <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Activa tu empresa en Fidebill y empeza a fidelizar clientes desde hoy.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Completa el alta online, valida el correo del responsable y deja creada la
            base inicial de tu empresa para empezar a operar sin demoras.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigateTo(routes.companyRegistration)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800"
            >
              Registrate gratis
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="https://wa.me/5492235484897"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Hablar con un asesor
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-4 shadow-sm"
              >
                <CircleCheckBig className="mt-0.5 h-5 w-5 text-emerald-500" />
                <p className="text-sm font-medium text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="mesh-card relative overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-950/15">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-400/15 blur-3xl" />

            <p className="text-sm uppercase tracking-[0.3em] text-sky-200">
              Alta online para empresas
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Empieza con una base profesional desde el primer dia.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Fidebill te permite dar de alta tu empresa y dejar lista la
              configuracion inicial para avanzar con la activacion comercial sin
              demoras.
            </p>

            <div className="mt-8 grid gap-4">
              {heroPanelHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <p className="text-sm font-medium text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { navigateTo, routes } from '../utils/routes'

export default function Cta() {
  return (
    <section id="cta" className="scroll-mt-28 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mesh-card relative isolate overflow-hidden rounded-[2rem] px-6 pt-16 shadow-2xl sm:px-16 md:pt-20 lg:flex lg:items-center lg:gap-x-20 lg:px-20 lg:pt-0">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_42%)] lg:block" />

          <div className="mx-auto max-w-2xl py-10 text-center lg:mx-0 lg:flex-auto lg:py-24 lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
              Alta gratis para empresas
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Da el primer paso hoy y deja tu empresa lista para crecer con Fidebill.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              El alta inicial es gratuita, guiada y en pocos minutos. Si preferis
              acompanamiento comercial antes de registrarte, tambien podes hablar con
              nuestro equipo por WhatsApp.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => navigateTo(routes.companyRegistration)}
                className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Registrate gratis
              </button>
              <a
                href="https://wa.me/5492235484897"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Hablar con un asesor
              </a>
            </div>
          </div>

          <div className="relative mt-12 h-80 lg:mt-0 lg:h-[26rem] lg:flex-1">
            <img
              alt="Vista de la app de puntos"
              src="assets/Fidebill_Puntos.png"
              width={1824}
              height={1080}
              className="absolute left-0 top-0 w-full max-w-none rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-slate-950/20"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

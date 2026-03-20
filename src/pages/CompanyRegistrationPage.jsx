import { Building2, MailCheck, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import CompanyRegistrationForm from '../components/CompanyRegistrationForm'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'
import { routes } from '../utils/routes'

const valueProps = [
  {
    title: 'Correo validado',
    description: 'Confirmamos el correo del responsable antes de registrar la empresa.',
    icon: MailCheck,
  },
  {
    title: 'Accesos listos para operar',
    description: 'Creas un usuario administrador y uno operativo dentro del mismo flujo.',
    icon: Building2,
  },
  {
    title: 'Configuracion base lista',
    description: 'Dejamos preparada la estructura inicial para que el equipo pueda continuar la activacion.',
    icon: Sparkles,
  },
]

export default function CompanyRegistrationPage() {
  return (
    <>
      <Navbar currentPath={routes.companyRegistration} />
      <main className="px-6 pb-20 pt-32 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <section className="mesh-card overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-950/10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
              Alta online para empresas
            </p>
            <h1 className="mt-4 text-4xl font-semibold">
              Activa tu empresa gratis en Fidebill.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Este flujo guiado te permite dejar tu empresa lista para empezar:
              validamos el correo del responsable, creas los accesos iniciales y
              dejas preparada la configuracion base dentro del ecosistema de Fidebill
              sin depender de una gestion manual.
            </p>

            <div className="mt-10 grid gap-4">
              {valueProps.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <item.icon className="h-5 w-5 text-emerald-300" />
                  <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <CompanyRegistrationForm />
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  )
}

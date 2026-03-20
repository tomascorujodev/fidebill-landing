export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/85">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <img
            src="assets/LogoFinalFidebill.png"
            className="h-9 w-auto"
            alt="Fidebill logo"
          />
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Fidebill ayuda a las empresas a fidelizar clientes, ordenar beneficios y
            crecer con una experiencia digital propia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
              Contacto
            </h2>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a href="mailto:soporte@fidebill.com" className="hover:text-slate-950">
                  soporte@fidebill.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5492235484897"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950"
                >
                  WhatsApp comercial
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
              Redes
            </h2>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a
                  href="https://www.instagram.com/fidebillsoftware/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">
              Documentacion
            </h2>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a
                  href="mailto:soporte@fidebill.com?subject=Solicitud%20de%20politicas%20de%20privacidad"
                  className="hover:text-slate-950"
                >
                  Solicitar politicas de privacidad
                </a>
              </li>
              <li>
                <a
                  href="mailto:soporte@fidebill.com?subject=Solicitud%20de%20terminos%20y%20condiciones"
                  className="hover:text-slate-950"
                >
                  Solicitar terminos y condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

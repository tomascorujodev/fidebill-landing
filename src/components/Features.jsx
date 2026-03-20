import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Fideliza con puntos y beneficios.',
    description:
      'Hace que tus clientes vuelvan con una propuesta simple, medible y alineada a tu marca.',
    icon: ServerIcon,
  },
  {
    name: 'Personaliza la experiencia.',
    description:
      'Muestra tu negocio con identidad propia y una experiencia pensada para tus clientes.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Gestiona catalogo y canjes.',
    description:
      'Organiza productos, servicios y beneficios canjeables desde una base preparada para crecer.',
    icon: LockClosedIcon,
  },
]

export default function Features() {
  return (
    <div
      id="feac"
      className="section-shell -mt-[80px] flex scroll-mt-28 flex-col items-center overflow-hidden rounded-[2rem] bg-white/90 pt-[80px] xl:mx-[5%] xl:flex-row"
    >
      <div className="max-w-lg flex-1 p-4">
        <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          Convierte clientes ocasionales en clientes frecuentes
        </p>
        <p className="mt-6 text-lg/8 text-gray-600">
          Fidebill te ayuda a vender mas con una experiencia de fidelizacion simple,
          profesional y facil de implementar para cualquier empresa.
        </p>
        <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  aria-hidden="true"
                  className="absolute left-1 top-1 size-5 text-indigo-600"
                />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex-1">
        <img
          alt="Vista de la plataforma Fidebill"
          src="assets/Fidebill-Sistemas.png"
          className="w-full object-cover"
        />
      </div>
    </div>
  )
}

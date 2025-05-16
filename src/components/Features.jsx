import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Fidelizá a tus clientes.',
    description: 'Hacé que tus clientes vuelvan con un sistema de puntos 100% configurable.',
    icon: ServerIcon,
  },
  {
    name: 'Configurá tu aplicación.',
    description:
      'Obtené una aplicación para tus clientes, personalizable con tu logo, colores y beneficios propios.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Creá tu propio catálogo.',
    description: 'Configurá tu propio catálogo de productos y servicios canjeables por puntos.',
    icon: LockClosedIcon,
  },

]

export default function Features() {
  return (
    <div className="overflow-hidden bg-white flex items-center flex-col xl:flex-row xl:mx-[5%]">
      {/* Contenido de texto */}
      <div className="max-w-lg p-4 flex-1">
        <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          Incrementá tus ventas
        </p>
        <p className="mt-6 text-lg/8 text-gray-600">
          Al fidelizar a tus clientes de forma sencilla e intuitiva, vas a lograr que siempre vuelvan a tu negocio.
        </p>
        <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-indigo-600" />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Imagen */}
      <div className="flex-1">
        <img
          alt="Product screenshot"
          src="assets/Fidebill-Sistemas.png"
          className="w-full object-cover"
        />
      </div>
    </div>

  )
}


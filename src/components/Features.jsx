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
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              {/* <h2 className="text-base/7 font-semibold text-indigo-600">Fidelizá a tus clientes</h2> */}
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
          </div>
           <img
            alt="Product screenshot"
            src="assets/Fidebill_Facturacion.png"
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />{/*
          <img
            alt="Product screenshot"
            src="assets/Fidebill_Facturacion.png"
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          /> */}
           {/* Imagenes a la derecha */}
            <div>

            {/* Imagen de fondo (Backoffice) 
            <img
              alt="Backoffice"
              src="assets/Fidebill_Facturacion.png"
              width={2432}
              height={1442}
              className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem]"
            />*/}

            {/* Imagen encima (App Cliente)
            <img
              alt="App Cliente"
              src="assets/Fidebill_AppMovil.png"
              width={300}
              height={600}
              className="absolute w-32 sm:w-40 md:w-48 left-8 bottom-6 rounded-2xl shadow-2xl border-4 border-white"
            /> */}
            </div>
          </div>
  
      </div>
    </div>
  )
}


import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

const WhatsAppButton = () => {
  const [hover, setHover] = useState(false)

  return (
    <div
      className="fixed bottom-8 right-8 flex flex-col items-end"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className="mb-2 rounded-lg bg-gray-800 px-5 py-1 text-sm text-white shadow-lg animate-fadeIn">
          Habla con un asesor
        </div>
      )}
      <a
        href="https://wa.me/5492235484897"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar con un asesor por WhatsApp"
        className="rounded-full bg-green-500 p-3 text-white shadow-lg transition hover:bg-green-600"
      >
        <MessageCircle size={45} />
      </a>
    </div>
  )
}

export default WhatsAppButton

import { MessageCircle } from "lucide-react";
import { useState } from "react";

const WhatsAppButton = () => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="fixed bottom-8 right-8 flex flex-col items-end"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className="mb-2 px-5 py-1 bg-gray-800 text-white text-sm rounded-lg shadow-lg animate-fadeIn">
          ¡Chateá con nosotros!
        </div>
      )}
      <a
        href="https://wa.me/5492235484897"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
      >
        <MessageCircle size={45} />
      </a>
    </div>
  );
};

export default WhatsAppButton;

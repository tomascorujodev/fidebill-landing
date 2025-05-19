import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detecta el scroll para cambiar el fondo del navbar y el logo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/80 backdrop-blur-md shadow-md"
          : "bg-gray-900/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src={
              isScrolled
                ? "assets/LogoFinalFidebillBlanco.png"
                : "assets/LogoFinalFidebill.png"
            }
            className="h-8 transition-all duration-300"
            alt="FideBill"
          />
        </a>

        {/* Menú en pantallas grandes */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a href="#" className="text-white hover:text-blue-300 transition">
              Inicio
            </a>
          </li>
          <li>
            <a href="#feac" className="text-white hover:text-blue-300 transition">
              Servicios
            </a>
          </li>
          <li>
            <a href="#pricing" className="text-white hover:text-blue-300 transition">
              Precios
            </a>
          </li>
        </ul>

        {/* Botón de menú en móviles */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900/90 backdrop-blur-md">
          <ul className="flex flex-col items-center space-y-4 py-6">
            <li>
              <a
                href="#"
                className="text-white text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-white text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Servicios
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-white text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

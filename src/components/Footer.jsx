import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showImpressum, setShowImpressum] = useState(false);
  const closeModal = () => setShowImpressum(false);

  return (
    <footer className="bg-transparent text-white py-4 text-center absolute bottom-0 w-full">
      <div className="container mx-auto">
        {/* Button-Stil angepasst wie in der mobilen Ansicht */}
        <button
          onClick={() => setShowImpressum(true)}
          className="bg-glass text-xs text-white p-4 rounded-full shadow-lg"
        >
          {/* Neu: Symbol vor dem Text */}
          <span className="text-red-700">ℹ </span>Impressum
        </button>
      </div>
      {showImpressum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-sm font-bold">
              X
            </button>
            <h2 className="text-xl font-bold mb-4">Impressum</h2>
            <p>Colin Blome</p>
            <p>Buten Porten 4</p>
            <p>49584 Fürstenau</p>
            <br />
            <p>Kontakt</p>
            <p>
              E-Mail:{" "}
              <a style={{ color: "#FF5722" }} href="mailto:info@colinblome.dev">
                info@colinblome.dev
              </a>
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
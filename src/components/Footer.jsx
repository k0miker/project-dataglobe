import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showImpressum, setShowImpressum] = useState(false);
  const closeModal = () => setShowImpressum(false);

  return (
    <footer className="bg-transparent text-white py-4 text-center absolute bottom-0 w-full pointer-events-none z-50">
      <div className="container mx-auto flex flex-col items-center gap-2 pointer-events-auto">
        <div className="text-[10px] text-gray-400 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
          Data provided by <a href="https://data.worldbank.org/" target="_blank" rel="noreferrer" className="hover:text-white underline">The World Bank</a>, <a href="https://earthquake.usgs.gov/" target="_blank" rel="noreferrer" className="hover:text-white underline">USGS</a> & <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer" className="hover:text-white underline">Natural Earth</a>.
        </div>
        <button
          onClick={() => setShowImpressum(true)}
          className="bg-glass text-xs text-white px-4 py-2 rounded-full shadow-lg hover:bg-white/20 transition-colors"
        >
          <span className="text-cyan-400 mr-1">ℹ</span>Impressum & Datenschutz
        </button>
      </div>
      {showImpressum && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 pointer-events-auto backdrop-blur-sm">
          <div className="bg-slate-800 text-gray-200 p-6 rounded-lg relative max-w-md w-full border border-slate-600 shadow-2xl text-left">
            <button onClick={closeModal} className="absolute top-3 right-4 text-lg font-bold text-gray-400 hover:text-white">
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Impressum & Datenschutz</h2>
            <div className="text-sm space-y-2">
              <p><strong>Angaben gemäß § 5 TMG:</strong></p>
              <p>Colin Blome<br />Buten Porten 4<br />49584 Fürstenau</p>
              <p className="mt-2"><strong>Kontakt:</strong></p>
              <p>E-Mail: <a className="text-cyan-400 hover:underline" href="mailto:info@colinblome.dev">info@colinblome.dev</a></p>
              <p>Portfolio: <a className="text-cyan-400 hover:underline" href="https://colinblome.dev">colinblome.dev</a></p>
              <h3 className="text-lg font-bold mt-6 mb-2 text-cyan-400">Datenschutz</h3>
              <p>Diese Webseite speichert keine personenbezogenen Daten und verwendet kein Tracking (wie Google Analytics).</p>
              <p>Zur Optimierung der Ladezeiten werden abgerufene API-Daten (z.B. Geodaten, Statistiken) lokal in Ihrem Browser (Local Storage) zwischengespeichert. Diese Daten sind rein technischer Natur und lassen keinen Rückschluss auf Ihre Person zu.</p>
              <p>Die Webseite wird auf einem externen Server gehostet. Der Hosting-Anbieter speichert standardmäßig Verbindungsdaten (wie IP-Adressen) in Server-Logfiles, um die Sicherheit und den Betrieb zu gewährleisten.</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
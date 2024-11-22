import './App.css'
import GlobeComponent from './components/globe'
import Input from './components/input'
import Output from './components/output'
import { useState } from 'react';

function App() {
  const [selectedWorld, setSelectedWorld] = useState("earthDark");
  const [selectedCountry, setSelectedCountry] = useState("");

  return (
    <main className='flex justify-between w-screen h-screen '>
      <Input onSelectChange={setSelectedWorld} onCountryChange={setSelectedCountry} />
      <GlobeComponent selectedWorld={selectedWorld} />
      <Output selectedCountry={selectedCountry} />     
    </main>
  )
}

export default App

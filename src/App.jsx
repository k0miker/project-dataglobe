import './App.css'
import GlobeComponent from './components/globe'
import Input from './components/input'
import Output from './components/output'
import { useState } from 'react';

function App() {
  const [selectedWorld, setSelectedWorld] = useState("earthDark.jgp");
  const [selectedCountry, setSelectedCountry] = useState("");
  console.log("app:" + selectedWorld);

  return (
    <main className='flex justify-between w-screen h-screen '>
      <Input onWorldChange={setSelectedWorld} onCountryChange={setSelectedCountry} />
      <GlobeComponent selectedWorld={selectedWorld} />
      <Output selectedCountry={selectedCountry} />     
    </main>
  )
}

export default App

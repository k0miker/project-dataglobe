import './App.css'
import GlobeComponent from './components/globe'
import Input from './components/input'
import Output from './components/output'
import { useState } from 'react';

function App() {
  const [selectedWorld, setSelectedWorld] = useState("earthDark.jgp");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dataOption, setDataOption] = useState("gdp");
  const [showData, setShowData] = useState(true);

  return (
    <main className='flex justify-between w-screen h-screen '>
      <Input 
        onWorldChange={setSelectedWorld} 
        onCountryChange={setSelectedCountry} 
        onDataOptionChange={setDataOption} 
        onShowDataChange={setShowData} 
      />
      <GlobeComponent 
        selectedWorld={selectedWorld} 
        dataOption={dataOption} 
        showData={showData} 
        onCountrySelect={setSelectedCountry} 
      />
      <Output selectedCountry={selectedCountry} />     
    </main>
  )
}

export default App

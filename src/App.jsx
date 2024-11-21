import './App.css'
import GlobeComponent from './components/globe'
import Input from './components/input'
import Output from './components/output'
import { useState } from 'react';

function App() {
  const [selectedWorld, setSelectedWorld] = useState("earthDark");

  return (
    <main className='flex justify-between w-screen h-screen '>
      <Input onSelectChange={setSelectedWorld} />
      <GlobeComponent selectedWorld={selectedWorld} />
      <Output />     
    </main>
  )
}

export default App

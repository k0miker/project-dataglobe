import { useState } from 'react'
import './App.css'
import Globe from './components/globe'
import Input from './components/input'
import Output from './components/output'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className='flex justify-between w-screen h-screen '>
      <Input />
      <Globe />
      <Output />     
    </ main>
  )
}

export default App

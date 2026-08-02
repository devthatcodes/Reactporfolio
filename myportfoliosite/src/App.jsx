import { useState } from "react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Heroimage from "./components/Heroimage"
import Navbar from "./components/Navbar"
import Aboutme from "./components/Aboutme"
import Whatido from "./components/Whatido"    
import Latestprojects from "./components/Latestprojects"
import "./style.css"

function App() {

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#1F1F22] text-white">
      <Heroimage/>
      <Navbar/>
      <Aboutme/>
      <Whatido/>
      <Latestprojects/>
      <SpeedInsights />
    </div>  
  )
}

export default App  
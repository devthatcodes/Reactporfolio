import { useState, useEffect } from "react"
import Typewriter from "./Typewriter"
import H2herotext from "./H2herotext"

function Herotext() {

    const H1text = "Hi, My name is Deontae"   

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold text-center w-full">
            <h1><Typewriter text={H1text} speed={100} /></h1>
            <H2herotext />
        </div>
    )
}   

export default Herotext
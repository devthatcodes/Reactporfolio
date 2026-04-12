import { useState, useEffect } from "react"

function Navbar() {
    const Devname = "Deontae Word";

    return (
        <nav className="absolute top-0 left-0 w-full h-20 bg-transparent flex items-center justify-between px-12 z-50">
            <div className="text-white text-2xl font-bold tracking-wider uppercase">{Devname}</div>
            <ul className="list-none flex items-center gap-8 text-white/80 font-medium">
                <li><a href="#" className="hover:text-white transition-colors duration-300">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Projects</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
        </nav>
    )
}

export default Navbar

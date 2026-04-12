import { useState, useEffect } from "react"
import toyboxImg from "../assets/toybox.jpg"
import solusImg from "../assets/solus.png"
import keeperImg from "../assets/keeper.png"

const projects = [
    {
        id: 1,
        title: "Toybox Kids Supply CO.",
        image: toyboxImg,
    },
    {
        id: 2,
        title: "SOLUS",
        image: solusImg,
    },
    {
        id: 3,
        title: "The Keeper App",
        image: keeperImg,
    }
]

function ProjectCard({ title, image }) {
    return (
        <div className="bg-[#292A37] rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 flex flex-col">
            <div className="h-56 w-full overflow-hidden bg-gray-800">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110" 
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-md text-sm transition-colors cursor-pointer">
                    View Demo
                </button>
            </div>
        </div>
    )
}

function Latestprojects() {
    return (
        <section className="bg-[#1f1f22] text-white py-24 px-6 md:px-12 lg:px-24 w-full">
            {/* Header */}
            <div className="max-w-6xl mx-auto text-center mb-16">
                <h4 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm mb-4 text-center">Portfolio</h4>
                <h2 className="text-4xl md:text-5xl font-bold tracking-[0.1em] text-center">LATEST PROJECTS</h2>
            </div>

            {/* Projects Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.id} title={project.title} image={project.image} />
                ))}
            </div>

            {/* CTA Banner (Last Section) */}
            <div className="max-w-4xl mx-auto mt-32 bg-[#292A37] rounded-2xl py-16 px-6 text-center shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                    Have any project in mind ?
                </h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md transition-colors shadow-lg cursor-pointer">
                    Contact me
                </button>
            </div>
        </section>
    )
}

export default Latestprojects
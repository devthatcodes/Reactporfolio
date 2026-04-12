import { useState, useEffect } from "react"

function Aboutme() {

    const name = "Deontae Word"
    
    return (
        <section className="bg-[#1f1f22] text-white py-24 px-6 md:px-12 lg:px-24 w-full">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                {/* Image Side */}
                <div className="w-full md:w-1/2 relative p-4">
                    {/* Decorative bottom-left offset frame */}
                    <div className="absolute top-[30%] -left-6 -bottom-6 right-[40%] border-l-2 border-b-2 border-white z-0 rounded-bl-lg"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" 
                        alt="Workspace" 
                        className="w-full h-auto rounded-3xl relative z-10 block shadow-2xl object-cover"
                    />
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2">
                    <h4 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">About Me</h4>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">I'm {name}</h2>
                    <p className="text-gray-400 leading-relaxed mb-6 text-sm md:text-base">
                        Far far away, behind the word mountains, far from the countries
                        Vokalia and Consonantia, there live the blind texts. Separated
                        they live in Bookmarksgrove right at the coast of the Semantics,
                        a large language ocean.
                    </p>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                        Far far away, behind the word mountains, far from the countries
                        Vokalia and Consonantia, there live the blind texts. Separated
                        they live in Bookmarksgrove right at the coast of the Semantics,
                        a large language ocean.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Aboutme
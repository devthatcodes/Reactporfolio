import { useState, useEffect } from "react"

function Whatido() {
    return (
        <section className="bg-[#1f1f22] text-white py-24 px-6 md:px-12 lg:px-24 w-full">
            <div className="max-w-5xl mx-auto text-center mb-16">
                <h4 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">What I Do</h4>
                <h2 className="text-4xl md:text-5xl font-bold">SPECIALIZING IN</h2>
            </div>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 1 */}
                <div className="bg-[#292A37] rounded-xl p-8 flex flex-col justify-center shadow-lg transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 bg-[#393B4E] rounded-xl shrink-0 flex items-center justify-center p-3 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold leading-snug">Front-end <br /> Development</h3>
                    </div>
                    <p className="text-[#a1a1aa] leading-relaxed text-[15px]">
                        Lom ipsum dolo, sit amet consectetu adipisicing elit, rem voluptas sed blanditiis
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#292A37] rounded-xl p-8 flex flex-col justify-center shadow-lg transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 bg-[#393B4E] rounded-xl shrink-0 flex items-center justify-center p-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold leading-snug">UI/UX <br /> Designer</h3>
                    </div>
                    <p className="text-[#a1a1aa] leading-relaxed text-[15px]">
                        Lom ipsum dolo, sit amet consectetu adipisicing elit, rem voluptas sed blanditiis
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Whatido
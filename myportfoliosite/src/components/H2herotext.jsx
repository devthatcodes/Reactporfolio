import Typewriter from "./Typewriter"

function H2herotext() {
    const H2text = "I am a Fully Stacked Web Developer"

    return (
        <h2 className="text-2xl mt-4 font-medium text-gray-200">
            <Typewriter text={H2text} speed={100} delay={2500} />
        </h2>
    )
}

export default H2herotext

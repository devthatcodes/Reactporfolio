import { useState, useEffect } from "react"

const Typewriter = ({text, speed = 100, delay = 0}) => {
    const [displayedText, setDisplayedText] = useState("")
    const [index, setIndex] = useState(0)
    const [isWaiting, setIsWaiting] = useState(delay > 0)

    useEffect(() => {
        if (delay > 0) {
            const waitTimer = setTimeout(() => setIsWaiting(false), delay)
            return () => clearTimeout(waitTimer)
        }
    }, [delay])

    useEffect(() => {
        if (!isWaiting && index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[index])
                setIndex(prev => prev + 1)
            }, speed)
            return () => clearTimeout(timeout)
        }
    }, [index, text, speed, isWaiting])

    return <span>{displayedText}</span>
}

export default Typewriter
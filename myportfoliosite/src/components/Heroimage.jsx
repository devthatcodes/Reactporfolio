import Herotext from "./Herotext"
import react_hero_bg from "../assets/react_hero_bg.png"

function Heroimage() {
    return (
        <div 
          className="relative w-full h-screen bg-cover bg-center" 
          style={{ backgroundImage: `url(${react_hero_bg})` }}
        >
          <Herotext />

        </div>
    )
}

export default Heroimage


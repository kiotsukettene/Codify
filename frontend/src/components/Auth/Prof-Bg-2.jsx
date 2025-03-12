import React from 'react'
import Astro from "../../assets/picture/random-background/Astro.png"
import FiveStar from "../../assets/picture/random-background/FiveStar.png"
import FourStar from "../../assets/picture/random-background/FourStar.png"
import PinkStar from "../../assets/picture/random-background/PinkStar.png"
import VioletStar from "../../assets/picture/random-background/VioletStar.png"
import SpaceShip from "../../assets/picture/random-background/SpaceShip.png"
import Waves from "../../assets/picture/random-background/Waves.png"
import logo from "../../assets/picture/logos/logo.png"

const ProfBg2= () => {
  return (
    <div>
       {/* Background Images */}
       <img 
              src={logo}
              alt="Logo" 
              className="absolute top-28 lg:top-7 left-24 lg:left-10 lg:w-28" 
            />
            <img
              src={Astro}
              alt="Mascot"
              className="absolute top-10 right-[-120px] w-60 lg:w-96 opacity-90 -rotate-12"
            />
            <img
              src={FiveStar}
              alt="Five Star"
              className="absolute top-32 lg:top-60 left-80 lg:left-52 w-5 lg:w-12 opacity-90"
            />
            <img
              src={FiveStar}
              alt="Five Star"
              className="absolute top-20 lg:top-32 right-80 lg:right-96 w-20 lg:w-16 opacity-90"
            />
            <img
              src={FourStar}
              alt="Four Star"
              className="absolute bottom-[10px] right-0 w-20 lg:w-64 opacity-90 rotate-45"
            />
            <img
              src={PinkStar}
              alt="Star"
              className="absolute top-2/4 left-32 w-5 lg:w-10"
            />
            <img
              src={PinkStar}
              alt="Star"
              className="absolute top-2/4 right-52 w-5 lg:w-10"
            />
            <img
              src={PinkStar}
              alt="Star"
              className="absolute bottom-36 right-72 w-5 lg:w-20"
            />
            <img
              src={VioletStar}
              alt="Star"
              className="absolute top-24 left-[-90px] w-10 lg:w-52"
            />
            <img
              src={SpaceShip}
              alt="Spaceship"
              className="absolute bottom-4 lg:bottom-32 left-32 w-36 lg:w-52"
            />
            <img
              src={Waves}
              alt="wave"
              className="absolute bottom-0 left-0 w-52 lg:w-72"
            />
    </div>
  )
}

export default ProfBg2

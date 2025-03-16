import React from 'react'

import union from "@/assets/picture/random-background/union.png"
import pinkFlower from "@/assets/picture/random-background/pink-flower.png"
import blueFlower from "@/assets/picture/random-background/blue-flower.png"
import purpleFlower from "@/assets/picture/random-background/purple-flower.png"
import arrow from "@/assets/picture/random-background/arrow.png"
import mascot from "@/assets/picture/random-background/mascot.png"
import logo from "@/assets/picture/logos/logo.png"



const ProfBg1 = () => {
  return (
    <div>
        {/* Background Images */}
           
            <img 
              src={pinkFlower}
              alt="Pink Flower" 
              className="absolute top-16 lg:top-32 left-[-28px] w-16 lg:w-32 opacity-90"
            />
            <img 
              src={purpleFlower}
              alt="Purple Flower" 
              className="absolute bottom-[100px] left-[-30px] w-20 lg:w-52 opacity-90"
            />
            <img 
              src={blueFlower}
              alt="Blue Flower" 
              className="absolute top-[250px] right-[-30px] w-16 lg:w-56 opacity-90"
            />
            <img 
              src={union}
              alt="Star" 
              className="absolute top-10 right-96 w-10 lg:w-52"
            />
            <img 
              src={arrow}
              alt="Arrow" 
              className="absolute top-10 left-24 w-10 lg:w-52"
            />
            <img 
              src={arrow}
              alt="Arrow" 
              className="absolute bottom-20 left-44 w-10 lg:w-52"
            />
            <img 
              src={arrow}
              alt="Arrow" 
              className="absolute bottom-20 right-0 w-20 lg:w-72 rotate-180"
            />
            <img 
              src={mascot}
              alt="Mascot" 
              className="absolute bottom-[-150px] right-[-100px] w-72 lg:w-96"
            />
    </div>
  )
}

export default ProfBg1

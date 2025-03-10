import GalaxyButton from "@/components/ui/galaxyButton";
import React from "react";
import sampleImg from "../../assets/picture/random background/sample_img.png";
import VariableFontHoverByRandomLetter from "@/fancy/components/text/variable-font-hover-by-random-letter";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Compare } from "@/components/ui/compare";
import BrandsComponent from "@/components/ui/brands";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import {
  BellIcon,
  CalendarIcon,
  FileInputIcon,
  FileTextIcon,
  GlobeIcon,
} from "lucide-react";

import codeEditor from '../../assets/picture/banners/code-editor.png'

const features = [
  {
    Icon: FileTextIcon,
    name: "Gamified Learning ",
    description: "We automatically save your files as you type.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: FileInputIcon,
    name: "Built-in Coding Environment",
    description: "Practice real-time.",
    href: "/",
    cta: "Learn more",
    background: <img src={codeEditor} className="absolute opacity-100 p-4" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Live Video Sessions ",
    description: "Collaborate with others.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: " Code Battles & Challenge",
    description: "Compete and improve.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Personalized Learning Paths",
    description:
      "Tailored courses.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

function LandingPage() {
  const Statistic = ({ number, title, description }) => {
    return (
      <div className="flex flex-col items-start">
        <h3 className="text-[2.5rem] font-bold text-[#FF5D3A]">{number}</h3>
        <p className="text-gray-900 font-semibold mt-4 text-lg">{title}</p>
        <p className="text-gray-500 mt-2 leading-relaxed">{description}</p>
      </div>
    );
  };
  return (
    <main className=" bg-neutral-50">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-16  bg-gradient-to-b from-indigo-700 via-purple-400 to-pink-200">
        <div className="container mx-auto">
          {/* Hero Title & Subtitle */}
          <h1 className="text-5xl md:text-7xl font-bold max-w-3xl  mx-auto text-white font-hero tracking-wide [text-shadow:0px_0px_10px_rgba(255,255,255,0.3)]">
            The platform where every aspiring coder can thrive
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mt-4">
            Where challenges transform into achievements.
          </p>

          {/* Call to Action Button */}
          {/* <button className="mt-6 px-6 py-3 text-lg font-semibold bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-200 transition">
      Get Started
    </button> */}
          <GalaxyButton className="mt-6 px-6 py-3 text-lg font-semibold bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-200 transition">
            Get Started
          </GalaxyButton>

          {/* The Box (Mockup) */}
          <div className="relative mt-16 mx-auto max-w-4xl w-full p-4 rounded-3xl border border-white/40 bg-white/40 backdrop-blur-lg shadow-[0px_0px_60px_20px_rgba(255,255,255,0.2)]">
            <div className="absolute inset-0 bg-white/10 blur-2xl opacity-20 rounded-3xl"></div>
            <img
              src={sampleImg}
              alt="Mockup"
              className="relative w-full rounded-2xl shadow-[0px_0px_40px_10px_rgba(255,255,255,0.3)]"
            />
          </div>
        </div>
      </section>
      <BrandsComponent />

      {/* Content to enable scrolling */}

      <section className="mt-[-8rem] pt-0 bg-neutral-50 ">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side - Text Content */}
          <div className="w-full md:w-1/2 p-6 lg:p-12">
            <div className="max-w-2xl mx-auto">
              <div className="w-full items-center justify-start flex">
                <VariableFontHoverByRandomLetter
                  label="Let's Go!"
                  staggerDuration={0.03}
                  className="text-4xl sm:text-5xl md:text-7xl cursor-pointer"
                  fromFontVariationSettings="'wght' 400, 'slnt' 0"
                  toFontVariationSettings="'wght' 900, 'slnt' 0"
                />
              </div>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Experience the elegance of beautifully handcrafted templates
                designed to elevate your digital presence.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xl">🎨</span>
                  <p>Beautifully Handcrafted Templates</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl">🚀</span>
                  <p>Seamlessly Integrated Marketing</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl">📱</span>
                  <p>Fully Responsive Design</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl">📱</span>
                  <p>Fully Responsive Design</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Mockup */}
          <div className="w-full md:w-1/2 ">
            <ContainerScroll
            // titleComponent={
            //   <>
            //     <h1 className="text-4xl font-semibold text-black dark:text-white">
            //       Unleash the power of <br />
            //       <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">Scroll Animations</span>
            //     </h1>
            //   </>
            // }
            >
              <img
                src={sampleImg}
                alt="hero"
                className="w-full h-full object-cover object-left-top"
                draggable={false}
              />
            </ContainerScroll>
          </div>
        </div>
      </section>

      <section className="max-w-fit w-full min-h-screen mx-auto py-2 px-6 bg-neutral-50">
        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </section>

  

      <section className="min-h-screen bg-neutral-50 py-8 flex justify-center items-center">
        <div className="p-4 flex justify-center items-center border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 px-4 max-w-4xl mx-auto">
          <Compare
            firstImage="https://assets.aceternity.com/code-problem.png"
            secondImage="https://assets.aceternity.com/code-solution.png"
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="h-[400px] w-[300px] md:h-[500px] md:w-[600px]"
            slideMode="hover"
          />
        </div>
      </section>














          {/* <section className="min-h-screen bg-white px-4 md:p-24">
<div className="flex flex-col overflow-hidden pb-[500px] ">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img
          src={sampleImg}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
</section> */}
    </main>

    
  );
}

export default LandingPage;

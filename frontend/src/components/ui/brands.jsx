function BrandsComponent() {
  const brands = [
    {
      name: "JavaScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    {
      name: "Java",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    },
    {
      name: "C++",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    },
    
    {
      name: "Python",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      name: "HTML5",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    },
    {
      name: "C#",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    },
  ]

  return (
    <div className="w-full pt-6 ">
      <div className="container mx-auto px-4">
      <h2 className="text-lg font-medium text-center text-gray-800 mb-10">
          Learn, Build, and Innovate with These Technologies
        </h2>        <div className="flex flex-wrap justify-center items-center gap-20 md:gap-16 lg:gap-20">
          {brands.map((brand) => (
            <div key={brand.name} className="group relative flex items-center justify-center">
              <img
                src={brand.icon || "/placeholder.svg"}
                alt={`${brand.name} logo`}
                className="h-10 w-10 md:h-16 md:w-16 object-contain transition-all duration-300 
                         filter grayscale opacity-60 "
              />
             
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BrandsComponent


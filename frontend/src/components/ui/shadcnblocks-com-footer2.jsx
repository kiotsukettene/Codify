import Logo from '../../assets/picture/logos/Logo.png'


const Footer2 = ({
  logo = {
    
    src: Logo,
    alt: "Codify",
    // title: "Codify.com",
    url: "",
  },

  // tagline = "Level Up Your Learning. One code at a time.",

  menuItems = [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Features", url: "#" },
        { text: "Integrations", url: "#" },
        { text: "Pricing", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#" },
        { text: "Team", url: "#" },
        { text: "Blog", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Contact", url: "#" },
        { text: "Privacy", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help", url: "#" },
        { text: "Advertise", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "LinkedIn", url: "#" },
      ],
    },
  ],

  copyright = "© 2025 Copyright. All rights reserved.",

  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ]
}) => {
  return (
    (
      <section className="relative w-full ">
      <div className="container mx-auto px-6">
        
       <div className="flex flex-row justify-between">
         {/* Logo & Tagline */}
         <div className="w-1/4 flex flex-col  text-center justify-start items-start">
          <img src={logo.src} alt="Codify Logo" className="h-14 hover:scale-110 transition-transform" />
          <p className="text-md font-medium mt-2 tracking-wide text-white/80">
            Level Up Your Learning. One Code at a Time.
          </p>
        </div>
    
        {/* Footer Links */}
        <div className="w-3/4 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 text-center">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h3 className="mb-4 font-semibold text-purple-400 flex items-center justify-center gap-2">
                <span className="text-lg">⚡</span> {section.title}
              </h3>
              <ul className="space-y-2 text-white/60">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="hover:text-white transition duration-200">
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
       </div>
   
        {/* Bottom Links & Copyright */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 Codify. All rights reserved.</p>
          <div className="flex space-x-6">
            {bottomLinks.map((link, linkIdx) => (
              <a 
                key={linkIdx} 
                href={link.url} 
                className="px-4 py-2 bg-gray-800/50 hover:bg-purple-500/40 transition rounded-full"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
    
      </div>
    </section>
    
    )
  );
};

export { Footer2 };

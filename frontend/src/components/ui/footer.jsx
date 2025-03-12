import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Linkedin, ArrowRight, Heart, MapPin, Mail, Book, Globe, Box } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

export default function Footer() {
  return (
    <footer className="bg-[#1a061f] text-white max-w-7xl mx-auto rounded-3xl py-8 px-6 md:px-12">
      {/* Top section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Branding & Mission (Left Section) */}
        <div className="space-y-3 md:max-w-xs">
          <div className="space-y-1">
            <h3 className="text-base font-medium">Support</h3>
            <a href="mailto:support@codify.com" className="flex items-center gap-1.5 text-sm hover:underline">
              <Mail className="h-3.5 w-3.5" />
              support@codify.com
            </a>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-medium">Location</h3>
            <p className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5" />
              Caloocan City, Philippines
            </p>
          </div>
        </div>

        {/* Vertical separator - visible on desktop */}
        <div className="hidden md:block">
          <Separator orientation="vertical" className="h-40 bg-gray-700" />
        </div>

        {/* Quick Links (Middle Section) */}
        <div className="space-y-4 md:min-w-[280px]">
          <div className="space-y-1">
            <h3 className="text-base font-medium flex gap-2"> <Box className="text-primary"/> Product</h3>
            <div className="flex flex-wrap gap-x-2 text-sm">
              <a href="#" className="hover:underline">
                Overview
              </a>{" "}
              |
              <a href="#" className="hover:underline">
                Features
              </a>{" "}
              |
              <a href="#" className="hover:underline">
                Pricing
              </a>{" "}
              |
              <a href="#" className="hover:underline">
                Code Battles
              </a>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-medium flex gap-2"><Book className="text-primary"/> Resources</h3>
            <div className="flex flex-wrap gap-x-2 text-sm">
              <a href="#" className="hover:underline">
                Help
              </a>{" "}
              |
              <a href="#" className="hover:underline">
                FAQs
              </a>{" "}
              |
              <a href="#" className="hover:underline">
                Tutorials
              </a>{" "}
              |
              <a href="#" className="hover:underline">
                API Docs
              </a>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-medium flex gap-2"><Globe className="text-primary"/> Community</h3>
            <div className="flex flex-wrap gap-x-2 text-sm">
              <a href="#" className="hover:underline">
                Blog
              </a>{" "}
              |
              <a href="#" className="hover:underline">
                Forum
              </a>{" "}
              |
              <a href="#" className="hover:underline">
                Leaderboard
              </a>
            </div>
          </div>
        </div>

        {/* Vertical separator - visible on desktop */}
        <div className="hidden md:block">
          <Separator orientation="vertical" className="h-40 bg-gray-700" />
        </div>

        {/* Social Media & Contact (Right Section) */}
        <div className="space-y-6">
          {/* Social Media */}
          <div className="flex gap-3">
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>

          {/* Contact Us Button */}
          <Button
            className="rounded-full bg-primary  text-white hover:bg-white hover:text-black transition-all  hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] w-full"
          >
            Contact Us <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

         
        </div>
      </div>

      {/* Separator */}
      <Separator className="my-6 bg-gray-800" />

      {/* Bottom section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo and Tagline */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5">
              <span className="absolute inset-0 flex items-center justify-center text-lg">✻</span>
            </div>
            <span className="text-lg font-mono tracking-wider">Codify</span>
          </div>
          <div className="text-xs text-gray-400 max-w-xs">
            <p>Level Up Your Learning. One Code at a Time.</p>
            <p className="mt-1">Empowering coders through interactive challenges & real-time learning.</p>
          </div>
        </div>

        {/* Made by love */}
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 fill-current" />
          <span className="text-sm">Powered by passion, driven by code.</span>
        </div>
      </div>
    </footer>
  )
}


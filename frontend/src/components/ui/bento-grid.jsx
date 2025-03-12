import { cn } from "@/lib/utils"

// Import your images
import codeEditor from "../../assets/picture/banners/code-editor.png"
import videoConference from "../../assets/picture/banners/Video-Conference.png"
import Task from "../../assets/picture/banners/Task.png"
import course from "../../assets/picture/banners/course.png"
import codeBattle from '../../assets/picture/banners/code-battle.png'

const BentoGrid = ({ children, className }) => {
  return <div className={cn("grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>{children}</div>
}

const BentoCard = ({
  title,
  description,
  className,
  icon: Icon,
  children,
  href = "#",
  glowColor = "rgba(139, 92, 246, 0.5)",
}) => (
  <div
    className={cn(
      "group relative flex flex-col overflow-hidden rounded-xl bg-white p-6",
      "border border-neutral-200 shadow-sm transition-all duration-300",
      "hover:shadow-lg hover:shadow-[var(--glow-color)]",
      "dark:bg-neutral-950 dark:border-neutral-800",
      className,
    )}
    style={{ "--glow-color": glowColor }}
  >
    <div className="flex items-center gap-2 mb-2">
      {Icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#521a80] text-white relative overflow-hidden group-hover:scale-110 transition-all duration-300 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/40 transition-colors duration-300"></div>
          <Icon className="h-6 w-6 relative z-10 group-hover:text-white transition-colors duration-300" />
        </div>
      )}
    </div>

    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1 animate-text-reveal">{title}</h3>

    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 animate-text-fade-in">{description}</p>

    <div className="mt-auto">{children}</div>
  </div>
)

// Learning platform specialized cards
const GamifiedLearningCard = ({ className }) => (
  <BentoCard
    title="🚀 Gamified Learning"
    description="Earn XP, badges, and rankings as you progress through your learning journey"
    className={className}
    glowColor="rgba(234, 88, 12, 0.5)"
    icon={({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 15L8.5 12L12 9L15.5 12L12 15Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 20.5L3 17.5L6 14.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 20.5L21 17.5L18 14.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  >
    <div className="mt-4 relative h-48 overflow-hidden rounded-lg transform transition-transform duration-500 group-hover:scale-[1.02]">
      <img
        src={Task || "/placeholder.svg"}
        alt="Gamified Learning"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = "/placeholder.svg?height=200&width=400"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition-all duration-300">
            XP
          </div>
          <div className="text-sm font-medium">Level up your skills</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Badges
          </span>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Leaderboards
          </span>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Achievements
          </span>
        </div>
      </div>
    </div>
  </BentoCard>
)

const CodingEnvironmentCard = ({ className }) => (
  <BentoCard
    title="💻 Built-in Coding Environment"
    description="Practice real-time with our integrated development environment"
    className={className}
    glowColor="rgba(59, 130, 246, 0.5)"
    icon={({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 18L22 12L16 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  >
    <div className="mt-4 relative h-48 overflow-hidden rounded-lg transform transition-transform duration-500 group-hover:scale-[1.02]">
      <img
        src={codeEditor || "/placeholder.svg"}
        alt="Coding Environment"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = "/placeholder.svg?height=200&width=400"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
            &lt;/&gt;
          </div>
          <div className="text-sm font-medium">Code in your browser</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Multiple Languages
          </span>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Auto-save
          </span>
        </div>
      </div>
    </div>
  </BentoCard>
)

const VideoSessionsCard = ({ className }) => (
  <BentoCard
    title="📹 Live Video Sessions"
    description="Learn from experts through interactive live sessions"
    className={className}
    glowColor="rgba(239, 68, 68, 0.5)"
    icon={({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M23 7L16 12L23 17V7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  >
    <div className="mt-4 relative h-48 overflow-hidden rounded-lg transform transition-transform duration-500 group-hover:scale-[1.02]">
      <img
        src={videoConference || "/placeholder.svg"}
        alt="Live Video Sessions"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = "/placeholder.svg?height=200&width=400"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300">
            LIVE
          </div>
          <div className="text-sm font-medium">Expert-led sessions</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Interactive
          </span>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Chat Support
          </span>
        
        </div>
      </div>
    </div>
  </BentoCard>
)

const CodeBattlesCard = ({ className }) => (
  <BentoCard
    title="🔥 Code Battles & Challenges"
    description="Compete and improve your skills through challenges"
    className={className}
    glowColor="rgba(139, 92, 246, 0.5)"
    icon={({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.5 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V7.5L14.5 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9 15L12 12L15 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  >
    <div className="mt-4 relative h-48 overflow-hidden rounded-lg transform transition-transform duration-500 group-hover:scale-[1.02]">
      <img
        src={codeBattle}
        alt="Code Battles"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
            VS
          </div>
          <div className="text-sm font-medium">Compete to win</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Daily Challenges
          </span>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Tournaments
          </span>
        </div>
      </div>
    </div>
  </BentoCard>
)

const PersonalizedLearningCard = ({ className }) => (
  <BentoCard
    title="🎯 Course Management"
    description="Follow tailored courses designed for your skill level and goals"
    className={className}
    glowColor="rgba(16, 185, 129, 0.5)"
    icon={({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 4L12 14.01L9 11.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  >
    <div className="mt-4 relative h-48 overflow-hidden rounded-lg transform transition-transform duration-500 group-hover:scale-[1.02]">
      <img
        src={course || "/placeholder.svg"}
        alt="Course Management"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = "/placeholder.svg?height=200&width=400"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-all duration-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 4L12 14.01L9 11.01"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-sm font-medium">Tailored for you</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Modules And Lessons
          </span>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
            Different Courses
          </span>
        </div>
      </div>
    </div>
  </BentoCard>
)

export {
  BentoGrid,
  BentoCard,
  GamifiedLearningCard,
  CodingEnvironmentCard,
  VideoSessionsCard,
  CodeBattlesCard,
  PersonalizedLearningCard,
}


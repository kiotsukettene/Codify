// Mock data for badges

import badge1 from "@/assets/picture/achievements/badge1.png"
import badge2 from "@/assets/picture/achievements/badge2.png"
import badge3 from "@/assets/picture/achievements/badge3.png"
import badge4 from "@/assets/picture/achievements/badge4.png"
import badge5 from "@/assets/picture/achievements/badge5.png"
import badge6 from "@/assets/picture/achievements/badge6.png"
import badge7 from "@/assets/picture/achievements/badge7.png"
import badge8 from "@/assets/picture/achievements/badge8.png"
import badge9 from "@/assets/picture/achievements/badge9.png"
import badge10 from "@/assets/picture/achievements/badge10.png"
import badge11 from "@/assets/picture/achievements/badge11.png"
import badge12 from "@/assets/picture/achievements/badge12.png"
import badge13 from "@/assets/picture/achievements/badge13.png"
import badge14 from "@/assets/picture/achievements/badge14.png"
import badge15 from "@/assets/picture/achievements/badge15.png"

const badges = [
  {
    id: "code-champion",
    name: "Code Champion",
    description: "Achieved victory in a coding battle with impressive skills!",
    image: badge1,
    color: "#FFA500", // Orange
    requiredPoints: 100,
    rarity: "common",
  },
  {
    id: "syntax-master",
    name: "Syntax Master",
    description: "Demonstrated exceptional command of coding syntax and structure.",
    image: badge2,
    color: "#8A2BE2", // Purple
    requiredPoints: 200,
    rarity: "uncommon",
  },
  {
    id: "debugger-extraordinaire",
    name: "Debugger Extraordinaire",
    description: "Successfully identified and fixed complex bugs with remarkable efficiency.",
    image: badge7,
    color: "#B22222", // Firebrick red
    requiredPoints: 300,
    rarity: "rare",
  },
  {
    id: "algorithm-ace",
    name: "Algorithm Ace",
    description: "Mastered complex algorithms and implemented them flawlessly.",
    image: badge3,
    color: "#1F7D53",
    requiredPoints: 400,
    rarity: "rare",
  },
  {
    id: "battle-veteran",
    name: "Battle Veteran",
    description: "Participated in multiple coding battles and emerged victorious.",
    image: badge4,
    color: "#A5158C",
    requiredPoints: 150,
    rarity: "uncommon",
  },
  {
    id: "challenge-enthusiast",
    name: "Challenge Enthusiast",
    description: "Completed a variety of coding challenges with enthusiasm.",
    image: badge5, // Placeholder
    color: "#EC7FA9",
    requiredPoints: 250,
    rarity: "uncommon",
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Showcased potential and promise in coding battles.",
    image: badge13,
    color: "#7886C7",
    requiredPoints: 350,
    rarity: "rare",
  },
  {
    id: "critical-thinker",
    name: "Critical Thinker",
    description: "Demonstrated exceptional problem-solving skills under pressure.",
    image: badge10,
    color: "#644A07",
    requiredPoints: 300,
    rarity: "rare",
  },
  {
    id: "legendary-coder",
    name: "Legendary Coder",
    description: "Achieved legendary status in coding battles with unmatched skills.",
    image: badge12,
    color: "#9B3922",
    requiredPoints: 400,
    rarity: "epic",
  },
  {
    id: "tactical-genius",
    name: "Tactical Genius",
    description: "Formulated and executed brilliant strategies in coding battles.",
    image: badge15,
    color: "#A62C2A",
    requiredPoints: 350,
    rarity: "rare",
  },
  {
    id: "optimization-wizard",
    name: "Optimization Wizard",
    description: "Optimized code for performance and efficiency like a wizard.",
    image: badge8,
    color: "#526D82",
    requiredPoints: 450,
    rarity: "epic",
  },
  {
    id: "speed-coder",
    name: "Speed Coder",
    description: "Completed coding challenges in record time.",
    image: badge14,
    color: "#7A1CAC",
    requiredPoints: 400,
    rarity: "rare",
  },
  {
    id: "flawless-victory",
    name: "Flawless Victory",
    description: "Achieved a perfect score in a coding battle without any mistakes.",
    image: badge11,
    color: "#FE6E00",
    requiredPoints: 350,
    rarity: "rare",
  },
  {
    id: "creative-coder",
    name: "Creative Coder",
    description: "Demonstrated creativity and innovation in coding solutions.",
    image: badge6,
    color: "#161179",
    requiredPoints: 500,
    rarity: "legendary",
  },
  {
    id: "code-conqueror",
    name: "Code Conqueror",
    description: "Conquered all coding challenges with exceptional skill.",
    image: badge9,
    color: "#E53888",
    requiredPoints: 1000,
    rarity: "legendary",
  },
]

// Helper function to get badge by ID
export const getBadgeById = (id) => {
  return badges.find((badge) => badge.id === id) || badges[0] // Default to first badge if not found
}

// Helper function to get badge by points
export const getBadgeByPoints = (points) => {
  // Find the highest badge the user qualifies for
  const qualifiedBadges = badges.filter((badge) => points >= badge.requiredPoints)
  if (qualifiedBadges.length === 0) return badges[0] // Default to first badge

  // Sort by required points (descending) and return the highest one
  return qualifiedBadges.sort((a, b) => b.requiredPoints - a.requiredPoints)[0]
}

// Helper function to get all badges
export const getAllBadges = () => {
  return badges
}

// Helper function to get user's earned badges
export const getEarnedBadges = (userPoints) => {
  return badges.filter((badge) => userPoints >= badge.requiredPoints)
}

export default badges
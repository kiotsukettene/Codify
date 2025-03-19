import { useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import confetti from "canvas-confetti";

// Cute emoji icons for each card
const cardConfig = [
  {
    emoji: "🏆",
    label: "Total Wins",
    value: "15",
    color: "bg-pink-100",
    accent: "text-pink-500",
    border: "border-pink-300",
    mascot: "🐰",
    description: "You're doing amazing! Keep collecting those wins!",
  },
  {
    emoji: "⭐",
    label: "Win Rate",
    value: "85%",
    color: "bg-blue-100",
    accent: "text-blue-500",
    border: "border-blue-300",
    mascot: "🐳",
    description: "Wow! You're in the top players with this win rate!",
  },
  {
    emoji: "🎮",
    label: "Total Battles",
    value: "24",
    color: "bg-green-100",
    accent: "text-green-500",
    border: "border-green-300",
    mascot: "🐸",
    description: "Every battle makes you stronger and more experienced!",
  },
];

// Cute decorative elements
const Decorations = ({ color }) => {
  return (
    <>
      {/* Stars */}
      <motion.div
        className={`absolute -top-2 -right-2 ${color} rounded-full w-5 h-5 flex items-center justify-center text-xs`}
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✨
      </motion.div>

      {/* Hearts */}
      <motion.div
        className="absolute bottom-4 left-4 text-xs"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        💖
      </motion.div>

      {/* Dots */}
      <div className="absolute top-6 right-6 flex space-x-1">
        {[0, 0.2, 0.4].map((delay, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${color}`}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              duration: 1,
              delay: delay,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </>
  );
};

// Confetti effect
const useConfetti = (ref) => {
  const triggerConfetti = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 30,
        spread: 70,
        origin: { x, y },
        colors: ["#FDA4AF", "#93C5FD", "#86EFAC", "#FDE68A", "#C4B5FD"],
        shapes: ["circle", "square"],
        scalar: 0.7,
        gravity: 1.2,
        ticks: 100,
      });
    }
  };

  return triggerConfetti;
};

const CuteCard = ({ emoji, label, value, color, accent, border, mascot, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const triggerConfetti = useConfetti(cardRef);
  const controls = useAnimationControls();

  const handleHover = () => {
    setIsHovered(true);
    controls.start({
      rotate: [0, -2, 2, -1, 1, 0],
      transition: { duration: 0.5 },
    });
  };

  const handleClick = () => {
    triggerConfetti();
    controls.start({
      scale: [1, 0.95, 1.05, 1],
      transition: { duration: 0.4 },
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${color} ${border} border-2 rounded-3xl p-6 shadow-md overflow-hidden`}
      style={{
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.06)",
        transform: "rotate(-1deg)",
      }}
      whileHover={{
        y: -10,
        rotate: "1deg",
        boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
      }}
      animate={controls}
      onHoverStart={handleHover}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      initial={{ y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cute decorations */}
      <Decorations color={color} />

      {/* Emoji icon */}
      <motion.div
        className="text-3xl"
        animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
        transition={{ duration: 0.5 }}
      >
        {emoji}
      </motion.div>

      {/* Value with wiggle effect */}
      <motion.h2
        className={`text-6xl font-bold mb-2 font-nunito ${accent}`}
        animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.h2>

      {/* Label */}
      <p className="text-gray-600 font-nunito text-lg mb-3">{label}</p>

      {/* Mascot and description on hover */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="flex items-center mt-2 mb-1">
          <span className="text-2xl mr-2">{mascot}</span>
          <p className="text-sm text-gray-500 font-nunito">{description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StudentStatCards = () => {
  return (
    <div className="py-16 ">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-nunito font-bold text-header relative inline-block">
            Your Gaming Stats
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto font-nunito">
            Look at all your amazing achievements! Keep playing to earn more! ✨
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {cardConfig.map((card, index) => (
            <CuteCard
              key={index}
              emoji={card.emoji}
              label={card.label}
              value={card.value}
              color={card.color}
              accent={card.accent}
              border={card.border}
              mascot={card.mascot}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentStatCards;

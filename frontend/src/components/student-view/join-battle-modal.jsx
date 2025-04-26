import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import purpleCloud from '@/assets/picture/random-background/code-battle-header-2.png';
import useBattleStore from "@/store/battleStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const JoinBattleModal = ({ isOpen, onClose, initialBattleCode = "" }) => {
  const [battleCode, setBattleCode] = useState(initialBattleCode);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { joinBattle } = useBattleStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setBattleCode("");
      setJoinSuccess(false);
      setError("");
    } else if (initialBattleCode) {
      setBattleCode(initialBattleCode);
    }
  }, [isOpen, initialBattleCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setJoinSuccess(false);
    setError("");

    try {
      await joinBattle(battleCode);
      setJoinSuccess(true);
      toast.success("Successfully joined the battle!");
      
      // Wait for a moment to show success state
      setTimeout(() => {
        onClose();
        navigate(`/student/code-battle/lobby/${battleCode}`);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to join battle. Please check your code and try again.");
      toast.error(err.message || "Failed to join battle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#151135] border-none shadow-none text-white overflow-hidden">
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-semibold">Enter Battle Code</DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter the code provided by your professor to join this battle.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="relative">
            <Input
              type="text"
              value={battleCode}
              onChange={(e) => setBattleCode(e.target.value)}
              placeholder="Enter battle code"
              className={`bg-opacity-10 text-white placeholder-gray-400 bg-[#2A2557] border-[#654ff0] focus:ring-[#9c88ff] ${
                error ? "animate-shake border-red-500" : ""
              }`}
              autoFocus
            />
            {isLoading ? null : error ? (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
            ) : joinSuccess ? (
              <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            ) : null}
          </div>

          {error && <p className="text-red-500 text-center font-medium">{error}</p>}
          {joinSuccess && (
            <p className="text-green-500 text-center font-medium">Successfully joined the battle!</p>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onClose} className="text-white bg-[#2A2557] hover:bg-[#3A3567]">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !battleCode.trim()} 
              className="bg-[#654ff0] hover:bg-[#7b66ff] disabled:bg-[#2A2557]"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Join Battle"}
            </Button>
          </div>
        </form>

        <div className="absolute bottom-0 left-0 w-full opacity-10">
          <img src={purpleCloud} alt="Decorative Background" className="w-full object-cover" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinBattleModal;
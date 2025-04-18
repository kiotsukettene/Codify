import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useBattleStore from "@/store/battleStore";
import CreateBattle from "./Create-Battle";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditBattle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { battles, isLoadingBattles, battlesError, fetchBattles, setBattleData } = useBattleStore();
  const [battleNotFound, setBattleNotFound] = useState(false);

  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  useEffect(() => {
    if (!isLoadingBattles && !battlesError) {
      const battle = battles.find((b) => b.id === id);
      if (battle) {
        setBattleData({
          title: battle.challenge || "",
          description: battle.description?.split(" | ")[0] || "",
          duration: battle.description?.match(/(\d+) minutes/) ? parseInt(battle.description.match(/(\d+) minutes/)[1]) : 30,
          commencement: battle.commencement ? new Date(battle.commencement).toISOString().slice(0, 16) : "",
          courseId: battle.course?.id || "",
          program: battle.course?.program || "",
          section: battle.course?.section || "",
          player1: battle.challengers?.[0]?.id || "",
          player2: battle.challengers?.[1]?.id || "",
          challenges: battle.challenges || [{ problemTitle: "", problemDescription: "", points: 100, inputConstraints: ["", "", ""], expectedOutput: ["", "", ""] }],
          rules: battle.rules || "",
        });
        setBattleNotFound(false);
      } else {
        setBattleNotFound(true);
      }
    }
  }, [battles, id, isLoadingBattles, battlesError, setBattleData]);

  if (isLoadingBattles) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (battlesError) {
    return (
      <div className="flex flex-col items-center text-red-500">
        <AlertCircle className="h-6 w-6 mb-2" />
        <p>{battlesError}</p>
        <Button onClick={fetchBattles} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (battleNotFound) {
    return (
      <div className="flex flex-col items-center text-red-500">
        <AlertCircle className="h-6 w-6 mb-2" />
        <p>Battle not found</p>
        <Button onClick={() => navigate("/professor/code-battle")} className="mt-2">
          Back to Battles
        </Button>
      </div>
    );
  }

  return <CreateBattle isEditMode={true} battleId={id} />;
};

export default EditBattle;
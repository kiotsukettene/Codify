import React, { useEffect } from "react";
import CreateBattle from "./Create-Battle";
import useBattleStore from "@/store/battleStore";
import { useParams } from "react-router-dom";

const EditBattle = () => {
  const { id } = useParams();
  const { battles, setBattleData, fetchBattles } = useBattleStore();

  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  useEffect(() => {
    const battle = battles.find((b) => b.id === id);
    if (battle) {
      setBattleData({
        title: battle.challenge,
        description: battle.description.split(" | ")[0], // Extract description
        duration: parseInt(battle.description.match(/(\d+) minutes/)[1]),
        commencement: new Date(battle.commencement).toISOString().slice(0, 16),
        courseId: battle.courseId,
        program: battle.program,
        section: battle.section,
        player1: battle.challengers[0].id,
        player2: battle.challengers[1].id,
        challenges: battle.challenges,
        rules: battle.rules,
      });
    }
  }, [battles, id, setBattleData]);

  return <CreateBattle isEditMode={true} battleId={id} />;
};

export default EditBattle;
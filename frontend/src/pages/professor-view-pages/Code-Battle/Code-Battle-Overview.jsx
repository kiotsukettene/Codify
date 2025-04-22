import React, { useState, useEffect } from "react";
import { Trophy, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBattleTab from "@/components/professor-view/Code-Battle-Tab"
import Leaderboard from "@/components/professor-view/Leaderboard-Tab";

const CodeBattleOverview = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab") || "battle");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab); 
  };

  return (
    <div className="w-full p-2">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
        <TabsList className="bg-transparent">
          <TabsTrigger
            value="battle"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
            data-[state=active]:text-purple-600 data-[state=active]:border-b-2 
            data-[state=active]:border-purple-600 rounded-none h-14 transition-all duration-300"
          >
            <Zap className="mr-2 h-4 w-4" />
            Code Battle
          </TabsTrigger>

          <TabsTrigger
            value="leaderboards"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
            data-[state=active]:text-purple-600 data-[state=active]:border-b-2 
            data-[state=active]:border-purple-600 rounded-none h-14 transition-all duration-300"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboards
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === "battle" ? <CodeBattleTab /> : <Leaderboard />}
        </div>
      </Tabs>
    </div>
  );
};

export default CodeBattleOverview;

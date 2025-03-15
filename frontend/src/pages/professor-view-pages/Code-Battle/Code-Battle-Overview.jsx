import React, { useState, useEffect } from "react";
import { Trophy, Zap } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/professor-view/Sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CodeBattleTab from "@/components/professor-view/Code-Battle-Tab"
import Leaderboard from "@/components/professor-view/Leaderboard-Tab";

const CodeBattleOverview = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab") || "battle");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab); 
  };

  return (
          <div className="flex-1 flex flex-col">
            {/* Tabs Navigation */}
            <div className="items-center px-4 gap-4">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
                <TabsList className="bg-transparent p-0 h-full">
                  <TabsTrigger
                    value="battle"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
                    data-[state=active]:text-purple-600 data-[state=active]:border-b-2 
                    data-[state=active]:border-purple-600 rounded-none h-14 px-4 transition-all duration-300"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Code Battle
                  </TabsTrigger>

                  <TabsTrigger
                    value="leaderboards"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
                    data-[state=active]:text-purple-600 data-[state=active]:border-b-2 
                    data-[state=active]:border-purple-600 rounded-none h-14 px-4 transition-all duration-300"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboards
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6">
              {activeTab === "battle" ? <CodeBattleTab /> : <Leaderboard />}
            </div>
          </div>
  );
};

export default CodeBattleOverview;

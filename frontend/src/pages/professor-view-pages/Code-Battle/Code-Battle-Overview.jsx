import React, { useState, useEffect } from "react";
import { Trophy, Zap } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/professor-view/Sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CodeBattleTab from "../../../components/professor-view/Code-Battle-Tab"
import Leaderboard from "../../../components/professor-view/Leaderboard-Tab";

const CodeBattleOverview = () => {
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab") || "battle");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab); 
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full min-h-screen">
        <SidebarInset className="flex-1">
          <header className="flex h-20 shrink-0 items-center gap-2 px-4 border-b">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold"
            >
              Code Battle Arena
            </motion.h2>
          </header>

          <div className="flex flex-col min-h-screen bg-white">
            {/* Tabs Navigation */}
            <div className="flex h-14 items-center px-4 gap-4">
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
            <div className="p-6">
              {activeTab === "battle" ? <CodeBattleTab /> : <Leaderboard />}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CodeBattleOverview;

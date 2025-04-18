import React, { useEffect } from "react";
import {
  Calendar,
  GamepadIcon as GameController,
  Shield,
  Swords,
  ScrollText,
  Trophy,
  Plus,
  HelpCircle,
  X,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useBattleStore from "@/store/battleStore";
import { useCourseStore } from "@/store/courseStore";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

const CreateBattle = ({ isEditMode = false, battleId}) => {
  const {
    battleData,
    selectedCourse,
    selectedProgram,
    selectedSection,
    open,
    courseValue,
    isSubmitting,
    setBattleData,
    addChallenge,
    updateChallenge,
    removeChallenge,
    selectCourse,
    selectProgram,
    selectSection,
    setOpen,
    saveBattle, // Add saveBattle
    submitBattle,
    getAvailablePlayers,
    editBattle,
  } = useBattleStore();

  const { courses, isLoading: isCoursesLoading, fetchCoursesByProfessor } = useCourseStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCoursesByProfessor();
  }, [fetchCoursesByProfessor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await editBattle(battleId, battleData);
      } else {
        const response = await submitBattle();
        navigate(`/professor/code-battle/lobby/${response.battle.battleId}`);
      }
    } catch (error) {
      // Error is already handled by the store
      console.error("Failed to handle battle:", error);
    }
  };

  const handleSave = async () => {
    await saveBattle();
  };

  const isPlayerSelectionEnabled = selectedCourse && selectedProgram && selectedSection;
  const canAddChallenge = battleData.challenges.length < 3;

  return (
    <div className="w-full">
      <div className="flex gap-3 justify-between pt-4 pb-4">
        <div className="flex gap-4">
          <Trophy className="h-8 w-8 text-[#7C3AED]" />
          <h1 className="text-2xl font-bold">Create Your Epic Code Battle Arena</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full border-muted-foreground/30"
            >
              <HelpCircle className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-purple-600">Code Compiler Information</DialogTitle>
              <DialogDescription>
                Each section of the interface plays a specific role in the process of code development
                and testing. Below is a detailed description of each component:
                <br />
                <br />
                <b>Main</b> <br /> This is where users type their source code in the selected
                programming language.
                <br />
                <br />
                <b>Input</b> <br /> This section accepts user-provided input values for code execution.
                <br />
                <br />
                <b>Output</b> <br /> This displays the results of code execution.
                <br />
                <br />
                <b>Language Selector</b> <br /> This dropdown allows choosing a programming language.
                <br />
                <br />
                <b>Run Code</b> <br /> This executes the code in the main panel.
                <br />
                <br />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#7C3AED]">
              <GameController className="h-5 w-5" />
              Battle Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Battle Title</label>
              <Input
                placeholder="Enter an epic battle title"
                value={battleData.title}
                onChange={(e) => setBattleData({ title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Battle Description</label>
              <Input
                placeholder="Describe the battle objectives and goals"
                value={battleData.description}
                onChange={(e) => setBattleData({ description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Battle Duration (minutes)
                </label>
                <Input
                  type="number"
                  placeholder="Enter duration"
                  value={battleData.duration}
                  onChange={(e) => setBattleData({ duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Battle Commencement
                </label>
                <Input
                  type="datetime-local" // Changed to datetime-local for precise scheduling
                  value={battleData.commencement}
                  onChange={(e) => setBattleData({ commencement: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#7C3AED]">
              <Shield className="h-5 w-5" />
              Champions & Challengers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-12">
              <div className="space-y-2 col-span-6">
                <label className="text-sm font-medium">Course</label>
                {isCoursesLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {courseValue
                          ? courses.find((course) => course._id === courseValue)?.className
                          : "Select course..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandInput placeholder="Search course..." />
                        <CommandEmpty>No course found.</CommandEmpty>
                        <CommandGroup>
                          {[...new Set(courses.map((course) => course.className))].map((className) => {
                            const course = courses.find((c) => c.className === className);
                            return (
                              <CommandItem
                                key={course._id}
                                value={course._id}
                                onSelect={() => selectCourse(course._id, courses)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    courseValue === course._id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {className}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <div className="space-y-2 col-span-4">
                <label className="text-sm font-medium">Program</label>
                <Select
                  onValueChange={selectProgram}
                  value={selectedProgram}
                  disabled={!selectedCourse}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={selectedCourse ? "Select program..." : "Select a course first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCourse?.programs.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Section</label>
                <Select
                  onValueChange={selectSection}
                  value={selectedSection}
                  disabled={!selectedCourse || !selectedProgram}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedCourse && selectedProgram
                          ? "Select section..."
                          : "Select a program first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCourse?.sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Player 1</label>
                <Select
                  onValueChange={(value) => setBattleData({ player1: value })}
                  value={battleData.player1}
                  disabled={!isPlayerSelectionEnabled}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isPlayerSelectionEnabled
                          ? "Select Player 1"
                          : "Select course, program, and section first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlayers("player1")(useBattleStore.getState()).length === 0 ? (
                      <SelectItem disabled>No students available</SelectItem>
                    ) : (
                      getAvailablePlayers("player1")(useBattleStore.getState()).map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Player 2</label>
                <Select
                  onValueChange={(value) => setBattleData({ player2: value })}
                  value={battleData.player2}
                  disabled={!isPlayerSelectionEnabled}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isPlayerSelectionEnabled
                          ? "Select Player 2"
                          : "Select course, program, and section first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlayers("player2")(useBattleStore.getState()).length === 0 ? (
                      <SelectItem disabled>No students available</SelectItem>
                    ) : (
                      getAvailablePlayers("player2")(useBattleStore.getState()).map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="justify-between flex text-2xl font-semibold">
          <div className="text-[#7C3AED] flex items-center gap-2">
            <Swords className="h-5 w-5" />
            Battle Challenges
          </div>
        </div>

        {battleData.challenges.map((challenge, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-[#7C3AED] text-base">
                  Challenge No. {index + 1}
                </CardTitle>
                {battleData.challenges.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeChallenge(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Problem Title</label>
                <Input
                  value={challenge.problemTitle}
                  onChange={(e) => updateChallenge(index, "problemTitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  className="min-h-[100px]"
                  value={challenge.problemDescription}
                  onChange={(e) => updateChallenge(index, "problemDescription", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Points</label>
                <Input
                  type="number"
                  min="0"
                  value={challenge.points}
                  onChange={(e) =>
                    updateChallenge(index, "points", parseInt(e.target.value) || 0)
                  }
                  placeholder="Enter points for this challenge"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Input Constraints (Test Cases)</label>
                <div className="grid gap-4 md:grid-cols-3">
                  {[0, 1, 2].map((testCaseIndex) => (
                    <div key={testCaseIndex} className="space-y-1">
                      <label className="text-xs font-medium">Test Case {testCaseIndex + 1}</label>
                      <Textarea
                        className="min-h-[80px]"
                        value={challenge.inputConstraints[testCaseIndex] || ""}
                        onChange={(e) => {
                          const newInputConstraints = [
                            ...(challenge.inputConstraints || ["", "", ""]),
                          ];
                          newInputConstraints[testCaseIndex] = e.target.value;
                          updateChallenge(index, "inputConstraints", newInputConstraints);
                        }}
                        placeholder={`Input for test case ${testCaseIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Output (Test Cases)</label>
                <div className="grid gap-4 md:grid-cols-3">
                  {[0, 1, 2].map((testCaseIndex) => (
                    <div key={testCaseIndex} className="space-y-1">
                      <label className="text-xs font-medium">Test Case {testCaseIndex + 1}</label>
                      <Textarea
                        className="min-h-[80px]"
                        value={challenge.expectedOutput[testCaseIndex] || ""}
                        onChange={(e) => {
                          const newExpectedOutput = [
                            ...(challenge.expectedOutput || ["", "", ""]),
                          ];
                          newExpectedOutput[testCaseIndex] = e.target.value;
                          updateChallenge(index, "expectedOutput", newExpectedOutput);
                        }}
                        placeholder={`Output for test case ${testCaseIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={addChallenge}
            disabled={!canAddChallenge}
            className={`flex items-center gap-1 text-white hover:bg-purple-500 hover:text-gray-100 bg-purple-600 ${
              !canAddChallenge ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Plus className="h-4 w-4" /> Add Challenge
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#7C3AED]">
              <ScrollText className="h-5 w-5" />
              Battle Rules <p className="text-sm text-gray-400">(Optional)</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add additional rules"
              className="min-h-[100px]"
              value={battleData.rules}
              onChange={(e) => setBattleData({ rules: e.target.value })}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleSave} // Wire to handleSave
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Schedule Battle"}
            </Button>
            <Button
              className="bg-[#7C3AED] hover:bg-[#6D28D9]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Commencing..." : "Commence Now"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBattle;
import React from 'react'
import { FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"

const ActivityTab = ({ mission }) => {
    if (!mission) return null; 
    return (
        <Link to={`/mission/${mission.slug}`} className="w-full">
          <Button variant="ghost" className="w-full p-0 h-auto hover:bg-accent/50">
            <Card className="w-full p-4 cursor-pointer border hover:border-purple-300 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <h3>
                      Mission {mission.id} : {mission.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">Due: {mission.dueDate}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-400 hover:bg-purple-100">
                  {mission.submitted}/{mission.total} Submitted
                </Badge>
              </div>
            </Card>
          </Button>
        </Link>
      );
    };

export default ActivityTab

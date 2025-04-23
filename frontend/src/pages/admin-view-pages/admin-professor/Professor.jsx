import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Plus, SlidersHorizontal, UserX } from "lucide-react"; // Added UserX icon
import { useprofAuthStore } from "@/store/profAuthStore";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddProfessor from "../admin-professor/Add-Professor";
import { motion } from "framer-motion";

function ProfessorList() {
  const { professors, fetchProfessors, deleteProfessor, isLoading, error } =
    useprofAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const handleDelete = async (id) => {
    await deleteProfessor(id);
    toast.success("Professor deleted successfully");
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full p-6 mt-4 bg-white rounded-lg">
      <motion.div
       initial={{ x: 50, opacity: 0 }}
       animate={{ x: 0, opacity: 1 }}
       transition={{ duration: 0.6, ease: "anticipate" }}
      >
      <h1 className="text-3xl font-semibold text-neutral-900">
        Professors Management
      </h1>
      <h4 className="pb-6 pt-1 font-normal">
        Manage and view the list of professors.
      </h4>
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex-1 flex flex-col w-full h-full overflow-auto">
          <Card className="w-full">
            <CardHeader>
              <CardDescription className="flex items-center gap-4 mx-auto w-full justify-end">
                <Dialog
                  open={isModalOpen}
                  onOpenChange={(open) => setIsModalOpen(open)}
                  modal
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus /> Register New Professor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <AddProfessor onClose={() => setIsModalOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="text-neutral-900">
                  <SlidersHorizontal /> Filter
                </Button>
              </CardDescription>
            </CardHeader>

            {isLoading ? (
              <p>Loading professors...</p>
            ) : (
              <>
                {error && <p className="text-red-500 p-4">{error}</p>}
                <CardContent>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {professors.length > 0 ? (
                        professors.map((professor) => (
                          <TableRow key={professor._id || professor.id}>
                            <TableCell>{professor.firstName}</TableCell>
                            <TableCell>{professor.lastName}</TableCell>
                            <TableCell>{professor.email}</TableCell>
                            <TableCell>
                              {professor.createdAt
                                ? new Date(professor.createdAt).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleDelete(professor._id)}
                                className="bg-red-500 text-white"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            <div className="flex flex-col items-center gap-2">
                              <UserX size={48} className="text-gray-400" />
                              <p className="text-gray-500 text-lg">
                                No Added Professor Yet
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </>
            )}
          </Card>
      </motion.div>
    </div>
  );
}

export default ProfessorList;
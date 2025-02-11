import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, SlidersHorizontal } from 'lucide-react'

import { useStudentStore } from '@/store/studentStore'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddStudent from '../admin-student/Add-Student'
 


function StudentList() {
  const { students, fetchStudents, deleteStudent, isLoading, error } = useStudentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    await deleteStudent(id);
    toast.success("Student deleted successfully")
  }

  return (
    <div className="flex flex-1 flex-col w-full h-full p-6 mt-4 bg-white rounded-lg ">
      <h1 className="text-3xl font-semibold text-neutral-900">Students Management</h1>
      <h4 className='pt-3 font-normal'>Manage and view the list of professors, their assigned courses, and details.
      </h4>
  
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full h-full p-4 overflow-auto">
        <main className="flex-1 w-full">
              <Card className="w-full">
                <CardHeader>
                  {/* <CardTitle>Products</CardTitle> */}
                  <CardDescription className="flex items-center gap-4 mx-auto w-full justify-end">
                    {/* Manage your products and view their sales performance. */}
{/* DialogTrigger to open the modal */}
<Dialog
                  open={isModalOpen}
                  onOpenChange={(open) => setIsModalOpen(open)}
                  modal
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-neutral-900 text-white hover:bg-neutral-700"
                    >
                      <Plus /> Register New Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <AddStudent onClose={() => setIsModalOpen(false)} />
                  </DialogContent>
                </Dialog>




                <Button variant='outline' className="text-neutral-900"><SlidersHorizontal /> Filter</Button>
                  </CardDescription>
            </CardHeader>
            {isLoading ? (
              <p>Loading students...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <CardContent>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Date Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        students.map((student) => {
                            return (
                            <TableRow key={student._id}>
                              <TableCell>{student.studentId}</TableCell>
                              <TableCell>{student.firstName}</TableCell>
                              <TableCell>{student.lastName}</TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.course}</TableCell>
                              <TableCell>{student.year}</TableCell>
                              <TableCell>{student.section}</TableCell>
                              <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                              <Button onClick={() => handleDelete(student._id)} className="bg-red-500 text-white">Delete</Button>
                              </TableCell>
                            </TableRow>
                            )
                        })
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
        </main>
      </div>
    </div>
  );
  
}

export default StudentList
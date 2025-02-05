import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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


function StudentList() {
  const navigate = useNavigate()
  const StudentList = [
    {
      studentId: '20221210-N',
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@gmail.com',
      course: 'BSIT',
      year: '1st',
      section: 'A',
      password: "123",
      dateJoined: "12/12/2024",
    



    }
  ]

  const handleAddStudent = () => {  
    navigate('/admin/addStudent')
  }

  return (
    <div className="flex flex-1 flex-col w-full h-full p-6 mt-4 bg-white rounded-lg ">
      <h1 className="text-3xl font-semibold text-neutral-900">Professors Management</h1>
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
                    <Button onClick={handleAddStudent} className="bg-neutral-900 text-white hover:bg-neutral-700"><Plus/> Register New Student</Button>
                    <Button variant='outline' className="text-neutral-900"><SlidersHorizontal/> Filter</Button>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Firstname</TableHead>
                        <TableHead>Lastname</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Date Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      
                      {
                        StudentList.map((students) => {
                          return (
                            <TableRow key={students.id}>
                              <TableCell className="font-medium">{students.firstname}</TableCell>
                              <TableCell>{students.studentId}</TableCell>
                              <TableCell>{students.firstname}</TableCell>
                              <TableCell>{students.lastname}</TableCell>
                              <TableCell>{students.email}</TableCell>
                              <TableCell>{students.course}</TableCell>
                              <TableCell>{students.year}</TableCell>
                              <TableCell>{students.section}</TableCell>
                              <TableCell>{students.password}</TableCell>
                              <TableCell>{students.dateJoined}</TableCell>

                            </TableRow>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
           
        </main>
      </div>
    </div>
  );
  
}

export default StudentList

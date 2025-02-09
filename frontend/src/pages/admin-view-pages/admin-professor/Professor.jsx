import React from 'react'
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  Plus,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Users2,
} from "lucide-react"
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



function ProfessorList() {
  const navigate = useNavigate()
  const ProfessorList = [
    {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@gmail.com',
      password: "123",
      dateJoined: "12/12/2024",

    }
  ]

  const handleAddProfessor = () => {  
    navigate('/admin/addProfessor')
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
                    <Button onClick={handleAddProfessor} className="bg-neutral-900 text-white hover:bg-neutral-700"><Plus/> Add Professor</Button>
                    <Button variant='outline' className="text-neutral-900"><SlidersHorizontal/> Filter</Button>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Firstname</TableHead>
                        <TableHead>Lastname</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Date Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      
                      {
                        ProfessorList.map((professors) => {
                          return (
                            <TableRow key={professors.id}>
                              <TableCell className="font-medium">{professors.firstname}</TableCell>
                              <TableCell>{professors.lastname}</TableCell>
                              <TableCell>{professors.email}</TableCell>
                              <TableCell>{professors.password}</TableCell>
                              <TableCell>{professors.dateJoined}</TableCell>
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

export default ProfessorList

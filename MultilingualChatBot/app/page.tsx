"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2 } from "lucide-react"

export default function LandingPage() {
  const [citizenUser, setCitizenUser] = useState("")
  const [citizenPass, setCitizenPass] = useState("")
  const [deptUser, setDeptUser] = useState("")
  const [deptPass, setDeptPass] = useState("")

  const handleCitizenLogin = () => {
    if (citizenUser === "citizen" && citizenPass === "1234") {
      localStorage.setItem("role", "citizen")
      localStorage.setItem("isLoggedIn", "true")
      window.location.href = "/citizen"
    } else {
      alert("Invalid Citizen credentials! Use citizen / 1234")
    }
  }

  const handleDeptLogin = () => {
    if (deptUser === "dept" && deptPass === "1234") {
      localStorage.setItem("role", "department")
      localStorage.setItem("isLoggedIn", "true")
      window.location.href = "/department"
    } else {
      alert("Invalid Department credentials! Use dept / 1234")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">SchemesConnect</h1>
        <p className="text-gray-600">One-stop portal for government schemes & citizen services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        
        {/* Citizen Login */}
        <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-blue-700">Citizen Login</CardTitle>
            <CardDescription>Access all schemes relevant to you</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-500">
            <input
              type="text"
              placeholder="Username"
              className="border p-2 w-full mb-2 rounded"
              value={citizenUser}
              onChange={(e) => setCitizenUser(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-2 rounded"
              value={citizenPass}
              onChange={(e) => setCitizenPass(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleCitizenLogin} className="w-full bg-blue-600 hover:bg-blue-700">
              Login as Citizen
            </Button>
          </CardFooter>
        </Card>

        {/* Department Login */}
        <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-blue-700">Department Login</CardTitle>
            <CardDescription>Manage schemes and verify citizen applications</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-500">
            <input
              type="text"
              placeholder="Username"
              className="border p-2 w-full mb-2 rounded"
              value={deptUser}
              onChange={(e) => setDeptUser(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-2 rounded"
              value={deptPass}
              onChange={(e) => setDeptPass(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleDeptLogin} className="w-full bg-blue-600 hover:bg-blue-700">
              Login as Department
            </Button>
          </CardFooter>
        </Card>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 SchemesConnect. All rights reserved.</p>
        <p className="mt-1">Empowering citizens with access to welfare schemes</p>
      </footer>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createAccount, authenticate, getAccountType } from "../../../firebase/auth"
import { auth } from "../../../firebase/firebase"
import { Lock, Mail, Phone, MapPin, User, UserCircle } from "lucide-react"

export default function AuthenticationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    userLocation: "",
    userHandle: "",
    contactNumber: "",
    emailAddress: "",
    secretCode: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()

  useEffect(() => {
    const authListener = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRole = await getAccountType(user)
      }
    })
    return () => authListener()
  }, [])

  const handleInputChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAuthentication = async (action: "register" | "login") => {
    setIsProcessing(true)
    setErrorMessage("")
    try {
      const user = action === "register"
        ? await createAccount(
            formData.fullName,
            formData.userLocation,
            formData.userHandle,
            formData.contactNumber,
            formData.emailAddress,
            formData.secretCode,
            "buyer"
          )
        : await authenticate(formData.emailAddress, formData.secretCode)

      const userRole = await getAccountType(user)
      
      switch(userRole) {
        case "buyer": router.push("/"); break;
        case "admin": router.push("/admin-dashboard"); break;
        case "manager": router.push("/manager-dashboard"); break;
      }
    } catch (error: any) {
      setErrorMessage(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#2A254B] flex items-center justify-center p-4 font-clash">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div className="flex mb-8">
          <button
            className={`flex-1 py-4 text-lg font-medium transition-colors ${
              activeTab === "login"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-4 text-lg font-medium transition-colors ${
              activeTab === "register"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white/80"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Create Account
          </button>
        </div>

        <div className="px-8 pb-8">
          {activeTab === "login" ? (
            <div className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-6 w-6 text-white/60" />
                <input
                  type="email"
                  name="emailAddress"
                  placeholder="Email Address"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-6 w-6 text-white/60" />
                <input
                  type="password"
                  name="secretCode"
                  placeholder="Password"
                  value={formData.secretCode}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-6 w-6 text-white/60" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-6 w-6 text-white/60" />
                <input
                  type="text"
                  name="userLocation"
                  placeholder="Address"
                  value={formData.userLocation}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-3 h-6 w-6 text-white/60" />
                <input
                  type="text"
                  name="userHandle"
                  placeholder="Username"
                  value={formData.userHandle}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-6 w-6 text-white/60" />
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="Phone Number"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-6 w-6 text-white/60" />
                <input
                  type="email"
                  name="emailAddress"
                  placeholder="Email Address"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-6 w-6 text-white/60" />
                <input
                  type="password"
                  name="secretCode"
                  placeholder="Password"
                  value={formData.secretCode}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => handleAuthentication(activeTab === "login" ? "login" : "register")}
            disabled={isProcessing}
            className="w-full mt-8 bg-white text-[#2A254B] py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : activeTab === "login" ? "Sign In" : "Create Account"}
          </button>

          {errorMessage && (
            <p className="mt-4 text-red-300 text-center">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}
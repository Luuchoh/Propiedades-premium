import { RegisterForm } from "@/components/auth/register-form"
import { Home } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-primary">
            <Home className="h-8 w-8" />
            <span>Propiedades Premium</span>
          </Link>
        </div>

        {/* Register Form */}
        <RegisterForm />
      </div>
    </div>
  )
}

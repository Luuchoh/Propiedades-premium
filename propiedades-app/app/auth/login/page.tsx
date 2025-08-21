import { LoginForm } from "@/components/auth/login-form"
import { Home } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
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

        {/* Login Form */}
        <LoginForm />

        {/* Demo Credentials */}
        <div className="text-center text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
          <p className="font-medium mb-2">Credenciales de demostración:</p>
          <p>Admin: admin@propiedades.com / admin123</p>
          <p>Agente: agente@propiedades.com / agente123</p>
        </div>
      </div>
    </div>
  )
}

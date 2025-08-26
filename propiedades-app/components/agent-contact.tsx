"use client"

import type React from "react"

import { useState } from "react"
import type { Property } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Mail, MessageCircle, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface AgentContactProps {
  agent: Property["agent"]
  propertyId: string
}

export function AgentContact({ agent, propertyId }: AgentContactProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hola, estoy interesado en la propiedad #${propertyId.toUpperCase()}. Me gustaría obtener más información.`,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message to the agent
    console.log("Contact form submitted:", contactForm)
    setIsContactModalOpen(false)
    // Show success message
  }

  const handleCall = () => {
    window.location.href = `tel:${agent.phone}`
  }

  const handleEmail = () => {
    const subject = `Consulta sobre propiedad #${propertyId.toUpperCase()}`
    const body = contactForm.message
    window.location.href = `mailto:${agent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agente Inmobiliario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agent Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
            <AvatarFallback>
              {agent.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <p className="text-muted-foreground text-sm">Agente especializado</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            <span>{agent.phone}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            <span>{agent.email}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={handleCall} className="w-full" size="lg">
            <Phone className="h-4 w-4 mr-2" />
            Llamar Ahora
          </Button>

          <Button onClick={handleEmail} variant="outline" className="w-full bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            Enviar Email
          </Button>

          <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar Mensaje
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Contactar con {agent.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" name="name" value={contactForm.name} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input id="phone" name="phone" type="tel" value={contactForm.phone} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>Respuesta garantizada en menos de 24 horas</p>
        </div>
      </CardContent>
    </Card>
  )
}

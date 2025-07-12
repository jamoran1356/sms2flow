"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Award,
  BadgeCheck,
  Camera,
  Edit,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  ThumbsUp,
  User,
  Verified,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Juan Pérez",
    bio: "Emprendedor digital y entusiasta de las criptomonedas. Especializado en comercio electrónico y soluciones de pago innovadoras.",
    location: "Madrid, España",
    website: "https://juanperez.com",
    email: "juan@ejemplo.com",
    phone: "+34 612 345 678",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const saveChanges = () => {
    setIsEditing(false)
    // Aquí iría la lógica para guardar los cambios en el servidor
  }

  const badges = [
    {
      id: "verified",
      name: "Cuenta Verificada",
      icon: <BadgeCheck className="h-4 w-4 text-blue-500" />,
      description: "Identidad verificada mediante KYC",
      date: "Verificado el 15/03/2023",
    },
    {
      id: "trusted_seller",
      name: "Vendedor Confiable",
      icon: <Shield className="h-4 w-4 text-green-500" />,
      description: "Más de 50 transacciones exitosas",
      date: "Obtenido el 10/04/2023",
    },
    {
      id: "fast_shipper",
      name: "Envíos Rápidos",
      icon: <Award className="h-4 w-4 text-amber-500" />,
      description: "Tiempo de envío promedio menor a 24h",
      date: "Obtenido el 22/04/2023",
    },
    {
      id: "top_rated",
      name: "Altamente Valorado",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      description: "Calificación promedio superior a 4.8/5",
      date: "Obtenido el 05/05/2023",
    },
  ]

  const reviews = [
    {
      id: 1,
      user: "María G.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "08/05/2023",
      comment: "Excelente vendedor. Producto exactamente como se describió y envío muy rápido. Totalmente recomendado.",
      product: "Suscripción Premium",
    },
    {
      id: 2,
      user: "Carlos R.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "02/05/2023",
      comment:
        "Transacción perfecta. El pago se procesó al instante y el producto fue entregado inmediatamente. Volveré a comprar.",
      product: "Curso de Trading",
    },
    {
      id: 3,
      user: "Laura M.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "25/04/2023",
      comment:
        "Muy buen servicio. La comunicación fue clara y el producto cumplió con mis expectativas. Solo un pequeño retraso en la entrega.",
      product: "NFT Coleccionable",
    },
  ]

  const stats = {
    totalSales: 68,
    totalValue: "4,250.00",
    avgRating: 4.9,
    completionRate: 100,
    responseTime: "< 1 hora",
    verificationLevel: 3,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
          className={isEditing ? "bg-[#0a2463] hover:bg-[#0a2463]/90" : ""}
        >
          {isEditing ? (
            "Guardar Cambios"
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="relative pb-0">
              <div className="absolute top-4 right-4 flex space-x-2">
                {badges.slice(0, 3).map((badge) => (
                  <Dialog key={badge.id}>
                    <DialogTrigger asChild>
                      <button className="hover:scale-110 transition-transform" title={badge.name}>
                        {badge.icon}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          {badge.icon}
                          <span className="ml-2">{badge.name}</span>
                        </DialogTitle>
                        <DialogDescription>{badge.description}</DialogDescription>
                      </DialogHeader>
                      <div className="text-sm text-slate-600">{badge.date}</div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=96&width=96"
                      alt="Foto de perfil"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-[#0a2463] text-white p-1 rounded-full">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <Input
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="text-center font-bold text-xl max-w-[250px]"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{profileData.name}</h2>
                )}
                <div className="flex items-center mt-1 text-sm text-slate-600">
                  <Verified className="h-4 w-4 text-blue-500 mr-1" />
                  <span>Miembro desde Marzo 2023</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleChange} rows={4} />
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 text-center">{profileData.bio}</p>
                )}

                <div className="flex flex-col space-y-3 pt-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                    {isEditing ? (
                      <Input
                        name="location"
                        value={profileData.location}
                        onChange={handleChange}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <span className="text-sm">{profileData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 text-slate-400 mr-2" />
                    {isEditing ? (
                      <Input
                        name="website"
                        value={profileData.website}
                        onChange={handleChange}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {profileData.website}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-slate-400 mr-2" />
                    {isEditing ? (
                      <Input name="email" value={profileData.email} onChange={handleChange} className="h-8 text-sm" />
                    ) : (
                      <span className="text-sm">{profileData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-slate-400 mr-2" />
                    {isEditing ? (
                      <Input name="phone" value={profileData.phone} onChange={handleChange} className="h-8 text-sm" />
                    ) : (
                      <span className="text-sm">{profileData.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insignias y Reconocimientos</CardTitle>
              <CardDescription>Logros obtenidos en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-4 border rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      {badge.icon}
                    </div>
                    <h3 className="font-medium text-center">{badge.name}</h3>
                    <p className="text-xs text-slate-500 text-center mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Ver todas las insignias
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Todas las Insignias</DialogTitle>
                    <DialogDescription>Insignias y reconocimientos obtenidos en la plataforma</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-auto pr-2">
                    {[...badges, ...badges].map((badge, index) => (
                      <div key={`${badge.id}-${index}`} className="flex flex-col items-center p-4 border rounded-lg">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                          {badge.icon}
                        </div>
                        <h3 className="font-medium text-center">{badge.name}</h3>
                        <p className="text-xs text-slate-500 text-center mt-1">{badge.description}</p>
                        <p className="text-xs text-slate-400 mt-2">{badge.date}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas del Perfil</CardTitle>
              <CardDescription>Métricas de rendimiento y reputación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-[#0a2463]">{stats.totalSales}</div>
                  <p className="text-sm text-slate-600">Ventas Totales</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-[#0a2463]">${stats.totalValue}</div>
                  <p className="text-sm text-slate-600">Valor Total</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-[#0a2463] flex items-center">
                    {stats.avgRating}
                    <Star className="h-4 w-4 text-yellow-500 ml-1" />
                  </div>
                  <p className="text-sm text-slate-600">Calificación</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-[#0a2463]">{stats.completionRate}%</div>
                  <p className="text-sm text-slate-600">Tasa de Finalización</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-[#0a2463]">{stats.responseTime}</div>
                  <p className="text-sm text-slate-600">Tiempo de Respuesta</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    {[...Array(3)].map((_, i) => (
                      <Shield
                        key={i}
                        className={`h-5 w-5 ${i < stats.verificationLevel ? "text-blue-500" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">Nivel de Verificación</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Perfil completado</span>
                    <span className="text-sm text-slate-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Reputación</span>
                    <span className="text-sm text-slate-600">Excelente</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opiniones de Clientes</CardTitle>
              <CardDescription>Lo que dicen tus clientes sobre ti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.user}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{review.user}</h3>
                          <p className="text-xs text-slate-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-slate-600">{review.comment}</p>
                      <div className="mt-2 flex items-center">
                        <Badge variant="outline" className="text-xs">
                          {review.product}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 ml-auto">
                          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">Útil</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-center">
              <Button variant="outline" size="sm">
                Ver todas las opiniones (24)
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verificación de Identidad</CardTitle>
              <CardDescription>Estado de verificación de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Identidad Personal</h3>
                      <p className="text-xs text-green-600">Verificado</p>
                    </div>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Correo Electrónico</h3>
                      <p className="text-xs text-green-600">Verificado</p>
                    </div>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Teléfono</h3>
                      <p className="text-xs text-green-600">Verificado</p>
                    </div>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <Shield className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Verificación Avanzada</h3>
                      <p className="text-xs text-amber-600">Pendiente</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                    Completar
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-xs text-center text-slate-500 w-full">
                La verificación avanzada te permite aumentar tus límites de transacción y acceder a funciones premium.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

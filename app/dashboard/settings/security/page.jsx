"use client"

import { useState } from "react"
import { AlertCircle, Check, Eye, EyeOff, Key, Lock, Shield, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SecuritySettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginNotifications: true,
    withdrawalConfirmation: true,
    sessionTimeout: true,
    biometricLogin: false,
    trustedDevices: true,
  })

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityToggle = (setting) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const changePassword = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para cambiar la contraseña
    console.log("Cambio de contraseña solicitado", passwordForm)

    // Reiniciar el formulario
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Configuración de Seguridad</h1>
        <Button variant="outline" size="sm" className="gap-1">
          <Shield className="h-4 w-4" />
          <span>Centro de Seguridad</span>
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertTitle>Protege tu cuenta</AlertTitle>
        <AlertDescription className="text-blue-800">
          La seguridad de tu cuenta es fundamental. Te recomendamos activar la autenticación de dos factores y utilizar
          una contraseña fuerte y única.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="password">Contraseña</TabsTrigger>
          <TabsTrigger value="2fa">Autenticación</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General de Seguridad</CardTitle>
              <CardDescription>Gestiona las opciones de seguridad básicas de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones de inicio de sesión</Label>
                  <p className="text-sm text-slate-500">
                    Recibe notificaciones cuando alguien inicie sesión en tu cuenta
                  </p>
                </div>
                <Switch
                  checked={securitySettings.loginNotifications}
                  onCheckedChange={() => handleSecurityToggle("loginNotifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Confirmación de retiros</Label>
                  <p className="text-sm text-slate-500">
                    Requiere confirmación por correo electrónico para todos los retiros
                  </p>
                </div>
                <Switch
                  checked={securitySettings.withdrawalConfirmation}
                  onCheckedChange={() => handleSecurityToggle("withdrawalConfirmation")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Tiempo de espera de sesión</Label>
                  <p className="text-sm text-slate-500">
                    Cierra la sesión automáticamente después de 30 minutos de inactividad
                  </p>
                </div>
                <Switch
                  checked={securitySettings.sessionTimeout}
                  onCheckedChange={() => handleSecurityToggle("sessionTimeout")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Inicio de sesión biométrico</Label>
                  <p className="text-sm text-slate-500">
                    Utiliza tu huella digital o reconocimiento facial para iniciar sesión
                  </p>
                </div>
                <Switch
                  checked={securitySettings.biometricLogin}
                  onCheckedChange={() => handleSecurityToggle("biometricLogin")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dispositivos de confianza</Label>
                  <p className="text-sm text-slate-500">Recuerda los dispositivos en los que has iniciado sesión</p>
                </div>
                <Switch
                  checked={securitySettings.trustedDevices}
                  onCheckedChange={() => handleSecurityToggle("trustedDevices")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#0a2463] hover:bg-[#0a2463]/90">Guardar Configuración</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispositivos Conectados</CardTitle>
              <CardDescription>Gestiona los dispositivos que tienen acceso a tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Smartphone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">iPhone 13 Pro</h3>
                      <p className="text-xs text-slate-500">Madrid, España • Activo ahora</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">Actual</span>
                    <Button variant="ghost" size="sm" className="h-8 text-slate-600">
                      Detalles
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                      <Laptop className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">MacBook Pro</h3>
                      <p className="text-xs text-slate-500">Madrid, España • Hace 2 días</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                    Revocar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                      <Tablet className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">iPad Air</h3>
                      <p className="text-xs text-slate-500">Barcelona, España • Hace 1 semana</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                    Revocar
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm">
                Cerrar sesión en todos los dispositivos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
            </CardHeader>
            <form onSubmit={changePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Requisitos de contraseña:</h3>
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Mínimo 8 caracteres</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Al menos una letra mayúscula</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Al menos un número</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Al menos un carácter especial</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button type="submit" className="w-full bg-[#0a2463] hover:bg-[#0a2463]/90">
                  Actualizar Contraseña
                </Button>
                <p className="text-xs text-center text-slate-500">
                  Se cerrará la sesión en todos los dispositivos después de cambiar la contraseña.
                </p>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Acceso</CardTitle>
              <CardDescription>Revisa la actividad reciente de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Lock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Inicio de sesión exitoso</h3>
                      <p className="text-xs text-slate-500">Madrid, España • 12/05/2023 15:30</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Dispositivo conocido
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Lock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Cambio de contraseña</h3>
                      <p className="text-xs text-slate-500">Madrid, España • 10/05/2023 09:15</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Seguridad</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Intento de inicio de sesión fallido</h3>
                      <p className="text-xs text-slate-500">Barcelona, España • 05/05/2023 22:45</p>
                    </div>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Alerta</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm">
                Ver historial completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="2fa" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Autenticación de Dos Factores (2FA)</CardTitle>
              <CardDescription>Añade una capa adicional de seguridad a tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Autenticación de dos factores</Label>
                  <p className="text-sm text-slate-500">Requiere un código adicional al iniciar sesión</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={() => handleSecurityToggle("twoFactorAuth")}
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Autenticador de aplicación</h3>
                    <p className="text-xs text-green-600">Activo</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Estás utilizando Google Authenticator para generar códigos de verificación.
                </p>
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Desactivar
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <Key className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Llaves de seguridad</h3>
                    <p className="text-xs text-slate-500">No configurado</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Utiliza una llave de seguridad física como YubiKey para una mayor seguridad.
                </p>
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <MessageSquare className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">SMS</h3>
                    <p className="text-xs text-slate-500">No configurado</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Recibe códigos de verificación por SMS en tu teléfono móvil.</p>
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4 border-t pt-4">
              <div className="w-full">
                <h3 className="text-sm font-medium mb-2">Códigos de recuperación</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Guarda estos códigos en un lugar seguro para acceder a tu cuenta si pierdes el acceso a tu dispositivo
                  de autenticación.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Generar nuevos códigos de recuperación
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración Avanzada</CardTitle>
              <CardDescription>Opciones adicionales de seguridad para tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Verificación para retiros</Label>
                  <p className="text-sm text-slate-500">
                    Requiere 2FA para todos los retiros, incluso desde dispositivos de confianza
                  </p>
                </div>
                <Switch checked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Verificación para cambios de configuración</Label>
                  <p className="text-sm text-slate-500">Requiere 2FA para cambiar la configuración de seguridad</p>
                </div>
                <Switch checked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Bloqueo de IP sospechosas</Label>
                  <p className="text-sm text-slate-500">
                    Bloquea automáticamente los intentos de inicio de sesión desde ubicaciones inusuales
                  </p>
                </div>
                <Switch checked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones de seguridad avanzadas</Label>
                  <p className="text-sm text-slate-500">Recibe alertas sobre actividades sospechosas en tu cuenta</p>
                </div>
                <Switch checked={true} />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Alert variant="outline" className="w-full bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Tu cuenta tiene un nivel de seguridad alto. Continúa manteniendo tus credenciales seguras.
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Laptop(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" ry="2"></rect>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  )
}

function Tablet(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12" y2="18"></line>
    </svg>
  )
}

function MessageSquare(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  Key,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  RotateCcw,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminSecurity() {
  const [loading, setLoading] = useState(true)
  const [admins, setAdmins] = useState([])
  const [logs, setLogs] = useState([])
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [loginNotifications, setLoginNotifications] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, logsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/audit-logs"),
        ])
        if (usersRes.ok) {
          const data = await usersRes.json()
          setAdmins((data.users || []).filter((u) => u.role === "ADMIN"))
        }
        if (logsRes.ok) {
          const data = await logsRes.json()
          setLogs(data.logs || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  const getStatusBadge = (action) => {
    const a = (action || "").toLowerCase()
    if (a.includes("login") && a.includes("fail")) {
      return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Fallido</Badge>
    }
    if (a.includes("login")) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Exitoso</Badge>
    }
    if (a.includes("config") || a.includes("setting")) {
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Config</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Info</Badge>
  }

  const failedLogs = logs.filter((l) => (l.action || "").toLowerCase().includes("fail")).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seguridad Administrativa</h1>
        <p className="text-gray-500">Gestiona la seguridad y configuraciones de acceso</p>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
          <TabsTrigger value="logs">Logs de Seguridad</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Autenticación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Autenticación de dos factores</Label>
                    <p className="text-sm text-muted-foreground">Verificación adicional para login</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notificaciones de login</Label>
                    <p className="text-sm text-muted-foreground">Email en cada nuevo login</p>
                  </div>
                  <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
                </div>
                <div className="space-y-2">
                  <Label>Tiempo de sesión (minutos)</Label>
                  <Input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Máximo intentos de login</Label>
                  <Input type="number" value={maxLoginAttempts} onChange={(e) => setMaxLoginAttempts(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Políticas de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Lock className="w-4 h-4 mr-2" />
                  Cambiar Contraseña de Admin
                </Button>
                <Button className="w-full" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Regenerar Claves API
                </Button>
                <Button className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Revisar Permisos
                </Button>
                <Button className="w-full" variant="destructive">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Cerrar Todas las Sesiones
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admins" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Administradores
              </CardTitle>
              <CardDescription>Usuarios con acceso administrativo</CardDescription>
            </CardHeader>
            <CardContent>
              {admins.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay administradores registrados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name || "Sin nombre"}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-800">{admin.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(admin.createdAt).toLocaleDateString("es-ES")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Registro de Actividad
              </CardTitle>
              <CardDescription>Historial de eventos de seguridad</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay logs de seguridad</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Acción</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user?.email || "Sistema"}</TableCell>
                        <TableCell>{log.ipAddress || "-"}</TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleString("es-ES")}</TableCell>
                        <TableCell>{getStatusBadge(log.action)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{admins.length}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Intentos Fallidos</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{failedLogs}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{logs.length}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estado</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Activo</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

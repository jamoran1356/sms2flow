import { CheckCircle, Lock, Shield, User, Zap } from "lucide-react"

export default function LandingSecurity() {
  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 px-3 py-1 text-sm text-white shadow-lg">
              Seguridad Garantizada
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
              Un sistema seguro para todos
            </h2>
            <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Kiipay implementa múltiples capas de seguridad para proteger tanto a compradores como a vendedores.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative flex flex-col items-center space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg">
              <div className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 p-3 text-white shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Protección para Compradores</h3>
              <p className="text-center text-slate-600">
                Todos los pagos están protegidos. Para productos físicos, los fondos se mantienen en custodia hasta que
                confirmes la recepción.
              </p>
              <ul className="space-y-2 text-sm text-left w-full">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Verificación de vendedores</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Sistema de reseñas transparente</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Garantía de devolución</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative flex flex-col items-center space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg">
              <div className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 p-3 text-white shadow-lg">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Protección para Vendedores</h3>
              <p className="text-center text-slate-600">
                Los pagos para productos digitales son inmediatos. Para bienes físicos, implementamos políticas que
                previenen fraudes y disputas injustas.
              </p>
              <ul className="space-y-2 text-sm text-left w-full">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Verificación de compradores</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Protección contra chargebacks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Resolución de disputas justa</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative flex flex-col items-center space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg">
              <div className="rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 p-3 text-white shadow-lg">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Seguridad Tecnológica</h3>
              <p className="text-center text-slate-600">
                Utilizamos la tecnología blockchain para garantizar transacciones seguras y transparentes, con múltiples
                capas de protección.
              </p>
              <ul className="space-y-2 text-sm text-left w-full">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Autenticación de dos factores</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Encriptación de extremo a extremo</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Monitoreo de IA contra fraudes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-1 text-indigo-600">
              <Zap className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">Sistema de Insignias</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Construye tu reputación en la plataforma</h3>
            <p className="text-slate-600">
              Nuestro sistema de insignias valida la experiencia y confiabilidad de los usuarios. Cada insignia
              representa un logro específico que ayuda a construir confianza en la comunidad.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  Insignia de Identidad Verificada: Confirma que el usuario ha pasado por nuestro proceso de
                  verificación KYC.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  Insignia de Vendedor Confiable: Otorgada después de completar exitosamente más de 50 transacciones.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  Insignia de Envíos Rápidos: Para vendedores con tiempos de entrega consistentemente rápidos.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  Insignia de Altamente Valorado: Para usuarios con calificaciones promedio superiores a 4.8/5.
                </span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 opacity-30 blur-lg"></div>
            <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">María Rodríguez</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                          <Star className="h-3 w-3 text-amber-600" />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 ml-2">Miembro desde 2023</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Estadísticas del Perfil</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-600">Transacciones:</p>
                      <p className="font-medium">127</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Valoración:</p>
                      <p className="font-medium flex items-center">
                        4.9/5
                        <span className="flex ml-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          ))}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Tiempo de respuesta:</p>
                      <p className="font-medium">{"<"} 1 hora</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Nivel de verificación:</p>
                      <p className="font-medium">Avanzado</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center mb-2">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Vendedor Verificado</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Este usuario ha completado todos los niveles de verificación y tiene un historial de transacciones
                    excelente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Star(props) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

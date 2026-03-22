import Link from "next/link"

export const metadata = {
  title: "Términos y condiciones | sms2flow",
  description:
    "Términos y condiciones de uso de sms2flow para cuentas, billeteras, operaciones por SMS, servicios blockchain y uso aceptable de la plataforma.",
}

const sections = [
  {
    title: "1. Aceptación",
    paragraphs: [
      "Al acceder, registrarse o utilizar sms2flow, el usuario acepta estos Términos y Condiciones de Uso. Si no está de acuerdo con ellos, no debe utilizar la plataforma ni sus servicios asociados.",
    ],
  },
  {
    title: "2. Objeto del servicio",
    paragraphs: [
      "sms2flow es una plataforma tecnológica orientada a facilitar interacciones con billeteras, operaciones registradas en blockchain y ejecución de instrucciones transmitidas mediante interfaces web y, cuando aplique, mensajes SMS procesados por la plataforma.",
      "La disponibilidad de determinadas funciones, activos digitales, redes, tarifas, validaciones o integraciones puede variar en cualquier momento por razones técnicas, regulatorias, operativas o de seguridad.",
    ],
  },
  {
    title: "3. Registro y cuenta",
    paragraphs: [
      "El usuario debe proporcionar información veraz, actualizada y suficiente para crear y mantener su cuenta. Es responsable de custodiar sus credenciales, cuentas de correo, teléfonos vinculados, sesiones activas y cualquier factor de autenticación asociado.",
      "sms2flow puede suspender, limitar o cancelar cuentas con información falsa, actividad sospechosa, incumplimiento de estos términos, uso abusivo o riesgos de seguridad detectados razonablemente.",
    ],
  },
  {
    title: "4. Uso de billeteras, SMS y operaciones",
    paragraphs: [
      "El usuario es el único responsable de revisar direcciones de destino, montos, redes, teléfonos asociados, comandos enviados y cualquier otro dato usado para autorizar una operación. Las operaciones blockchain pueden ser irreversibles una vez confirmadas por la red correspondiente.",
      "La entrega de mensajes SMS, la latencia de red, el comportamiento de operadores móviles, terceros integrados o infraestructuras blockchain escapan parcialmente al control directo de sms2flow. En consecuencia, pueden producirse demoras, rechazos, costos adicionales, reintentos o fallos de procesamiento.",
    ],
  },
  {
    title: "5. Riesgos y ausencia de asesoría financiera",
    paragraphs: [
      "El uso de activos digitales implica riesgos tecnológicos, regulatorios y de mercado, incluyendo volatilidad, pérdida de acceso, errores operativos, congestión de red, cambios de protocolo y eventuales incidentes de terceros.",
      "sms2flow presta un servicio tecnológico y no ofrece asesoría financiera, legal, contable, tributaria ni de inversión. Toda decisión económica o patrimonial basada en el uso de la plataforma es tomada bajo exclusiva responsabilidad del usuario.",
    ],
  },
  {
    title: "6. Tarifas y cargos",
    paragraphs: [
      "El uso de la plataforma puede estar sujeto a comisiones propias de sms2flow, cargos por SMS, costos de proveedores externos y tarifas de red o gas aplicables a cada blockchain. Salvo que se indique expresamente lo contrario, dichos importes no son reembolsables una vez consumido el servicio o emitida la operación.",
    ],
  },
  {
    title: "7. Uso permitido",
    paragraphs: [
      "Queda prohibido utilizar sms2flow para actividades ilícitas, fraude, lavado de activos, envío masivo no autorizado, suplantación de identidad, abuso de infraestructura, pruebas de intrusión no autorizadas, vulneración de derechos de terceros o cualquier conducta que pueda comprometer la seguridad, continuidad o reputación del servicio.",
    ],
  },
  {
    title: "8. Propiedad intelectual",
    paragraphs: [
      "El software, diseño, marca, contenido, documentación, interfaces y demás elementos de sms2flow están protegidos por derechos de propiedad intelectual. El uso de la plataforma no transfiere al usuario ningún derecho de titularidad sobre dichos elementos, salvo la licencia limitada, revocable y no exclusiva necesaria para usar el servicio conforme a estos términos.",
    ],
  },
  {
    title: "9. Servicios de terceros",
    paragraphs: [
      "La plataforma puede depender de servicios de terceros, incluidos proveedores de autenticación, operadores de mensajería, redes blockchain, infraestructura de hosting o herramientas de análisis y soporte. sms2flow no responde por actos u omisiones propios de dichos terceros fuera del alcance razonable de control de la plataforma.",
    ],
  },
  {
    title: "10. Disponibilidad y garantías",
    paragraphs: [
      "sms2flow se ofrece sobre una base de disponibilidad razonable. No se garantiza servicio ininterrumpido, libre de errores o compatible con todos los dispositivos, redes móviles, jurisdicciones o activos digitales. El servicio puede ser modificado, restringido o interrumpido temporal o definitivamente por mantenimiento, seguridad, cumplimiento normativo o evolución del producto.",
    ],
  },
  {
    title: "11. Limitación de responsabilidad",
    paragraphs: [
      "En la máxima medida permitida por la ley aplicable, sms2flow no será responsable por pérdidas indirectas, lucro cesante, pérdida de oportunidad, pérdida de datos, daños reputacionales, fluctuaciones de mercado, errores del usuario, envíos a direcciones incorrectas, indisponibilidad de terceros o consecuencias derivadas del uso de redes blockchain y operadores de mensajería.",
      "Cuando la responsabilidad de sms2flow resulte legalmente exigible, esta quedará limitada al importe efectivamente pagado por el usuario a sms2flow por el servicio directamente relacionado con el evento reclamado durante el período inmediatamente anterior que establezca la normativa aplicable.",
    ],
  },
  {
    title: "12. Indemnidad",
    paragraphs: [
      "El usuario se obliga a mantener indemne a sms2flow frente a reclamaciones, sanciones, pérdidas, daños o costos derivados del uso indebido de la plataforma, del incumplimiento de estos términos o de la vulneración de derechos de terceros imputable al usuario.",
    ],
  },
  {
    title: "13. Suspensión y terminación",
    paragraphs: [
      "sms2flow podrá suspender funciones, retener temporalmente operaciones en revisión, limitar accesos o terminar cuentas cuando existan indicios razonables de fraude, incumplimiento, riesgo de seguridad, orden de autoridad competente o necesidad de proteger a la plataforma, a otros usuarios o a terceros.",
    ],
  },
  {
    title: "14. Modificaciones",
    paragraphs: [
      "sms2flow podrá actualizar estos términos para reflejar cambios funcionales, regulatorios, comerciales o de seguridad. La versión vigente será la publicada en esta página. El uso continuado del servicio después de su actualización constituye aceptación de la nueva versión.",
    ],
  },
  {
    title: "15. Ley aplicable y jurisdicción",
    paragraphs: [
      "Estos términos se interpretarán conforme a la legislación aplicable al titular del servicio, salvo que una norma imperativa disponga otra cosa. Cualquier controversia será sometida a la jurisdicción competente que corresponda según dicha normativa y el domicilio del operador del servicio.",
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 md:px-6 md:py-20">
          <div className="inline-flex w-fit items-center rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-700">
            Documento legal
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Términos y condiciones de uso</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Última actualización: 22 de marzo de 2026. Estas condiciones regulan el acceso y uso de sms2flow,
              incluidas las operaciones de billetera, autenticación y mensajería SMS vinculadas a la plataforma.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/privacy"
              className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-sky-400 hover:text-sky-600"
            >
              Ver política de privacidad
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-700"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Este documento cubre los riesgos operativos y contractuales básicos del producto, pero conviene revisarlo
            con asesoría legal antes de un despliegue comercial o regulado.
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <article key={section.title} className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-7 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 text-sm text-slate-600">
            sms2flow debe publicar junto a estos términos la identidad del operador del servicio y su canal oficial de
            notificaciones contractuales para que el documento quede completamente listo para producción.
          </div>
        </div>
      </section>
    </main>
  )
}
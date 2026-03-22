import Link from "next/link"

export const metadata = {
  title: "Política de privacidad | sms2flow",
  description:
    "Política de privacidad de sms2flow sobre el tratamiento de datos personales, autenticación, billeteras, operaciones por SMS y actividad transaccional.",
}

const sections = [
  {
    title: "1. Alcance",
    paragraphs: [
      "Esta Política de Privacidad describe cómo sms2flow recopila, usa, almacena y protege la información personal y transaccional tratada a través del sitio web, la aplicación y los servicios vinculados al envío y recepción de instrucciones por SMS y al uso de billeteras asociadas a la red Flow.",
      "La política aplica a usuarios registrados, visitantes del sitio y cualquier persona que interactúe con funcionalidades de autenticación, billeteras, transacciones, clientes, staking o mensajería SMS dentro de la plataforma.",
    ],
  },
  {
    title: "2. Datos que tratamos",
    paragraphs: [
      "Podemos tratar datos de identificación y contacto como nombre, correo electrónico, número de teléfono, imagen de perfil y credenciales de acceso. Cuando el registro se realiza con proveedores externos, también tratamos la información compartida por dichos proveedores para autenticar la cuenta.",
      "Además, la plataforma trata información operativa y financiera necesaria para prestar el servicio, incluyendo direcciones de billetera, red utilizada, balances, historial de transacciones, posiciones de staking, contactos o clientes creados por el usuario, contratos asociados y notificaciones del sistema.",
      "En el flujo SMS, sms2flow puede tratar números de origen y destino, contenido del mensaje, comandos detectados, montos, estados de procesamiento y marcas temporales necesarias para ejecutar o auditar operaciones.",
      "También podemos procesar identificadores de sesión, tokens de autenticación, registros de actividad y datos técnicos mínimos requeridos para seguridad, prevención de fraude, mantenimiento y continuidad del servicio.",
    ],
  },
  {
    title: "3. Finalidades del tratamiento",
    paragraphs: [
      "Usamos los datos para crear y administrar cuentas, autenticar usuarios, generar o vincular billeteras, procesar instrucciones SMS, ejecutar operaciones en blockchain, mostrar balances e historiales, habilitar funciones administrativas y prestar soporte.",
      "También utilizamos la información para proteger la plataforma, detectar accesos no autorizados, investigar incidentes, prevenir fraude, cumplir obligaciones legales, responder requerimientos de autoridad competente y mejorar la estabilidad operativa del servicio.",
    ],
  },
  {
    title: "4. Base jurídica",
    paragraphs: [
      "El tratamiento se apoya, según el caso, en la ejecución de la relación contractual con el usuario, en el consentimiento otorgado al registrarse o utilizar funciones concretas, en el interés legítimo de proteger la plataforma y en el cumplimiento de obligaciones legales aplicables.",
    ],
  },
  {
    title: "5. Compartición de información",
    paragraphs: [
      "sms2flow no vende datos personales. La información puede compartirse con proveedores que participan en la operación del servicio, tales como servicios de autenticación, infraestructura, bases de datos, monitoreo, mensajería, custodia tecnológica o procesamiento vinculado a la red blockchain, siempre en la medida necesaria para la prestación del servicio.",
      "Cierta información transaccional puede quedar registrada en redes blockchain públicas y, por su naturaleza, no depende exclusivamente de sms2flow ni puede ser eliminada de dichas redes una vez confirmada la operación.",
      "También podremos divulgar información cuando sea necesario para cumplir la ley, atender requerimientos regulatorios o defender derechos e intereses legítimos de sms2flow o de terceros.",
    ],
  },
  {
    title: "6. Conservación",
    paragraphs: [
      "Conservamos la información durante el tiempo necesario para mantener la cuenta activa, ejecutar operaciones, atender soporte, resolver controversias, mantener trazabilidad y cumplir obligaciones legales, fiscales, contables, de seguridad o prevención de fraude.",
      "Cuando los datos dejan de ser necesarios, se eliminan o anonimizan en la medida técnicamente posible, salvo aquellos que deban mantenerse por obligación legal o por persistir en registros blockchain públicos.",
    ],
  },
  {
    title: "7. Seguridad",
    paragraphs: [
      "sms2flow aplica medidas técnicas y organizativas razonables para proteger la información contra acceso no autorizado, alteración, pérdida o divulgación indebida. Entre ellas pueden incluirse controles de acceso, gestión de sesiones, hash de contraseñas y protección reforzada de credenciales o claves sensibles cuando corresponda.",
      "Ningún sistema es completamente infalible. Por ello, el usuario también debe proteger su correo, teléfono, dispositivos, contraseñas, cuentas vinculadas y cualquier mecanismo usado para autorizar operaciones.",
    ],
  },
  {
    title: "8. Derechos del usuario",
    paragraphs: [
      "El usuario puede solicitar acceso, rectificación, actualización, oposición, supresión o portabilidad de sus datos personales, así como retirar consentimientos cuando la base jurídica aplicable sea el consentimiento. Las solicitudes deberán canalizarse por los medios oficiales de soporte habilitados por sms2flow.",
      "Si la solicitud afecta información necesaria para mantener seguridad, prevenir fraude, cumplir obligaciones legales o preservar registros transaccionales ya emitidos, sms2flow podrá limitar total o parcialmente su alcance conforme a la normativa aplicable.",
    ],
  },
  {
    title: "9. Menores de edad",
    paragraphs: [
      "La plataforma no está dirigida a menores de edad sin autorización válida de sus representantes legales. Si sms2flow detecta que se ha registrado información de un menor en contra de las reglas aplicables, podrá restringir o cancelar la cuenta y adoptar medidas de supresión según corresponda.",
    ],
  },
  {
    title: "10. Transferencias internacionales",
    paragraphs: [
      "Debido a la naturaleza de la infraestructura tecnológica, algunos proveedores o servicios integrados pueden operar en jurisdicciones distintas a la del usuario. Al utilizar sms2flow, el usuario entiende que determinados tratamientos pueden implicar transferencias internacionales sujetas a las salvaguardas razonables que resulten aplicables.",
    ],
  },
  {
    title: "11. Cambios a esta política",
    paragraphs: [
      "sms2flow podrá actualizar esta Política de Privacidad para reflejar cambios normativos, operativos o funcionales. La versión vigente será la publicada en esta página, con indicación de la fecha de última actualización. El uso continuado del servicio después de la publicación de cambios implica aceptación de la versión actualizada.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 md:px-6 md:py-20">
          <div className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
            Documento legal
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Política de privacidad</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Última actualización: 22 de marzo de 2026. Esta política explica qué datos trata sms2flow,
              por qué los trata y qué derechos tienen los usuarios sobre su información.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/terms"
              className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600"
            >
              Ver términos y condiciones
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-4 py-2 font-medium text-white transition hover:bg-emerald-600"
            >
              Ir al registro
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Este texto sirve como base operativa para sms2flow y debe revisarse con asesoría legal local antes de
            su publicación definitiva si la aplicación operará comercialmente o en mercados regulados.
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
            Para consultas sobre estas condiciones de privacidad, sms2flow deberá habilitar y mantener un canal de
            contacto oficial visible dentro de la aplicación o su sitio público.
          </div>
        </div>
      </section>
    </main>
  )
}
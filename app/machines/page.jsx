import Link from "next/link"

export const metadata = {
  title: "SMS2Flow Machines — Vending Machines meet Blockchain",
  description:
    "Convierte cualquier máquina expendedora en un punto de venta cripto. Compra con un SMS, paga con blockchain, sin apps ni internet.",
}

export default function MachinesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ── Hero: Vending Machine + Sales Pitch ─────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwOGYwOGYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDE0djJoMTB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#08f08f] hover:text-[#08f08f]/80 transition-colors">
              ← Volver al inicio
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left: Vending Machine Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#08f08f]/20 to-teal-400/20 blur-2xl"></div>
                <div className="relative w-72 md:w-80 rounded-2xl border-2 border-slate-600 bg-gradient-to-b from-slate-700 to-slate-800 p-6 shadow-2xl">
                  {/* Machine header */}
                  <div className="rounded-lg bg-[#08f08f] px-4 py-2 text-center">
                    <span className="text-sm font-bold text-slate-900 tracking-wider">SMS2FLOW VENDING</span>
                  </div>

                  {/* Product grid */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {["☕", "🥤", "🍫", "💧", "🧃", "🍪"].map((emoji, i) => (
                      <div key={i} className="flex flex-col items-center rounded-lg bg-slate-600/50 p-3 backdrop-blur">
                        <span className="text-2xl">{emoji}</span>
                        <span className="mt-1 text-[10px] text-slate-300 font-mono">0.{i + 1} FLOW</span>
                      </div>
                    ))}
                  </div>

                  {/* SMS Display */}
                  <div className="mt-4 rounded-lg border border-slate-500 bg-slate-900 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-[#08f08f] animate-pulse"></div>
                      <span className="text-[10px] text-[#08f08f] font-mono uppercase tracking-widest">SMS Mode Active</span>
                    </div>
                    <p className="text-xs text-[#08f08f] font-mono leading-relaxed">
                      &gt; BUY 1 COFFEE<br />
                      ✓ Pagado con FLOW<br />
                      ✓ Dispensando...
                    </p>
                  </div>

                  {/* Dispense slot */}
                  <div className="mt-4 rounded-lg border-2 border-dashed border-slate-500 bg-slate-900/50 py-3 text-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">▼ Recoger producto ▼</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sales Pitch */}
            <div className="flex flex-col space-y-6">
              <div className="inline-flex">
                <span className="rounded-full bg-[#08f08f]/10 border border-[#08f08f]/30 px-4 py-1.5 text-sm font-semibold text-[#08f08f]">
                  Próximamente
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
                Tu máquina expendedora,{" "}
                <span className="text-[#08f08f]">potenciada por blockchain</span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                Imagina una máquina de vending donde el cliente compra enviando un simple SMS.
                Sin apps, sin internet en el teléfono, sin tarjetas. Solo un mensaje de texto
                y la blockchain se encarga del resto.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <span className="inline-flex items-center justify-center rounded-lg bg-[#08f08f] px-6 py-3 text-sm font-bold text-slate-900 hover:bg-[#08f08f]/90 transition-colors shadow-lg shadow-[#08f08f]/20">
                    Regístrate como operador
                  </span>
                </Link>
                <a href="#como-funciona">
                  <span className="inline-flex items-center justify-center rounded-lg border border-slate-500 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700/50 transition-colors">
                    Ver cómo funciona ↓
                  </span>
                </a>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <p className="text-2xl font-bold text-[#08f08f]">0%</p>
                  <p className="text-xs text-slate-400">Comisión de red</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#08f08f]">&lt;3s</p>
                  <p className="text-xs text-slate-400">Tiempo de pago</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#08f08f]">2G</p>
                  <p className="text-xs text-slate-400">Funciona sin datos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="como-funciona" className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-[#08f08f]/10 px-4 py-1.5 text-sm font-semibold text-[#08f08f] mb-4">
              Así de simple
            </span>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Tres actores, un flujo sin fricción: el usuario, la máquina y la blockchain.
              Todo conectado a través de un simple SMS.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-5 items-start">
            {[
              {
                step: "1",
                icon: "📱",
                title: "El usuario envía un SMS",
                description: "Desde cualquier teléfono básico escribe: BUY 1 COFFEE y lo envía al número de la máquina.",
              },
              {
                step: "",
                icon: "→",
                title: "",
                description: "",
                isArrow: true,
              },
              {
                step: "2",
                icon: "⚡",
                title: "El backend procesa y cobra",
                description: "Nuestro servidor valida el comando, debita FLOW del wallet del usuario y registra la compra on-chain.",
              },
              {
                step: "",
                icon: "→",
                title: "",
                description: "",
                isArrow: true,
              },
              {
                step: "3",
                icon: "🎉",
                title: "La máquina entrega",
                description: "El contrato emite un evento, la máquina lo detecta y dispensa el producto. SMS de confirmación enviado.",
              },
            ].map((item, i) =>
              item.isArrow ? (
                <div key={i} className="hidden md:flex items-center justify-center pt-10">
                  <div className="text-3xl text-[#08f08f] font-bold">→</div>
                </div>
              ) : (
                <div key={i} className="relative bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-[#08f08f]/10 flex items-center justify-center mb-4">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#08f08f] flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-900">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Use Cases / Integration Section ─────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-[#08f08f]/10 px-4 py-1.5 text-sm font-semibold text-[#08f08f] mb-4">
              Más allá del vending
            </span>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">
              SMS + Blockchain en tu vida cotidiana
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              La tecnología de SMS2Flow no se limita a máquinas expendedoras.
              Cualquier dispositivo o servicio del mundo real puede conectarse a pagos blockchain a través de un mensaje de texto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: "🏪",
                title: "Tiendas y kioscos",
                description: "Pequeños comerciantes aceptan pagos cripto sin necesidad de terminal POS ni smartphone. El cliente envía un SMS, el pago se confirma al instante.",
              },
              {
                emoji: "🅿️",
                title: "Parquímetros inteligentes",
                description: "Paga el estacionamiento con un SMS al número del parquímetro. Sin monedas, sin app, la barrera se abre sola al confirmar el pago on-chain.",
              },
              {
                emoji: "🏥",
                title: "Farmacias y clínicas rurales",
                description: "Zonas sin internet estable pero con cobertura 2G. Los pacientes pagan medicamentos o consultas con un mensaje de texto y wallet blockchain.",
              },
              {
                emoji: "🚌",
                title: "Transporte público",
                description: "Sube al bus y paga tu pasaje con un SMS. El sistema verifica tu saldo en blockchain y emite tu boleto digital de forma instantánea.",
              },
              {
                emoji: "🎰",
                title: "Máquinas recreativas",
                description: "Arcades, juegos, lavadoras de autolavado. Cualquier máquina operada con monedas puede migrar a pagos por SMS + blockchain.",
              },
              {
                emoji: "🌾",
                title: "Cooperativas agrícolas",
                description: "Agricultores que venden cosechas directamente. Reciben pagos cripto vía SMS sin necesidad de cuenta bancaria ni smartphone.",
              },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-[#08f08f]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#08f08f]/10 flex items-center justify-center mb-4 group-hover:bg-[#08f08f]/20 transition-colors">
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technical Architecture (simplified) ─────────────────────────── */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900">
              Arquitectura en 3 capas
            </h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              Simple por fuera, robusto por dentro. Cada componente hace una sola cosa y la hace bien.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white border border-slate-200 p-8 text-center shadow-sm">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <span className="text-3xl">📡</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Capa de Acceso</h3>
              <p className="text-sm font-medium text-[#08f08f] mb-3">SMS / Mensajes de texto</p>
              <p className="text-sm text-slate-600">
                El usuario interactúa mediante SMS estándar. Funciona en cualquier teléfono con red 2G.
                No requiere internet, apps ni datos móviles.
              </p>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-8 text-center shadow-sm">
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Capa de Lógica</h3>
              <p className="text-sm font-medium text-[#08f08f] mb-3">Backend + Orquestación</p>
              <p className="text-sm text-slate-600">
                Nuestro servidor valida comandos, gestiona wallets, ejecuta transacciones
                y coordina con los dispositivos físicos en tiempo real.
              </p>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-8 text-center shadow-sm">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <span className="text-3xl">⛓️</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Capa de Settlement</h3>
              <p className="text-sm font-medium text-[#08f08f] mb-3">Smart Contracts on-chain</p>
              <p className="text-sm text-slate-600">
                Los pagos se liquidan en blockchain. Cada transacción queda registrada
                de forma inmutable, auditable y verificable por cualquiera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            ¿Tienes máquinas expendedoras?
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
            Integra pagos blockchain sin cambiar tu hardware. Solo necesitas una conexión a internet
            en la máquina y nosotros nos encargamos del resto con tecnología SMS.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <span className="inline-flex items-center justify-center rounded-lg bg-[#08f08f] px-8 py-3.5 text-sm font-bold text-slate-900 hover:bg-[#08f08f]/90 transition-colors shadow-lg shadow-[#08f08f]/20">
                Comienza gratis →
              </span>
            </Link>
            <Link href="/">
              <span className="inline-flex items-center justify-center rounded-lg border border-slate-500 px-8 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-700/50 transition-colors">
                Conoce SMS2Flow
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

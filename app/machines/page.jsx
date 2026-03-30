import Link from "next/link"

export const metadata = {
  title: "SMS2Flow Machines | RWA on BSC",
  description:
    "SMS2Flow Machines conecta comandos SMS con pagos y settlement on-chain en BNB Smart Chain para vending machines y activos fisicos (RWA).",
}

function formatAddress(value) {
  if (!value) return "No configurada"
  if (value.length < 12) return value
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

function resolveNetwork() {
  if (process.env.BSC_MAINNET_RPC && !process.env.BSC_TESTNET_RPC) {
    return { name: "BSC Mainnet", chainId: 56, explorer: "https://bscscan.com" }
  }
  return { name: "BSC Testnet", chainId: 97, explorer: "https://testnet.bscscan.com" }
}

function BilingualTitle({ es, en }) {
  return (
    <div className="space-y-1">
      <h2 className="i18n-es text-2xl font-semibold">{es}</h2>
      <h2 className="i18n-en text-2xl font-semibold">{en}</h2>
    </div>
  )
}

function BilingualParagraph({ es, en }) {
  return (
    <div className="space-y-3">
      <p className="i18n-es rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{es}</p>
      <p className="i18n-en rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{en}</p>
    </div>
  )
}

export default function MachinesPage() {
  const network = resolveNetwork()
  const registryAddress = process.env.MACHINE_REGISTRY_ADDRESS || ""
  const operatorAddress = process.env.MACHINE_OPERATOR_ADDRESS || ""
  const adminAddress = process.env.MACHINE_ADMIN_ADDRESS || ""
  const bscscanContractUrl = registryAddress
    ? `${network.explorer}/address/${registryAddress}`
    : ""

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <Link href="/" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
              <span className="i18n-es">Volver al inicio</span>
              <span className="i18n-en">Back to home</span>
            </Link>
          </div>

          <h1 className="i18n-es text-3xl font-bold tracking-tight md:text-4xl">SMS2Flow Machines en BSC</h1>
          <h1 className="i18n-en text-3xl font-bold tracking-tight md:text-4xl">SMS2Flow Machines on BSC</h1>
          <div className="mt-3 max-w-6xl">
            <BilingualParagraph
              es="Esta extension de SMS2Flow conecta maquinas fisicas (vending, lockers, kioscos) con pagos on-chain. El acceso es por SMS, la orquestacion vive en backend, y la liquidacion/asset-layer se ejecuta en BNB Smart Chain."
              en="This SMS2Flow extension connects physical machines (vending, lockers, kiosks) with on-chain payments. SMS is the access layer, backend services orchestrate logic, and settlement/asset logic runs on BNB Smart Chain."
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Access Layer</p>
              <p className="mt-1 text-sm font-semibold">SMS Command / Comando SMS</p>
              <p className="mt-1 text-sm text-slate-600">BUY via SMS without internet / Compra por SMS sin internet.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Logic Layer</p>
              <p className="mt-1 text-sm font-semibold">Backend Orchestration / Orquestacion Backend</p>
              <p className="mt-1 text-sm text-slate-600">Validates and executes on-chain purchase / Valida y ejecuta compra on-chain.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Settlement Layer</p>
              <p className="mt-1 text-sm font-semibold">BSC Smart Contract / Contrato BSC</p>
              <p className="mt-1 text-sm text-slate-600">On-chain revenue and auditable events / Revenue on-chain y eventos auditables.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <BilingualTitle
          es="Informacion del contrato en BSC"
          en="BSC Contract Information"
        />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Red / Network</p>
            <p className="mt-1 text-sm font-semibold">{network.name}</p>
            <p className="mt-1 text-sm text-slate-600">Chain ID: {network.chainId}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Machine Registry / Registro de Maquinas</p>
            <p className="mt-1 break-all text-sm font-semibold">{registryAddress || "MACHINE_REGISTRY_ADDRESS no configurada"}</p>
            {bscscanContractUrl ? (
              <a
                href={bscscanContractUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                <span className="i18n-es">Ver contrato en explorer</span>
                <span className="i18n-en">Open in explorer</span>
              </a>
            ) : null}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Admin Role / Rol Admin</p>
            <p className="mt-1 text-sm font-semibold">{formatAddress(adminAddress)}</p>
            <p className="mt-1 text-sm text-slate-600">DEFAULT_ADMIN_ROLE</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Operator Role / Rol Operador</p>
            <p className="mt-1 text-sm font-semibold">{formatAddress(operatorAddress)}</p>
            <p className="mt-1 text-sm text-slate-600">OPERATOR_ROLE (wallet backend)</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <BilingualTitle
          es="Flujo operativo"
          en="Operational Flow"
        />
        <ol className="mt-4 space-y-3 text-sm text-slate-700">
          <li className="rounded-lg border border-slate-200 bg-white p-4">1. SMS / Text: <span className="font-semibold">BUY machineId productId REF ref</span></li>
          <li className="rounded-lg border border-slate-200 bg-white p-4">2. Webhook API validates SMS and executes <span className="font-semibold">purchaseProduct</span> on BSC / API webhook valida SMS y ejecuta compra en BSC.</li>
          <li className="rounded-lg border border-slate-200 bg-white p-4">3. <span className="font-semibold">ProductPurchased</span> event triggers IoT integration / dispara integracion IoT.</li>
          <li className="rounded-lg border border-slate-200 bg-white p-4">4. Device confirms delivery at <span className="font-semibold">/api/machines/dispense-callback</span> / el dispositivo confirma entrega.</li>
          <li className="rounded-lg border border-slate-200 bg-white p-4">5. Backend calls <span className="font-semibold">confirmDispense</span> and closes local transaction / cierra transaccion local.</li>
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <BilingualTitle
          es="Vision RWA y Cross-chain"
          en="RWA and Cross-chain Vision"
        />
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
          <BilingualParagraph
            es="El modulo Machines posiciona a SMS2Flow como infraestructura RWA: las maquinas fisicas generan revenue on-chain verificable, con trazabilidad por evento y capacidad de auditoria para operacion real."
            en="The Machines module positions SMS2Flow as RWA infrastructure: physical machines produce verifiable on-chain revenue with event-based traceability and operational auditability."
          />
          <div className="mt-3">
            <BilingualParagraph
              es="Hoy el settlement principal esta en BSC. En fases futuras, el backend puede publicar estados o pruebas de actividad hacia Flow u otras redes para interoperabilidad, sin romper el flujo SMS existente."
              en="Today, primary settlement runs on BSC. In future phases, backend services can publish state or proofs to Flow or other ecosystems for interoperability without breaking the existing SMS flow."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

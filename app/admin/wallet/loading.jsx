export default function AdminWalletLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="w-56 h-8 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Balance Total */}
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <div className="w-32 h-6 bg-slate-700 rounded animate-pulse mb-2" />
        <div className="w-48 h-4 bg-slate-700 rounded animate-pulse mb-4" />
        <div className="w-40 h-10 bg-slate-700 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index}>
              <div className="w-12 h-3 bg-slate-700 rounded animate-pulse mb-1" />
              <div className="w-20 h-4 bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-1 bg-white p-1 rounded-lg w-fit">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-44 h-6 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-56 h-4 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-64 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

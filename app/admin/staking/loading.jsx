export default function AdminStakingLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-64 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Métricas de Staking */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-1 bg-white p-1 rounded-lg w-fit">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-64 h-4 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-64 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

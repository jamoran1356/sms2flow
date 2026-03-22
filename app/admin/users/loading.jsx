export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="flex-1 h-10 bg-slate-200 rounded animate-pulse"></div>
            <div className="w-40 h-10 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

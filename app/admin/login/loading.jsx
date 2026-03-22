export default function AdminLoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Skeleton */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-44 h-14 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-64 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-80 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>

        {/* Login Card Skeleton */}
        <div className="bg-white shadow-2xl rounded-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="w-72 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>

          <div className="space-y-5">
            {/* Demo credentials skeleton */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-200 rounded animate-pulse"></div>
                <div className="ml-3 space-y-2">
                  <div className="w-32 h-4 bg-blue-200 rounded animate-pulse"></div>
                  <div className="w-48 h-3 bg-blue-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Form fields skeleton */}
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Button skeleton */}
            <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Support link skeleton */}
          <div className="mt-8 text-center border-t pt-6">
            <div className="w-64 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="text-center space-y-2">
          <div className="w-56 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
          <div className="w-48 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

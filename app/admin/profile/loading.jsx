export default function AdminProfileLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="w-52 h-8 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-64 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg w-fit">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="w-28 h-8 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="w-44 h-6 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-56 h-4 bg-gray-200 rounded animate-pulse mb-6" />

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
            <div>
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

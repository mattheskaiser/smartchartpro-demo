export default function MaintenancePage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm min-h-[88px]">
        <div className="max-w-7xl mx-auto px-6 py-4 h-full">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">SmartChart Pro</h1>
                <p className="text-xs text-gray-500">Resident Care Documentation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full screen light blue background */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
              <p className="text-gray-600 mb-6">
                We're currently performing scheduled maintenance to improve your experience.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animation-delay-400"></div>
                </div>
                <span>We'll be back shortly</span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">Thank you for your patience</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link"

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Digital Document Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Request official documents online, track status, and get notified
        </p>
        <div className="space-x-4">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Request Documents</h3>
          <p className="text-gray-600">Apply for birth certificates, CNIC, domicile, and more</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Track Status</h3>
          <p className="text-gray-600">Real-time updates on your document requests</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Get Notified</h3>
          <p className="text-gray-600">Receive notifications when status changes</p>
        </div>
      </div>
    </div>
  )
}
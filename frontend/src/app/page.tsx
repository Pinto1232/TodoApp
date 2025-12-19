'use client';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo App</h1>
          <p className="text-gray-600">
            Built with Next.js, Node.js &amp; Clean Architecture
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-500 text-center mb-4">
            Start building your features here!
          </p>
          <div className="flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              Test Button
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

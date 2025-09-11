export default function TabSection() {
  return (
    <section className="bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-md shadow-sm">
              For the People
            </button>
            <button className="px-6 py-3 text-gray-500 font-semibold rounded-md hover:text-gray-700 transition-colors">
              By the People
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
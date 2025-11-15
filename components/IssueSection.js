export default function IssueSection() {
  const issues = [
    {
      title: "Water",
      description:
        "Report water leaks, broken pipes, and supply issues in your area.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M12 2c3.5 3.9 7 8.2 7 11.5A7 7 0 0 1 5 13.5C5 10.2 8.5 5.9 12 2z" />
        </svg>
      ),
      accent: "from-blue-500 to-blue-600",
    },
    {
      title: "Roads",
      description:
        "Report potholes, damaged roads and infrastructure issues.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M6 2h12l-2 20H8L6 2z" />
          <path d="M11 6h2v3h-2V6zm0 6h2v3h-2v-3z" className="opacity-80" />
        </svg>
      ),
      accent: "from-gray-700 to-gray-900",
    },
    {
      title: "Lighting",
      description:
        "Report streetlight faults and public lighting problems near your community.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M12 2a6 6 0 0 0-6 6c0 3.3 3 5 3 8h6c0-3 3-4.7 3-8a6 6 0 0 0-6-6z" />
          <path d="M9 18h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2z" />
        </svg>
      ),
      accent: "from-yellow-400 to-yellow-500",
    },
    {
      title: "Waste",
      description:
        "Report waste management issues & sanitation concerns. Help keep the environs clean.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M9 4h6l1 2H8l1-2zM7 8h10l-1 11a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 8z" />
        </svg>
      ),
      accent: "from-blue-400 to-blue-500",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Issue Categories</h2>
          <p className="text-gray-600 text-lg">
            Select the type of issue you'd like to report to help us respond faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {issues.map((issue) => (
            <div
              key={issue.title}
              className="bg-blue-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                {issue.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 text-center mb-2">
                {issue.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                {issue.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
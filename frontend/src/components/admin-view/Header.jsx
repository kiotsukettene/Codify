import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-indigo-600"
              >
                <rect
                  x="2"
                  y="2"
                  width="9"
                  height="9"
                  rx="2"
                  fill="currentColor"
                />
                <rect
                  x="2"
                  y="13"
                  width="9"
                  height="9"
                  rx="2"
                  fill="currentColor"
                />
                <rect
                  x="13"
                  y="2"
                  width="9"
                  height="9"
                  rx="2"
                  fill="currentColor"
                />
                <rect
                  x="13"
                  y="13"
                  width="9"
                  height="9"
                  rx="2"
                  fill="currentColor"
                  opacity="0.5"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Manage Course Fields
              </h1>
              <div className="text-sm text-gray-500">
                <Link href="/dashboard" className="hover:text-indigo-600">
                  Dashboard
                </Link>{" "}
                / <span className="text-gray-700">Course Fields</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

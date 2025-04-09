// dashboard/components/sidebar-dashboard.tsx
import Link from "next/link";

export const SidebarDashboard = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <nav>
        <ul className="space-y-4">
          <li className="text-center">
            <Link href="/home" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li className="text-center">
            <Link
              href="/overview"
              className="text-gray-700 hover:text-blue-600"
            >
              Overview
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

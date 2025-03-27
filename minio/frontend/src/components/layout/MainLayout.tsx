// MainLayout.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/App";  // Função de logout

interface MainLayoutProps {
  buckets: any[];
  selectedBucket: string | null;
  storageUsed: number;
  storageTotal: number;
  onSelectBucket: (bucket: string | null) => void;
  onMenuItemClick: (item: string) => void;
  activeMenuItem: string | null;
  onSearch: (term: string) => void;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  buckets,
  selectedBucket,
  storageUsed,
  storageTotal,
  onSelectBucket,
  onMenuItemClick,
  activeMenuItem,
  onSearch,
  children,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-orange-600 mb-6">HostDime Storage</h2>
          <nav className="flex flex-col gap-4">
            <Button
              variant={activeMenuItem === "dashboard" ? "default" : "ghost"}
              onClick={() => onMenuItemClick("dashboard")}
              className="text-lg py-2 px-4 hover:bg-orange-100 rounded"
            >
              Dashboard
            </Button>
            <Button
              variant={activeMenuItem === "buckets" ? "default" : "ghost"}
              onClick={() => onMenuItemClick("buckets")}
              className="text-lg py-2 px-4 hover:bg-orange-100 rounded"
            >
              All Buckets
            </Button>
            <Button
              variant={activeMenuItem === "help" ? "default" : "ghost"}
              onClick={() => onMenuItemClick("help")}
              className="text-lg py-2 px-4 hover:bg-orange-100 rounded"
            >
              Help & Support
            </Button>
          </nav>

          <div className="text-xs text-gray-600 mt-6">
            <div className="mb-2 font-semibold uppercase">Your Buckets</div>
            <ul className="space-y-2">
              {buckets.map((bucket) => (
                <li
                  key={bucket.name}
                  onClick={() => onSelectBucket(bucket.name)}
                  className={`cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-100 ${selectedBucket === bucket.name ? "bg-orange-200" : ""}`}
                >
                  {bucket.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Armazenamento */}
        <div className="text-sm mt-8">
          <div className="mb-1 text-gray-600">Storage</div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-orange-500 rounded"
              style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {storageUsed} GB used / {storageTotal} GB total
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="mt-8 w-full text-sm"
          onClick={() => { logout(); window.location.href = '/login'; }}
        >
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-white">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search buckets and objects..."
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

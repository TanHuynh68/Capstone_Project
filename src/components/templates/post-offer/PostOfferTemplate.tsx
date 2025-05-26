import type React from "react";
interface MainLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

export function MainLayout({ leftColumn, rightColumn }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {leftColumn}
            </div>
          </div>

          {/* Right Column - Offers */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              {rightColumn}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

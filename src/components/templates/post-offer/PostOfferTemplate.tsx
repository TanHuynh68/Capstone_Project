import type React from "react";
interface MainLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

export function MainLayout({ leftColumn, rightColumn }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Posts */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 sticky top-6">
              {leftColumn}
            </div>
          </div>

          {/* Right Column - Offers */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="bg-card text-card-foreground rounded-lg shadow-sm p-6 sticky top-6">
              {rightColumn}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

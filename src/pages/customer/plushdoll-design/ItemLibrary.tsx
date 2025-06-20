import React, { useState, DragEvent, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import SidebarPanelWrapper from "./SidebarPanelWrapper";
import { PawPrint, Fan } from "lucide-react";
import UnsplashLibrary from "./UnsplashLibrary";
import SidebarSearchBar from "./SidebarSearchBar";

// Update LibraryItem interface
export interface LibraryItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  source: "local" | "unsplash";
}

interface ItemLibraryProps {
  onSelect: (imageUrl: string) => void;
  isOpen: boolean;
  showUnsplash?: boolean;
  onCloseLibrary: () => void;
  onCloseUnsplash: () => void;
}

const ItemLibrary = forwardRef<HTMLDivElement, ItemLibraryProps>(
  (
    { onSelect, isOpen, showUnsplash, onCloseLibrary, onCloseUnsplash },
    ref
  ) => {
    const [items] = useState<LibraryItem[]>([
      {
        id: "1",
        name: "Labubu 1",
        imageUrl: "/images/labubu-1.png",
        category: "Dễ thương",
        tags: ["cute", "animal"],
        source: "local",
      },
      {
        id: "2",
        name: "Labubu 2",
        imageUrl: "/images/labubu-2.png",
        category: "Giàu",
        tags: ["cute", "animal"],
        source: "local",
      },
      {
        id: "3",
        name: "Labubu 3",
        imageUrl: "/images/labubu-3.png",
        category: "Dễ thương",
        tags: ["cute", "animal"],
        source: "local",
      },
      {
        id: "4",
        name: "Labubu 4",
        imageUrl: "/images/labubu-4.png",
        category: "Hài hước",
        tags: ["cool", "animal"],
        source: "local",
      },
      {
        id: "5",
        name: "Labubu 5",
        imageUrl: "/images/labubu-5.png",
        category: "Giàu",
        tags: ["cute", "animal"],
        source: "local",
      },
      {
        id: "6",
        name: "Labubu 6",
        imageUrl: "/images/labubu-6.png",
        category: "Hài hước",
        tags: ["funny", "animal"],
        source: "local",
      },
      {
        id: "7",
        name: "Labubu 7",
        imageUrl: "/images/labubu-7.png",
        category: "Dễ thương",
        tags: ["cool", "animal"],
        source: "local",
      },
      {
        id: "8",
        name: "Labubu 8",
        imageUrl: "/images/labubu-8.png",
        category: "Hài hước",
        tags: ["funny", "animal"],
        source: "local",
      },
      {
        id: "9",
        name: "Labubu 9",
        imageUrl: "/images/labubu-9.png",
        category: "Dễ thương",
        tags: ["cute", "animal"],
        source: "local",
      },
      {
        id: "10",
        name: "Labubu 10",
        imageUrl: "/images/labubu-10.png",
        category: "Giàu",
        tags: ["cool", "animal"],
        source: "local",
      },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
    );

    const handleDragStart = (
      e: DragEvent<HTMLDivElement>,
      imageUrl: string
    ) => {
      e.dataTransfer.setData("text/plain", imageUrl);
      e.dataTransfer.effectAllowed = "copy";

      // Create a ghost image for better drag feedback
      const img = new Image();
      img.src = imageUrl;
      e.dataTransfer.setDragImage(img, 50, 50);
    };

    const handleItemClick = (imageUrl: string) => {
      onSelect(imageUrl);
    };

    const filteredItems = items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(items.map((item) => item.category)));

    if (!isOpen && !showUnsplash) return null;

    if (showUnsplash) {
      // Nếu là panel Unsplash thì dùng SidebarPanelWrapper cho UnsplashLibrary
      return (
        <SidebarPanelWrapper
          ref={ref}
          isOpen={showUnsplash}
          onClose={onCloseUnsplash}
          title="Thành phần"
          icon={<Fan className="w-5 h-5" />}
        >
          <UnsplashLibrary
            onSelect={onSelect}
            isOpen={showUnsplash}
            onDragStart={handleDragStart}
          />
        </SidebarPanelWrapper>
      );
    }

    return (
      <SidebarPanelWrapper
        ref={ref}
        isOpen={isOpen}
        onClose={onCloseLibrary}
        title="Các mẫu Labubu"
        icon={<PawPrint className="w-5 h-5" />}
      >
        <SidebarSearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={() => {}}
          placeholder="Tìm kiếm..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Nếu muốn có logic tìm kiếm thực sự, thêm tại đây
            }
          }}
          loading={false}
        />
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              Tất cả
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card pointer-events-none" />
        </div>
        <div className="h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <div className="p-2">
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="cursor-move group"
                  onClick={() => handleItemClick(item.imageUrl)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.imageUrl)}
                >
                  <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <p className="text-sm text-center text-muted-foreground truncate">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarPanelWrapper>
    );
  }
);

export default ItemLibrary;

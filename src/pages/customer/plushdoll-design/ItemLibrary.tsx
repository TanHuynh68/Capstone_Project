import React, { useState, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Update LibraryItem interface
export interface LibraryItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  tags?: string[];
}

// Add proper type for drag events
type DragEventHandler = (e: DragEvent<HTMLCanvasElement>) => void;

interface ItemLibraryProps {
  onSelect: (imageUrl: string) => void;
  isOpen: boolean;
}

const ItemLibrary: React.FC<ItemLibraryProps> = ({ onSelect, isOpen }) => {
  const [items] = useState<LibraryItem[]>([
    {
      id: "1",
      name: "Labubu 1",
      imageUrl: "/images/labubu-1.png",
      category: "Dễ thương",
      tags: ["cute", "animal"],
    },
    {
      id: "2",
      name: "Labubu 2",
      imageUrl: "/images/labubu-2.png",
      category: "Giàu",
      tags: ["cute", "animal"],
    },
    {
      id: "3",
      name: "Labubu 3",
      imageUrl: "/images/labubu-3.png",
      category: "Dễ thương",
      tags: ["cute", "animal"],
    },
    {
      id: "4",
      name: "Labubu 4",
      imageUrl: "/images/labubu-4.png",
      category: "Hài hước",
      tags: ["cool", "animal"],
    },
    {
      id: "5",
      name: "Labubu 5",
      imageUrl: "/images/labubu-5.png",
      category: "Giàu",
      tags: ["cute", "animal"],
    },
    {
      id: "6",
      name: "Labubu 6",
      imageUrl: "/images/labubu-6.png",
      category: "Hài hước",
      tags: ["funny", "animal"],
    },
    {
      id: "7",
      name: "Labubu 7",
      imageUrl: "/images/labubu-7.png",
      category: "Dễ thương",
      tags: ["cool", "animal"],
    },
    {
      id: "8",
      name: "Labubu 8",
      imageUrl: "/images/labubu-8.png",
      category: "Hài hước",
      tags: ["funny", "animal"],
    },
    {
      id: "9",
      name: "Labubu 9",
      imageUrl: "/images/labubu-9.png",
      category: "Dễ thương",
      tags: ["cute", "animal"],
    },
    {
      id: "10",
      name: "Labubu 10",
      imageUrl: "/images/labubu-10.png",
      category: "Giàu",
      tags: ["cool", "animal"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const handleDragStart = (e: DragEvent<HTMLDivElement>, imageUrl: string) => {
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

  if (!isOpen) return null;

  return (
    <div className="w-[300px] h-full border-l bg-white flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-4">Các mẫu Labubu</h3>
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white pointer-events-none" />
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="cursor-move group"
              onClick={() => handleItemClick(item.imageUrl)}
              draggable
              onDragStart={(e) => handleDragStart(e, item.imageUrl)}
            >
              <div className="aspect-square bg-gray-50 rounded-lg mb-2 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <p className="text-sm text-center text-gray-600 truncate">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemLibrary;

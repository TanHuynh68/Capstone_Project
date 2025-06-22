import React, { useState } from "react";
import SidebarSearchBar from "./SidebarSearchBar";

interface ShapesLibraryProps {
  onSelect: (shapeData: { type: string; svg: string }) => void;
  isOpen: boolean;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    shapeData: { type: string; svg: string }
  ) => void;
}

const ShapesLibrary: React.FC<ShapesLibraryProps> = ({
  onSelect,
  isOpen,
  onDragStart,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const allItems: Array<{
    id: string;
    name: string;
    type: "line" | "path" | "rect" | "circle" | "ellipse" | "polygon";
    category:
      | "Đường kẻ"
      | "Hình dạng phổ biến"
      | "Hình dạng mũi tên"
      | "Hình dạng đặc biệt";
    icon?: React.ComponentType<{ className?: string }>;
    svg: string;
    tags: string[];
  }> = [
    // Đường kẻ - Liền nét
    {
      id: "line-solid",
      name: "Đường thẳng",
      type: "line",
      category: "Đường kẻ",
      svg: `<line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" stroke-width="4"/>`,
      tags: ["đường kẻ", "line", "solid"],
    },
    {
      id: "line-double",
      name: "Đường đôi",
      type: "line",
      category: "Đường kẻ",
      svg: `<line x1="5" y1="45" x2="95" y2="45" stroke="currentColor" stroke-width="2"/><line x1="5" y1="55" x2="95" y2="55" stroke="currentColor" stroke-width="2"/>`,
      tags: ["đường kẻ", "line", "double"],
    },
    {
      id: "line-arrow",
      name: "Mũi tên",
      type: "line",
      category: "Đường kẻ",
      svg: `<line x1="5" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="4"/><polygon points="85,45 95,50 85,55" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow"],
    },
    {
      id: "line-arrow-double",
      name: "Mũi tên 2 chiều",
      type: "line",
      category: "Đường kẻ",
      svg: `<line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="4"/><polygon points="15,45 5,50 15,55" fill="currentColor"/><polygon points="85,45 95,50 85,55" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "double"],
    },
    {
      id: "line-wavy",
      name: "Đường sóng",
      type: "path",
      category: "Đường kẻ",
      svg: `<path d="M5 50 Q25 30 45 50 Q65 70 85 50" stroke="currentColor" stroke-width="3" fill="none"/>`,
      tags: ["đường kẻ", "line", "wavy", "curve"],
    },
    {
      id: "line-zigzag",
      name: "Đường răng cưa",
      type: "path",
      category: "Đường kẻ",
      svg: `<path d="M5 50 L25 30 L45 50 L65 30 L85 50" stroke="currentColor" stroke-width="3" fill="none"/>`,
      tags: ["đường kẻ", "line", "zigzag"],
    },

    // Đường kẻ - Nét đứt
    {
      id: "line-dashed",
      name: "Nét đứt",
      type: "line",
      category: "Đường kẻ",
      svg: `<line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" stroke-width="4" stroke-dasharray="8 8"/>`,
      tags: ["đường kẻ", "line", "dashed"],
    },
    {
      id: "line-dotted",
      name: "Nét chấm",
      type: "line",
      category: "Đường kẻ",
      svg: `<line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" stroke-width="4" stroke-dasharray="2 6" stroke-linecap="round"/>`,
      tags: ["đường kẻ", "line", "dotted"],
    },
    {
      id: "line-arrow-dashed",
      name: "Mũi tên nét đứt",
      type: "line",
      category: "Đường kẻ",
      svg: `<line x1="5" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="4" stroke-dasharray="8 8"/><polygon points="85,45 95,50 85,55" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "dashed", "nét đứt"],
    },
    {
      id: "line-arrow-double-dashed",
      name: "Mũi tên 2 chiều nét đứt",
      type: "line",
      category: "Đường kẻ",
      svg: `<line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="4" stroke-dasharray="8 8"/><polygon points="15,45 5,50 15,55" fill="currentColor"/><polygon points="85,45 95,50 85,55" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "double", "dashed", "nét đứt"],
    },

    // Hình dạng phổ biến
    {
      id: "rect",
      name: "Hình chữ nhật",
      type: "rect",
      category: "Hình dạng phổ biến",
      svg: `<rect x="10" y="20" width="80" height="60" fill="currentColor"/>`,
      tags: ["hình chữ nhật", "rectangle", "basic"],
    },
    {
      id: "square-rounded",
      name: "Hình vuông bo góc",
      type: "rect",
      category: "Hình dạng phổ biến",
      svg: `<rect x="10" y="10" width="80" height="80" rx="10" fill="currentColor"/>`,
      tags: ["hình vuông", "square", "rounded"],
    },
    {
      id: "circle",
      name: "Hình tròn",
      type: "circle",
      category: "Hình dạng phổ biến",
      svg: `<circle cx="50" cy="50" r="40" fill="currentColor"/>`,
      tags: ["hình tròn", "circle", "basic"],
    },
    {
      id: "ellipse",
      name: "Hình bầu dục",
      type: "ellipse",
      category: "Hình dạng phổ biến",
      svg: `<ellipse cx="50" cy="50" rx="45" ry="30" fill="currentColor"/>`,
      tags: ["hình bầu dục", "ellipse", "oval"],
    },
    {
      id: "triangle",
      name: "Tam giác",
      type: "polygon",
      category: "Hình dạng phổ biến",
      svg: `<polygon points="50,10 90,90 10,90" fill="currentColor"/>`,
      tags: ["hình tam giác", "triangle", "basic"],
    },
    {
      id: "triangle-inverted",
      name: "Tam giác ngược",
      type: "polygon",
      category: "Hình dạng phổ biến",
      svg: `<polygon points="10,10 90,10 50,90" fill="currentColor"/>`,
      tags: ["hình tam giác", "triangle", "inverted"],
    },
    {
      id: "diamond",
      name: "Hình thoi",
      type: "polygon",
      category: "Hình dạng phổ biến",
      svg: `<polygon points="50,10 90,50 50,90 10,50" fill="currentColor"/>`,
      tags: ["hình thoi", "diamond", "special"],
    },
    {
      id: "pentagon",
      name: "Ngũ giác",
      type: "polygon",
      category: "Hình dạng phổ biến",
      svg: `<polygon points="50,5 95,35 75,95 25,95 5,35" fill="currentColor"/>`,
      tags: ["ngũ giác", "pentagon"],
    },
    {
      id: "hexagon",
      name: "Lục giác",
      type: "polygon",
      category: "Hình dạng phổ biến",
      svg: `<polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="currentColor"/>`,
      tags: ["lục giác", "hexagon", "special"],
    },
    {
      id: "octagon",
      name: "Bát giác",
      type: "polygon",
      category: "Hình dạng phổ biến",
      svg: `<polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="currentColor"/>`,
      tags: ["bát giác", "octagon", "special"],
    },
    {
      id: "trapezoid",
      name: "Hình thang",
      type: "polygon",
      category: "Hình dạng phổ biến",
      svg: `<polygon points="20,20 80,20 90,80 10,80" fill="currentColor"/>`,
      tags: ["hình thang", "trapezoid"],
    },
    {
      id: "parallelogram",
      name: "Hình bình hành",
      type: "polygon",
      category: "Hình dạng phổ biến",
      svg: `<polygon points="10,20 70,20 90,80 30,80" fill="currentColor"/>`,
      tags: ["hình bình hành", "parallelogram"],
    },

    // Hình dạng mũi tên
    {
      id: "arrow-right",
      name: "Mũi tên phải",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="5,35 65,35 65,15 95,50 65,85 65,65 5,65" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "right"],
    },
    {
      id: "arrow-left",
      name: "Mũi tên trái",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="95,35 35,35 35,15 5,50 35,85 35,65 95,65" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "left"],
    },
    {
      id: "arrow-up",
      name: "Mũi tên lên",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="35,95 35,35 15,35 50,5 85,35 65,35 65,95" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "up"],
    },
    {
      id: "arrow-down",
      name: "Mũi tên xuống",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="35,5 35,65 15,65 50,95 85,65 65,65 65,5" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "down"],
    },
    {
      id: "arrow-up-down",
      name: "Mũi tên Lên/Xuống",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="50,10 65,30 55,30 55,70 65,70 50,90 35,70 45,70 45,30 35,30" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "up-down"],
    },
    {
      id: "arrow-left-right",
      name: "Mũi tên Trái/Phải",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="10,50 30,35 30,45 70,45 70,35 90,50 70,65 70,55 30,55 30,65" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "left-right"],
    },
    {
      id: "arrow-right-bar",
      name: "Mũi tên phải có thanh",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="30,35 80,35 80,20 95,50 80,80 80,65 30,65" fill="currentColor"/><rect x="15" y="15" width="10" height="70" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "bar"],
    },
    {
      id: "arrow-left-bar",
      name: "Mũi tên trái có thanh",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="70,35 20,35 20,20 5,50 20,80 20,65 70,65" fill="currentColor"/><rect x="75" y="15" width="10" height="70" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "bar"],
    },
    {
      id: "arrow-pointy-right",
      name: "Mũi tên nhọn phải",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="20,25 70,50 20,75" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "pointy"],
    },
    {
      id: "arrow-pointy-left",
      name: "Mũi tên nhọn trái",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="80,25 30,50 80,75" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "pointy"],
    },
    {
      id: "arrow-double-chevron-right",
      name: "Chevron kép phải",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="30,15 55,50 30,85 40,85 65,50 40,15" fill="currentColor"/><polygon points="55,15 80,50 55,85 65,85 90,50 65,15" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "double-chevron"],
    },
    {
      id: "arrow-double-chevron-left",
      name: "Chevron kép trái",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="70,15 45,50 70,85 60,85 35,50 60,15" fill="currentColor"/><polygon points="45,15 20,50 45,85 35,85 10,50 35,15" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "double-chevron"],
    },
    {
      id: "arrow-l-up-right",
      name: "Mũi tên L lên phải",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="30,80 30,35 70,35 70,20 90,40 70,60 70,45 40,45 40,80" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "l-shape"],
    },
    {
      id: "arrow-l-up-left",
      name: "Mũi tên L lên trái",
      type: "polygon",
      category: "Hình dạng mũi tên",
      svg: `<polygon points="70,80 70,35 30,35 30,20 10,40 30,60 30,45 60,45 60,80" fill="currentColor"/>`,
      tags: ["mũi tên", "arrow", "l-shape"],
    },

    // Hình dạng đặc biệt
    {
      id: "star-4",
      name: "Sao 4 cánh",
      type: "polygon",
      category: "Hình dạng đặc biệt",
      svg: `<polygon points="50,5 65,35 95,50 65,65 50,95 35,65 5,50 35,35" fill="currentColor"/>`,
      tags: ["ngôi sao", "star", "4-point"],
    },
    {
      id: "star-5",
      name: "Sao 5 cánh",
      type: "polygon",
      category: "Hình dạng đặc biệt",
      svg: `<polygon points="50,5 61,35 95,35 68,57 79,87 50,70 21,87 32,57 5,35 39,35" fill="currentColor"/>`,
      tags: ["ngôi sao", "star", "5-point"],
    },
    {
      id: "heart",
      name: "Trái tim",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<path d="M50,95 C25,75 0,60 0,40 C0,25 10,15 25,15 C40,15 50,30 50,30 C50,30 60,15 75,15 C90,15 100,25 100,40 C100,60 75,75 50,95 Z" fill="currentColor"/>`,
      tags: ["trái tim", "heart", "love"],
    },
    {
      id: "moon",
      name: "Mặt trăng",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<path d="M80 25 A40 40 0 1 0 80 75 A30 30 0 1 1 80 25z" fill="currentColor"/>`,
      tags: ["mặt trăng", "moon", "crescent"],
    },
    {
      id: "sun",
      name: "Mặt trời",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<circle cx="50" cy="50" r="25" fill="currentColor"/><path d="M50 5 L50 20 M50 80 L50 95 M20 50 L5 50 M95 50 L80 50 M29 29 L15 15 M85 85 L71 71 M29 71 L15 85 M71 29 L85 15" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`,
      tags: ["mặt trời", "sun"],
    },
    {
      id: "lightning",
      name: "Sấm sét",
      type: "polygon",
      category: "Hình dạng đặc biệt",
      svg: `<polygon points="50,15 35,50 55,50 45,85 65,45 45,45" fill="currentColor"/>`,
      tags: ["tia sét", "lightning", "bolt"],
    },
    {
      id: "speech-bubble",
      name: "Bong bóng chat",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<path d="M10 10 H90 V60 H55 L45 75 L35 60 H10 V10 Z" fill="currentColor"/>`,
      tags: ["bong bóng chat", "speech bubble", "lời thoại"],
    },
    {
      id: "cylinder",
      name: "Hình trụ",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<ellipse cx="50" cy="20" rx="40" ry="10" fill="currentColor"/><path d="M10 20 V80" stroke="currentColor" stroke-width="0.5" fill="none"/><path d="M90 20 V80" stroke="currentColor" stroke-width="0.5" fill="none"/><ellipse cx="50" cy="80" rx="40" ry="10" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>`,
      tags: ["hình trụ", "cylinder", "3d"],
    },
    {
      id: "drop",
      name: "Giọt nước",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<path d="M50 10 C50 10 80 40 80 65 C80 85 65 95 50 95 C35 95 20 85 20 65 C20 40 50 10 50 10 Z" fill="currentColor"/>`,
      tags: ["giọt nước", "drop", "water"],
    },
    {
      id: "cross",
      name: "Dấu cộng",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<path d="M35 20 L65 20 L65 35 L80 35 L80 65 L65 65 L65 80 L35 80 L35 65 L20 65 L20 35 L35 35 Z" fill="currentColor"/>`,
      tags: ["dấu cộng", "cross", "plus"],
    },
    {
      id: "checkmark",
      name: "Dấu tích",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<path d="M15 50 L35 70 L85 30" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
      tags: ["dấu tích", "checkmark", "check"],
    },
    {
      id: "x-mark",
      name: "Dấu X",
      type: "path",
      category: "Hình dạng đặc biệt",
      svg: `<path d="M25 25 L75 75 M75 25 L25 75" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
      tags: ["dấu x", "x-mark", "close"],
    },
  ];

  const handleShapeClick = (shapeData: { type: string; svg: string }) => {
    onSelect(shapeData);
  };

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  if (!isOpen) return null;

  return (
    <>
      <SidebarSearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={() => {}}
        placeholder="Tìm kiếm hình dạng..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Logic tìm kiếm có thể thêm ở đây
          }
        }}
        loading={false}
      />

      <div className="h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="p-2">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 px-1">
                {category}
              </h3>
              <div className={`grid grid-cols-3 gap-4`}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="cursor-move group"
                    onClick={() =>
                      handleShapeClick({ type: item.type, svg: item.svg })
                    }
                    draggable
                    onDragStart={(e) =>
                      onDragStart(e, { type: item.type, svg: item.svg })
                    }
                  >
                    <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden relative flex items-center justify-center p-2">
                      <div className="w-full h-full text-primary">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 100 100"
                          xmlns="http://www.w3.org/2000/svg"
                          preserveAspectRatio="none"
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ __html: item.svg }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShapesLibrary;

"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { RefreshCw, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface SidebarCollapseProps {
  title: string;
  subItem: { title: string; tabName: string; fetch?: () => Promise<any> }[];
  onClick?: (tabName: string) => void;
}

const SidebarCollapse = ({ title, subItem, onClick }: SidebarCollapseProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleFetch = async (fetchFn: () => Promise<any>) => {
    try {
      setLoading(true);
      const res = await fetchFn();
      console.log("Fetch result: ", res);
    } catch (error) {
      console.error("Fetch error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubItemClick = (tabName: string) => {
    // Only trigger onClick if the section is open
    if (isOpen) {
      onClick?.(tabName);
    }
  };

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    // Clear the active tab when closing the section
    if (!open && onClick) {
      onClick("");
    }
  };

  return (
    <div className="w-full">
      <SidebarMenu>
        <Collapsible
          open={isOpen}
          onOpenChange={handleToggle}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger className="font-semibold text-lg hover:bg-gray-100 p-3 mt-3 rounded-lg w-full flex items-center justify-between transition-colors">
              <span>{title}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <div className="pt-2 space-y-1">
                {subItem.map((item, index) => (
                  <div
                    key={`${item.tabName}-${index}`}
                    className="flex items-center gap-2"
                  >
                    <SidebarMenuSub className="flex-1">
                      <button
                        className="w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors text-sm"
                        onClick={() => handleSubItemClick(item.tabName)}
                      >
                        {item.title}
                      </button>
                    </SidebarMenuSub>
                    {(item.tabName === "viewPost" ||
                      item.tabName === "images" ||
                      item.tabName === "designs") &&
                      item.fetch && (
                        <Button
                          variant="default"
                          size="sm"
                          disabled={loading}
                          onClick={() => handleFetch(item.fetch!)}
                          className="shrink-0 bg-primary"
                        >
                          <RefreshCw
                            className={`h-4 w-4 mr-1 ${
                              loading ? "animate-spin" : ""
                            }`}
                          />
                          Làm mới
                        </Button>
                      )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </div>
  );
};

export default SidebarCollapse;

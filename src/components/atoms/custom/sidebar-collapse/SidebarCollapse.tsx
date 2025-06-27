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
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export interface SidebarCollapseProps {
  title: string;
  subItem: { title: string; tabName: string; fetch?: any }[];
  onClick?: any;
}

const SidebarCollapse = ({ title, subItem, onClick }: SidebarCollapseProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleFetch = async (fetch: any) => {
    setLoading(true);
   const res = await fetch();
    setLoading(false);
    console.log('res: ', res)
     console.log('loading: ', loading)
  };
  return (
    <div>
      <SidebarMenu>
        <Collapsible className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger
              onClick={() => onClick("")}
              className="font-semibold text-xl hover:bg-gray-100 p-1 rounded-b-lg w-full flex"
            >
              <div>{title}</div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {subItem.map((item) => (
                <div className="flex">
                  <SidebarMenuSub key={item.title}>
                    <div
                      className="m-1 p-1 rounded-b-lg hover:bg-gray-100"
                      onClick={() => onClick(item.tabName)}
                    >
                      {item.title}
                    </div>
                  </SidebarMenuSub>
                  {item.tabName === "viewPost" && (
                    <div className="bg-white border-b border-gray-200">
                      <div className="max-w-7xl  ">
                        <div className="flex items-center ">
                          <div></div>
                          <Button
                            disabled={loading}
                            onClick={() => handleFetch(item.fetch())}
                          >
                            <RefreshCw
                              className={`h-4 w-4 mr-2 ${
                                loading ? "animate-spin" : ""
                              }`}
                            />
                            Làm mới
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </div>
  );
};

export default SidebarCollapse;

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

export interface SidebarCollapseProps {
  title: string;
  subItem: { title: string; tabName: string }[];
  onClick?: any;
}

const SidebarCollapse = ({ title, subItem, onClick }: SidebarCollapseProps) => {
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
                <SidebarMenuSub key={item.title}>
                  <div
                    className="m-1 p-1 rounded-b-lg hover:bg-gray-100"
                    onClick={() => onClick(item.tabName)}
                  >
                    {item.title}
                  </div>
                </SidebarMenuSub>
              ))}
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </div>
  );
};

export default SidebarCollapse;

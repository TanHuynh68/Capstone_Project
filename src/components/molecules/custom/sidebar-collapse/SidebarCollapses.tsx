import SidebarCollapse, { SidebarCollapseProps } from "@/components/atoms/custom/sidebar-collapse/SidebarCollapse";

export interface SidebarCollapsesProps {
  items: SidebarCollapseProps[],
  onClick: any,
}

const SidebarCollapses = ({ items, onClick }: SidebarCollapsesProps) => {
  return (
    <div>
      {
      items.map((item: SidebarCollapseProps)=>(
        <SidebarCollapse onClick={onClick} subItem={item.subItem} title={item.title}/>
      ))
    }
    </div>
  );
};

export default SidebarCollapses;

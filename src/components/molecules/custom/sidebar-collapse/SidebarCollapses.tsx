"use client"

import SidebarCollapse, { type SidebarCollapseProps } from "@/components/atoms/custom/sidebar-collapse/SidebarCollapse"

export interface SidebarCollapsesProps {
  items: SidebarCollapseProps[]
  onClick: (tabName: string) => void
}

const SidebarCollapses = ({ items, onClick }: SidebarCollapsesProps) => {
  return (
    <div className="space-y-2">
      {items.map((item: SidebarCollapseProps, index: number) => (
        <SidebarCollapse key={`${item.title}-${index}`} onClick={onClick} subItem={item.subItem} title={item.title} />
      ))}
    </div>
  )
}

export default SidebarCollapses

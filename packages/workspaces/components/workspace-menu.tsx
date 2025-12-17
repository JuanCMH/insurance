import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { RemixiconComponentType } from "@remixicon/react";
import Link from "next/link";

export function WorkspaceMenu({
  data,
}: {
  data: {
    title: string;
    icon: RemixiconComponentType;
    items: { title: string; url: string; icon: RemixiconComponentType }[];
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((section) => (
          <DropdownMenu key={section.title}>
            <SidebarMenuItem>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <section.icon />
                  <span>{section.title}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              {section.items?.length ? (
                <DropdownMenuContent
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  className="min-w-56 rounded-lg"
                >
                  {section.items.map((item) => (
                    <DropdownMenuItem
                      asChild
                      key={item.title}
                      className="cursor-pointer"
                    >
                      <Link href={item.url}>
                        {item.title}
                        <item.icon className="ml-auto" />
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              ) : null}
            </SidebarMenuItem>
          </DropdownMenu>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

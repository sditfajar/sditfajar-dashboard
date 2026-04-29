"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  name: string;
  href?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  children?: NavItem[];
};

interface SidebarNavProps {
  items: NavItem[];
  onNavigate?: () => void;
}

export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  // Open accordions that contain the active link
  const defaultValue = items
    .filter((item) =>
      item.children?.some(
        (child) => child.href && pathname.startsWith(child.href)
      )
    )
    .map((item) => item.name);

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultValue}
      className="w-full space-y-1"
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.href ? pathname.startsWith(item.href) : false;

        if (item.children && item.children.length > 0) {
          return (
            <AccordionItem value={item.name} key={index} className="border-none">
              <AccordionTrigger
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:no-underline [&[data-state=open]]:text-primary",
                  item.disabled && "opacity-50 pointer-events-none"
                )}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.name}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0 pt-1">
                <div className="flex flex-col space-y-1 pl-9 pr-2">
                  {item.children.map((child, childIndex) => {
                    const ChildIcon = child.icon;
                    const isChildActive = child.href
                      ? pathname === child.href
                      : false;

                    return child.href && !child.disabled ? (
                      <Link
                        key={childIndex}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary",
                          isChildActive ? "bg-muted text-primary font-medium" : ""
                        )}
                      >
                        {ChildIcon && <ChildIcon className="h-4 w-4" />}
                        {child.name}
                      </Link>
                    ) : (
                      <div
                        key={childIndex}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground/40 cursor-not-allowed select-none"
                      >
                        {ChildIcon && <ChildIcon className="h-4 w-4 opacity-50" />}
                        {child.name}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        }

        // Standard link without children
        return item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary",
              isActive ? "bg-muted text-primary" : ""
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.name}
          </Link>
        ) : (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/40 cursor-not-allowed select-none"
          >
            {Icon && <Icon className="h-4 w-4 opacity-50" />}
            {item.name}
          </div>
        );
      })}
    </Accordion>
  );
}

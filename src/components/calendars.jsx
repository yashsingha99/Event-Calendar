import * as React from "react";
import { Check, ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function Calendars({ calendars }) {
  const [checkedItems, setCheckedItems] = React.useState({});

  const toggleItem = (calendarName, item) => {
    setCheckedItems((prev) => {
      const currentSet = new Set(prev[calendarName] || []);
      if (currentSet.has(item)) {
        currentSet.delete(item);
      } else {
        currentSet.add(item);
      }
      return {
        ...prev,
        [calendarName]: currentSet,
      };
    });
  };

  const isChecked = (calendarName, item) =>
    checkedItems[calendarName]?.has(item);

  return (
    <>
      {calendars.map((calendar, index) => (
        <React.Fragment key={calendar.name}>
          <SidebarGroup className="py-0">
            <Collapsible
              defaultOpen={index === 0}
              className="group/collapsible"
            >
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm"
              >
                <CollapsibleTrigger>
                  {calendar.name}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {calendar.items.map((item) => {
                      const active = isChecked(calendar.name, item);
                      return (
                        <SidebarMenuItem key={item}>
                          <SidebarMenuButton
                            onClick={() => toggleItem(calendar.name, item)}
                            className="flex gap-2 items-center"
                          >
                            <div
                              data-active={active}
                              className={`group/calendar-item border text-sidebar-primary-foreground flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm ${
                                active
                                  ? "border-[#3174AD] bg-[#3174AD]"
                                  : "border-sidebar-border"
                              }`}
                            >
                              <Check
                                className={`size-3 ${
                                  active ? "block" : "hidden"
                                } text-white`}
                              />
                            </div>
                            {item}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  );
}

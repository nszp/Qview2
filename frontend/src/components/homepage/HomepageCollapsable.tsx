import { Button, Collapse, useComputedColorScheme } from "@mantine/core";
import { ChevronDown, ChevronRight } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

export default function HomepageCollapsable({
  openByDefault,
  title,
  children,
}: React.PropsWithChildren<{
  openByDefault: boolean;
  title: string;
}>) {
  const [open, setOpen] = useState(openByDefault);
  const colorScheme = useComputedColorScheme("light");

  return (
    <>
      <Button
        size="md"
        mb="sm"
        pb="xs"
        ta="center"
        variant="transparent"
        sx={(theme, u) => ({
          whiteSpace: "nowrap",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor:
            colorScheme === "light"
              ? theme.colors.gray[3]
              : theme.colors.dark[4],
          color: "unset",
          [u.smallerThan("xs")]: {
            width: "90%",
          },
          [u.largerThan("xs")]: {
            width: "50%",
          },
        })}
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronDown /> : <ChevronRight />}
        {/* TODO: make it a transition or something  */}
      </Button>
      <Collapse in={open} w="100%">
        {children}
      </Collapse>
    </>
  );
}

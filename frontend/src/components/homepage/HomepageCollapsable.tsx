import { Button, Collapse, useComputedColorScheme } from "@mantine/core";
import type * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { ChevronRightIcon } from "lucide-react";

const ExpandChevronIcon = styled(ChevronRightIcon)({
  transition: "transform 0.2s ease-in-out",
  transformOrigin: "center",
  "&[data-rotate='true']": {
    transform: "rotate(90deg)",
  },
});

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
        <ExpandChevronIcon data-rotate={open} />
      </Button>
      <Collapse in={open} w="100%">
        {children}
      </Collapse>
    </>
  );
}

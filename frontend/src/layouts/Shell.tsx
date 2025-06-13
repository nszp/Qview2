// import {
//   AppBar,
//   Backdrop,
//   Box,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   styled,
//   Toolbar,
//   Typography,
// } from "@mui/material";
// import { Outlet, useNavigate } from "react-router";
// import { ChevronLeft, Menu, Inbox, Mail } from "@mui/icons-material";
// import { useState } from "react";
//
// const drawerWidth = 240;
//
// export const Shell = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//
//   const toggleDrawer = () => setDrawerOpen(!drawerOpen);
//
//   const navigate = useNavigate();
//
//   const DrawerHeader = styled("div")(() => ({
//     display: "flex",
//     alignItems: "center",
//     //padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     //    ...theme.mixins.toolbar,
//     justifyContent: "flex-end",
//   }));
//
//   const ShellBox = styled("div")(() => ({
//     margin: "0 auto",
//     maxWidth: "1200px",
//   }));
//
//   return (
//     <>
//       <Box sx={{ flexGrow: 1 }}>
//         <AppBar position="static">
//           <Toolbar>
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               sx={{ mr: 2 }}
//               onClick={() => {
//                 toggleDrawer();
//               }}
//             >
//               <Menu />
//             </IconButton>
//             <Typography
//               variant="h6"
//               component="div"
//               sx={{ cursor: "pointer" }}
//               onClick={() => navigate("/")}
//             >
//               QView
//             </Typography>
//             <Typography
//               variant="h6"
//               component="div"
//               sx={{ flexGrow: 2 }}
//               onClick={() => toggleDrawer()}
//             ></Typography>
//             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//               {/* CRA: right-aligned nav buttons */}
//               {/*{auth.isAuthenticated && <a onClick={() => { auth.logout(); apollo.resetStore(); }}>Logout</a>}*/}
//               {/*{!auth.isAuthenticated && <button onClick={() => navigate('/login')}>Login/Register</button>}*/}
//             </Typography>
//             {/*{auth.isAuthenticated && <IconButton onClick={() => navigate('/account')}> <AccountCircle /></IconButton>}*/}
//           </Toolbar>
//         </AppBar>
//       </Box>
//       <Backdrop
//         onClick={() => toggleDrawer()}
//         open={drawerOpen}
//         sx={{ zIndex: 1 }}
//       >
//         <Drawer
//           sx={{
//             width: drawerWidth,
//             flexShrink: 0,
//             "& .MuiDrawer-paper": {
//               width: drawerWidth,
//               boxSizing: "border-box",
//             },
//           }}
//           variant="persistent"
//           anchor="left"
//           open={drawerOpen}
//         >
//           <DrawerHeader>
//             <IconButton onClick={() => toggleDrawer()}>
//               <ChevronLeft />
//             </IconButton>
//           </DrawerHeader>
//           <Divider />
//           <List>
//             {["Tournament", "Division", "Room", "Round"].map((text, index) => (
//               <ListItem
//                 key={text}
//                 disablePadding
//                 onClick={() => {
//                   switch (index % 4) {
//                     case 0:
//                       navigate("/tournament");
//                       break;
//                     case 1:
//                       navigate("/division");
//                       break;
//                     case 2:
//                       alert("room");
//                       break;
//                     case 3:
//                       alert("round");
//                   }
//                 }}
//               >
//                 <ListItemButton>
//                   <ListItemIcon>
//                     {index % 2 === 0 ? <Inbox /> : <Mail />}
//                   </ListItemIcon>
//                   <ListItemText primary={text} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//           <Divider />
//           <List>
//             {["Quizzes", "Team", "Individual"].map((text, index) => (
//               <ListItem
//                 key={text}
//                 disablePadding
//                 onClick={() => {
//                   switch (index % 3) {
//                     case 0:
//                       alert("quizzes");
//                       break;
//                     case 1:
//                       alert("team");
//                       break;
//                     case 2:
//                       alert("individual");
//                       break;
//                   }
//                 }}
//               >
//                 <ListItemButton>
//                   <ListItemIcon>
//                     {index % 2 === 0 ? <Inbox /> : <Mail />}
//                   </ListItemIcon>
//                   <ListItemText primary={text} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//           <Divider />
//           <List>
//             {["Todos", "Files", "GraphQL"].map((text, index) => (
//               <ListItem
//                 key={text}
//                 disablePadding
//                 onClick={() => {
//                   switch (index % 3) {
//                     case 0:
//                       navigate("/todos");
//                       break;
//                     case 1:
//                       navigate("/files");
//                       break;
//                     case 2:
//                       navigate("/gql");
//                       break;
//                   }
//                 }}
//               >
//                 <ListItemButton>
//                   <ListItemIcon>
//                     {index % 2 === 0 ? <Inbox /> : <Mail />}
//                   </ListItemIcon>
//                   <ListItemText primary={text} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Drawer>
//       </Backdrop>
//       <ShellBox>
//         <Outlet />
//       </ShellBox>
//     </>
//   );
// };

import {
  AppShell,
  Burger,
  Group,
  Skeleton,
  Text,
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

/*

display: block;
  padding: var(--mantine-spacing-xs) var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-md);
  font-weight: 500;

  @mixin hover {
    background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
  }
}
 */

// const NavbarButton = ({ children }: { children: React.ReactNode }) => (
//   <UnstyledButton
//     sx={(theme, u) => ({
//       display: "block",
//       padding: `${theme.spacing.xs} ${theme.spacing.md}`,
//       borderRadius: theme.radius.md,
//       fontWeight: 500,
//       "&:hover": {
//         [u.light]: {
//           backgroundColor: theme.colors.gray[0],
//         },
//         [u.dark]: {
//           backgroundColor: theme.colors.dark[6],
//         },
//       },
//     })}
//   >
//     {children}
//   </UnstyledButton>
// );

export const Shell = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (opened) {
      toggle();
    }
  }, [location.pathname]);

  const { setColorScheme } = useMantineColorScheme();

  const colorScheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" sx={{ flex: 1 }}>
            <Text
              size="lg"
              fw={500}
              sx={{
                marginTop: "-0.2rem",
                userSelect: "none",
                cursor: "pointer",
              }}
              onClick={() => navigate("/", { viewTransition: true })}
            >
              Q2025 Stats
            </Text>
            <Group gap={0}>
              <ActionIcon
                variant="transparent"
                aria-label="Change color scheme"
                c={colorScheme === "light" ? "black" : "white"}
                onClick={toggleColorScheme}
                p={2}
              >
                {colorScheme === "light" ? (
                  <Sun size={24} />
                ) : (
                  <Moon size={24} />
                )}
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {/*{data.divisions.length === 0 ? (*/}
        {/*  <Skeleton height={40} mb="xs" />*/}
        {/*) : (*/}
        {/*  data.divisions.map((division) => (*/}
        {/*    <NavLink key={division.name} label={division.name} defaultOpened>*/}
        {/*      <NavLink*/}
        {/*        label="Individual Standings"*/}
        {/*        onClick={() =>*/}
        {/*          navigate(*/}
        {/*            `/stats/division/${encodeURIComponent(division.name)}/individual`,*/}
        {/*          )*/}
        {/*        }*/}
        {/*      />*/}
        {/*      <NavLink*/}
        {/*        label="Team Standings"*/}
        {/*        onClick={() =>*/}
        {/*          navigate(*/}
        {/*            `/stats/division/${encodeURIComponent(division.name)}/team`,*/}
        {/*          )*/}
        {/*        }*/}
        {/*      />*/}
        {/*    </NavLink>*/}
        {/*  ))*/}
        {/*)}*/}
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

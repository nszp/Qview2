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


import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';

export const Shell = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={ { height: { base: 60, md: 70, lg: 80 } } }
      navbar={ {
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      } }
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={ opened } onClick={ toggle } hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        { Array(15)
          .fill(0)
          .map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: temp
            <Skeleton key={ index } h={ 28 } mt="sm" animate={ false } />
          )) }
      </AppShell.Navbar>
      <AppShell.Main><Outlet /></AppShell.Main>
    </AppShell>);
};

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { BsBuildingCheck } from "react-icons/bs";
import { FaGamepad } from "react-icons/fa6";

export default function TemporaryDrawer() {
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logo = [
    <img
      src="/assets/images/aviator2.png"
      alt="logo"
      style={{ width: "80px" }}
    />,
  ];

  const BarItem = [
    {
      name: "Dashboard",
      Icon: (
        <i
          style={{ fontSize: "25px" }}
          className="parent-icon icon-color-1 bx bx-home-alt"
        />
      ),
    },
    {
      name: "UserSection",
      Icon: (
        <i
          style={{ fontSize: "25px" }}
          className="bx bx-user parent-icon icon-color-2"
        />
      ),
    },
    {
      name: "Deposit",
      Icon: (
        <i
          style={{ fontSize: "25px" }}
          className="bx bx-wallet parent-icon icon-color-5"
        />
      ),
    },
    {
      name: "Withdraw",
      Icon: (
        <i
          style={{ fontSize: "25px" }}
          className="bx bx-money-withdraw parent-icon icon-color-8"
        />
      ),
    },
    {
      name: "Aviator Bet",
      Icon: (
        <i
          style={{ fontSize: "25px" }}
          className="bx bx-money-withdraw parent-icon icon-color-8"
        />
      ),
    },
    {
      name: "Aviator Control",
      Icon: (
        <i
          style={{ fontSize: "25px" }}
          className="bx bx-task parent-icon icon-color-6"
        />
      ),
    },
    {
      name: "Wingo Bet",
      Icon: (
        <BsBuildingCheck
          style={{ fontSize: "25px" }}
          className="parent-icon icon-color-1"
        />
      ),
    },
    {
      name: "Wingo Control",
      Icon: (
        <FaGamepad
          style={{ fontSize: "25px" }}
          className="parent-icon icon-color-1"
        />
      ),
    },
    {
      name: "Settings",
      Icon: (
        <i
          style={{ fontSize: "25px" }}
          className="bx bx-group parent-icon icon-color-7"
        />
      ),
    },
  ];

  const handleListItemClick = (text) => {
    switch (text) {
      case "Dashboard":
        navigate("/Dashboard");
        break;
      case "UserSection":
        navigate("/UserSection");
        break;
      case "Deposit":
        navigate("/Recharge");
        break;
      case "Withdraw":
        navigate("/Withdraw");
        break;
      case "Aviator Bet":
        navigate("/Allbet");
        break;
      case "Aviator Control":
        navigate("/Crashplanned");
        break;
      case "Wingo Bet":
        navigate("/WingoBet");
        break;
      case "Wingo Control":
        navigate("/WingoControl");
        break;
      case "Settings":
        navigate("/Setting");
        break;
      default:
        break;
    }
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {logo.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {BarItem.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton onClick={() => handleListItemClick(item.name)}>
              <ListItemIcon>{item.Icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <i className="bx bx-menu" style={{ fontSize: "25px" }} />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

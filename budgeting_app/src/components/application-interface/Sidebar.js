import React, {useEffect} from 'react';
import styled from '@emotion/styled';
import {getUserAccounts} from './SidebarData';
import Submenu from './SubMenu';
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreateBankAcc from "../account/CreateBankAcc";
import HomeIcon from "@mui/icons-material/Home";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SidebarWrap = styled.nav`
  width: 100%;
`;

const Sidebar = ({loggedIn, createAccSuccess, setCreateAccSuccess, setEffectOpen, setMessage}) => {

    const SidebarData = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: <HomeIcon />,
            iconClosed: <ExpandMoreIcon />,
            iconOpen: <ExpandLessIcon />,
        },
        {
            title: "Accounts",
            path: "/accounts",
            icon: <AccountBalanceIcon />,
            subNavi: getUserAccounts(),
        },
        {
            title: "AddAccount",
            icon: <CreateBankAcc setCreateAccSuccess={setCreateAccSuccess} setEffectOpen={setEffectOpen} setMessage={setMessage}/>,
            path: "/accounts",
        },
    ];

    useEffect(() => {
        if (loggedIn || createAccSuccess){
            SidebarData[1].subNavi = getUserAccounts()
            setCreateAccSuccess(false)
        }
    },[loggedIn, createAccSuccess])

  return (
      <SidebarWrap>
        {SidebarData.map((item, index) => {
          return <Submenu item={item} key={index} />;
        })}
      </SidebarWrap>
  );
};

export default Sidebar;

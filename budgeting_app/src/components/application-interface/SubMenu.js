import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styled from '@emotion/styled';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: flex-start;
  align-items: center;
  padding: 15px;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  border-left: 4px solid #15171c;

  &:hover {
    background: #252831;
    border-left: 4px solid #d380ff;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 7px;
`;

const SidebarBalance = styled.span`
  margin-left: 16px;
  margin-top: 40px;
  font-size: 16px;
  color: ${props => (props.negative ? '#ff4d4f' : '#52c41a')};
`;

const DropdownLink = styled(Link)`
  height: 60px;
  padding-left: 3rem;
  background: #15171c;
  display: flex;
  text-decoration: none;
  align-items: center;
  color: #ffffff;
  font-size: 18px;
  border-left: 4px solid #15171c;

  &:hover {
    background: #252831;
    border-left: 4px solid #d380ff;
    cursor: pointer;
  }
`;

const Submenu = ({item}) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);

  return (
      <>
        <SidebarLink to={item.path} onClick={item.subNavi && showSubnav}>
          <div>
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
          </div>
          <div>
            {item.subNavi && subnav
                ? item.iconOpen
                : item.subNavi
                    ? item.iconClosed
                    : null}
          </div>
        </SidebarLink>
        {subnav &&
        item.subNavi.map((subitem, index) => {
          const isNegative = subitem.balance < 0;
              return (
                  <DropdownLink to={subitem.path} key={index}>
                    <div>
                      {subitem.icon}
                      <SidebarLabel>{subitem.title}</SidebarLabel>
                    </div>
                    <div>
                      {subitem.balance && (
                          <SidebarBalance negative={isNegative}>
                            <div style={{display: 'flex'}}>
                              {subitem.balance}
                              <span style={{marginLeft: '5px'}}>€</span>
                            </div>
                          </SidebarBalance>
                      )}
                    </div>
                  </DropdownLink>
              );
            })}
      </>
  );
};

export default Submenu;

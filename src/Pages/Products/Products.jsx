import React, {useState} from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Card from "../../Components/Card/Card";
import Header from "../../Components/Header/Header";
import Game from "../../Components/Game/Game";
import {Dropdown} from '@mui/base/Dropdown';
import {Menu} from '@mui/base/Menu';
import {MenuButton as BaseMenuButton} from '@mui/base/MenuButton';
import {MenuItem as BaseMenuItem, menuItemClasses} from '@mui/base/MenuItem';
import {blue, grey} from "@mui/material/colors";
import {styled} from "@mui/material";

const {getData, getGames} = require('../../db/db');

const items = getData();
const games = getGames();

function Products() {

    const createHandleMenuClick = (menuItem: string) => {
        return () => {
            console.log(`Clicked on ${menuItem}`);
        };
    };

    const Listbox = styled('ul')(
        ({theme}) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 6px ${
            theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
        };
  z-index: 1;
  `,
    );

    const MenuButton = styled(BaseMenuButton)(
        ({theme, ...props}) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0;
  border-radius: 8px;
  transition: all 150ms ease;
  cursor: pointer;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: none;
  display: flex;
  align-items: center;
  justify-content: end;
  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
  }

  &:active {
    background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
    outline: none;
  }
  `,
    );

    const MenuItem = styled(BaseMenuItem)(
        ({theme}) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }
  `,
    );

    return <div>
        {/*<div className="flex align-stretch flex-wrap w-100">*/}
        {/*    {games.map((game) => {*/}
        {/*        return <Game game={game} key={game.id}/>;*/}
        {/*    })}*/}
        {/*</div>*/}
        <div className="flex justify-between py-08 horizontal-padding">
            <h2>Game 1</h2>
            {/*<div className="relative">*/}
            {/*    <Dropdown>*/}
            {/*        <MenuButton className="text-blue">по популярности<KeyboardArrowDownIcon/></MenuButton>*/}
            {/*        <Menu slots={{listbox: Listbox}}>*/}
            {/*            <MenuItem onClick={createHandleMenuClick('1')}>по популярности</MenuItem>*/}
            {/*            <MenuItem onClick={createHandleMenuClick('2')}>по убыванию цены</MenuItem>*/}
            {/*            <MenuItem onClick={createHandleMenuClick('3')}>по возрастанию цены</MenuItem>*/}
            {/*        </Menu>*/}
            {/*    </Dropdown>*/}
            {/*</div>*/}

        </div>
        <div className="flex column">
            {items.map((item) => {
                return <Card sx={{'$:hover': {
                        backgroundColor: "var(--tg-theme-secondary-bg-color)"
                    }}} item={item} key={item.id}/>;
            })}
        </div>
    </div>
}

export default Products;
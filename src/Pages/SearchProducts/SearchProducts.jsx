import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchProducts } from '../../db/db';
import Card from "../../Components/Card/Card";
import { SearchBar } from "../../Components/SearchBar/SearchBar";
import {Dropdown} from '@mui/base/Dropdown';
import {Menu} from '@mui/base/Menu';
import {MenuButton as BaseMenuButton} from '@mui/base/MenuButton';
import {MenuItem as BaseMenuItem, menuItemClasses} from '@mui/base/MenuItem';
import {blue, grey} from "@mui/material/colors";
import {styled} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getProducts } from "../../db/db";

export const SearchProducts = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [sortBy, setSortBy] = useState('purchase_count')

  const sortValues = {
      'purchase_count': 'по популярности',
      'price_lower': 'по убыванию цены',
      'price_higher': 'по возрастанию цены',
  };
  const createHandleMenuClick = (menuItem) => {
      return () => {
          setSortBy(menuItem);
          async function fetchItems(sort, game_id) {
              const items = await getProducts(sort, game_id);
              setSearchResults(items);
          }
          fetchItems(sortBy, searchResults[0].game_id);
      };
  };

  const Listbox = styled('ul')(({theme}) => `
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
  box-shadow: 0px 4px 6px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'};
  z-index: 1;
  `,);

    const MenuButton = styled(BaseMenuButton)(({theme, ...props}) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0;
  padding-left: ".2rem";
  border-radius: 8px;
  transition: all 150ms ease;
  background: var(--tg-theme-bg-color);
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: end;
  &:hover {
    background: var(--tg-theme-secondary-bg-color);
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
  }
  `,);

    const MenuItem = styled(BaseMenuItem)(({theme}) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &:focus {
    outline: 1px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    background-color: var(--tg-theme-bg-color);
    color: var(--tg-theme-text-color);
  }

  &.${menuItemClasses.disabled} {
    color: var(--tg-theme-text-color);
  }
  `,);

  useEffect(() => {
    const fetchResults = async () => {
      const results = await searchProducts(query);
      setSearchResults(results);
    };
    fetchResults();
  }, [query]);

    return (
     <div>
        <div className="header">
          <SearchBar/>
        </div>
        <div className="flex justify-end mb-4">
          <Dropdown
              sx={{
                  borderColor: "var(--tg-theme-section-separator-color) !important",
                  background: "var(--tg-theme-bg-color) !important"
              }}>
              <MenuButton className="text-blue">{sortValues[sortBy]}<KeyboardArrowDownIcon/></MenuButton>
              <Menu sx={{
                  color: "var(--tg-theme-text-color) !important",
                  borderColor: "var(--tg-theme-section-separator-color) !important",
                  background: "var(--tg-theme-bg-color) !important"
              }}
                    slots={{listbox: Listbox}}>
                  {Object.entries(sortValues).map(([key, value]) => (
                      <MenuItem key={key} onClick={createHandleMenuClick(key)}>
                          {value}
                      </MenuItem>
                  ))}
              </Menu>
          </Dropdown>
        </div>
        <div className="flex column">
            {searchResults.map((item) => (
                <Card 
                    sx={{
                        '&:hover': {
                            backgroundColor: "var(--tg-theme-secondary-bg-color)"
                        }
                    }} 
                    item={item} 
                    key={item.id}
                />
            ))}
        </div>
    </div>
    );
};
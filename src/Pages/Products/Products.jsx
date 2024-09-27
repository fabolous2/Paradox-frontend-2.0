import React, {useState, useEffect} from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Card from "../../Components/Card/Card";
import {Dropdown} from '@mui/base/Dropdown';
import {Menu} from '@mui/base/Menu';
import {MenuButton as BaseMenuButton} from '@mui/base/MenuButton';
import {MenuItem as BaseMenuItem, menuItemClasses} from '@mui/base/MenuItem';
import {blue, grey} from "@mui/material/colors";
import {styled} from "@mui/material";
import {getProducts, getGame} from "../../db/db";
import { useLocation } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';

function Products() {
  const [items, setItems] = useState([]);
  const [game_name, setGameName] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'purchase_count', direction: 'descending' });
  const location = useLocation();
  const game_id = new URLSearchParams(location.search).get("id");
  const { tg } = useTelegram();
 
  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      window.history.back();
    });

    return () => {
      tg.BackButton.offClick();
      tg.BackButton.hide();
    };
  }, []);

  const sortValues = {
      'purchase_count': 'по популярности',
      'price_lower': 'по убыванию цены',
      'price_higher': 'по возрастанию цены',
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts(game_id);
      setItems(data);
    };
    fetchData();
  }, [game_id]);

  useEffect(() => {
    const fetchGameName = async () => {
      const data = await getGame(game_id);
      setGameName(data.name);
    };
    fetchGameName();
  }, [game_id]);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        switch (sortConfig.key) {
          case 'purchase_count':
            return b.purchase_count - a.purchase_count;
          case 'price_higher':
            return a.price - b.price;
          case 'price_lower':
            return b.price - a.price;
          default:
            return 0;
        }
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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

    return (
      <div>
        <div className="flex justify-between py-08 horizontal-padding">
          <h2>{game_name}</h2>
          <div className="relative">
            <Dropdown
              sx={{
                borderColor: "var(--tg-theme-section-separator-color) !important",
                background: "var(--tg-theme-bg-color) !important"
              }}>
              <MenuButton className="text-blue">{sortValues[sortConfig.key]}<KeyboardArrowDownIcon/></MenuButton>
              <Menu sx={{
                color: "var(--tg-theme-text-color) !important",
                borderColor: "var(--tg-theme-section-separator-color) !important",
                background: "var(--tg-theme-bg-color) !important"
              }}
                slots={{listbox: Listbox}}>
                {Object.entries(sortValues).map(([key, value]) => (
                  <MenuItem key={key} onClick={() => requestSort(key)}>
                    {value}
                  </MenuItem>
                ))}
              </Menu>
            </Dropdown>
          </div>
        </div>
        <div className="flex column">
          {sortedItems.map((item) => {
            return <Card sx={{'$:hover': {
              backgroundColor: "var(--tg-theme-secondary-bg-color)"
            }}} item={item} key={item.id}/>;
          })}
        </div>
      </div>
    );
}

export default Products;
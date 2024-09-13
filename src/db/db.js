import thirtyGems from '../images/30gems.jpg';

import game1 from '../images/game1.png';
import game2 from '../images/game2.png';
import game3 from '../images/game3.png';
import game4 from '../images/game4.png';
import game5 from '../images/game5.png';
import game6 from '../images/game6.png';
import axios from 'axios';

export function getData() {
    return [
        {id: 11, subtitle: 'Brawl Stars', rating: 5,title: '30 гемов', price: 300, Image: thirtyGems},
        {id: 12, subtitle: 'Brawl Stars', rating: 4,title: 'Burger', price: 15, Image: thirtyGems},
        {id: 13, subtitle: 'Redix shop', rating: 4,title: '30 gems', price: 15, Image: thirtyGems},
    ]
}

export function getGames() {
    return [
        {id: 1, title: 'Brawl Stars', Image: game1},
        {id: 2, title: 'Squad Busters',Image: game2},
        {id: 3, title: 'Clash of Clans', Image: game3},
        {id: 4, title: 'Clash Royale', Image: game4},
        {id: 5, title: 'Roblox', Image: game5},
        {id: 6, title: 'Fortnite', Image: game6},
    ]
}

export function getXPadding() {
    return "1.5rem";
}


export function getUser(tg) {
    const db_user = () => {
        axios.get('http://127.0.0.1:8000/profile/', {
            headers: {
                'Authorization': `${tg.initDataUnsafe}`
            }
        }).then(r => {
            return r.data;
        })
    }

    return db_user;
}
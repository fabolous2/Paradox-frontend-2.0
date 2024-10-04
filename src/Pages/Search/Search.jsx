import React from 'react';
import { SearchBar } from '../../Components/SearchBar/SearchBar';
import { useTelegram } from '../../hooks/useTelegram';
import { useEffect } from 'react';

export function SearchPage() {
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
    }, [tg.BackButton]);

    return (
        <div className="search-page">
            <div className="header">
                <SearchBar />
            </div>
        </div>
    );
}
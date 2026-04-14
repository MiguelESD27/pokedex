import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PokemonService from '../services/PokemonAPI';

export const PokemonContext = createContext(null);
export const FavoritesContext = createContext(null);


export const PokemonProvider = ({ children }) => {
    const [isLoaded, setLoaded] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const pokemonService = useMemo(() => new PokemonService(), [isLoaded]);

    useEffect(() => {
        setLoaded(true);
    }, [isLoaded]);

    const toggleFavorite = (id) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    return (
        <PokemonContext.Provider value={pokemonService}>
            <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
                {children}
            </FavoritesContext.Provider>
        </PokemonContext.Provider>
    );
};

export const usePokemonService = () => {
    const context = useContext(PokemonContext);
    return context;
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    return context;
};
import { useState, useEffect } from 'react';
import CardGrid from '../components/Cards/CardGrid';
import PokemonCard from '../components/Pokemon/PokemonCard';
import Loader from '../components/Loaders/Loader';
import { usePokemonService } from '../context/Context';
import { useFavorites } from '../context/Context';

const Collection = () => {
    const { favorites } = useFavorites();
    const pokemonServiceInstance = usePokemonService();

    const [isFetching, setIsFetching] = useState(false);
    const [collectionData, setCollectionData] = useState([]);

    useEffect(() => {
        if (!pokemonServiceInstance || !favorites.length) {
            setCollectionData([]);
            return;
        }
        setIsFetching(true);
        const promises = favorites.map((id) => {
            const cached = pokemonServiceInstance.GetPokemonById(id);
            return Object.keys(cached).length
                ? Promise.resolve(cached)
                : pokemonServiceInstance.FetchId(id);
        });
        Promise.allSettled(promises).then((results) => {
            const data = results
                .filter(({ status }) => status === 'fulfilled')
                .map(({ value }) => value);
            setCollectionData(data);
            setIsFetching(false);
        });
    }, [favorites, pokemonServiceInstance]);

    return (
        <section className='mx-auto max-w-7xl'>
            <div className="relative min-h-40">
                {isFetching && <Loader />}
                {!isFetching && !collectionData.length && (
                    <p className="text-center text-gray-400 py-16">
                        
                    </p>
                )}
                <CardGrid
                    gridItems={collectionData.map((data) => (
                        <PokemonCard data={data} key={data.id} />
                    ))}
                />
            </div>
        </section>
    );
};

export default Collection;
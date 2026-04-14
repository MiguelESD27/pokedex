import { useState, useEffect, useMemo } from 'react';
import CardGrid from '../components/Cards/CardGrid';
import PokemonCard from '../components/Pokemon/PokemonCard';
import Paginator from '../components/Paginator/Paginator';
import Loader from '../components/Loaders/Loader';
import { usePokemonService } from '../context/Context';

const SORT_OPTIONS = [
    { label: 'Por ID',     value: 'id'   },
    { label: 'Por Nombre', value: 'name' },
];

const btnBase     = 'px-4 py-2 rounded-sm text-sm font-medium transition-colors cursor-pointer';
const btnActive   = 'bg-indigo-700 text-white';
const btnInactive = 'bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:text-indigo-700';

const Catalogo = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [PokemonListData, setPokemonListData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const PokemonServiceInstance = usePokemonService();

    useEffect(
        () => {
            if (PokemonServiceInstance) {
                setIsFetching(true);
                PokemonServiceInstance.FetchList(page, limit, (list, total) => {
                    setPokemonListData(list);
                    setTotalItems(total);
                    setIsFetching(false);
                });
            }
        }
        , [page, limit, isLoaded, PokemonServiceInstance]
    );

    const sortedList = useMemo(() => {
        if (!PokemonListData?.length) return PokemonListData;
        return [...PokemonListData].sort((a, b) => {
            if (sortBy === 'name') return (a?.value?.name ?? '').localeCompare(b?.value?.name ?? '');
            return (a?.value?.id ?? 0) - (b?.value?.id ?? 0);
        });
    }, [PokemonListData, sortBy]);

    if (isLoaded && !PokemonListData) {
        setIsLoaded(true);
        return <div>Loading</div>
    }
    return (
        <section className='mx-auto max-w-7xl'>
            <div className="flex items-center gap-2 px-4 pt-4">
                <span className="text-sm font-medium text-gray-600">Ordenar:</span>
                {SORT_OPTIONS.map(({ label, value }) => (
                    <button
                        key={value}
                        className={`${btnBase} ${sortBy === value ? btnActive : btnInactive}`}
                        onClick={() => setSortBy(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className="relative">
                {isFetching && <Loader />}
                <CardGrid
                    gridItems={sortedList?.map(o => {
                        return (
                            <PokemonCard data={o?.value} key={o?.value.id} />
                        );
                    })} />
            </div>
            <Paginator
                page={page}
                onPageChange={setPage}
                limit={limit}
                onLimitChange={setLimit}
                totalItems={totalItems}
            />
        </section>
    );
}

export default Catalogo;
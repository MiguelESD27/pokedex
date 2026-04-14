import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { usePokemonService } from '../context/Context';
import Loader from '../components/Loaders/Loader';

const typeColor = {
    normal: 'bg-stone-500',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-600',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-700',
    poison: 'bg-violet-600',
    ground: 'bg-amber-600',
    flying: 'bg-sky-500',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-600',
    rock: 'bg-yellow-700',
    ghost: 'bg-indigo-700',
    dragon: 'bg-indigo-500',
    dark: 'bg-neutral-800',
    steel: 'bg-slate-500',
    fairy: 'bg-rose-400',
};

const formatText = (value) =>
    value
        ?.split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const Detail = () => {
    const { id } = useParams();
    const redirectTo = useNavigate();
    const pokemonServiceInstance = usePokemonService();

    const [isFetching, setIsFetching] = useState(false);
    const [pokemonData, setPokemonData] = useState(null);
    const [speciesData, setSpeciesData] = useState(null);

    useEffect(() => {
        if (!pokemonServiceInstance) return;
        setIsFetching(true);

        const cached = pokemonServiceInstance.GetPokemonById(id);
        const pokemonPromise = Object.keys(cached).length
            ? Promise.resolve(cached)
            : pokemonServiceInstance.FetchId(id);

        pokemonPromise
            .then((poke) => {
                setPokemonData(poke);
                return pokemonServiceInstance.FetchSpecies(id);
            })
            .then((species) => {
                setSpeciesData(species);
                setIsFetching(false);
            })
            .catch(() => {
                setIsFetching(false);
            });
    }, [id, pokemonServiceInstance]);

    const primaryType = pokemonData?.types?.find((t) => t.slot === 1)?.type?.name;
    const headerBgClass = typeColor[primaryType] ?? 'bg-green-600';

    const imageUrl =
        pokemonData?.sprites?.other?.['official-artwork']?.front_default ||
        pokemonData?.sprites?.front_default ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData?.id}.png`;

    const types = pokemonData?.types?.map((t) => t.type.name) ?? [];

    const description = (
        speciesData?.flavor_text_entries?.find((e) => e.language.name === 'es')?.flavor_text ??
        speciesData?.flavor_text_entries?.find((e) => e.language.name === 'en')?.flavor_text ??
        ''
    ).replace(/[\n\f\r]/g, ' ');

    const abilities = pokemonData?.abilities ?? [];

    return (
        <section className='mx-auto max-w-7xl px-4 py-6'>
            <div className="relative min-h-40">
                {isFetching && <Loader />}
                {!isFetching && pokemonData && (
                    <>
                        <button
                            className="mb-6 px-4 py-2 bg-indigo-700 text-white font-bold rounded-sm hover:bg-indigo-800 transition-colors cursor-pointer"
                            onClick={() => redirectTo('/')}
                        >
                            ← Volver
                        </button>

                        <div className="flex flex-col md:flex-row gap-8 items-start">

                            <div className={`flex justify-center items-center rounded-xl ${headerBgClass} p-8 w-full md:w-80 shrink-0`}>
                                <img
                                    className="w-56 h-56 object-contain drop-shadow-xl"
                                    src={imageUrl}
                                    alt={pokemonData?.name || 'pokemon'}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-gray-400 font-bold text-lg">{`#${pokemonData?.id}`}</span>
                                    <span className="flex gap-2">
                                        {types.map((typeName) => (
                                            <span
                                                key={typeName}
                                                className={`inline-block px-3 py-1 ${typeColor[typeName] ?? 'bg-green-600'} text-white text-sm rounded-sm`}
                                            >
                                                {formatText(typeName)}
                                            </span>
                                        ))}
                                    </span>
                                </div>

                                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                    {formatText(pokemonData?.name)}
                                </h2>

                                {description && (
                                    <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
                                )}

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Habilidades</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {abilities.map(({ ability, is_hidden }) => (
                                            <span
                                                key={ability.name}
                                                className={`px-4 py-2 rounded-sm text-white font-bold ${is_hidden ? 'bg-indigo-400' : 'bg-indigo-700'}`}
                                            >
                                                {formatText(ability.name)}
                                                {is_hidden && (
                                                    <span className="ml-1 text-xs font-normal opacity-80">(Oculta)</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Detail;
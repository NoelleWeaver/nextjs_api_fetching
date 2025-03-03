import Image from 'next/image';

async function getPokemonData() {
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailsRes = await fetch(pokemon.url);
        return detailsRes.ok ? detailsRes.json() : null;
      })
    );

    return pokemonDetails.filter(Boolean);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function Home() {
  const pokemon = await getPokemonData();

  if (!pokemon) {
    return <p className="text-center">Failed to load data</p>;
  }

  return (
    <div className="">
      <h1 className="">Pokemon List</h1>
      <div className="">
        {pokemon.map((poke) => (
          <div key={poke.id} className="">
            <Image src={poke.sprites.front_default} width={100} height={100} alt={poke.name} />
            <h2 className="">{poke.name}</h2>
            <p className="">Height: {poke.height}</p>
            <p className="">Weight: {poke.weight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

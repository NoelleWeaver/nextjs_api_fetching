import Image from 'next/image';

async function getPokemonData() {
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200');
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
    <div className='bg-[#fbfbfb]'>
      <h1 className="text-center text-[2rem] font-bold mt-[1rem]">Pokemon List</h1>
      <div className="grid grid-cols-3 gap-[2rem] place-items-center mt-[5rem] mb-[5rem]">
        {pokemon.map((poke) => (
          <div key={poke.id} className="bg-[#A4ADE7] w-[25vw] h-[67vh] place-items-center rounded-[20px] border-[6px] border-[#7480CE]">
            <Image src={poke.sprites.front_default} width={500} height={500} alt={poke.name} className="bg-white rounded-[20px] w-[22vw] mt-[1rem] mb-[0.5rem]" />
            <h2 className="capitalize text-[1.5rem] font-semibold mb-[1rem]">{poke.name}</h2>
            <div className="bg-[#D5D2E6] w-[23vw] h-[14vh] p-[1rem] rounded-[20px] border-[6px] border-[#F5F5F5]">
              <p className="border-b-2 border-[#333] w-[20vw] h-[5vh]">Height: {poke.height}</p>
              <p className="w-[20vw] mt-[1rem]">Weight: {poke.weight}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Pokemon, PokemonDetails, PokemonSpecies } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number, offset: number): Observable<{ results: Pokemon[] }> {
    return this.http.get<{ results: Pokemon[] }>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonTypes(): Observable<{ results: Pokemon[] }> {
    return this.http.get<{ results: Pokemon[] }>(`${this.apiUrl}/type`);
  }

  getPokemonsByType(type: string): Observable<{ pokemon: { pokemon: Pokemon }[] }> {
    return this.http.get<{ pokemon: { pokemon: Pokemon }[] }>(`${this.apiUrl}/type/${type}`);
  }

  getPokemonDetailsByName(name: string | undefined): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${this.apiUrl}/pokemon/${name}`);
  }

  getPokemonDetailsById(id: number | undefined): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${this.apiUrl}/pokemon/${id}`);
  }

  getPokemonDescriptionByName(name: string | undefined): Observable<PokemonSpecies>{
    return this.http.get<PokemonSpecies>(`${this.apiUrl}/pokemon-species/${name}`)
  }

  getPokemonOfficialArtwork(name: string){
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${name}.png`;
  }

  getPokemonsByEvolutionChain(apiUrl: string) {
    return this.http.get<any>(apiUrl).pipe(
      map((response) => {
        let evolutionNames: string[] = [];
        let queue: any[] = [response.chain]; // Cola para procesar la evolución en orden

        while (queue.length > 0) {
          let current = queue.shift(); // Sacamos el primer Pokémon de la cola
          
          if (current && !evolutionNames.includes(current.species.name)) {
            evolutionNames.push(current.species.name); // Agregar en orden correcto
          }

          // Agregar las evoluciones a la cola para que se procesen en el orden correcto
          if (current?.evolves_to?.length > 0) {
            queue.push(...current.evolves_to);
          }
        }

        return evolutionNames; // No es necesario hacer reverse, ya que BFS garantiza el orden
      })
    );
}

  getPokemonSpriteByName(pokemonName: string) {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).pipe(
      map(data => {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
      }),
      catchError(error => {
        console.error("Error fetching sprite:", error);
        return of("");
      })
    );
  }


}
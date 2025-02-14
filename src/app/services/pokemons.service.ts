import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

}
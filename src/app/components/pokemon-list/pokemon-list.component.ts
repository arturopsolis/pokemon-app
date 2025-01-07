import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemons.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  pokemonTypes: any[] = [];
  limit = 20;
  offset = 0;
  currentPage = 1;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.fetchPokemons();
    this.fetchPokemonTypes();
  }

  fetchPokemons(): void {
    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe((data) => {
      this.pokemons = data.results;
      this.filteredPokemons = data.results;
    });
  }

  fetchPokemonTypes(): void {
    this.pokemonService.getPokemonTypes().subscribe((data) => {
      this.pokemonTypes = data.results;
    });
  }

  nextPage(): void {
    this.offset += this.limit;
    this.currentPage++;
    this.fetchPokemons();
  }

  previousPage(): void {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.currentPage--;
      this.fetchPokemons();
    }
  }

  filterPokemons(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPokemons = this.pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchText)
    );
  }

  filterByType(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const type = selectElement.value;
  
    if (type === 'all') {
      this.filteredPokemons = this.pokemons;
    } else {
      this.pokemonService.getPokemonsByType(type).subscribe((data) => {
        this.filteredPokemons = data.pokemon.map((p: any) => ({
          name: p.pokemon.name
        }));
      });
    }
  }
}
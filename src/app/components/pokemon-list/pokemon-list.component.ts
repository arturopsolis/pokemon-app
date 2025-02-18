import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PokemonService } from 'src/app/services/pokemons.service';
import { Pokemon, PokemonDetails } from 'src/app/models/pokemon';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  pokemonTypes: Pokemon[] = [];
  limit = 1017;
  offset = 0;
  currentPage = 1;

  filterForm: FormGroup;

  currentPokemon: Pokemon | undefined | null;

  constructor(private pokemonService: PokemonService) {
    this.filterForm = new FormGroup({
      search: new FormControl(''),
      type: new FormControl('all')
    });
  }

  ngOnInit(): void {
    this.fetchPokemons();
    this.fetchPokemonTypes();
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
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

  applyFilters(): void {
    const { search, type } = this.filterForm.value;

    let filtered = this.pokemons;

    if (search) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type !== 'all') {
      this.pokemonService.getPokemonsByType(type).subscribe((data) => {
        const typePokemons = data.pokemon.map((p: any) => p.pokemon.name);
        filtered = filtered.filter((pokemon) => typePokemons.includes(pokemon.name));
        this.filteredPokemons = filtered;
      });
    } else {
      this.filteredPokemons = filtered;
    }
  }

  nextPage(): void {
    this.offset += this.limit;
    this.currentPage += 1;
    this.fetchPokemons();
  }

  previousPage(): void {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.currentPage -=1;
      this.fetchPokemons();
    }
  }

  handlePokemonDetails(pokemon: Pokemon){
    this.currentPokemon = pokemon;
  }

  extractPokemonId(url: string) {
    const parts = url.split('/'); 
    return +parts[parts.length - 2];
  }

  pokemonSpriteDefault(url: string){
    let imageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
    let id = this.extractPokemonId(url);
    return `${imageUrl}${id}.png`;

  }

  cleanCurrentPokemon(){
    this.currentPokemon = null;
  }


}
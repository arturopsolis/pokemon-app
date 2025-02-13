import { Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemons.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent {

  @Input() currentPokemon: Pokemon | undefined;

  currentPokemonOfficialArt: string = ""
  currentPokemonId: number = 0;

  constructor(private pokemonServie: PokemonService){}

  ngOnChanges(){
    
    this.currentPokemonId = this.extractPokemonId(this.currentPokemon?.url);
    this.currentPokemonOfficialArt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.currentPokemonId}.png`
    console.log("currentPokemon", this.currentPokemon)
    console.log("this.currentPokemonOfficialArt: ", this.currentPokemonOfficialArt)
    /*  this.pokemonServie.getPokemonDetailsByName(this.currentPokemon?.name).subscribe({
      next: (data)=>{
        console.log(data)
      },
      error: (err)=>{
        console.log(err)
      }
    }) */

    
  }

  extractPokemonId(url: any) {
    const parts = url.split('/'); 
    return +parts[parts.length - 2]; // Convertir a número
  }

}

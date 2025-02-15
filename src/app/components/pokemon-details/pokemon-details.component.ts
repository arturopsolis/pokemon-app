import { Component, Input } from '@angular/core';
import { Pokemon, PokemonDetails } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemons.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent {

  @Input() currentPokemon: Pokemon | undefined;

  colorMap: { [key: string]: string } = {
    black: "#212121",
    blue: "#3b5998",
    brown: "#8B4513",
    gray: "#9E9E9E",
    green: "#4CAF50",
    pink: "#E91E63",
    purple: "#9C27B0",
    red: "#c4393d",
    white: "#F5F5F5",
    yellow: "#f6c14a"
  };

  

  currentPokemonDetails: PokemonDetails | undefined;
  currentPokemonOfficialArt: string = ""
  currentPokemonId: number = 0;
  currentPokemonDescription: string = "";
  currentPokemonColor: string = "";
  currentPokemonHeight: number = 0;
  currentPokemonWeight: number = 0;
  currentPokemonSpritesFrontDefault: string = "";
  currentPokemonMainType: string = '';
  currentPokemonMainAbility: string = '';


  constructor(private pokemonServie: PokemonService){}


  ngOnChanges(){

    console.log("currentPokemon: ", this.currentPokemon)
    
    this.currentPokemonId = this.extractPokemonId(this.currentPokemon?.url);
    this.currentPokemonOfficialArt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.currentPokemonId}.png`
    
    this.pokemonServie.getPokemonDetailsByName(this.currentPokemon?.name).subscribe({
      next: (data)=>{
        this.currentPokemonDetails = data;
        this.currentPokemonSpritesFrontDefault = data.sprites.front_default;
        this.currentPokemonHeight = data.height;
        this.currentPokemonWeight = data.weight;
        this.currentPokemonMainType = data.types[0].type.name;
        this.currentPokemonMainAbility = data.abilities[0].ability.name;
        console.log("this.currentPokemon: ", this.currentPokemonDetails);
      },
      error: (err)=>{
        console.log(err)
      }
    })

    this.pokemonServie.getPokemonDescriptionByName(this.currentPokemon?.name).subscribe({
      next: (data) =>{
        console.log("getPokemonDescriptionByName: ", data)
        this.currentPokemonDescription = data.flavor_text_entries[0].flavor_text;
        this.currentPokemonColor = data.color.name;
      },
      error: (err) => {
        console.log(err)
      }
    })

  }

  extractPokemonId(url: any) {
    const parts = url.split('/'); 
    return +parts[parts.length - 2];
  }

}


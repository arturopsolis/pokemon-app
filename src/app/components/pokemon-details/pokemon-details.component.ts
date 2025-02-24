import { Component, EventEmitter, Input, Output } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { Pokemon, PokemonDetails, Type } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemons.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent {
  @Output() showDetails = new EventEmitter<boolean>;
  @Input() currentPokemon: Pokemon | undefined;

  private audio = new Audio();
  activeTab: string = 'info'; 
  isLoading: boolean = true;
  isImageLoading: boolean = true;

  cryIsPlaying: boolean = false;

  currentPokemonCompleteDetails: PokemonDetails | undefined;
  currentPokemonOfficialArt: string = ""
  currentPokemonId: number = 0;
  currentPokemonDescription?: string;
  currentPokemonColor: string = "";
  currentPokemonHeight: number = 0;
  currentPokemonWeight: number = 0;
  currentPokemonSpritesFrontDefault: string = "";
  currentPokemonTypes: Type[] = [];
  currentPokemonMainType: string = '';
  currentPokemonMainAbility: string = '';
  currentPokemonCriesUrl: string = '';
  currentPokemonEveolutionChainUrl: string = '';
  currentEvolutionChainPokemons: any[] = [];


  constructor(private pokemonServie: PokemonService){}

  ngOnChanges(){
    this.isImageLoading = true;
    
    this.currentPokemonId = this.extractPokemonId(this.currentPokemon?.url);
    this.currentPokemonOfficialArt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.currentPokemonId}.png`
    
    this.pokemonServie.getPokemonDetailsByName(this.currentPokemon?.name).subscribe({
      next: (data)=>{
        this.currentPokemonCompleteDetails = data;
        this.currentPokemonSpritesFrontDefault = data.sprites.front_default;
        this.currentPokemonHeight = data.height;
        this.currentPokemonWeight = data.weight;
        this.currentPokemonTypes = data.types;
        this.currentPokemonMainType = data.types[0].type.name;
        this.currentPokemonMainAbility = data.abilities[0].ability.name;
        this.currentPokemonCriesUrl = data.cries.latest;
        
      },
      error: (err)=>{
        console.log(err)
      }
    })

    this.pokemonServie.getPokemonDescriptionByName(this.currentPokemon?.name).subscribe({
      next: (data) =>{
        let description = data.flavor_text_entries.find((item)=>{
          return item.language.name === "en";
        })
        this.currentPokemonDescription = (description?.flavor_text ?? "No description available")
        .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Elimina caracteres de control
        .replace(/\s+/g, ' ') // Reemplaza múltiples espacios por un solo espacio
    .trim(); // Elimina espacios al inicio y final
        this.currentPokemonColor = data.color.name;
        this.getPokemonsByEvolutionChain(data.evolution_chain.url);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.currentPokemonDescription = "[No description available]";
        this.currentPokemonColor = "unknown";
      }
    })
  }

  getPokemonsByEvolutionChain(evolutionChainUrl: string) {
    this.pokemonServie.getPokemonsByEvolutionChain(evolutionChainUrl).subscribe({
      next: (evolutionNames: string[]) => {
        this.currentEvolutionChainPokemons = []; // Reiniciar la lista antes de agregar
  
        const spriteObservables = evolutionNames.map(name =>
          this.pokemonServie.getPokemonSpriteByName(name).pipe(
            map(spriteUrl => ({ name, spriteUrl })) // Transformar cada resultado
          )
        );
  
        forkJoin(spriteObservables).subscribe({
          next: (pokemons) => {
            this.currentEvolutionChainPokemons = pokemons;
          },
          error: (err) => {
            console.error("Error fetching evolution chain sprites", err);
          }
        });
      },
      error: (err) => {
        console.error("Error fetching evolution chain", err);
      }
    });
  }

  getPokemonSpriteByPokemonName(name: string){
    return this.pokemonServie.getPokemonSpriteByName(name);
  }

  extractPokemonId(url: any) {
    const parts = url.split('/'); 
    return +parts[parts.length - 2];
  }

  playAudio(): void {
    this.cryIsPlaying = false;
    if (this.currentPokemonCriesUrl) {
      this.audio.src = this.currentPokemonCriesUrl;
      this.audio.load();
      this.audio.play();
      this.cryIsPlaying = true

      this.audio.onended = () => {
        this.cryIsPlaying = false; 
      };

    } else {
      console.warn('No audio URL provided');
    }
  }

  handleBackToMain(){
    this.showDetails.emit(false);
  }

  onImageLoad(){
    this.isImageLoading = false;
  }

}


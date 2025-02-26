import { Component, EventEmitter, Input, Output } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { Pokemon, PokemonDetails, Type } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemons.service';
import { Pokemon3DService } from 'src/app/services/pokemon-3d.service'; // Importamos el nuevo servicio

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent {
  @Output() showDetails = new EventEmitter<boolean>();
  @Input() currentPokemon: Pokemon | undefined;

  private audio = new Audio();
  activeTab: string = 'info'; 
  isLoading: boolean = true;
  isImageLoading: boolean = true;

  currentPokemonCompleteDetails: PokemonDetails | undefined;
  currentPokemonOfficialArt: string = "";
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
  cryIsPlaying: boolean = false;
  currentPokemon3DModelUrl: string | null = null;
  pokemon3dModelIsLoading: boolean = false;
  hasAnimation: boolean = false;
  has3DModel: boolean = false; // Se agrega para controlar la visibilidad del tab 3D

  constructor(private pokemonService: PokemonService, private pokemon3DService: Pokemon3DService) {}

  ngOnChanges() {
    this.isImageLoading = true;
    
    this.currentPokemonId = this.extractPokemonId(this.currentPokemon?.url);
    this.currentPokemonOfficialArt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.currentPokemonId}.png`;

    this.pokemonService.getPokemonDetailsByName(this.currentPokemon?.name).subscribe({
      next: (data) => {
        this.currentPokemonCompleteDetails = data;
        this.currentPokemonSpritesFrontDefault = data.sprites.front_default;
        this.currentPokemonHeight = data.height;
        this.currentPokemonWeight = data.weight;
        this.currentPokemonTypes = data.types;
        this.currentPokemonMainType = data.types[0].type.name;
        this.currentPokemonMainAbility = data.abilities[0].ability.name;
        this.currentPokemonCriesUrl = data.cries.latest;
      },
      error: (err) => console.log(err)
    });

    this.pokemonService.getPokemonDescriptionByName(this.currentPokemon?.name).subscribe({
      next: (data) => {
        let description = data.flavor_text_entries.find((item) => item.language.name === "en");
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
    });

    if (this.currentPokemon?.name) {
      this.pokemon3dModelIsLoading = true;
      this.pokemon3DService.getPokemon3DModel(this.currentPokemon.name).subscribe({
        next: (modelUrl) => {
          if (modelUrl) {
            this.currentPokemon3DModelUrl = modelUrl;
            this.has3DModel = true;
            this.pokemon3dModelIsLoading = false;
            console.log("3D Model URL:", this.currentPokemon3DModelUrl);

            // ✅ Verificamos si el modelo tiene animaciones
            setTimeout(() => {
              const modelViewer = document.querySelector('#pokemon-model') as any;
              this.hasAnimation = modelViewer?.availableAnimations?.length > 0 || false;
            }, 1000);
          } else {
            console.log(`No 3D model found for ${this.currentPokemon?.name}`);
            this.currentPokemon3DModelUrl = null;
            this.hasAnimation = false;
            this.has3DModel = false;
          }
        },
        error: (err) => {
          console.log("Error fetching 3D model", err);
          this.currentPokemon3DModelUrl = null;
          this.hasAnimation = false;
          this.pokemon3dModelIsLoading = false;
          this.has3DModel = false;
        }
      });
    }
  }

  getPokemonsByEvolutionChain(evolutionChainUrl: string) {
    this.pokemonService.getPokemonsByEvolutionChain(evolutionChainUrl).subscribe({
      next: (evolutionNames: string[]) => {
        this.currentEvolutionChainPokemons = []; // Reiniciar la lista antes de agregar
  
        const spriteObservables = evolutionNames.map(name =>
          this.pokemonService.getPokemonSpriteByName(name).pipe(
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
    return this.pokemonService.getPokemonSpriteByName(name);
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

  pauseAnimation() {
    const modelViewer = document.querySelector('#pokemon-model') as any;
    if (modelViewer) {
      modelViewer.pause();
      console.log('Animación pausada');
    }
  }
  
  resumeAnimation() {
    const modelViewer = document.querySelector('#pokemon-model') as any;
    if (modelViewer) {
      modelViewer.play();
      console.log('Animación reanudada');
    }
  }


}


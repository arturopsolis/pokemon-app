export interface Pokemon {
    name: string;
    url: string;
  }

  export interface PokemonDetails {
    abilities: AbilitySlot[];
    base_experience: number;
    cries: Cries;
    forms: PokemonForm[];
    game_indices: GameIndex[];
    height: number;
    held_items: any[]; // Puedes definir mejor si hay datos aquí
    id: number;
    sprites: {
      front_default: string;
    }
  }
  
  export interface AbilitySlot {
    ability: NamedAPIResource;
    is_hidden: boolean;
    slot: number;
  }
  
  export interface Cries {
    latest: string;
    legacy: string;
  }
  
  export interface PokemonForm {
    name: string;
    url: string;
  }
  
  export interface GameIndex {
    game_index: number;
    version: NamedAPIResource;
  }
  
  export interface NamedAPIResource {
    name: string;
    url: string;
  }

  export interface PokemonSpecies {
    color: Pokemon;
    flavor_text_entries: {
      flavor_text: string;
      language: { name: string };
    }[];
  }
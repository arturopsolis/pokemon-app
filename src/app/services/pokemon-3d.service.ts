import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Pokemon3DService {
  private apiUrl = 'https://pokemon3d-api.onrender.com/v1/Regular'; // ✅ Endpoint correcto

  constructor(private http: HttpClient) {}

  getPokemon3DModel(name: string): Observable<string | null> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data) => console.log("📡 API Response:", data)), // 👀 Para ver la respuesta de la API en la consola
      map((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          console.error("❌ Error: API no devolvió una lista válida", data);
          return null;
        }

        // 🔹 Extraemos la lista de Pokémon del primer objeto en la respuesta
        const pokemonList = data[0]?.pokemon;
        if (!Array.isArray(pokemonList)) {
          console.error("❌ Error: No se encontró la clave 'pokemon' en la respuesta", data);
          return null;
        }

        // 🔍 Buscamos el Pokémon por nombre (ignorando mayúsculas y minúsculas)
        const foundPokemon = pokemonList.find((p) =>
          p?.name?.toLowerCase() === name.toLowerCase()
        );

        if (foundPokemon && foundPokemon.model) {
          console.log(`✅ Modelo encontrado para ${name}:`, foundPokemon.model);
          return foundPokemon.model; // ✅ Retorna la URL del modelo 3D
        }

        console.warn(`⚠️ No se encontró modelo 3D para ${name}`);
        return null;
      }),
      catchError((err) => {
        console.error(`❌ Error fetching 3D model for ${name}`, err);
        return of(null);
      })
    );
  }
}
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

export interface Pokemon {
  id: number;
  name: string;
  type: string | null;
  weight: number | null;
}

@Injectable({ providedIn: "root" })
export class PokemonService {
  private http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:8000/api/pokemon";

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.apiUrl).pipe(
      map((response: any) => {
        return response.member as Pokemon[];
      })
    );
  }

  getPokemon(pokemonId: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${pokemonId}`).pipe(
      map((response: any) => {
        return response.member as Pokemon;
      })
    );
  }

  postPokemon(pokemon: Omit<Pokemon, "id">): Observable<HttpResponse<Pokemon>> {
    return this.http.post<Pokemon>(this.apiUrl, pokemon, {
      headers: new HttpHeaders({ "content-type": "application/ld+json" }),
      observe: "response",
    });
  }

  deletePokemon(pokemonId: number): Observable<HttpResponse<Pokemon>> {
    return this.http.delete<Pokemon>(`${this.apiUrl}/${pokemonId}`, {
      headers: new HttpHeaders({ "content-type": "application/ld+json" }),
      observe: "response",
    });
  }

  updatePokemon(
    pokemonId: number,
    pokemon: Omit<Pokemon, "id">
  ): Observable<HttpResponse<Pokemon>> {
    return this.http.patch<Pokemon>(`${this.apiUrl}/${pokemonId}`, pokemon, {
      headers: new HttpHeaders({
        "content-type": "application/merge-patch+json",
      }),
      observe: "response",
    });
  }
}

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class PokemonService {
  private http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:8000/api/pokemon";

  getPokemons(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}

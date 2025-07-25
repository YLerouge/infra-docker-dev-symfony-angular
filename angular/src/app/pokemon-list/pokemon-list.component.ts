import {
  Component,
  effect,
  inject,
  input,
  output,
  Signal,
  signal,
} from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { HttpResponse } from "@angular/common/http";

import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, map, switchMap } from "rxjs";

import { CardModule } from "primeng/card";
import { PanelModule } from "primeng/panel";
import { DividerModule } from "primeng/divider";
import { Button } from "primeng/button";

import { Pokemon, PokemonService } from "../../shared/services/pokemon.service";

@Component({
  selector: "app-pokemon-list",
  imports: [PanelModule, CardModule, TitleCasePipe, Button, DividerModule],
  templateUrl: "./pokemon-list.component.html",
})
export class PokemonListComponent {
  private readonly pokemonService: PokemonService = inject(PokemonService);

  pokemons: Signal<Pokemon[] | undefined> = signal([]);

  private refresh$ = new BehaviorSubject<Pokemon[] | void>(undefined);
  pokemonAdded = input<Pokemon | null>();
  pokemonEdit = output<Pokemon | null>();

  constructor() {
    let pokemonList$ = this.refresh$.pipe(
      switchMap(() => this.pokemonService.getPokemons())
    );

    this.pokemons = toSignal(pokemonList$);

    effect(() => {
      if (this.pokemonAdded()) {
        this.refresh$.next();
        this.pokemonEdit.emit(null);
      }
    });
  }

  deletePokemon(id: number) {
    this.pokemonService
      .deletePokemon(id)
      .subscribe((response: HttpResponse<Pokemon>) => {
        if (response.status === 204) {
          this.refresh$.next();
        }
      });
  }

  editPokemon(pokemon: Pokemon) {
    this.pokemonEdit.emit(pokemon);
  }
}

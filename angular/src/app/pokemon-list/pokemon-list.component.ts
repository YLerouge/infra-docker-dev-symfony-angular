import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  output,
  runInInjectionContext,
  Signal,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { CardModule } from "primeng/card";
import { PanelModule } from "primeng/panel";

import { Pokemon, PokemonService } from "../../shared/services/pokemon.service";
import { TitleCasePipe } from "@angular/common";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { Button } from "primeng/button";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-pokemon-list",
  imports: [PanelModule, CardModule, TitleCasePipe, Button],
  templateUrl: "./pokemon-list.component.html",
})
export class PokemonListComponent {
  private readonly pokemonService: PokemonService = inject(PokemonService);

  private refresh$ = new BehaviorSubject<void>(undefined);

  pokemons: Signal<Pokemon[] | undefined> = signal([]);
  pokemonAdded = input<any>();
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

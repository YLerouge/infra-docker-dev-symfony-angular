import { Component, inject, Signal, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { CardModule } from "primeng/card";
import { PanelModule } from "primeng/panel";

import { PokemonService } from "../../shared/services/pokemon.service";
import { TitleCasePipe } from "@angular/common";

@Component({
  selector: "app-pokemon-list",
  imports: [PanelModule, CardModule, TitleCasePipe],
  templateUrl: "./pokemon-list.component.html",
})
export class PokemonListComponent {
  pokemons: Signal<any> = signal("");
  private readonly pokemonService: PokemonService = inject(PokemonService);

  constructor() {
    this.pokemons = toSignal(this.pokemonService.getPokemons(), {
      initialValue: "",
    });
  }
}

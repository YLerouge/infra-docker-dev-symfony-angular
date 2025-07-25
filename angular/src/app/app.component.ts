import { Component, input } from "@angular/core";
import { CardModule } from "primeng/card";
import { PanelModule } from "primeng/panel";

import { PokemonListComponent } from "./pokemon-list/pokemon-list.component";
import { AddPokemonComponent } from "./add-pokemon/add-pokemon.component";
import { Pokemon } from "../shared/services/pokemon.service";

@Component({
  selector: "app-root",
  imports: [PanelModule, CardModule, PokemonListComponent, AddPokemonComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  pokemonAdded?: any;
  pokemonEdit: Pokemon | null = null;

  setPokemonAdded(value?: any) {
    this.pokemonAdded = value;
  }

  setPokemonEdit(value: Pokemon | null) {
    this.pokemonEdit = value;
  }
}

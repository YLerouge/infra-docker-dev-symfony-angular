import { Component, input } from "@angular/core";
import { Card } from "primeng/card";

import { PokemonListComponent } from "./pokemon-list/pokemon-list.component";
import { Pokemon } from "../shared/services/pokemon.service";
import { PokemonFormComponent } from "./pokemon-form/pokemon-form.component";

@Component({
  selector: "app-root",
  imports: [Card, PokemonListComponent, PokemonFormComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  pokemonAdded?: any;
  pokemonEdit: Pokemon | null = null;

  setPokemonAdded(value?: Pokemon | null) {
    this.pokemonAdded = value;
  }

  setPokemonEdit(value: Pokemon | null) {
    this.pokemonEdit = value;
  }
}

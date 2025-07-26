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
  pokemons: Pokemon[] = [];
  pokemonAdded?: any;
  pokemonEdit: Pokemon | null = null;

  setPokemons(value: Pokemon[] | undefined) {
    this.pokemons = value ?? [];
  }

  setPokemonAdded(value?: any) {
    this.pokemonAdded = value;
  }

  setPokemonEdit(value: Pokemon | null) {
    this.pokemonEdit = value;
  }
}

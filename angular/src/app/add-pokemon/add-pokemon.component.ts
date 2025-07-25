import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from "@angular/core";
import { Dialog } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { Pokemon, PokemonService } from "../../shared/services/pokemon.service";
import { FormsModule } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-add-pokemon",
  imports: [
    ButtonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    Dialog,
  ],
  templateUrl: "./add-pokemon.component.html",
})
export class AddPokemonComponent {
  private readonly pokemonService: PokemonService = inject(PokemonService);

  pokemonAdded = output<any>();
  pokemonEdit = input<Pokemon | null>();
  visible = signal(false);

  pokemon: Omit<Pokemon, "id"> = {
    name: "",
    type: "",
    weight: null,
  };

  constructor() {
    effect(() => {
      let pokemonEdit = this.pokemonEdit();

      untracked(() => {
        if (pokemonEdit) {
          this.visible.set(true);
          this.pokemon.name = pokemonEdit.name;
          this.pokemon.type = pokemonEdit.type;
          this.pokemon.weight = pokemonEdit.weight;
        }
      });
    });
  }

  new() {
    this.pokemonService
      .postPokemon(this.pokemon)
      .subscribe((response: HttpResponse<Pokemon>) => {
        if (response.status === 201) {
          this.visible.set(false);
          this.resetValue();
          this.pokemonAdded.emit(response.body);
        }
      });
  }

  edit(id: number) {
    this.pokemonService
      .updatePokemon(id, this.pokemon)
      .subscribe((response: HttpResponse<Pokemon>) => {
        if (response.status === 200) {
          this.visible.set(false);
          this.resetValue();
          this.pokemonAdded.emit(response.body);
        }
      });
  }

  resetValue() {
    this.pokemon.name = "";
    this.pokemon.type = "";
    this.pokemon.weight = null;
  }
}

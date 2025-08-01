import {
  Component,
  effect,
  input,
  output,
  signal,
  untracked,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpResponse } from "@angular/common/http";

import { Dialog } from "primeng/dialog";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { InputNumber } from "primeng/inputnumber";
import { Toast } from "primeng/toast";
import { MessageService } from "primeng/api";

import { Pokemon, PokemonService } from "../../shared/services/pokemon.service";

@Component({
  selector: "app-pokemon-form",
  imports: [Button, FormsModule, InputText, InputNumber, Dialog, Toast],
  providers: [MessageService],
  templateUrl: "./pokemon-form.component.html",
})
export class PokemonFormComponent {
  pokemonAdded = output<Pokemon | null>();
  pokemonEdit = input<Pokemon | null>();
  visible = signal(false);

  pokemon: Omit<Pokemon, "id"> = {
    name: "",
    type: "",
    weight: null,
  };

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly messageService: MessageService
  ) {
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
          this.messageService.add({
            severity: "success",
            summary: "Yeah !",
            detail: `'${response.body?.name}' created.`,
            life: 3000,
          });
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
          this.messageService.add({
            severity: "success",
            summary: "Yeah !",
            detail: `'${response.body?.name}' updated.`,
            life: 3000,
          });
        }
      });
  }

  resetValue() {
    this.pokemon.name = "";
    this.pokemon.type = "";
    this.pokemon.weight = null;
  }
}

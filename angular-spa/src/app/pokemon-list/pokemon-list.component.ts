import {
  Component,
  effect,
  input,
  output,
  Signal,
  signal,
} from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { HttpResponse } from "@angular/common/http";

import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, map, switchMap } from "rxjs";

import { Card } from "primeng/card";
import { Divider } from "primeng/divider";
import { Button } from "primeng/button";
import { ConfirmDialog } from "primeng/confirmdialog";
import { Toast } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";

import { Pokemon, PokemonService } from "../../shared/services/pokemon.service";

@Component({
  selector: "app-pokemon-list",
  imports: [Card, TitleCasePipe, Button, Divider, ConfirmDialog, Toast],
  providers: [ConfirmationService, MessageService],
  templateUrl: "./pokemon-list.component.html",
})
export class PokemonListComponent {
  pokemons: Signal<Pokemon[] | undefined> = signal([]);

  private refresh$ = new BehaviorSubject<Pokemon[] | void>(undefined);
  pokemonAdded = input<Pokemon | null>();
  pokemonEdit = output<Pokemon | null>();

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {
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

  confirmDeletion(event: Event, pokemon: Pokemon) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete '${pokemon.name}' ?`,
      header: "Confirm deletion",
      closable: true,
      closeOnEscape: true,
      defaultFocus: "reject",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Cancel",
      rejectButtonProps: {
        severity: "secondary",
      },
      acceptLabel: "Confirm",
      accept: () => {
        this.deletePokemon(pokemon);
      },
    });
  }

  deletePokemon(pokemon: Pokemon) {
    this.pokemonService
      .deletePokemon(pokemon.id)
      .subscribe((response: HttpResponse<Pokemon>) => {
        if (response.status === 204) {
          this.messageService.add({
            severity: "success",
            summary: "Yeah !",
            detail: `'${pokemon.name}' deleted.`,
            life: 3000,
          });
          this.refresh$.next();
        }
      });
  }

  editPokemon(pokemon: Pokemon) {
    this.pokemonEdit.emit(pokemon);
  }
}

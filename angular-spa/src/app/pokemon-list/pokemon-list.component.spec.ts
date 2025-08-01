import { ComponentFixture, TestBed, tick } from "@angular/core/testing";
import { PokemonListComponent } from "./pokemon-list.component";
import { provideZonelessChangeDetection } from "@angular/core";
import { HttpResponse, provideHttpClient } from "@angular/common/http";
import { Pokemon } from "../../shared/services/pokemon.service";
import { of } from "rxjs";
import { Confirmation, ConfirmationService } from "primeng/api";

describe("PokemonListComponent", () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        ConfirmationService,
      ],
      imports: [PokemonListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);

    fixture.autoDetectChanges();
    component = fixture.componentInstance;
  });

  it("should create the pokemon list", () => {
    expect(component).toBeTruthy();
  });

  it("should call deletePokemon, show success message, and refresh on successful delete", () => {
    const pokemon: Pokemon = {
      id: 42,
      name: "pikachu",
      type: "electric",
      weight: 10,
    };
    const httpResponse = new HttpResponse<Pokemon>({ status: 204 });

    spyOn(component["pokemonService"], "deletePokemon").and.returnValue(
      of(httpResponse)
    );
    const messageServiceSpy = spyOn(component["messageService"], "add");
    const refreshNextSpy = spyOn<any>(component["refresh$"], "next");

    component.deletePokemon(pokemon);

    expect(component["pokemonService"].deletePokemon).toHaveBeenCalledWith(42);
    expect(messageServiceSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: "success",
        summary: "Yeah !",
        detail: `'${pokemon.name}' deleted.`,
        life: 3000,
      })
    );
    expect(refreshNextSpy).toHaveBeenCalled();
  });

  it("should not show success message or refresh if response status is not 204", () => {
    const pokemon: Pokemon = {
      id: 43,
      name: "bulbasaur",
      type: "grass",
      weight: 12,
    };
    const httpResponse = new HttpResponse<Pokemon>({ status: 400 });

    spyOn(component["pokemonService"], "deletePokemon").and.returnValue(
      of(httpResponse)
    );
    const messageServiceSpy = spyOn(component["messageService"], "add");
    const refreshNextSpy = spyOn<any>(component["refresh$"], "next");

    component.deletePokemon(pokemon);

    expect(messageServiceSpy).not.toHaveBeenCalled();
    expect(refreshNextSpy).not.toHaveBeenCalled();
  });

  it("should emit pokemonEdit when editPokemon is called", () => {
    const pokemon: Pokemon = {
      id: 99,
      name: "charizard",
      type: "fire",
      weight: 90,
    };
    const emitSpy = spyOn(component.pokemonEdit, "emit");
    component.editPokemon(pokemon);
    expect(emitSpy).toHaveBeenCalledWith(pokemon);
  });

  it("should refresh and emit null on pokemonEdit when pokemonAdded is set", () => {
    const pokemon: Pokemon = {
      id: 99,
      name: "charizard",
      type: "fire",
      weight: 90,
    };

    // Set input value for the signal
    fixture.componentRef.setInput("pokemonAdded", pokemon);
    const refreshNextSpy = spyOn<any>(component["refresh$"], "next");
    const emitSpy = spyOn(component.pokemonEdit, "emit");

    // Wait for the effect to be called
    TestBed.tick();

    expect(refreshNextSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(null);
  });

  it("should call confirmationService.confirm with correct params in confirmDeletion", () => {
    const pokemon: Pokemon = {
      id: 7,
      name: "squirtle",
      type: "water",
      weight: 9,
    };
    const event = new MouseEvent("click");
    const confirmSpy = spyOn(component["confirmationService"], "confirm");

    component.confirmDeletion(event, pokemon);

    expect(confirmSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        target: event.target as EventTarget,
        message: `Are you sure you want to delete '${pokemon.name}' ?`,
        header: "Confirm deletion",
        closable: true,
        closeOnEscape: true,
        defaultFocus: "reject",
        icon: "pi pi-exclamation-triangle",
        rejectLabel: "Cancel",
        rejectButtonProps: { severity: "secondary" },
        acceptLabel: "Confirm",
        accept: jasmine.any(Function),
      })
    );
  });

  it("should call deletePokemon when accept is triggered in confirmDeletion", () => {
    const pokemon: Pokemon = {
      id: 8,
      name: "wartortle",
      type: "water",
      weight: 22,
    };
    const event = new MouseEvent("click");
    spyOn(component, "deletePokemon");

    spyOn(component["confirmationService"], "confirm").and.callFake(
      (options: any) => options.accept()
    );

    component.confirmDeletion(event, pokemon);

    expect(component.deletePokemon).toHaveBeenCalledWith(pokemon);
  });
});

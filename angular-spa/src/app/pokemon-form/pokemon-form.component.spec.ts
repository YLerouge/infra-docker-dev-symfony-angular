import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PokemonFormComponent } from "./pokemon-form.component";
import { HttpResponse, provideHttpClient } from "@angular/common/http";
import { provideZonelessChangeDetection } from "@angular/core";
import { Pokemon } from "../../shared/services/pokemon.service";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { of } from "rxjs";

describe("PokemonFormComponent", () => {
  let component: PokemonFormComponent;
  let fixture: ComponentFixture<PokemonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideAnimationsAsync(),
      ],
      imports: [PokemonFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonFormComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show dialog and populate fields when pokemonEdit is set", () => {
    const pokemon: Pokemon = {
      id: 8,
      name: "wartortle",
      type: "water",
      weight: 22,
    };
    const { ["id"]: id, ...pokemonWithoutId } = pokemon;

    fixture.componentRef.setInput("pokemonEdit", pokemon);

    TestBed.tick();

    expect(component.visible()).toBeTrue();
    expect(component.pokemon).toEqual(pokemonWithoutId);
  });

  it("should call postPokemon and emit on success in new()", () => {
    const pokemon: Omit<Pokemon, "id"> = {
      name: "wartortle",
      type: "water",
      weight: 22,
    };

    component.pokemon = pokemon;

    const httpResponse = new HttpResponse<Pokemon>({ status: 201 });
    spyOn(component["pokemonService"], "postPokemon").and.returnValue(
      of(httpResponse)
    );
    spyOn(component.pokemonAdded, "emit");
    spyOn(component["messageService"], "add");

    component.new();

    expect(component["pokemonService"].postPokemon).toHaveBeenCalledWith(
      pokemon
    );
    expect(component.pokemonAdded.emit).toHaveBeenCalledWith(httpResponse.body);
    expect(component["messageService"].add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: "success",
        summary: "Yeah !",
        detail: `'${httpResponse.body?.name}' created.`,
        life: 3000,
      })
    );
    expect(component.visible()).toBeFalse();
    expect(component.pokemon).toEqual({
      name: "",
      type: "",
      weight: null,
    });
  });

  it("should call updatePokemon and emit on success in edit()", () => {
    const pokemon: Omit<Pokemon, "id"> = {
      name: "wartortle",
      type: "water",
      weight: 22,
    };

    component.pokemon = pokemon;

    const httpResponse = new HttpResponse<Pokemon>({ status: 200 });
    spyOn(component["pokemonService"], "updatePokemon").and.returnValue(
      of(httpResponse)
    );
    spyOn(component.pokemonAdded, "emit");
    spyOn(component["messageService"], "add");

    component.edit(5);

    expect(component["pokemonService"].updatePokemon).toHaveBeenCalledWith(
      5,
      pokemon
    );
    expect(component.pokemonAdded.emit).toHaveBeenCalledWith(httpResponse.body);
    expect(component["messageService"].add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        severity: "success",
        summary: "Yeah !",
        detail: `'${httpResponse.body?.name}' updated.`,
        life: 3000,
      })
    );
    expect(component.visible()).toBeFalse();
    expect(component.pokemon).toEqual({
      name: "",
      type: "",
      weight: null,
    });
  });
});

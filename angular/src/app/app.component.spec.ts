import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { provideZonelessChangeDetection } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { Pokemon } from "../shared/services/pokemon.service";

describe("AppComponent", () => {
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient()],
      imports: [AppComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it("should create the app", () => {
    expect(app).toBeTruthy();
  });

  it("should set values from outputs", () => {
    let pokemon: Pokemon = {
      id: 1,
      name: "toto",
      type: "titi",
      weight: 10,
    };

    app.setPokemonAdded(pokemon);
    expect(app.pokemonAdded).toBe(pokemon);

    app.setPokemonEdit(pokemon);
    expect(app.pokemonEdit).toBe(pokemon);
  });
});

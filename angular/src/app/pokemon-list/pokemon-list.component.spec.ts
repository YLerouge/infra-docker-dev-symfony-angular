import { TestBed } from "@angular/core/testing";
import { PokemonListComponent } from "./pokemon-list.component";
import { provideZonelessChangeDetection } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";

describe("PokemonListComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient()],
      imports: [PokemonListComponent],
    }).compileComponents();
  });

  it("should create the pokemon list", () => {
    const fixture = TestBed.createComponent(PokemonListComponent);
    const pokemonList = fixture.componentInstance;
    expect(pokemonList).toBeTruthy();
  });
});

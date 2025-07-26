import { TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { PokemonService, Pokemon } from "./pokemon.service";
import { HttpResponse, provideHttpClient } from "@angular/common/http";
import { provideZonelessChangeDetection } from "@angular/core";

describe("PokemonService", () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  const apiUrl = "http://localhost:8000/api/pokemon";

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonService,
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should fetch all pokemons", () => {
    const mockPokemons: Pokemon[] = [
      { id: 1, name: "Bulbasaur", type: "Grass", weight: 10 },
    ];

    service.getPokemons().subscribe((pokemons) => {
      expect(pokemons).toEqual(mockPokemons);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe("GET");
    req.flush({ member: mockPokemons });
  });

  it("should fetch a single pokemon", () => {
    const mockPokemon: Pokemon = {
      id: 1,
      name: "Bulbasaur",
      type: "Grass",
      weight: 10,
    };

    service.getPokemon(1).subscribe((pokemon) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe("GET");
    req.flush({ member: mockPokemon });
  });

  it("should post a new pokemon", () => {
    const newPokemon = { name: "Charmander", type: "Fire", weight: 8 };
    const mockResponse = new HttpResponse({
      status: 201,
      body: { id: 2, ...newPokemon },
    });

    service.postPokemon(newPokemon).subscribe((response) => {
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 2, ...newPokemon });
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe("POST");
    req.flush({ id: 2, ...newPokemon }, { status: 201, statusText: "Created" });
  });

  it("should delete a pokemon", () => {
    service.deletePokemon(1).subscribe((response) => {
      expect(response.status).toBe(204);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null, { status: 204, statusText: "No Content" });
  });

  it("should update a pokemon", () => {
    const update = { name: "Ivysaur", type: "Grass", weight: 13 };
    const mockResponse = new HttpResponse({
      status: 200,
      body: { id: 1, ...update },
    });

    service.updatePokemon(1, update).subscribe((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...update });
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe("PATCH");
    req.flush({ id: 1, ...update }, { status: 200, statusText: "OK" });
  });
});

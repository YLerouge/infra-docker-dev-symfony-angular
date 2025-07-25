import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddPokemonComponent } from "./add-pokemon.component";
import { provideHttpClient } from "@angular/common/http";
import { provideZonelessChangeDetection } from "@angular/core";

describe("AddPokemonComponent", () => {
  let component: AddPokemonComponent;
  let fixture: ComponentFixture<AddPokemonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient()],
      imports: [AddPokemonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

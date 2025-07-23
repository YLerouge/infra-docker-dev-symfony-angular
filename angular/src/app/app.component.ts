import { Component } from "@angular/core";
import { CardModule } from "primeng/card";
import { PanelModule } from "primeng/panel";

import { PokemonListComponent } from "./pokemon-list/pokemon-list.component";

@Component({
  selector: "app-root",
  imports: [PanelModule, CardModule, PokemonListComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {}

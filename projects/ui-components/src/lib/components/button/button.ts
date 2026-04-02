import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "flip-button",
  imports: [],
  templateUrl: "./button.html",
  styleUrl: "./button.css",
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {

}

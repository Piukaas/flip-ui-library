import { ChangeDetectionStrategy, Component, input, InputSignal, ViewEncapsulation } from "@angular/core";

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = "primary" | "secondary" | "danger" | "warning" | "success" | "info" | "ghost";

@Component({
  selector: "flip-button",
  imports: [],
  templateUrl: "./button.html",
  styleUrl: "./button.css",
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.id]": "id()",
    "[attr.data-variant]": "variant()",
  }
})
export class Button {
  public readonly id: InputSignal<string | undefined> = input();
  public readonly type: InputSignal<ButtonType> = input<ButtonType>("button");
  public readonly disabled: InputSignal<boolean> = input(true);
  public readonly label: InputSignal<string | undefined> = input();
  public readonly ariaLabel: InputSignal<string | undefined> = input();
  public readonly variant: InputSignal<ButtonVariant> = input<ButtonVariant>("primary");
}

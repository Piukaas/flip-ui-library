import { ChangeDetectionStrategy, Component, input, InputSignal, ViewEncapsulation } from "@angular/core";

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = "cta" | "light" | "ghost" | "text" | "outline";
type ButtonColor = "primary" | "secondary" | "danger" | "warning" | "success" | "info";

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
    "[attr.data-color]": "color()",
  }
})
export class Button {
  public readonly id: InputSignal<string | undefined> = input();
  public readonly type: InputSignal<ButtonType> = input<ButtonType>("button");
  public readonly disabled: InputSignal<boolean> = input(false);
  public readonly label: InputSignal<string | undefined> = input();
  public readonly ariaLabel: InputSignal<string | undefined> = input();
  public readonly variant: InputSignal<ButtonVariant> = input<ButtonVariant>("cta");
  public readonly color: InputSignal<ButtonColor> = input<ButtonColor>("primary");
}

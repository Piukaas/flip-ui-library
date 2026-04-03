import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  Signal,
  ViewEncapsulation
} from "@angular/core";

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = "cta" | "default" | "light" | "ghost" | "text" | "outline";
type ButtonColor = "primary" | "secondary" | "danger" | "warning" | "success" | "info";
type ButtonSize = "small" | "medium" | "large";

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
    "[attr.data-size]": "!isText() ? size() : undefined",
    "[attr.data-wide]": "wide() && !isText() ? true : undefined",
  }
})
export class Button {
  public readonly id: InputSignal<string | undefined> = input();
  public readonly type: InputSignal<ButtonType> = input<ButtonType>("button");
  public readonly disabled: InputSignal<boolean> = input(false);
  public readonly label: InputSignal<string | undefined> = input();
  public readonly ariaLabel: InputSignal<string | undefined> = input();
  public readonly variant: InputSignal<ButtonVariant> = input<ButtonVariant>("default");
  public readonly color: InputSignal<ButtonColor> = input<ButtonColor>("primary");
  public readonly size: InputSignal<ButtonSize> = input<ButtonSize>("medium");
  public readonly wide: InputSignal<boolean> = input(false);

  protected readonly isText: Signal<boolean> = computed(() => this.variant() === "text");
}

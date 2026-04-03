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

/**
 * A versatile button component that supports various visual styles,
 * sizes, and icon slotting configurations.
 */
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
  /** The unique identifier for the button element. */
  public readonly id: InputSignal<string | undefined> = input();

  /** The HTML type of the button. Determines form submission behavior. */
  public readonly type: InputSignal<ButtonType> = input<ButtonType>("button");

  /** Whether the button is non-interactive. */
  public readonly disabled: InputSignal<boolean> = input(false);

  /** The text content rendered within the button's label part. */
  public readonly label: InputSignal<string | undefined> = input();

  /** Accessibility label for screen readers. Overrides the default label text. */
  public readonly ariaLabel: InputSignal<string | undefined> = input();

  /** The structural style of the button. */
  public readonly variant: InputSignal<ButtonVariant> = input<ButtonVariant>("default");

  /** The semantic color set applied to the button. */
  public readonly color: InputSignal<ButtonColor> = input<ButtonColor>("primary");

  /** The scale of the button. */
  public readonly size: InputSignal<ButtonSize> = input<ButtonSize>("medium");

  /** Whether the button expands to the full width of its parent container. */
  public readonly wide: InputSignal<boolean> = input(false);

  protected readonly isText: Signal<boolean> = computed(() => this.variant() === "text");
}

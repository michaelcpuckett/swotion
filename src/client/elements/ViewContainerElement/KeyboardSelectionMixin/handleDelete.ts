import { IKeyboardSelectionMixin } from '.';
import { SELECTABLE_CELL_ELEMENT_SELECTOR } from '../constants';
import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';

export function handleDelete(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: KeyboardEvent,
  cellElement: HTMLElement,
) {
  const selectedCellElements = Array.from(
    this.querySelectorAll(
      `[aria-selected="true"]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
    ),
  );

  this.dispatchEvent(
    new CustomEvent('view-container:clear-cells', {
      bubbles: true,
      composed: true,
      detail: selectedCellElements.length
        ? selectedCellElements
        : [cellElement],
    }),
  );

  const hasCheckedSelectMultipleRowsCheckbox = this.matches(
    ':has(input[type="checkbox"][name="row[]"]:checked)',
  );

  if (hasCheckedSelectMultipleRowsCheckbox) {
    this.dispatchEvent(
      new CustomEvent('view-container:delete-rows', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

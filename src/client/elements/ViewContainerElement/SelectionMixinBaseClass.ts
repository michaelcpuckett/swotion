import {
  ANY_CELL_ELEMENT_SELECTOR,
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  isHtmlElement,
} from './constants';

export class SelectionMixinBaseClass extends HTMLElement {
  gridElement: HTMLElement;

  constructor() {
    super();

    const gridElement = this.querySelector('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      throw new Error('Could not find grid element');
    }

    this.gridElement = gridElement;
  }

  getClosestCellElementFromPoint(event: Event) {
    if (event instanceof PointerEvent) {
      let closestCellElement: HTMLElement | null = null;

      const touchTarget = window.document.elementFromPoint(
        event.clientX,
        event.clientY,
      );

      if (touchTarget instanceof HTMLElement) {
        closestCellElement = touchTarget.closest(ANY_CELL_ELEMENT_SELECTOR);
      }

      return closestCellElement;
    } else {
      return this.getClosestCellElementFromComposedPath(event);
    }
  }

  getClosestCellElementFromComposedPath(event: Event) {
    const composedPath = event.composedPath();

    const closestCellElement = composedPath.find((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return element.matches(ANY_CELL_ELEMENT_SELECTOR);
    });

    if (!(closestCellElement instanceof HTMLElement)) {
      return null;
    }

    return closestCellElement;
  }

  updateHighlightElement(
    highlightElement: HTMLElement | null,
    cellElement: HTMLElement,
    originCellElement: HTMLElement,
  ) {
    if (!highlightElement) {
      return;
    }

    const closestRowElement = cellElement.closest('[role="row"]');

    if (!(closestRowElement instanceof HTMLElement)) {
      return;
    }

    const draggedRow = originCellElement.closest('[role="row"]');

    if (!(draggedRow instanceof HTMLElement)) {
      return;
    }

    const closestCellColumnIndex = Array.from(
      closestRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).indexOf(cellElement);
    const originCellColumnIndex = Array.from(
      draggedRow.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).indexOf(originCellElement);

    const closestCellLeft = cellElement.getBoundingClientRect().left;
    const closestCellRight = cellElement.getBoundingClientRect().right;

    const originCellLeft = originCellElement.getBoundingClientRect().left;
    const originCellRight = originCellElement.getBoundingClientRect().right;

    const closestCellTop = cellElement.getBoundingClientRect().top;
    const closestCellBottom = cellElement.getBoundingClientRect().bottom;

    const originCellTop = originCellElement.getBoundingClientRect().top;
    const originCellBottom = originCellElement.getBoundingClientRect().bottom;

    const isSameCell = cellElement === originCellElement;
    const isoriginCellBeforeClosestCell =
      originCellColumnIndex < closestCellColumnIndex && !isSameCell;
    const isoriginCellAfterClosestCell =
      originCellColumnIndex > closestCellColumnIndex && !isSameCell;
    const isoriginCellAboveClosestCell =
      originCellTop < closestCellTop && !isSameCell;
    const isoriginCellBelowClosestCell =
      originCellBottom > closestCellBottom && !isSameCell;

    const left = isSameCell
      ? originCellLeft
      : isoriginCellBeforeClosestCell
        ? originCellLeft
        : closestCellLeft;

    const right = isSameCell
      ? originCellRight
      : isoriginCellAfterClosestCell
        ? originCellRight
        : closestCellRight;

    const top = isSameCell
      ? originCellTop
      : isoriginCellAboveClosestCell
        ? originCellTop
        : closestCellTop;

    const bottom = isSameCell
      ? originCellBottom
      : isoriginCellBelowClosestCell
        ? originCellBottom
        : closestCellBottom;

    highlightElement.style.left = `${left}px`;
    highlightElement.style.top = `${top}px`;
    highlightElement.style.width = `${right - left}px`;
    highlightElement.style.height = `${bottom - top}px`;
    highlightElement.style.border = '3px solid var(--swatch-interactive)';
  }

  initializeHighlightElement(
    highlightElement: HTMLElement | null,
    cellElement: HTMLElement,
  ) {
    if (highlightElement) {
      return null;
    }

    highlightElement = window.document.createElement('div');
    highlightElement.classList.add('highlight');
    const { left, top } = cellElement.getBoundingClientRect();
    highlightElement.style.top = `${top}px`;
    highlightElement.style.left = `${left}px`;

    this.appendChild(highlightElement);

    return highlightElement;
  }

  updateSelectedCells(highlightElement: HTMLElement | null) {
    if (!highlightElement) {
      return;
    }

    const { top, left, bottom, right } =
      highlightElement.getBoundingClientRect();

    const allCellElements = Array.from(
      this.gridElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).filter(isHtmlElement);

    const markCellSelected = (cellElement: HTMLElement) => {
      cellElement.setAttribute('aria-selected', 'true');
    };

    const markCellUnselected = (cellElement: HTMLElement) => {
      cellElement.removeAttribute('aria-selected');
    };

    for (const cellElement of allCellElements) {
      const cellBounds = cellElement.getBoundingClientRect();
      const isTopWithinBounds = Math.ceil(cellBounds.top) >= Math.ceil(top);
      const isBottomWithinBounds =
        Math.ceil(cellBounds.bottom) <= Math.ceil(bottom);
      const isLeftWithinBounds = Math.ceil(cellBounds.left) >= Math.ceil(left);
      const isRightWithinBounds =
        Math.ceil(cellBounds.right) <= Math.ceil(right);
      const isWithinBounds =
        isTopWithinBounds &&
        isBottomWithinBounds &&
        isLeftWithinBounds &&
        isRightWithinBounds;

      if (isWithinBounds) {
        markCellSelected(cellElement);
      } else {
        markCellUnselected(cellElement);
      }
    }
  }

  selectCellElement(options: {
    relativeCellElement: HTMLElement;
    targetCellElement: HTMLElement;
    originCellElement: HTMLElement | null;
    highlightElement: HTMLElement | null;
  }) {
    const {
      relativeCellElement,
      targetCellElement,
      originCellElement,
      highlightElement,
    } = options;

    let newHighlightElement = highlightElement;
    let newOriginCellElement = originCellElement;

    if (!highlightElement) {
      newHighlightElement = this.initializeHighlightElement(
        highlightElement,
        relativeCellElement,
      );
      newOriginCellElement = relativeCellElement;
    }

    this.updateHighlightElement(
      newHighlightElement,
      targetCellElement,
      newOriginCellElement || relativeCellElement,
    );

    this.updateSelectedCells(newHighlightElement);

    return {
      highlightElement: newHighlightElement,
      originCellElement: newOriginCellElement,
    };
  }
}

export type Constructor = { new (...args: any[]): SelectionMixinBaseClass };

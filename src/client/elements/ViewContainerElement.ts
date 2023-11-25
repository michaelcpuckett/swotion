const ANY_CELL_ELEMENT_SELECTOR =
  '[role="gridcell"], [role="columnheader"], [role="rowheader"]';

const SELECTABLE_CELL_ELEMENT_SELECTOR = `[data-selectable]:is(${ANY_CELL_ELEMENT_SELECTOR})`;

const INPUT_SELECTOR =
  ':is(:is(auto-save-search, auto-save-text) input, input[type="checkbox"])';

const FLYOUT_MENU_SELECTOR = 'flyout-menu [role="menu"]';

function isInFlyoutMenu(element: Element | HTMLElement | EventTarget) {
  if (!(element instanceof Element)) {
    return false;
  }

  const flyoutMenuElement = element.closest(FLYOUT_MENU_SELECTOR);

  return flyoutMenuElement instanceof HTMLElement;
}

function isHtmlElement(element: unknown): element is HTMLElement {
  return element instanceof HTMLElement;
}

export class ViewContainerElement extends HTMLElement {
  private gridElement: HTMLElement;
  private draggedCellElement: HTMLElement | null = null;
  private highlightElement: HTMLElement | null = null;
  private isShiftKeyPressed = false;
  private isInvertingSelection = false;
  private isDragging = false;
  private boundDragstartHandler = this.handleDragstart.bind(this);
  private boundDragendHandler = this.handleDragend.bind(this);
  private boundDragoverHandler = this.handleDragover.bind(this);
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundKeyupHandler = this.handleKeyup.bind(this);
  private boundHandleAutoSaveTextSave = this.handleAutoSaveTextSave.bind(this);
  private boundClearCellsHandler = this.handleClearCells.bind(this);

  constructor() {
    super();

    const gridElement = this.querySelector('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      throw new Error('Could not find grid element');
    }

    this.gridElement = gridElement;
  }

  connectedCallback() {
    this.addEventListener(
      'view-container:clear-cells',
      this.boundClearCellsHandler,
      {
        capture: true,
      },
    );
    this.addEventListener('mousedown', this.boundDragstartHandler);
    this.addEventListener('touchstart', this.boundDragstartHandler);
    this.addEventListener('mouseover', this.boundDragoverHandler);
    this.addEventListener('touchmove', this.boundDragoverHandler);
    this.addEventListener('mouseup', this.boundDragendHandler, {
      capture: true,
    });
    this.addEventListener('touchend', this.boundDragendHandler, {
      capture: true,
    });
    this.addEventListener('touchcancel', this.boundDragendHandler, {
      capture: true,
    });
    this.addEventListener('keydown', this.boundKeydownHandler, {
      capture: true,
    });
    this.addEventListener('keyup', this.boundKeyupHandler);
    this.addEventListener(
      'auto-save-text:save',
      this.boundHandleAutoSaveTextSave,
    );

    this.addEventListener('auto-save-text:toggle-edit-mode', (event: Event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      const cellElement = event.target.closest(
        SELECTABLE_CELL_ELEMENT_SELECTOR,
      );

      if (!(cellElement instanceof HTMLElement)) {
        return;
      }

      const rowElement = cellElement.closest('[role="row"]');

      if (!(rowElement instanceof HTMLElement)) {
        return;
      }

      const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

      const nextRowElement = rowElement.nextElementSibling;

      if (!(nextRowElement instanceof HTMLElement)) {
        return;
      }

      const nextCellElement = nextRowElement.children[cellIndex];

      if (!(nextCellElement instanceof HTMLElement)) {
        return;
      }

      nextCellElement.focus();
    });
  }

  disconnectedCallback() {
    this.removeEventListener(
      'view-container:clear-cells',
      this.boundClearCellsHandler,
      {
        capture: true,
      },
    );
    this.removeEventListener('mousedown', this.boundDragstartHandler);
    this.removeEventListener('touchstart', this.boundDragstartHandler);
    this.removeEventListener('mouseover', this.boundDragoverHandler);
    this.removeEventListener('touchmove', this.boundDragoverHandler);
    this.removeEventListener('mouseup', this.boundDragendHandler, {
      capture: true,
    });
    this.removeEventListener('touchend', this.boundDragendHandler, {
      capture: true,
    });
    this.removeEventListener('touchcancel', this.boundDragendHandler, {
      capture: true,
    });
    this.removeEventListener('keydown', this.boundKeydownHandler, {
      capture: true,
    });
    this.removeEventListener('keyup', this.boundKeyupHandler);
    this.removeEventListener(
      'auto-save-text:save',
      this.boundHandleAutoSaveTextSave,
    );
  }

  handleDragstart(event: Event) {
    const closestCellElement =
      this.getClosestCellElementFromComposedPath(event);

    if (!closestCellElement) {
      return;
    }

    const allCells = Array.from(
      this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
    );

    for (const cell of allCells) {
      if (cell.hasAttribute('aria-selected')) {
        cell.setAttribute('data-selected', '');
      } else {
        cell.removeAttribute('data-selected');
      }
    }

    this.isInvertingSelection =
      this.isShiftKeyPressed &&
      closestCellElement.hasAttribute('aria-selected');

    if (event instanceof TouchEvent) {
      window.document.body.classList.add('prevent-scroll');
    }

    this.initializeHighlightElement(closestCellElement);

    if (!this.isShiftKeyPressed) {
      return;
    }

    this.updateHighlightElement(closestCellElement, closestCellElement);
    this.updateSelectedCells();
  }

  handleDragover(event: Event) {
    if (!this.draggedCellElement) {
      return;
    }

    if (!this.highlightElement) {
      return;
    }

    const closestCellElement = this.getClosestCellElementFromPoint(event);

    if (!closestCellElement) {
      return;
    }

    if (
      !this.isShiftKeyPressed &&
      closestCellElement === this.draggedCellElement
    ) {
      return;
    }

    this.isDragging = true;
    this.updateHighlightElement(closestCellElement, this.draggedCellElement);
    this.updateSelectedCells();
  }

  updateSelectedCells() {
    if (!this.highlightElement) {
      return;
    }

    const { top, left, bottom, right } =
      this.highlightElement.getBoundingClientRect();

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

      // console.log(cellElement, {
      //   isRightWithinBounds,
      //   'cellBounds.right': cellBounds.right,
      //   'highlightBounds.right': right,
      //   isWithinBounds,
      // });

      if (this.isInvertingSelection) {
        if (isWithinBounds) {
          markCellUnselected(cellElement);
        } else if (cellElement.hasAttribute('data-selected')) {
          markCellSelected(cellElement);
        }
      } else if (this.isShiftKeyPressed) {
        if (isWithinBounds || cellElement.hasAttribute('data-selected')) {
          markCellSelected(cellElement);
        } else {
          markCellUnselected(cellElement);
        }
      } else {
        if (isWithinBounds) {
          markCellSelected(cellElement);
        } else {
          markCellUnselected(cellElement);
        }
      }
    }
  }

  handleDragend(event: Event) {
    if (!this.highlightElement) {
      return;
    }

    if (event instanceof TouchEvent) {
      if (event.touches.length > 0) {
        return;
      }

      window.document.body.classList.remove('prevent-scroll');
    }

    const closestCellElement = this.getClosestCellElementFromPoint(event);

    if (!(closestCellElement instanceof HTMLElement)) {
      return;
    }

    const allCells = Array.from(
      this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
    );

    for (const cell of allCells) {
      if (cell.hasAttribute('aria-selected')) {
        cell.setAttribute('data-selected', '');
      } else {
        cell.removeAttribute('data-selected');
      }
    }

    if (
      this.isShiftKeyPressed ||
      (this.isDragging && this.draggedCellElement !== closestCellElement)
    ) {
      this.isDragging = false;
      event.stopImmediatePropagation();
      event.stopPropagation();
    } else {
      this.isDragging = false;
      return;
    }

    if (!this.draggedCellElement) {
      return;
    }

    this.updateHighlightElement(closestCellElement, this.draggedCellElement);
    this.updateSelectedCells();

    this.highlightElement.remove();
    this.highlightElement = null;
    this.draggedCellElement = null;

    closestCellElement.focus();
  }

  handleAutoSaveTextSave(event: Event) {
    if (!(event instanceof CustomEvent)) {
      return;
    }

    const { target } = event;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const rowElement = target.closest('[role="row"]');

    if (!(rowElement instanceof HTMLElement)) {
      return;
    }

    const gridRows = Array.from(
      this.gridElement.querySelectorAll('[role="row"]'),
    );

    const rowIndex = gridRows.indexOf(rowElement);

    if (Number(rowIndex) !== gridRows.length - 1) {
      return;
    }

    const addRowButtonElement = this.querySelector('#add-new-row-button');

    if (!(addRowButtonElement instanceof HTMLButtonElement)) {
      throw new Error('Could not find add new row button element');
    }

    const addRowFormElement = addRowButtonElement.form;

    if (!(addRowFormElement instanceof HTMLFormElement)) {
      throw new Error('Could not find add new row form element');
    }

    addRowFormElement.submit();
  }

  handleKeyup(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    this.isShiftKeyPressed = event.shiftKey;

    const allCells = Array.from(
      this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
    );

    if (this.isDragging) {
      for (const cell of allCells) {
        if (cell.hasAttribute('aria-selected')) {
          cell.setAttribute('data-selected', '');
        } else {
          cell.removeAttribute('data-selected');
        }
      }
    }

    if (!this.isShiftKeyPressed) {
      if (this.highlightElement) {
        this.highlightElement.remove();
      }
      this.highlightElement = null;
      this.draggedCellElement = null;
      this.isDragging = false;

      const selectedCells = Array.from(
        this.gridElement.querySelectorAll(
          `[data-selected]:is(${ANY_CELL_ELEMENT_SELECTOR})`,
        ),
      );

      for (const selectedCell of selectedCells) {
        selectedCell.removeAttribute('data-selected');
      }
    }
  }

  getClosestCellElementFromPoint(event: Event) {
    if (event instanceof TouchEvent) {
      let closestCellElement: HTMLElement | null = null;

      const touchLocation = event.changedTouches[0];
      const touchTarget = window.document.elementFromPoint(
        touchLocation.clientX,
        touchLocation.clientY,
      );

      if (touchTarget instanceof HTMLElement) {
        closestCellElement = touchTarget.closest(
          SELECTABLE_CELL_ELEMENT_SELECTOR,
        );
      }

      return closestCellElement;
    } else {
      return this.getClosestCellElementFromComposedPath(event);
    }
  }

  updateHighlightElement(
    cellElement: HTMLElement,
    draggedCellElement: HTMLElement,
  ) {
    if (!this.highlightElement) {
      return;
    }

    const closestRowElement = cellElement.closest('[role="row"]');

    if (!(closestRowElement instanceof HTMLElement)) {
      return;
    }

    const draggedRow = draggedCellElement.closest('[role="row"]');

    if (!(draggedRow instanceof HTMLElement)) {
      return;
    }

    const closestCellColumnIndex = Array.from(
      closestRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).indexOf(cellElement);
    const draggedCellColumnIndex = Array.from(
      draggedRow.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).indexOf(draggedCellElement);

    const closestCellLeft = cellElement.getBoundingClientRect().left;
    const closestCellRight = cellElement.getBoundingClientRect().right;

    const draggedCellLeft = draggedCellElement.getBoundingClientRect().left;
    const draggedCellRight = draggedCellElement.getBoundingClientRect().right;

    const closestCellTop = cellElement.getBoundingClientRect().top;
    const closestCellBottom = cellElement.getBoundingClientRect().bottom;

    const draggedCellTop = draggedCellElement.getBoundingClientRect().top;
    const draggedCellBottom = draggedCellElement.getBoundingClientRect().bottom;

    const isSameCell = cellElement === draggedCellElement;
    const isDraggedCellBeforeClosestCell =
      draggedCellColumnIndex < closestCellColumnIndex && !isSameCell;
    const isDraggedCellAfterClosestCell =
      draggedCellColumnIndex > closestCellColumnIndex && !isSameCell;
    const isDraggedCellAboveClosestCell =
      draggedCellTop < closestCellTop && !isSameCell;
    const isDraggedCellBelowClosestCell =
      draggedCellBottom > closestCellBottom && !isSameCell;

    const left = isSameCell
      ? draggedCellLeft
      : isDraggedCellBeforeClosestCell
        ? draggedCellLeft
        : closestCellLeft;

    const right = isSameCell
      ? draggedCellRight
      : isDraggedCellAfterClosestCell
        ? draggedCellRight
        : closestCellRight;

    const top = isSameCell
      ? draggedCellTop
      : isDraggedCellAboveClosestCell
        ? draggedCellTop
        : closestCellTop;

    const bottom = isSameCell
      ? draggedCellBottom
      : isDraggedCellBelowClosestCell
        ? draggedCellBottom
        : closestCellBottom;

    this.highlightElement.style.left = `${left}px`;
    this.highlightElement.style.top = `${top}px`;
    this.highlightElement.style.width = `${right - left}px`;
    this.highlightElement.style.height = `${bottom - top}px`;

    if (right - left === 0 || bottom - top === 0) {
      console.log('zero width or height', {
        draggedCellElement,
        cellElement,
      });
    }

    this.highlightElement.style.border = '3px solid var(--swatch-interactive)';
  }

  getClosestCellElementFromComposedPath(event: Event) {
    const composedPath = event.composedPath();

    const closestCellElement = composedPath.find((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return element.matches(SELECTABLE_CELL_ELEMENT_SELECTOR);
    });

    if (!(closestCellElement instanceof HTMLElement)) {
      return null;
    }

    return closestCellElement;
  }

  initializeHighlightElement(cellElement: HTMLElement) {
    if (this.highlightElement) {
      return;
    }

    this.draggedCellElement = cellElement;

    this.highlightElement = window.document.createElement('div');
    this.highlightElement.classList.add('highlight');
    const { left, top } = cellElement.getBoundingClientRect();
    this.highlightElement.style.top = `${top}px`;
    this.highlightElement.style.left = `${left}px`;

    this.appendChild(this.highlightElement);
  }

  handleClearCells(event: Event) {
    if (!(event instanceof CustomEvent)) {
      return;
    }

    if (!Array.isArray(event.detail)) {
      return;
    }

    const cellElements = event.detail.filter(isHtmlElement);

    for (const cellElement of cellElements) {
      const autoSaveTextElement = cellElement.querySelector(INPUT_SELECTOR);

      if (!(autoSaveTextElement instanceof HTMLInputElement)) {
        continue;
      }

      autoSaveTextElement.value = '';
    }

    const clearCellsButtonElement = this.querySelector('#clear-cells-button');

    if (!(clearCellsButtonElement instanceof HTMLButtonElement)) {
      throw new Error('Could not find clear cells button element');
    }

    const clearCellsFormElement = clearCellsButtonElement.form;

    if (!(clearCellsFormElement instanceof HTMLFormElement)) {
      throw new Error('Could not find add new row form element');
    }

    const hiddenInputElement = clearCellsFormElement.querySelector(
      'input[type="hidden"][name="cell[]"]',
    );

    if (!(hiddenInputElement instanceof HTMLInputElement)) {
      throw new Error('Could not find hidden input element');
    }

    const cellsValue = cellElements
      .map((cellElement) => {
        const rowId = cellElement.getAttribute('data-row-id');

        if (!rowId) {
          throw new Error('Could not find id attribute');
        }

        const propertyId = cellElement.getAttribute('data-property-id');

        if (!propertyId) {
          throw new Error('Could not find id attribute');
        }

        return rowId + ':' + propertyId;
      })
      .join(',');

    hiddenInputElement.setAttribute('value', cellsValue);

    fetch(clearCellsFormElement.action, {
      method: clearCellsFormElement.method,
      body: new FormData(clearCellsFormElement),
    });
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (!this.isShiftKeyPressed) {
      this.isShiftKeyPressed = event.key === 'Shift' || event.shiftKey;

      if (this.isShiftKeyPressed) {
        const allCells = Array.from(
          this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
        );

        for (const cell of allCells) {
          if (cell.hasAttribute('aria-selected')) {
            cell.setAttribute('data-selected', '');
          } else {
            cell.removeAttribute('data-selected');
          }
        }
      }
    }

    if (event.key === 'Escape') {
      const selectedCells = Array.from(
        this.gridElement.querySelectorAll(
          `[aria-selected="true"]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
        ),
      );

      for (const selectedCell of selectedCells) {
        selectedCell.removeAttribute('aria-selected');
        selectedCell.removeAttribute('data-selected');
      }

      if (this.highlightElement) {
        this.highlightElement.remove();
        this.highlightElement = null;
      }
    }

    const cellElement = event.composedPath().find((element) => {
      return (
        element instanceof HTMLElement &&
        element.matches(ANY_CELL_ELEMENT_SELECTOR)
      );
    });

    if (!(cellElement instanceof HTMLElement)) {
      return;
    }

    const editableAutoSaveTextInputElement = cellElement.querySelector(
      'auto-save-text input[type="text"]:not([data-read-only])',
    );

    if (editableAutoSaveTextInputElement) {
      return;
    }

    const flyoutMenuElement = event.composedPath().find(isInFlyoutMenu);

    if (flyoutMenuElement) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.handleArrowUp(cellElement);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.handleArrowDown(cellElement);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.handleArrowLeft(cellElement);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.handleArrowRight(cellElement);
        break;
      case 'Home':
        event.preventDefault();
        this.handleHome(cellElement);
        break;
      case 'End':
        event.preventDefault();
        this.handleEnd(cellElement);
        break;
      default:
        break;
    }

    const selectedCellElements = Array.from(
      this.querySelectorAll(
        `[aria-selected="true"]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
      ),
    );

    if (event.key === ' ' && this.isShiftKeyPressed) {
      const inputElement = cellElement.querySelector(INPUT_SELECTOR);

      if (!(inputElement instanceof HTMLInputElement)) {
        return;
      }

      if (!inputElement.hasAttribute('data-read-only')) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();

      const allCells = Array.from(
        this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
      );

      for (const cell of allCells) {
        if (cell.hasAttribute('aria-selected')) {
          cell.setAttribute('data-selected', '');
        } else {
          cell.removeAttribute('data-selected');
        }
      }

      this.isInvertingSelection = cellElement.hasAttribute('aria-selected');

      if (this.highlightElement) {
        this.highlightElement.remove();
      }
      this.highlightElement = null;
      this.draggedCellElement = null;

      this.initializeHighlightElement(cellElement);
      this.updateHighlightElement(cellElement, cellElement);
      this.updateSelectedCells();
    }

    if (selectedCellElements.length) {
      if (['Delete', 'Backspace'].includes(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        this.dispatchEvent(
          new CustomEvent('view-container:clear-cells', {
            bubbles: true,
            composed: true,
            detail: selectedCellElements,
          }),
        );
      }
    }
  }

  handleHome(cellElement: HTMLElement) {
    const gridElement = cellElement.closest('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      return;
    }

    const rowElements = Array.from(
      gridElement.querySelectorAll('[role="row"]'),
    );

    const targetRowElement = rowElements[0];

    if (!(targetRowElement instanceof HTMLElement)) {
      return;
    }

    const targetRowElementCells = Array.from(targetRowElement.children);

    const targetCellElement = targetRowElementCells[0];

    if (!(targetCellElement instanceof HTMLElement)) {
      return;
    }

    this.focusElement(targetCellElement);
  }

  handleEnd(cellElement: HTMLElement) {
    const gridElement = cellElement.closest('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      return;
    }

    const rowElements = Array.from(
      gridElement.querySelectorAll('[role="row"]'),
    );

    const targetRowElement = rowElements[rowElements.length - 1];

    if (!(targetRowElement instanceof HTMLElement)) {
      return;
    }

    const targetRowElementCells = Array.from(targetRowElement.children);

    const targetCellElement =
      targetRowElementCells[targetRowElementCells.length - 1];

    if (!(targetCellElement instanceof HTMLElement)) {
      return;
    }

    this.focusElement(targetCellElement);
  }

  handleArrowUp(cellElement: HTMLElement) {
    const rowElement = cellElement.closest('[role="row"]');

    if (!rowElement) {
      return;
    }

    const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

    const gridElement = rowElement.closest('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      return;
    }

    const rowElements = Array.from(
      gridElement.querySelectorAll('[role="row"]'),
    );

    const rowIndex = rowElements.indexOf(rowElement);

    const targetRowElement = rowElements[rowIndex - 1];

    if (!(targetRowElement instanceof HTMLElement)) {
      return;
    }

    const targetRowElementCells = Array.from(targetRowElement.children);

    const targetCellElement =
      targetRowElementCells[
        Math.min(targetRowElementCells.length - 1, cellIndex)
      ];

    if (!(targetCellElement instanceof HTMLElement)) {
      return;
    }

    if (
      this.isShiftKeyPressed &&
      !targetCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
    ) {
      return;
    }

    this.focusElement(targetCellElement);

    if (this.isDragging) {
      return;
    }

    if (this.isShiftKeyPressed) {
      if (!this.highlightElement) {
        this.isInvertingSelection = cellElement.hasAttribute('aria-selected');
        this.initializeHighlightElement(cellElement);
      }
      this.updateHighlightElement(
        targetCellElement,
        this.draggedCellElement || cellElement,
      );
      this.updateSelectedCells();
    }
  }

  handleArrowDown(cellElement: HTMLElement) {
    const rowElement = cellElement.closest('[role="row"]');

    if (!rowElement) {
      return;
    }

    const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

    const gridElement = rowElement.closest('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      return;
    }

    const rowElements = Array.from(
      gridElement.querySelectorAll('[role="row"]'),
    );

    const rowIndex = rowElements.indexOf(rowElement);

    const targetRowElement = rowElements[rowIndex + 1];

    if (!(targetRowElement instanceof HTMLElement)) {
      return;
    }

    const targetRowElementCells = Array.from(targetRowElement.children);

    const targetCellElement =
      targetRowElementCells[
        Math.min(targetRowElementCells.length - 1, cellIndex)
      ];

    if (!(targetCellElement instanceof HTMLElement)) {
      return;
    }

    if (
      this.isShiftKeyPressed &&
      !targetCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
    ) {
      return;
    }

    this.focusElement(targetCellElement);

    if (this.isDragging) {
      return;
    }

    if (this.isShiftKeyPressed) {
      if (!this.highlightElement) {
        this.isInvertingSelection = cellElement.hasAttribute('aria-selected');
        this.initializeHighlightElement(cellElement);
      }
      this.updateHighlightElement(
        targetCellElement,
        this.draggedCellElement || cellElement,
      );
      this.updateSelectedCells();
    }
  }

  handleArrowLeft(cellElement: HTMLElement) {
    const previousCellElement = cellElement.previousElementSibling;

    if (!(previousCellElement instanceof HTMLElement)) {
      return;
    }

    if (
      this.isShiftKeyPressed &&
      !previousCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
    ) {
      return;
    }

    this.focusElement(previousCellElement);

    if (this.isDragging) {
      return;
    }

    if (this.isShiftKeyPressed) {
      if (!this.highlightElement) {
        this.isInvertingSelection = cellElement.hasAttribute('aria-selected');
        this.initializeHighlightElement(cellElement);
      }
      this.updateHighlightElement(
        previousCellElement,
        this.draggedCellElement || cellElement,
      );
      this.updateSelectedCells();
    }
  }

  handleArrowRight(cellElement: HTMLElement) {
    const nextCellElement = cellElement.nextElementSibling;

    if (!(nextCellElement instanceof HTMLElement)) {
      return;
    }

    if (
      this.isShiftKeyPressed &&
      !nextCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
    ) {
      return;
    }

    this.focusElement(nextCellElement);

    if (this.isDragging) {
      return;
    }

    if (this.isShiftKeyPressed) {
      if (!this.highlightElement) {
        this.isInvertingSelection = cellElement.hasAttribute('aria-selected');
        this.initializeHighlightElement(cellElement);
      }
      this.updateHighlightElement(
        nextCellElement,
        this.draggedCellElement || cellElement,
      );
      this.updateSelectedCells();
    }
  }

  focusElement(targetCellElement: HTMLElement) {
    targetCellElement.focus();
  }
}

window.customElements.define('view-container', ViewContainerElement);

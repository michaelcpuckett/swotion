import React from 'react';
import { Database, AnyProperty } from 'shared/types';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { PostFormElement } from 'components/elements/PostFormElement';

export function AddPropertyForm(
  props: React.PropsWithChildren<{ database: Database<AnyProperty[]> }>,
) {
  return (
    <PostFormElement
      action={`/databases/${props.database.id}/properties`}
      id="add-row-form"
    >
      <input
        type="hidden"
        name="type"
        value="String"
      />
      <button
        type="submit"
        className="text-color--currentColor button--full-width"
        aria-label="Add Property"
        tabIndex={-1}
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="125 175 250 250"
        >
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="/icons.svg#plus"
          ></use>
        </svg>
      </button>
    </PostFormElement>
  );
}

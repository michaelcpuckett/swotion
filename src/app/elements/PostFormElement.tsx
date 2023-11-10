import React from 'react';

export function PostFormElement(props: React.PropsWithChildren<{ action: string; id: string; }>) {
  return (
    <post-form>
      <form noValidate action={props.action} method="POST" id={props.id} role="none">
        <input type="hidden" name="_method" value="POST" />
        {props.children}
        <button type="reset" hidden>
          Reset
        </button>
      </form>
    </post-form>
  );
}
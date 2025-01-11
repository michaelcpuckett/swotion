import { FormEventHandler, useCallback } from 'react';

export interface Note {
  id: string;
  position: string;
  text: string;
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('notesDB', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        return;
      }

      const db = event.target.result;

      if (!db.objectStoreNames.contains('notes')) {
        const notesObjectStore = db.createObjectStore('notes', {
          keyPath: 'id',
          autoIncrement: false,
        });
        notesObjectStore.createIndex('id', 'id', { unique: true });
        notesObjectStore.createIndex('position', 'position', { unique: true });
      }
    };

    request.onsuccess = (event: Event) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        reject(new Error('Failed to open the database'));
        return;
      }

      resolve(event.target.result);
    };

    request.onerror = (event) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        reject(new Error('Failed to open the database'));
        return;
      }

      reject(event.target.error);
    };
  });
}

export async function setNotesDb(value: Note[]) {
  const db = await openDB();
  const transaction = db.transaction('notes', 'readwrite');
  const store = transaction.objectStore('notes');

  for (const note of value) {
    store.put(note);
  }

  return transaction.oncomplete;
}

async function deleteNote(note: Note): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction('notes', 'readwrite');
  const store = transaction.objectStore('notes');
  const request = store.delete(note.id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).then(() => {
    window.location.reload();
  });
}

export async function getNotes(): Promise<Note[]> {
  const db = await openDB();
  const transaction = db.transaction('notes', 'readonly');
  const store = transaction.objectStore('notes');
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function reorderNote(
  noteToReorder: Note,
  noteToFlip: Note,
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('notes', 'readwrite');
  const store = tx.objectStore('notes');
  const { position: oldPosition } = noteToReorder;
  const { position: newPosition } = noteToFlip;

  noteToReorder.position = newPosition;
  noteToFlip.position = oldPosition;

  store.delete(noteToReorder.id);
  store.delete(noteToFlip.id);
  store.put(noteToReorder);
  store.put(noteToFlip);

  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = reject;
  }).then(() => {
    window.location.reload();
  });
}

export default function NoteRow({
  note,
  prevNote,
  nextNote,
}: {
  note: Note;
  prevNote: Note;
  nextNote: Note;
}) {
  const handleDelete = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();

      const formElement = event.target;

      if (!(formElement instanceof HTMLFormElement)) {
        return;
      }

      await deleteNote(note);
    },
    [note],
  );

  const handleMoveUp = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();

      if (!prevNote) {
        return;
      }

      await reorderNote(note, prevNote);
    },
    [note, prevNote],
  );

  const handleMoveDown = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();

      if (!nextNote) {
        return;
      }

      await reorderNote(note, nextNote);
    },
    [note, nextNote],
  );

  return (
    <div role="row">
      <div role="gridcell">
        <p>{note.text.slice(0, 20)}...</p>
      </div>
      <div role="gridcell">
        <a href={`/notes/${note.id}`}>Edit</a>
      </div>
      <div role="gridcell">
        <form onSubmit={handleMoveUp}>
          <button>Move Up</button>
        </form>
      </div>
      <div role="gridcell">
        <form onSubmit={handleMoveDown}>
          <button>Move Down</button>
        </form>
      </div>
      <div role="gridcell">
        <form onSubmit={handleDelete}>
          <button>Delete</button>
        </form>
      </div>
    </div>
  );
}
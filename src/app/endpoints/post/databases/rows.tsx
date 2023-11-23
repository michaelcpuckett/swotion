import { Referrer, NormalizedFormData, PartialRow, AnyRow } from 'shared/types';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import { getUniqueId } from 'shared/getUniqueId';
import { formatPropertyValueFromFormData } from 'shared/formatPropertyValueFromFormData';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  addRowToIndexedDb,
  getRowByIdFromIndexedDb,
  deleteRowByIdFromIndexedDb,
  editRowInIndexedDb,
} from 'utilities/idb';
import { LexoRank } from 'lexorank';

export async function PostDatabaseRows(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  console.log('POST DB');
  const idb = await getIdb();
  const id = match?.[1] || '';
  const database = await getDatabaseFromIndexedDb(id, idb);

  if (!database) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  if (formData.bulkAction !== undefined) {
    if (formData.bulkAction === 'DELETE') {
      const rowIds = formData['row[]'] || [];

      for (const rowId of rowIds) {
        const row = await getRowByIdFromIndexedDb(rowId, database.id, idb);

        if (!row) {
          continue;
        }

        await deleteRowByIdFromIndexedDb(row.id, database.id, idb);
      }
    } else if (formData.bulkAction === 'CLEAR') {
      const cellEntries = formData['cell[]'] || [];

      for (const cellEntry of cellEntries) {
        const [rowId, propertyId] = cellEntry.split(':');
        const existingRow = await getRowByIdFromIndexedDb<typeof database>(
          rowId,
          database.id,
          idb,
        );

        if (!existingRow) {
          continue;
        }

        const rowToPatch = {};

        for (const [key, value] of Object.entries(existingRow)) {
          if (key === propertyId) {
            rowToPatch[key] = '';
          } else {
            rowToPatch[key] = value;
          }
        }

        if (
          !guardIsChecklistRow(rowToPatch, database) &&
          !guardIsTableRow(rowToPatch, database)
        ) {
          idb.close();
          return new Response('Not found', {
            status: 404,
          });
        }

        await editRowInIndexedDb(rowToPatch, idb);
      }
    } else {
      idb.close();
      return new Response('Not found', {
        status: 404,
      });
    }

    idb.close();
    return Response.redirect(event.request.referrer, 303);
  }

  const rowToAdd = {
    id: getUniqueId(),
    databaseId: database.id,
  };

  for (const property of database.properties) {
    const formDataValue = formatPropertyValueFromFormData<typeof property>(
      formData[property.id],
      property,
    );

    if (formDataValue === undefined) {
      continue;
    }

    rowToAdd[property.id] = formDataValue;
  }

  if (
    !guardIsChecklistRow(rowToAdd, database) &&
    !guardIsTableRow(rowToAdd, database)
  ) {
    idb.close();
    const url = new URL(event.request.referrer);
    url.searchParams.set('error', 'Invalid row');

    return Response.redirect(url.href, 303);
  }

  if (guardIsChecklistRow(rowToAdd, database)) {
    rowToAdd.completed = formData.completed === 'on';
  }

  if (formData.position !== undefined) {
    rowToAdd.position = formData.position;
  } else {
    const lastRow = database.rows[database.rows.length - 1];

    if (lastRow) {
      rowToAdd.position = LexoRank.parse(lastRow.position).genNext().toString();
    } else {
      rowToAdd.position = LexoRank.middle().toString();
    }
  }

  await addRowToIndexedDb<typeof database>(rowToAdd, idb);
  idb.close();

  const redirectUrl = new URL(
    `/databases/${database.id}`,
    new URL(event.request.url).origin,
  );
  const firstPropertyName = database.properties[0]?.id || '';
  const autoFocusId = `auto-save-text--field__${firstPropertyName}--${rowToAdd.id}`;
  redirectUrl.searchParams.set('autofocus', autoFocusId);

  return Response.redirect(redirectUrl.href, 303);
}

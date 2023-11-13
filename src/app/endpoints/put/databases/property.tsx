import { Referrer, PartialDatabase, Property } from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editPropertyInIndexedDb,
  getPropertyTypeFromString,
} from 'utilities/idb';

export async function PutDatabaseProperty(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: Record<string, string>,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const propertyId = match?.[1] || '';
  const databaseId = match?.[2] || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    return new Response('Not found', {
      status: 404,
    });
  }

  const property = database.properties.find(
    (property) => property.id === propertyId,
  );

  if (!property) {
    return new Response('Not found', {
      status: 404,
    });
  }

  const updatedProperty: Property = {
    index: property.index,
    id: property.id,
    databaseId: database.id,
    type: getPropertyTypeFromString(
      typeof formData.type === 'string' ? database.type : database.name,
    ),
    name: typeof formData.name === 'string' ? formData.name : database.name,
  };

  await editPropertyInIndexedDb(updatedProperty, idb);

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}/properties`,
    new URL(event.request.url).origin,
  );

  return Response.redirect(redirectUrl.href, 303);
}

import {
  Referrer,
  PartialDatabase,
  NormalizedFormData,
  Property,
} from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editPropertyInIndexedDb,
  getPropertyTypeFromString,
} from 'utilities/idb';

export async function PatchDatabaseProperty(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const propertyId = match?.[2] || '';
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

  const updatedPropertyType = getPropertyTypeFromString(database.type);

  const updatedProperty: Property<typeof updatedPropertyType> = {
    index: property.index,
    id: property.id,
    databaseId: database.id,
    type: updatedPropertyType,
    name: typeof formData.name === 'string' ? formData.name : database.name,
  };

  await editPropertyInIndexedDb(updatedProperty, idb);

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}/properties`,
    new URL(event.request.url).origin,
  );

  return Response.redirect(redirectUrl.href, 303);
}

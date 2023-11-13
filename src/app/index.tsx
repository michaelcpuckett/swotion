import { pathToRegexp, match, parse, compile } from "path-to-regexp";
import { renderToString } from "react-dom/server";
import { editPartialDatabaseInIndexedDb, deleteRowByIdFromIndexedDb, addPartialDatabaseToIndexedDb, getDatabaseFromIndexedDb, getPartialDatabasesFromIndexedDb, getIdb, getSettingsFromIndexedDb, SwotionIDB, addRowToIndexedDb, editRowInIndexedDb, reorderRowInIndexedDb, addUntypedPropertyToIndexedDB } from "utilities/idb";
import {assertIsDatabase, guardIsChecklist, guardIsChecklistRow, guardIsTableRow} from "shared/assertions";
import { Row, Referrer, Settings, Property, Database, PartialDatabase, PartialRow, Checklist, ChecklistRow, Table, TableRow, GetRowByType, UntypedProperty } from "shared/types";
import { URLS_TO_CACHE } from "./utilities/urlsToCache";
import { getUniqueId } from "shared/getUniqueId";
import { HomePage } from "components/pages/HomePage";
import { DatabasePage } from "components/pages/DatabasePage";

self.addEventListener("install", function (event: Event) {
  if (!(event instanceof ExtendableEvent)) {
    return;
  }

  event.waitUntil(
    caches
      .open("v1")
      .then(function (cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(function (error) {
        console.error(error);
      })
  );
});

self.addEventListener("fetch", function (event: Event) {
  if (!(event instanceof FetchEvent)) {
    return;
  }
  
  const url = new URL(event.request.url);
  const pathname = url.pathname;
  const id = url.searchParams.get('id') ?? '';
  const index = Number(url.searchParams.get('index') ?? -1);
  const mode = url.searchParams.get('mode') || '';
  const filter = url.searchParams.get('filter') || '';
  const query = url.searchParams.get('query') || '';
  const referrer: Referrer = {
    filter,
    query,
    mode,
    index,
    id,
    url: event.request.url,
  };

  const matchesDatabaseRows = pathToRegexp("/databases/:id").exec(pathname);
  const matchesDatabaseRow = pathToRegexp("/databases/:databaseId/rows/:id").exec(pathname);
  const matchesDatabaseProperties = pathToRegexp("/databases/:databaseId/properties").exec(pathname);

  if (event.request.method === "GET") {
    return event.respondWith(
      (async () => {
        if (URLS_TO_CACHE.includes(pathname)) {
          const cache = await caches.open("v1");
          const cachedResponse = await cache.match(event.request);

          if (cachedResponse) {
            return cachedResponse;
          }
        }

        switch (true) {
          case "/" === pathname: {
            const idb = await getIdb();
            const renderResult = await renderHomePage(idb, referrer);

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }    
          case !!matchesDatabaseRows: {
            const idb = await getIdb();
            const databaseId = matchesDatabaseRows?.[1] || '';
            const database = await getDatabaseFromIndexedDb(databaseId, idb);
            
            if (!database) {
              return new Response("Not found", {
                status: 404,
              });
            }

            const settings = await getSettingsFromIndexedDb(idb);

            const renderResult = await renderDatabasePage(database, referrer, settings);

            if (url.searchParams.has('query') && !query) {
              const redirectUrl = new URL(event.request.url);
              const urlSearchParams = new URLSearchParams(redirectUrl.search);
              urlSearchParams.delete('query');
              redirectUrl.search = urlSearchParams.toString();

              return Response.redirect(redirectUrl.href, 302);
            }

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }
          case !!matchesDatabaseRow: {
            const idb = await getIdb();
            const databaseId = matchesDatabaseRow?.[1] || '';
            const id = matchesDatabaseRow?.[2] || '';

            const database = await getDatabaseFromIndexedDb(databaseId, idb);

            if (!database) {
              return new Response("Not found", {
                status: 404,
              });
            }

            const row = database.rows.find(row => row.id === id);

            if (!row) {
              return new Response("Not found", {
                status: 404,
              });
            }

            const settings = await getSettingsFromIndexedDb(idb);

            const mode = url.searchParams.get('mode') || 'EDIT_ROW';

            const renderResult = await renderDatabasePage(database, {
              ...referrer,
              id,
              mode,
            }, settings);

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }
          case !!matchesDatabaseProperties: {
            const idb = await getIdb();
            const databaseId = matchesDatabaseProperties?.[1] || '';

            const database = await getDatabaseFromIndexedDb(databaseId, idb);

            if (!database) {
              return new Response("Not found", {
                status: 404,
              });
            }

            const settings = await getSettingsFromIndexedDb(idb);

            const mode = url.searchParams.get('mode') || 'EDIT_PROPERTIES';

            const renderResult = await renderDatabasePage(database, {
              ...referrer,
              id,
              mode,
            }, settings);

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }
        }

        return new Response("Not found", {
          status: 404,
        });
      })()
    );
  }
  
  return event.respondWith((async () => {
    const rawFormData = await event.request.formData();
    const formData = Object.fromEntries(Array.from(rawFormData.entries()).map(([key, value]) => [key, value.toString()]));
    
    switch (true) {
      case pathname === "/databases": {
        switch (formData._method) {
          case 'POST': {
            const idb = await getIdb();
            const id = getUniqueId();

            const database = {
              id,
              type: formData.type,
              name: formData.name || '',
              properties: [],
              rows: [],
            };

            assertIsDatabase(database);
  
            await addPartialDatabaseToIndexedDb(database, idb);
 
            const databaseUrl = `/databases/${id}`;
            const url = new URL(databaseUrl, new URL(event.request.url).origin);
            
            return Response.redirect(url.href, 303);
          }
        }
      }
      case !!matchesDatabaseRows: {
        const idb = await getIdb();
        const id = matchesDatabaseRows?.[1] || '';
        const database = await getDatabaseFromIndexedDb(id, idb);

        if (!database) {
          return new Response("Not found", {
            status: 404,
          });
        }

        const properties = database.properties || [];

        switch (formData._method) {
          case 'POST': {
            type TypedRow = GetRowByType<typeof database['type']>;

            const rowToAdd: Partial<TypedRow> = {
              id: getUniqueId(),
              databaseId: database.id,
              title: formData.title || '',
            };
            
            function guardIsRowOfType<T extends Row<Property[]>>(row: Partial<Row<Property[]>>, database: Database<Property[]>): row is T {
              return guardIsChecklistRow(row, database) || guardIsTableRow(row, database);
            }

            if (!guardIsRowOfType<TypedRow>(rowToAdd, database)) {
              const url = new URL(event.request.referrer);
              url.searchParams.set('error', 'Invalid row');

              return Response.redirect(url.href, 303);
            }

            if (guardIsChecklistRow(rowToAdd, database)) {
              rowToAdd.completed = formData.completed === 'on';
            }

            for (const property of properties) {
              if (formData[property.id] === undefined) {
                continue;
              }

              if (property.type === String) {
                rowToAdd[property.id] = `${formData[property.id]}`;
              }

              if (property.type === Number) {
                rowToAdd[property.id] = Number(formData[property.id]);
              }

              if (property.type === Boolean) {
                rowToAdd[property.id] = formData[property.id] === 'on';
              }
            }

            await addRowToIndexedDb<typeof database>(rowToAdd, idb);
            
            return Response.redirect(event.request.referrer, 303);
          }
          case 'PATCH': {
            const updatedDatabase: PartialDatabase = {
              id: database.id,
              type: database.type,
              name: typeof formData.name === 'string' ? formData.name : database.name,
            };

            await editPartialDatabaseInIndexedDb(updatedDatabase, idb);

            return Response.redirect(event.request.url, 303);
          }
        }
      }
      case !!matchesDatabaseRow: {
        const idb = await getIdb();
        const databaseId = matchesDatabaseRow?.[1] || '';
        const id = matchesDatabaseRow?.[2] || '';
        const database = await getDatabaseFromIndexedDb(databaseId, idb);

        if (!database) {
          return new Response("Not found", {
            status: 404,
          });
        }

        const properties = database.properties || [];

        switch (formData._method) {
          case 'DELETE': {
            await deleteRowByIdFromIndexedDb(id, idb);

            const redirectUrl = new URL(formData._redirect || `/databases/${databaseId}`, new URL(event.request.url).origin);
            return Response.redirect(redirectUrl.href, 303);
          }
          case 'PATCH': {
            const rowToPatch = database.rows.find(row => row.id === id);

            if (!rowToPatch) {
              return new Response("Not found", {
                status: 404,
              });
            }

            if (formData.index !== undefined) {
              await reorderRowInIndexedDb(Number(rowToPatch.index), Number(formData.index), idb);
            } else {
              for (const [key, value] of Object.entries(formData)) {
                if (['_method', '_redirect'].includes(key)) {
                  continue;
                }

                rowToPatch[key] = value;
              }

              await editRowInIndexedDb<typeof database>(rowToPatch, idb);
            }

            const redirectUrl = new URL(formData._redirect || `/databases/${databaseId}`, new URL(event.request.url).origin);
            redirectUrl.search = new URL(event.request.referrer).search;
            return Response.redirect(redirectUrl.href, 303);
          }
          case 'PUT': {
            type TypedRow = GetRowByType<typeof database['type']>;

            const existingRow = database.rows.find(row => row.id === id);

            if (!existingRow) {
              return new Response("Not found", {
                status: 404,
              });
            }

            const rowToPut: Partial<TypedRow> = {
              id: existingRow.id,
              index: existingRow.index,
              databaseId: database.id,
              title: formData.title,
            };
            
            function guardIsRowOfType<T extends Row<Property[]>>(row: Partial<Row<Property[]>>, database: Database<Property[]>): row is T {
              return guardIsChecklistRow(row, database) || guardIsTableRow(row, database);
            }

            if (!guardIsRowOfType<TypedRow>(rowToPut, database)) {
              const url = new URL(event.request.referrer);
              url.searchParams.set('error', 'Invalid row');

              return Response.redirect(url.href, 303);
            }

            if (guardIsChecklistRow(rowToPut, database)) {
              rowToPut.completed = formData.completed === 'on';
            }

            for (const property of properties) {
              if (formData[property.id] === undefined) {
                continue;
              }

              if (property.type === String) {
                rowToPut[property.id] = `${formData[property.id]}`;
              }

              if (property.type === Number) {
                rowToPut[property.id] = Number(formData[property.id]);
              }

              if (property.type === Boolean) {
                rowToPut[property.id] = formData[property.id] === 'on';
              }
            }

            await editRowInIndexedDb<typeof database>(rowToPut, idb);

            const redirectUrl = new URL(formData._redirect || `/databases/${databaseId}`, new URL(event.request.url).origin);

            return Response.redirect(redirectUrl.href, 303);
          }
        }
      }
      case !!matchesDatabaseProperties: {
        const idb = await getIdb();
        const databaseId = matchesDatabaseProperties?.[1] || '';

        const database = await getDatabaseFromIndexedDb(databaseId, idb);

        if (!database) {
          return new Response("Not found", {
            status: 404,
          });
        }

        switch (formData._method) {
          case 'POST': {
            const propertyToAdd: UntypedProperty = {
              index: -1,
              id: getUniqueId(),
              databaseId: database.id,
              name: formData.name,
              type: formData.type,
            };

            await addUntypedPropertyToIndexedDB(propertyToAdd, idb);

            const redirectUrl = new URL(formData._redirect || `/databases/${databaseId}`, new URL(event.request.url).origin);

            return Response.redirect(redirectUrl.href, 303);
          }
        }
      }
    }

    return new Response("Not found", {
      status: 404,
    });
  })());
});

async function renderDatabasePage(database: Database<Property[]>, referrer: Referrer, settings: Settings) {
  return renderToString(
    <DatabasePage
      database={database}
      referrer={referrer}
      settings={settings}
    />
  );
}

async function renderHomePage(idb: SwotionIDB, referrer: Referrer) {
  const databases = await getPartialDatabasesFromIndexedDb(idb);
  const settings = await getSettingsFromIndexedDb(idb);

  return renderToString(
    <HomePage
      databases={databases}
      settings={settings}
      referrer={referrer}
    />
  );
}

declare module "react" {
  interface HTMLAttributes<T>
    extends React.AriaAttributes,
      React.DOMAttributes<T> {
    shadowrootmode?: string;
    inert?: string;
  }

  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

type CustomElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "auto-save-text": CustomElement;
      "auto-save-checkbox": CustomElement;
      "flyout-menu": CustomElement;
      "unload-handler": CustomElement;
      "post-form": CustomElement;
    }
  }
}
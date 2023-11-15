export type Referrer = {
  url: string;
  mode?: string;
  index?: number;
  id?: string;
  query?: string;
  filter?: string;
  error?: string;
};

export interface Settings {
  theme: string;
}

export interface PartialDatabase {
  id: string;
  type: 'CHECKLIST' | 'TABLE' | 'LIST' | 'CALENDAR' | 'BOARD';
  name: string;
}

export interface Database<Properties extends AnyProperty[]>
  extends PartialDatabase {
  properties: Properties;
  rows: Row<Properties>[];
}

export interface PartialChecklist extends PartialDatabase {
  type: 'CHECKLIST';
}

export interface PartialTable extends PartialDatabase {
  type: 'TABLE';
}

export type Checklist<P extends AnyProperty[]> = PartialChecklist & {
  rows: ChecklistRow<P>[];
  properties: P;
};

export type Table<P extends AnyProperty[]> = PartialTable & {
  rows: TableRow<P>[];
  properties: P;
};

export interface PartialProperty {
  id: string;
  databaseId: string;
  name: string;
}

export interface UntypedProperty extends PartialProperty {
  index: number;
  type: string;
}

export type PropertyTypes =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor;

export interface Property<T extends PropertyTypes> extends PartialProperty {
  index: number;
  type: T;
}

export type AnyProperty = Property<PropertyTypes>;

export type DynamicPropertyKey<P extends AnyProperty> = P['id'];

// Infers the type using `infer` keyword
export type DynamicPropertyValue<P extends AnyProperty> =
  P['type'] extends StringConstructor
    ? string
    : P['type'] extends NumberConstructor
      ? number
      : P['type'] extends BooleanConstructor
        ? boolean
        : never;

export type DynamicPropertyKeyValuePair<P extends AnyProperty> = {
  [K in DynamicPropertyKey<P>]: DynamicPropertyValue<P>;
};

export type DynamicPropertyKeyValuePairs<P extends AnyProperty[]> = {
  [K in DynamicPropertyKey<P[number]>]: DynamicPropertyValue<P[number]>;
};

export interface PartialRow {
  id: string;
  databaseId: string;
  title: string;
}

export interface PartialTableRow extends PartialRow {}

export interface PartialChecklistRow extends PartialRow {
  completed: boolean;
}

export type Row<Properties extends AnyProperty[]> = PartialRow & {
  position: string;
} & DynamicPropertyKeyValuePairs<Properties>;

export type ChecklistRow<Properties extends AnyProperty[]> = Row<Properties> &
  PartialChecklistRow;

export type TableRow<Properties extends AnyProperty[]> = Row<Properties> &
  PartialTableRow;

export type AnyRow = Row<AnyProperty[]>;

export type AnyDatabase = Database<AnyProperty[]>;

export type IsChecklist<T extends Database<AnyProperty[]>['type']> =
  T extends Checklist<AnyProperty[]>['type'] ? T : never;

export type IsTable<T extends Database<AnyProperty[]>['type']> =
  T extends Table<AnyProperty[]>['type'] ? T : never;

export type GetRowByType<T extends Database<AnyProperty[]>['type']> =
  T extends IsChecklist<T>
    ? ChecklistRow<AnyProperty[]>
    : T extends IsTable<T>
      ? TableRow<AnyProperty[]>
      : never;

interface FormDataWithArrayValue {
  [key: `${string}[]`]: string[] | undefined;
}

interface FormDataWithStringValue {
  [key: string]: string | undefined;
}

export type NormalizedFormData = FormDataWithArrayValue &
  FormDataWithStringValue;

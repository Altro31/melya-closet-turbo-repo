
export type ToSchema<T> = {
  [K in keyof T]: T[K] extends infer Type
    ? Extract<Type, null> extends null
      ? true
      : false
    : never;
};

// Extract<Type, undefined> extends undefined
//         ? Schema.UndefinedOr<Schema.NullOr<Schema.Schema<NonNullable<Type>>>>
//         : Schema.NullOr<Schema.Schema<NonNullable<Type>>>

// Extract<Type, undefined> extends undefined
//         ? Schema.UndefinedOr<Schema.Schema<NonNullable<Type>>>
//         : Schema.Schema<Type>

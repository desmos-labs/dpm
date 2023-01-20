/**
 * Supported serializable types.
 */
export enum SerializableTypes {
  Date = 'Date',
  Uint8Array = 'Uint8Array',
}

/**
 * Interface that represents a serialized object.
 */
export interface SerializedObject {
  readonly serializedType: SerializableTypes;
  readonly value: string;
}

/**
 * Interface that represents an object that can serialize one of our supported
 * [SerializableTypes]{@link SerializableTypes}.
 */
export interface Serializer {
  /**
   * Function that given an object returns true if this object can serialize the
   * provided object.
   * @param obj - The object to test.
   */
  canEncodeObj(obj: any): boolean;

  /**
   * Function that serializes the provided object.
   * @param obj - The object to serialize.
   */
  encode(obj: any): SerializedObject;
}

/**
 * Interface that represents an object that can deserialize one of our
 * supported [SerializableTypes]{@link SerializableTypes}.
 */
export interface Deserializer {
  decode(obj: SerializedObject): any;
}

import { Deserializer, SerializableTypes, SerializedObject, Serializer } from './types';

export const DateSerializer: Serializer = {
  canEncodeObj(obj: any): boolean {
    return typeof obj.toISOString === 'function';
  },
  encode(obj: any): SerializedObject {
    return {
      serializedType: SerializableTypes.Date,
      value: obj.toISOString(),
    };
  },
};

export const DateDeserializer: Deserializer = {
  decode(serialized: SerializedObject): Date {
    return new Date(serialized.value);
  },
};

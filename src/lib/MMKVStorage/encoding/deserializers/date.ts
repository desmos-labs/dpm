import { Deserializer, SerializedObject } from '../types';

export const DateDeserializer: Deserializer = {
  decode(serialized: SerializedObject): Date {
    return new Date(serialized.value);
  },
};

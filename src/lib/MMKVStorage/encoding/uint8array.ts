import { fromHex, toHex } from '@cosmjs/encoding';
import { Deserializer, SerializableTypes, SerializedObject, Serializer } from './types';

export const Uint8ArraySerializer: Serializer = {
  canEncodeObj(obj: any): boolean {
    return obj instanceof Uint8Array;
  },
  encode(obj: any): SerializedObject {
    return {
      serializedType: SerializableTypes.Uint8Array,
      value: toHex(obj),
    };
  },
};

export const Uint8ArrayDeserializer: Deserializer = {
  decode(serialized: SerializedObject): Uint8Array {
    return fromHex(serialized.value);
  },
};

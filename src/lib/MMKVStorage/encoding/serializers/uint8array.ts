import { toHex } from '@cosmjs/encoding';
import { SerializableTypes, SerializedObject, Serializer } from '../types';

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

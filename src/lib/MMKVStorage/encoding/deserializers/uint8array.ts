import { fromHex } from '@cosmjs/encoding';
import { Deserializer, SerializedObject } from '../types';

export const Uint8ArrayDeserializer: Deserializer = {
  decode(serialized: SerializedObject): Uint8Array {
    return fromHex(serialized.value);
  },
};

import { Deserializer, SerializableTypes } from '../types';
import { DateDeserializer } from './date';
import { Uint8ArrayDeserializer } from './uint8array';

const Deserializers: Record<SerializableTypes, Deserializer> = {
  [SerializableTypes.Date]: DateDeserializer,
  [SerializableTypes.Uint8Array]: Uint8ArrayDeserializer,
};

export default Deserializers;

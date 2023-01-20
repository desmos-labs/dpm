import { SerializedObject } from 'lib/MMKVStorage/encoding/types';
import Deserializers from './deserializers';
import Serializers from './serializers';

/**
 * Custom JSON serialization for MMKV.
 */
function jsonReplacer(key: string, value: any): any {
  // @ts-ignore
  const toSerializeObject = this[key];
  if (toSerializeObject !== undefined) {
    const serializer = Serializers.find((e) => e.canEncodeObj(toSerializeObject));
    return serializer ? JSON.stringify(serializer.encode(toSerializeObject)) : value;
  }
  return value;
}

/**
 * Custom JSON deserialization for MMKV.
 */
const jsonReviver = (key: string, value: any) => {
  if (value[0] === '{') {
    // We have a serialized object, try to deserialize it to see if it's one
    // of our custom serialized types.
    const deserializedObject = <Partial<SerializedObject>>JSON.parse(value);
    if (
      deserializedObject !== undefined &&
      deserializedObject.serializedType !== undefined &&
      deserializedObject.value !== undefined
    ) {
      const deserializer = Deserializers[deserializedObject.serializedType];
      if (deserializer) {
        return deserializer.decode(deserializedObject as SerializedObject);
      }
    }
  }
  return value;
};

/**
 * Function that serialize an object into a JSON string, using a custom serialization
 * algorithm that preserves the type of the object.
 * @param obj - The object to serialize.
 */
export const serializeObject = (obj: any) => JSON.stringify(obj, jsonReplacer);

/**
 * Function that deserialize a JSON string into an object using a custom deserialization
 * algorithm that decodes the types of the object.
 * @param obj - The object to deserialize.
 */
export const deserializeObject = (obj: any) => JSON.parse(obj, jsonReviver);

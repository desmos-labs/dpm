import { Serializer } from '../types';
import { DateSerializer } from './date';
import { Uint8ArraySerializer } from './uint8array';

const Serializers: Serializer[] = [DateSerializer, Uint8ArraySerializer];

export default Serializers;

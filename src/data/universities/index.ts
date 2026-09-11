import { University } from '../../types';
import { AMERICAS_UNIVERSITIES } from './americas';
import { EUROPE_UNIVERSITIES } from './europe';
import { ASIA_OCEANIA_UNIVERSITIES } from './asia_oceania';
import { CENTRAL_ASIA_UNIVERSITIES } from './central_asia';

export const INITIAL_UNIVERSITIES: University[] = [
  ...AMERICAS_UNIVERSITIES,
  ...EUROPE_UNIVERSITIES,
  ...ASIA_OCEANIA_UNIVERSITIES,
  ...CENTRAL_ASIA_UNIVERSITIES,
];

export const UNIVERSITIES_DATABASE: University[] = INITIAL_UNIVERSITIES;

export * from './americas';
export * from './europe';
export * from './asia_oceania';
export * from './central_asia';
export * from './qs_ranking_list';

import type { Config } from '@jest/types';
// Sync object
// @lat: [[test-specs#How to Run]] — npm test builds the mock server, waits for http://localhost:5714, then runs jest --coverage
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
export default config;
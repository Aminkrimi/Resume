import next from 'eslint-config-next';

const config = [
  ...next,
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'cv/**'] },
];

export default config;

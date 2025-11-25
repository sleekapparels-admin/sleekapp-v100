import { generateOrganizationSchema, defaultOrganization } from '../lib/schema';

describe('Schema Generation', () => {
  it('should generate organization schema with correct type and naics', () => {
    const schema = generateOrganizationSchema(defaultOrganization);
    expect(schema['@type']).toBe('Corporation');
    expect(schema.naics).toBe('3152');
  });
});

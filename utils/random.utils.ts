import { faker } from '@faker-js/faker';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const customerFields = {
  'first name': { key: 'firstName', errorLabel: 'First Name' },
  'last name': { key: 'lastName', errorLabel: 'Last Name' },
  'postal code': { key: 'postalCode', errorLabel: 'Postal Code' },
} as const;

export type CustomerField = keyof typeof customerFields;

export function customerDetails(): CustomerDetails {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.string.numeric(5),
  };
}

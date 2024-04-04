// npm install @faker-js/faker --save-dev
// https://fakerjs.dev/guide/

import { faker } from '@faker-js/faker'

export const attendees = Array.from({ length: 212 }).map(() => ({
  id: faker.number.int({ min: 1000, max: 9999 }),
  name: faker.person.fullName(),
  email: faker.internet.email().toLocaleLowerCase(),
  createdAt: faker.date.recent({ days: 30 }),
  checkedInAt: faker.date.recent({ days: 7 }),
}));

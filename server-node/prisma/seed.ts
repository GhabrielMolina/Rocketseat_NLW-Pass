// Seed é um arquivo que é executado uma única vez para popular o banco de dados com dados iniciais. (facilita o front-end para testar a aplicação)

// Adicionar no packege.json
//   "prisma": {
//     "seed": "tsx prisma/seed.ts",
//   },

// O seed é executado com o comando npx prisma db seed

import { Prisma } from '@prisma/client'
import { prisma } from '../src/lib/prisma'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

async function seed() {
  const eventId = '9e9bd979-9d10-4915-b339-3786b1634f33'

  await prisma.event.deleteMany({}) // Deletar todos os eventos

  await prisma.event.create({
    data: {
      id: eventId,
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: 'The Unity conference for developers',
      maximumAttendees: 120,
    }
  })

  // AttendeeUncheckedCreateInput é um tipo gerado pelo Prisma que representa os dados que podem ser inseridos na tabela Attendee
  const attendeesToInsert: Prisma.AttendeeUncheckedCreateInput[] = [] // Array de objetos para inserir no banco de dados

  for (let i = 0; i < 120; i++) { // Criar 120 participantes
    attendeesToInsert.push({
      id: 10000 + i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId,
      createdAt: faker.date.recent({ days: 30, refDate: dayjs().subtract(8, "days").toDate() }), 
      checkIn: faker.helpers.arrayElement<Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined>([  // CheckInUncheckedCreateNestedOneWithoutAttendeeInput é um tipo gerado pelo Prisma que representa os dados que podem ser inseridos na tabela CheckIn
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }), // Criar um check-in recente
          }
        }
      ])
    })
  }

  await Promise.all(attendeesToInsert.map(data => { // Inserir todos os participantes no banco de dados
    return prisma.attendee.create({ data }) // Criar um participante
  }))
}

seed().then(() => { // Quando o seed for concluído
  console.log('Seed complete')
  prisma.$disconnect() // Desconectar do banco de dados
})
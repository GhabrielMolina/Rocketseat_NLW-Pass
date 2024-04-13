// Seed é um arquivo que é executado uma única vez para popular o banco de dados com dados iniciais. (facilita o front-end para testar a aplicação)

// Adicionar no packege.json
//   "prisma": {
//     "seed": "tsx prisma/seed.ts",
//   },

// O seed é executado com o comando npx prisma db seed

import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.event.create({
    data: {
      id: '9e9bd979-9d10-4915-b339-3786b1634f33',
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: 'The Unity conference for developers',
      maximumAttendees: 120,
    }
  })
}

seed().then(() => { // Quando o seed for concluído
  console.log('Seed complete')
  prisma.$disconnect() // Desconectar do banco de dados
})
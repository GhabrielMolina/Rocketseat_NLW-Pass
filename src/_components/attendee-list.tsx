import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronsRight, ChevronRight } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './_table/table'
import { TableHeader } from './_table/table-header'
import { TableCell } from './_table/table-cell'
import { TableRow } from './_table/table-row'

export function AttendeeList() {
  return (
    <div className='flex flex-col gap-4'>
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>

        <div className="px-3 py-1.5 w-72 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className='size-4 text-emerald-300' />
          <input className="bg-transparent flex-1 outline-non border-0 p-0 text-sm" placeholder="Buscar Participante..." />
        </div>
      </div>

      <Table>
        <thead>
          <tr className='border-b border-white/10'>
            <TableHeader style={{ width: 48 }}>
              <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data da inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 8 }).map((_, i) => {
            return (
              <TableRow key={i}>
                <TableCell>
                  {/* Instalar plugin do Tailwind para facilitar a estilização do checkbox
                    https://github.com/tailwindlabs/tailwindcss-forms
                    npm install -D @tailwindcss/forms
                    e adcionar require('@tailwindcss/forms') no tailwind.config.js
                  */}
                  <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
                </TableCell>
                <TableCell>1234</TableCell>
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    <span className='font-semibold text-white'>Ghabriel Molina</span>
                    <span>ghabrielmolina@hotmail.com</span>
                  </div>
                </TableCell>
                <TableCell>7 dias atrás</TableCell>
                <TableCell>3 dias atras</TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className='size-4' />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>

        <tfoot>
          <tr>
            <TableCell colSpan={3}>
              Mostrando 10 de 228 itens
            </TableCell>

            {/* npm i tailwind-merge para unir as classes passadas aqui com _table/table-cell.tsx */}
            <TableCell colSpan={3} className='text-right'>
              <div className='inline-flex items-center gap-8'>
                <span>Página 1 de 23</span>

                <div className='flex gap-1.5'>
                  <IconButton>
                    <ChevronsLeft className='size-4' />
                  </IconButton>
                  <IconButton>
                    <ChevronLeft className='size-4' />
                  </IconButton>
                  <IconButton>
                    <ChevronsRight className='size-4' />
                  </IconButton>
                  <IconButton>
                    <ChevronRight className='size-4' />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
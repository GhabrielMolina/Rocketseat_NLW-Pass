import { ComponentProps } from "react";

interface TableProps extends ComponentProps<'table'>{}

export function Table(props : TableProps) {
  return (
    // Div para poder aplicar arredondamento na tabela
    < div className='border border-white/10 rounded-lg' >
      <table className='w-full' {...props}>


      </table>
    </div>
  )
}
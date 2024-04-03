import { ComponentProps } from "react";

// ComponentProps é um tipo genérico que recebe um tipo de componente do HTML e retorna um objeto com todas propriedades do componente
// Fazendo isso, podemos passar qualquer as propriedades do componente para o componente que estamos criando {...props}
interface NavLinkProps extends ComponentProps<'a'> {
  children: string
}

export function NavLink (props : NavLinkProps) {
  return (
    <a {...props} className='font-medium text-sm'>{props.children}</a>
  )
}
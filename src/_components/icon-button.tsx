import { ComponentProps } from "react";

interface IconButtonProps extends ComponentProps<'button'> {
  transparent?: boolean
}
// ComponentProps já tras o children, então não precisamos adicionar ele no IconButtonProps
// E na classe button já temos o children por padrão, então não precisamos adicionar ele no IconButton

// {transparent, ...props} está removendo a propriedade transparent do objeto props
export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={transparent
        ? 'bg-black/10 border border-white/10 rounded-md p-1.5'
        : 'bg-white/10 border border-white/10 rounded-md p-1.5'
      }
    />
  )
}
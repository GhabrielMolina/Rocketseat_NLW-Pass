// Normaliza o texto para gerar um slug (URL amigável)
export function generateSlug(text: string): string {
  return text 
    .normalize("NFD") // Remove acentos e caracteres especiais
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase() // Converte para minúsculo
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-"); // Substitui espaços por hífens
}
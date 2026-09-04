export default interface CategoriaDTO {
    id_categoria?: number,
    nome: string,
    descricao?: string,
    ativo?: boolean,
    data_cadastro?: Date | string
}

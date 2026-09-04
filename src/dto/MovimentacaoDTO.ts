export default interface MovimentacaoDTO {
id_movimentacao?: number,
id_produto: number,
id_movimentacao_origem?: number,
motivo_movimentacao: string,
tipo_movimentacao: string,
quantidade: number,
preco_unitario: number,
valor_total: number,
observacao?: string,
data_movimentacao?: Date | string,
ativo?: boolean,
}
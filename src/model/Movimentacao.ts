import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Movimentacao {
    private id_movimentacao: number = 0;
    private id_produto: number = 0;
    private id_movimentacao_origem: number | undefined;
    private motivo_movimentacao: string = '';
    private tipo_movimentacao: string = '';
    private quantidade: number = 0;
    private preco_unitario: number = 0;
    private valor_total: number = 0;
    private observacao: string = '';
    private data_movimentacao: Date | string | undefined;
    private ativo: boolean = true;

    constructor(
        _id_movimentacao: number,
        _id_produto: number,
        _id_movimentacao_origem?: number,
        _motivo_movimentacao: string = '',
        _tipo_movimentacao: string = '',
        _quantidade: number = 0,
        _preco_unitario: number = 0,
        _valor_total: number = 0,
        _observacao: string = '',
        _data_movimentacao?: Date | string,
        _ativo: boolean = true
    ) {
        this.id_movimentacao = _id_movimentacao;
        this.id_produto = _id_produto;
        this.id_movimentacao_origem = _id_movimentacao_origem;
        this.motivo_movimentacao = _motivo_movimentacao;
        this.tipo_movimentacao = _tipo_movimentacao;
        this.quantidade = _quantidade;
        this.preco_unitario = _preco_unitario;
        this.valor_total = _valor_total;
        this.observacao = _observacao;
        this.data_movimentacao = _data_movimentacao;
        this.ativo = _ativo;
    }

    public getIdProduto(): number {
        return this.id_produto;
    }
    public setIdProduto(value: number): void {
        this.id_produto = value;
    }

    public getIdMovimentacao(): number {
        return this.id_movimentacao;
    }
    public setIdMovimentacao(value: number): void {
        this.id_movimentacao = value;
    }

    public getIdMovimentacaoOrigem(): number | undefined {
        return this.id_movimentacao_origem;
    }
    public setIdMovimentacaoOrigem(value: number): void {
        this.id_movimentacao_origem = value;
    }

    public getTipoMovimentacao(): string {
        return this.tipo_movimentacao;
    }
    public setTipoMovimentacao(value: string): void {
        this.tipo_movimentacao = value;
    }

    public getMotivoMovimentacao(): string {
        return this.motivo_movimentacao;
    }
    public setMotivoMovimentacao(value: string): void {
        this.motivo_movimentacao = value;
    }

    public getObservacao(): string {
        return this.observacao;
    }
    public setObservacao(value: string): void {
        this.observacao = value;
    }

    public getQuantidade(): number {
        return this.quantidade;
    }
    public setQuantidade(value: number): void {
        this.quantidade = value;
    }

    public getPrecoUnitario(): number {
        return this.preco_unitario;
    }
    public setPrecoUnitario(value: number): void {
        this.preco_unitario = value;
    }

    public getValorTotal(): number {
        return this.valor_total;
    }
    public setValorTotal(value: number): void {
        this.valor_total = value;
    }

    public getDataMovimentacao(): Date | string | undefined {
        return this.data_movimentacao;
    }
    public setDataMovimentacao(value: Date | string): void {
        this.data_movimentacao = value;
    }

    public getAtivo(): boolean {
        return this.ativo;
    }
    public setAtivo(value: boolean): void {
        this.ativo = value;
    }

    /**
     * Retorna uma lista com todos os movimentacoes cadastrados e ativos no banco de dados
     *
     * @returns Lista com todos os movimentacoes ativos cadastrados no banco de dados
     */
    static async listarMovimentacoes(): Promise<Array<MovimentacaoDTO> | null> {
        let listaDeMovimentacoes: Array<MovimentacaoDTO> = [];

        try {
            const querySelectMovimentacao = `SELECT * FROM movimentacao WHERE ativo = TRUE ORDER BY id_movimentacao;`;
            const respostaBD = await database.query(querySelectMovimentacao);

            for (const movimentacao of respostaBD.rows) {
                const movimentacaoDTO: MovimentacaoDTO = {
                    id_produto: movimentacao.id_produto,
                    id_movimentacao: movimentacao.id_movimentacao,
                    motivo_movimentacao: movimentacao.motivo_movimentacao,
                    id_movimentacao_origem: movimentacao.id_movimentacao_origem,
                    tipo_movimentacao: movimentacao.tipo_movimentacao,
                    quantidade: movimentacao.quantidade,
                    preco_unitario: movimentacao.preco_unitario,
                    valor_total: movimentacao.valor_total,
                    observacao: movimentacao.observacao,
                    data_movimentacao: movimentacao.data_movimentacao,
                    ativo: movimentacao.ativo,
                };

                listaDeMovimentacoes.push(movimentacaoDTO);
            }

            return listaDeMovimentacoes;
        } catch (error) {
            console.error(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Retorna as informações de um movimentacao informado pelo ID
     *
     * @param id_movimentacao ID do movimentacao a ser consultado
     * @returns
     */
    static async listarMovimentacao(id_movimentacao: number): Promise<MovimentacaoDTO | null> {
        try {
            const querySelectMovimentacao = `SELECT * FROM movimentacao WHERE id_movimentacao = $1;`;
            const respostaBD = await database.query(querySelectMovimentacao, [id_movimentacao]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const movimentacaoDTO: MovimentacaoDTO = {
                id_produto: respostaBD.rows[0].id_produto,
                id_movimentacao: respostaBD.rows[0].id_movimentacao,
                motivo_movimentacao: respostaBD.rows[0].motivo_movimentacao,
                id_movimentacao_origem: respostaBD.rows[0].id_movimentacao_origem,
                tipo_movimentacao: respostaBD.rows[0].tipo_movimentacao,
                quantidade: respostaBD.rows[0].quantidade,
                preco_unitario: respostaBD.rows[0].preco_unitario,
                valor_total: respostaBD.rows[0].valor_total,
                observacao: respostaBD.rows[0].observacao,
                data_movimentacao: respostaBD.rows[0].data_movimentacao,
                ativo: respostaBD.rows[0].ativo,
            };

            return movimentacaoDTO;
        } catch (error) {
            console.error(`Erro ao realizar consulta. ${error}`);
            return null;
        }
    }

    /**
     * Retorna as informações de uma movimentação por um critério textual.
     *
     * @param codigo Valor de busca
     * @returns Objeto com informações ou null
     */
    static async buscarPorCodigo(codigo: string): Promise<MovimentacaoDTO | null> {
        try {
            const querySelectCodigo = `SELECT * FROM movimentacao WHERE LOWER(motivo_movimentacao) = LOWER($1);`;
            const respostaBD = await database.query(querySelectCodigo, [codigo]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const movimentacaoDTO: MovimentacaoDTO = {
                id_produto: respostaBD.rows[0].id_produto,
                id_movimentacao: respostaBD.rows[0].id_movimentacao,
                motivo_movimentacao: respostaBD.rows[0].motivo_movimentacao,
                id_movimentacao_origem: respostaBD.rows[0].id_movimentacao_origem,
                tipo_movimentacao: respostaBD.rows[0].tipo_movimentacao,
                quantidade: respostaBD.rows[0].quantidade,
                preco_unitario: respostaBD.rows[0].preco_unitario,
                valor_total: respostaBD.rows[0].valor_total,
                observacao: respostaBD.rows[0].observacao,
                data_movimentacao: respostaBD.rows[0].data_movimentacao,
                ativo: respostaBD.rows[0].ativo,
            };

            return movimentacaoDTO;
        } catch (error) {
            console.error(`Erro ao realizar consulta por código. ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo movimentacao no banco de dados
     * @param movimentacao Objeto Movimentacao contendo as informações a serem cadastradas
     * @returns Boolean indicando se o cadastro foi bem-sucedido
     */
    static async cadastrarMovimentacao(movimentacao: Movimentacao): Promise<boolean> {
        try {
            const queryInsertMovimentacao = `
                INSERT INTO movimentacao (id_produto, motivo_movimentacao, id_movimentacao_origem, quantidade, tipo_movimentacao, preco_unitario, valor_total, observacao, data_movimentacao)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id_movimentacao;`;

            const valores = [
                movimentacao.getIdProduto(),
                movimentacao.getMotivoMovimentacao(),
                movimentacao.getIdMovimentacaoOrigem(),
                movimentacao.getQuantidade(),
                movimentacao.getTipoMovimentacao(),
                movimentacao.getPrecoUnitario(),
                movimentacao.getValorTotal(),
                movimentacao.getObservacao(),
                movimentacao.getDataMovimentacao()
            ];

            const result = await database.query(queryInsertMovimentacao, valores);

            if (result.rows.length > 0) {
                console.log(`Movimentação cadastrada com sucesso. ID: ${result.rows[0].id_movimentacao}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar movimentação: ${error}`);
            return false;
        }
    }

    /**
     * Remove (desativa) um movimentacao do banco de dados (Desativação Lógica - RN18/RN19)
     * @param id_movimentacao ID do movimentacao a ser desativado
     * @returns Boolean indicando se a desativação foi bem-sucedida
     */
    static async removerMovimentacao(id_movimentacao: number): Promise<boolean> {
        try {
            const movimentacao: MovimentacaoDTO | null = await this.listarMovimentacao(id_movimentacao);

            if (movimentacao && movimentacao.ativo) {
                const queryDesativarMovimentacao = `UPDATE movimentacao SET ativo = FALSE WHERE id_movimentacao = $1;`;
                const result = await database.query(queryDesativarMovimentacao, [id_movimentacao]);

                return result.rowCount !== 0;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao desativar movimentacao: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza os dados de um movimentacao no banco de dados.
     * @param movimentacao Objeto do tipo Movimentacao com os novos dados
     * @returns true caso sucesso, false caso erro
     */
    static async atualizarMovimentacao(movimentacao: Movimentacao): Promise<boolean> {
        try {
            const movimentacaoConsulta: MovimentacaoDTO | null = await this.listarMovimentacao(movimentacao.getIdMovimentacao());

            if (movimentacaoConsulta && movimentacaoConsulta.ativo) {
                const queryAtualizarMovimentacao = `
                    UPDATE movimentacao
                    SET id_produto = $1,
                        id_movimentacao_origem = $2,
                        motivo_movimentacao = $3,
                        tipo_movimentacao = $4,
                        quantidade = $5,
                        preco_unitario = $6,
                        valor_total = $7,
                        observacao = $8,
                        data_movimentacao = $9
                    WHERE id_movimentacao = $10;`;

                const valores = [
                    movimentacao.getIdProduto(),
                    movimentacao.getIdMovimentacaoOrigem(),
                    movimentacao.getMotivoMovimentacao(),
                    movimentacao.getTipoMovimentacao(),
                    movimentacao.getQuantidade(),
                    movimentacao.getPrecoUnitario(),
                    movimentacao.getValorTotal(),
                    movimentacao.getObservacao(),
                    movimentacao.getDataMovimentacao(),
                    movimentacao.getIdMovimentacao()
                ];

                const respostaBD = await database.query(queryAtualizarMovimentacao, valores);

                if (respostaBD.rowCount !== 0) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error(`Erro ao atualizar movimentacao: ${error}`);
            return false;
        }
    }
}

export default Movimentacao;
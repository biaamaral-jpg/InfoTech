
import type ProdutoDTO from "../dto/ProdutoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Produto {
    private id_produto: number = 0;
    private id_categoria: number;
    private codigo: string;
    private nome: string;
    private descricao: string;
    private preco_unitario: number;
    private quantidade_disponivel: number = 0;
    private quantidade_minima: number = 0;
    private ativo: boolean = true;
    private data_cadastro?: Date | string;

    constructor(
        _id_categoria: number,
        _codigo: string,
        _nome: string,
        _descricao: string,
        _preco_unitario: number,
        _quantidade_minima: number
    ) {
        this.id_categoria = _id_categoria;
        this.codigo = _codigo;
        this.nome = _nome;
        this.descricao = _descricao;
        this.preco_unitario = _preco_unitario;
        this.quantidade_minima = _quantidade_minima;
    }

    public getIdProduto(): number {
        return this.id_produto;
    }
    public setIdProduto(value: number): void {
        this.id_produto = value;
    }

    public getIdCategoria(): number {
        return this.id_categoria;
    }
    public setIdCategoria(value: number): void {
        this.id_categoria = value;
    }

    public getCodigo(): string {
        return this.codigo;
    }
    public setCodigo(value: string): void {
        this.codigo = value;
    }

    public getNome(): string {
        return this.nome;
    }
    public setNome(value: string): void {
        this.nome = value;
    }

    public getDescricao(): string {
        return this.descricao;
    }
    public setDescricao(value: string): void {
        this.descricao = value;
    }

    public getPrecoUnitario(): number {
        return this.preco_unitario;
    }
    public setPrecoUnitario(value: number): void {
        this.preco_unitario = value;
    }

    public getQuantidadeDisponivel(): number {
        return this.quantidade_disponivel;
    }
    public setQuantidadeDisponivel(value: number): void {
        this.quantidade_disponivel = value;
    }

    public getQuantidadeMinima(): number {
        return this.quantidade_minima;
    }
    public setQuantidadeMinima(value: number): void {
        this.quantidade_minima = value;
    }

    public getAtivo(): boolean {
        return this.ativo;
    }
    public setAtivo(value: boolean): void {
        this.ativo = value;
    }

    public getDataCadastro(): Date | string | undefined {
        return this.data_cadastro;
    }
    public setDataCadastro(value: Date | string): void {
        this.data_cadastro = value;
    }

    /**
     * Retorna uma lista com todos os produtos cadastrados e ativos no banco de dados
     * 
     * @returns Lista com todos os produtos ativos cadastrados no banco de dados
     */
    static async listarProdutos(): Promise<Array<ProdutoDTO> | null> {
        let listaDeProdutos: Array<ProdutoDTO> = [];

        try {
            const querySelectProduto = `SELECT * FROM produto WHERE ativo = TRUE ORDER BY nome;`;
            const respostaBD = await database.query(querySelectProduto);

            for (const produto of respostaBD.rows) {
                const produtoDTO: ProdutoDTO = {
                    id_produto: produto.id_produto,
                    id_categoria: produto.id_categoria,
                    codigo: produto.codigo,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco_unitario: produto.preco_unitario,
                    quantidade_disponivel: produto.quantidade_disponivel,
                    quantidade_minima: produto.quantidade_minima,
                    ativo: produto.ativo,
                    data_cadastro: produto.data_cadastro
                };

                listaDeProdutos.push(produtoDTO);
            }

            return listaDeProdutos;
        } catch (error) {
            console.error(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Retorna as informações de um produto informado pelo ID
     * 
     * @param id_produto 
     * @returns
     */
    static async listarProduto(id_produto: number): Promise<ProdutoDTO | null> {
        try {
            const querySelectProduto = `SELECT * FROM produto WHERE id_produto = $1;`;
            const respostaBD = await database.query(querySelectProduto, [id_produto]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const produtoDTO: ProdutoDTO = {
                id_produto: respostaBD.rows[0].id_produto,
                id_categoria: respostaBD.rows[0].id_categoria,
                codigo: respostaBD.rows[0].codigo,
                nome: respostaBD.rows[0].nome,
                descricao: respostaBD.rows[0].descricao,
                preco_unitario: respostaBD.rows[0].preco_unitario,
                quantidade_disponivel: respostaBD.rows[0].quantidade_disponivel,
                quantidade_minima: respostaBD.rows[0].quantidade_minima,
                ativo: respostaBD.rows[0].ativo,
                data_cadastro: respostaBD.rows[0].data_cadastro
            };

            return produtoDTO;
        } catch (error) {
            console.error(`Erro ao realizar consulta. ${error}`);
            return null;
        }
    }

    /**
     * Retorna as informações de um produto através do seu CÓDIGO ÚNICO
     * 
     * @param codigo Código único do produto (ex: "PER-001")
     * @returns Objeto com informações do produto ou null
     */
    static async buscarPorCodigo(codigo: string): Promise<ProdutoDTO | null> {
        try {
            const querySelectCodigo = `SELECT * FROM produto WHERE LOWER(codigo) = LOWER($1);`;
            const respostaBD = await database.query(querySelectCodigo, [codigo]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const produtoDTO: ProdutoDTO = {
                id_produto: respostaBD.rows[0].id_produto,
                id_categoria: respostaBD.rows[0].id_categoria,
                codigo: respostaBD.rows[0].codigo,
                nome: respostaBD.rows[0].nome,
                descricao: respostaBD.rows[0].descricao,
                preco_unitario: respostaBD.rows[0].preco_unitario,
                quantidade_disponivel: respostaBD.rows[0].quantidade_disponivel,
                quantidade_minima: respostaBD.rows[0].quantidade_minima,
                ativo: respostaBD.rows[0].ativo,
                data_cadastro: respostaBD.rows[0].data_cadastro
            };

            return produtoDTO;
        } catch (error) {
            console.error(`Erro ao realizar consulta por código. ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo produto no banco de dados
     * @param produto Objeto Produto contendo as informações a serem cadastradas
     * @returns Boolean indicando se o cadastro foi bem-sucedido
     */
    static async cadastrarProduto(produto: Produto): Promise<boolean> {
        try {
            const queryInsertProduto = `
                INSERT INTO produto (id_categoria, codigo, nome, descricao, preco_unitario, quantidade_minima)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id_produto;`;

            const valores = [
                produto.getIdCategoria(),
                produto.getCodigo().toUpperCase(),
                produto.getNome().toUpperCase(),
                produto.getDescricao(),
                produto.getPrecoUnitario(),
                produto.getQuantidadeMinima()
            ];

            const result = await database.query(queryInsertProduto, valores);

            if (result.rows.length > 0) {
                console.log(`Produto cadastrado com sucesso. ID: ${result.rows[0].id_produto}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return false;
        }
    }

    /**
     * Remove (desativa) um produto do banco de dados (Desativação Lógica - RN18/RN19)
     * @param id_produto ID do produto a ser desativado
     * @returns Boolean indicando se a desativação foi bem-sucedida
     */
    static async removerProduto(id_produto: number): Promise<boolean> {
        try {
            const produto: ProdutoDTO | null = await this.listarProduto(id_produto);

            if (produto && produto.ativo) {
                const queryDesativarProduto = `UPDATE produto SET ativo = FALSE WHERE id_produto = $1;`;
                const result = await database.query(queryDesativarProduto, [id_produto]);

                return result.rowCount !== 0;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao desativar produto: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza os dados de um produto no banco de dados.
     * @param produto Objeto do tipo Produto com os novos dados
     * @returns true caso sucesso, false caso erro
     */
    static async atualizarProduto(produto: Produto): Promise<boolean> {
        try {
            const produtoConsulta: ProdutoDTO | null = await this.listarProduto(produto.getIdProduto());

            if (produtoConsulta && produtoConsulta.ativo) {
                const queryAtualizarProduto = `
                    UPDATE produto 
                    SET id_categoria = $1,
                        codigo = $2,
                        nome = $3,
                        descricao = $4,
                        preco_unitario = $5,
                        quantidade_minima = $6
                    WHERE id_produto = $7;`;

                const valores = [
                    produto.getIdCategoria(),
                    produto.getCodigo().toUpperCase(),
                    produto.getNome().toUpperCase(),
                    produto.getDescricao(),
                    produto.getPrecoUnitario(),
                    produto.getQuantidadeMinima(),
                    produto.getIdProduto()
                ];

                const respostaBD = await database.query(queryAtualizarProduto, valores);

                if (respostaBD.rowCount !== 0) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error(`Erro ao atualizar produto: ${error}`);
            return false;
        }
    }
}

export default Produto;
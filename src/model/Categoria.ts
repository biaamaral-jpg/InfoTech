import type CategoriaDTO from "../dto/CategoriaDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Categoria {
    private id_categoria: number = 0;
    private nome: string = "";
    private descricao: string = "";
    private ativo: boolean = true;
    private data_cadastro: Date | string | undefined;

    constructor(
        _id_categoria: number = 0,
        _nome: string = "",
        _descricao: string = "",
        _ativo: boolean = true,
        _data_cadastro?: Date | string
    ) {
        this.id_categoria = _id_categoria;
        this.nome = _nome;
        this.descricao = _descricao;
        this.ativo = _ativo;
        this.data_cadastro = _data_cadastro;
    }

    public getIdCategoria(): number {
        return this.id_categoria;
    }
    public setIdCategoria(value: number): void {
        this.id_categoria = value;
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
     * Retorna uma lista com todas as categorias cadastradas e ativas no banco de dados
     * 
     * @returns Lista com todas as categorias ativas cadastradas no banco de dados
     */
    static async listarCategorias(): Promise<Array<CategoriaDTO> | null> {
        const listaDeCategorias: Array<CategoriaDTO> = [];

        try {
            const querySelectCategoria = `SELECT * FROM categoria WHERE ativo = TRUE ORDER BY nome;`;
            const respostaBD = await database.query(querySelectCategoria);

            for (const categoria of respostaBD.rows) {
                const categoriaDTO: CategoriaDTO = {
                    id_categoria: categoria.id_categoria,
                    nome: categoria.nome,
                    descricao: categoria.descricao,
                    ativo: categoria.ativo,
                    data_cadastro: categoria.data_cadastro,
                };

                listaDeCategorias.push(categoriaDTO);
            }

            return listaDeCategorias;
        } catch (error) {
            console.error(`Erro ao acessar o modelo de categoria: ${error}`);
            return null;
        }
    }

    /**
     * Retorna as informações de uma categoria informada pelo ID
     * 
     * @param id_categoria 
     * @returns
     */
    static async listarCategoria(id_categoria: number): Promise<CategoriaDTO | null> {
        try {
            const querySelectCategoria = `SELECT * FROM categoria WHERE id_categoria = $1;`;
            const respostaBD = await database.query(querySelectCategoria, [id_categoria]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const categoriaDTO: CategoriaDTO = {
                id_categoria: respostaBD.rows[0].id_categoria,
                nome: respostaBD.rows[0].nome,
                descricao: respostaBD.rows[0].descricao,
                ativo: respostaBD.rows[0].ativo,
                data_cadastro: respostaBD.rows[0].data_cadastro,
            };

            return categoriaDTO;
        } catch (error) {
            console.error(`Erro ao realizar consulta de categoria: ${error}`);
            return null;
        }
    }

    /**
     * Retorna as informações de uma categoria através do seu NOME
     * 
     * @param nome Nome da categoria
     * @returns Objeto com informações da categoria ou null
     */
    static async buscarPorNome(nome: string): Promise<CategoriaDTO | null> {
        try {
            const querySelectNome = `SELECT * FROM categoria WHERE LOWER(nome) = LOWER($1);`;
            const respostaBD = await database.query(querySelectNome, [nome]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const categoriaDTO: CategoriaDTO = {
                id_categoria: respostaBD.rows[0].id_categoria,
                nome: respostaBD.rows[0].nome,
                descricao: respostaBD.rows[0].descricao,
                ativo: respostaBD.rows[0].ativo,
                data_cadastro: respostaBD.rows[0].data_cadastro,
            };

            return categoriaDTO;
        } catch (error) {
            console.error(`Erro ao buscar categoria por nome: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra uma nova categoria no banco de dados
     * @param categoria Objeto Categoria contendo as informações a serem cadastradas
     * @returns Boolean indicando se o cadastro foi bem-sucedido
     */
    static async cadastrarCategoria(categoria: Categoria): Promise<boolean> {
        try {
            const queryInsertCategoria = `
                INSERT INTO categoria (nome, descricao)
                VALUES ($1, $2)
                RETURNING id_categoria;`;

            const valores = [
                categoria.getNome().trim(),
                categoria.getDescricao().trim()
            ];

            const result = await database.query(queryInsertCategoria, valores);

            if (result.rows.length > 0) {
                console.log(`Categoria cadastrada com sucesso. ID: ${result.rows[0].id_categoria}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar categoria: ${error}`);
            return false;
        }
    }

    /**
     * Remove (desativa) uma categoria do banco de dados (Desativação Lógica)
     * @param id_categoria ID da categoria a ser desativada
     * @returns Boolean indicando se a desativação foi bem-sucedida
     */
    static async removerCategoria(id_categoria: number): Promise<boolean> {
        try {
            const categoria: CategoriaDTO | null = await this.listarCategoria(id_categoria);

            if (categoria && categoria.ativo) {
                const queryDesativarCategoria = `UPDATE categoria SET ativo = FALSE WHERE id_categoria = $1;`;
                const result = await database.query(queryDesativarCategoria, [id_categoria]);

                return result.rowCount !== 0;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao desativar categoria: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza os dados de uma categoria no banco de dados.
     * @param categoria Objeto do tipo Categoria com os novos dados
     * @returns true caso sucesso, false caso erro
     */
    static async atualizarCategoria(categoria: Categoria): Promise<boolean> {
        try {
            const categoriaConsulta: CategoriaDTO | null = await this.listarCategoria(categoria.getIdCategoria());

            if (categoriaConsulta && categoriaConsulta.ativo) {
                const queryAtualizarCategoria = `
                    UPDATE categoria
                    SET nome = $1,
                        descricao = $2,
                        ativo = $3
                    WHERE id_categoria = $4;`;

                const valores = [
                    categoria.getNome(),
                    categoria.getDescricao(),
                    categoria.getAtivo(),
                    categoria.getIdCategoria()
                ];

                const respostaBD = await database.query(queryAtualizarCategoria, valores);

                if (respostaBD.rowCount !== 0) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error(`Erro ao atualizar categoria: ${error}`);
            return false;
        }
    }
}

export default Categoria;
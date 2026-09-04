import type { Request, Response } from "express";
import Categoria from "../model/Categoria.js";
import type CategoriaDTO from "../dto/CategoriaDTO.js";

class CategoriaController {
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeCategorias = await Categoria.listarCategorias();

            if (listaDeCategorias !== null) {
                return res.status(200).json(listaDeCategorias);
            } else {
                return res.status(400).json({ mensagem: "Erro ao buscar a lista de categorias." });
            }
        } catch (error) {
            console.error(`Erro ao listar categorias: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async categoriaPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id_categoria = parseInt(req.params.id_categoria as string, 10);

            if (isNaN(id_categoria)) {
                return res.status(400).json({ mensagem: "O ID da categoria fornecido é inválido." });
            }

            const categoria: CategoriaDTO | null = await Categoria.listarCategoria(id_categoria);

            if (categoria !== null) {
                return res.status(200).json(categoria);
            } else {
                return res.status(404).json({ mensagem: "Categoria não encontrada." });
            }
        } catch (error) {
            console.error(`Erro ao buscar categoria por ID: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async categoriaPorNome(req: Request, res: Response): Promise<Response> {
        try {
            const nome = req.params.nome as string;

            if (!nome) {
                return res.status(400).json({ mensagem: "É necessário informar o nome da categoria." });
            }

            const categoria: CategoriaDTO | null = await Categoria.buscarPorNome(nome);

            if (categoria !== null) {
                return res.status(200).json(categoria);
            } else {
                return res.status(404).json({ mensagem: "Nenhuma categoria foi encontrada com o nome informado." });
            }
        } catch (error) {
            console.error(`Erro ao buscar categoria por nome: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, descricao } = req.body;

            if (!nome || String(nome).trim() === "") {
                return res.status(400).json({
                    mensagem: "O campo nome da categoria é obrigatório."
                });
            }

            const categoriaExistente = await Categoria.buscarPorNome(nome);
            if (categoriaExistente !== null) {
                return res.status(409).json({ mensagem: "Já existe uma categoria cadastrada com este nome." });
            }

            const novaCategoria = new Categoria(
                0,
                String(nome).trim(),
                descricao ?? "",
                true,
                new Date()
            );

            const cadastroSucesso = await Categoria.cadastrarCategoria(novaCategoria);

            if (cadastroSucesso) {
                return res.status(201).json({ mensagem: "Categoria cadastrada com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível cadastrar a categoria no banco de dados." });
            }
        } catch (error) {
            console.error(`Erro ao cadastrar categoria: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const id_categoria = parseInt(req.params.id_categoria as string, 10);

            if (isNaN(id_categoria)) {
                return res.status(400).json({ mensagem: "O ID da categoria fornecido é inválido." });
            }

            const removido = await Categoria.removerCategoria(id_categoria);

            if (removido) {
                return res.status(200).json({ mensagem: "Categoria removida com sucesso do sistema." });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível remover a categoria. Verifique se ela existe." });
            }
        } catch (error) {
            console.error(`Erro ao remover categoria: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const id_categoria = parseInt(req.params.id_categoria as string, 10);
            const { nome, descricao, ativo } = req.body;

            if (isNaN(id_categoria)) {
                return res.status(400).json({ mensagem: "O ID da categoria fornecido é inválido." });
            }

            if (!nome || String(nome).trim() === "") {
                return res.status(400).json({ mensagem: "O nome da categoria é obrigatório." });
            }

            const categoriaAtualizar = new Categoria(
                id_categoria,
                String(nome).trim(),
                descricao ?? "",
                ativo !== undefined ? Boolean(ativo) : true,
                new Date()
            );

            const atualizado = await Categoria.atualizarCategoria(categoriaAtualizar);

            if (atualizado) {
                return res.status(200).json({ mensagem: "Categoria atualizada com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível atualizar a categoria. Verifique se ela existe ou está ativa." });
            }
        } catch (error) {
            console.error(`Erro ao atualizar categoria: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
}

export default CategoriaController;
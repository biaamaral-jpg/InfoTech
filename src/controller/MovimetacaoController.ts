import type { Request, Response } from "express";
import Movimentacao from "../model/Movimentacao.js";
import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";

class MovimentacaoController {

   
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeMovimentacao = await Movimentacao.listarMovimentacoes();

            if (listaDeMovimentacao !== null) {
                return res.status(200).json(listaDeMovimentacao);
            } else {
                return res.status(400).json({ mensagem: "Erro ao buscar a lista de movimentações." });
            }
        } catch (error) {
            console.error(`Erro ao listar movimentações: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    
    static async MovimentacaoPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id_movimentacao = parseInt(req.params.id_movimentacao as string, 10);

            if (isNaN(id_movimentacao)) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }

            const movimentacao: MovimentacaoDTO | null = await Movimentacao.listarMovimentacao(id_movimentacao);

            if (movimentacao !== null) {
                return res.status(200).json(movimentacao);
            } else {
                return res.status(404).json({ mensagem: "Movimentação não encontrada." });
            }
        } catch (error) {
            console.error(`Erro ao buscar movimentação por ID: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    
    static async movimentacaoPorCodigo(req: Request, res: Response): Promise<Response> {
        try {
            const codigo = req.params.codigo as string;

            if (!codigo) {
                return res.status(400).json({ mensagem: "É necessário informar o código da movimentação." });
            }

            const movimentacao: MovimentacaoDTO | null = await Movimentacao.buscarPorCodigo(codigo);

            if (movimentacao !== null) {
                return res.status(200).json(movimentacao);
            } else {
                return res.status(404).json({ mensagem: "Nenhuma movimentação foi encontrada com o código fornecido." });
            }
        } catch (error) {
            console.error(`Erro ao buscar movimentação por código: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
   
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const { id_produto, id_categoria, codigo, nome, descricao, preco_unitario, quantidade } = req.body;

           
            if (!id_categoria || !codigo || !nome || preco_unitario === undefined || quantidade === undefined) {
                return res.status(400).json({
                    mensagem: "Campos obrigatórios incompletos: id_produto, id_categoria, codigo, nome, preco_unitario e quantidade devem ser informados."
                });
            }

           
            if (preco_unitario < 0) {
                return res.status(400).json({ mensagem: "O preço unitário não pode ser um valor negativo." });
            }

            
            if (quantidade < 0) {
                return res.status(400).json({ mensagem: "A quantidade não pode ser um valor negativo." });
            }

           
            const movimentacaoExistente = await Movimentacao.buscarPorCodigo(codigo);
            if (movimentacaoExistente !== null) {
                return res.status(409).json({ mensagem: "Já existe uma movimentação cadastrada com este código." });
            }

      
            const novoMovimentacao = new Movimentacao(
                id_produto,
                id_categoria,
                codigo, 
                nome,
               preco_unitario,
                quantidade
            );

        
            const cadastroSucesso = await Movimentacao.cadastrarMovimentacao(novoMovimentacao);

            if (cadastroSucesso) {
                return res.status(201).json({ mensagem: "Movimentação cadastrada com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível cadastrar a movimentação no banco de dados." });
            }

        } catch (error) {
            console.error(`Erro ao cadastrar movimentação: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
   
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const id_movimentacao = parseInt(req.params.id_movimentacao as string, 10);

            if (isNaN(id_movimentacao)) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }

            const removido = await Movimentacao.removerMovimentacao(id_movimentacao);

            if (removido) {
                return res.status(200).json({ mensagem: "Movimentação removida com sucesso do sistema." });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível remover a movimentação. Verifique se ela existe." });
            }
        } catch (error) {
            console.error(`Erro ao remover movimentação: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
    /**
         * Rota PUT /movimentacoes/:id_movimentacao - Atualiza as informações da movimentação
         */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const id_movimentacao = parseInt(req.params.id_movimentacao as string, 10);
            const { id_categoria, codigo, nome, descricao, preco_unitario, quantidade_minima } = req.body;

            if (isNaN(id_movimentacao)) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }

            // Validações no backend
            if (preco_unitario !== undefined && preco_unitario < 0) {
                return res.status(400).json({ mensagem: "O preço unitário não pode ser um valor negativo." });
            }

            if (quantidade_minima !== undefined && quantidade_minima < 0) {
                return res.status(400).json({ mensagem: "A quantidade mínima não pode ser um valor negativo." });
            }

            // Instancia o produto e seta o ID
            const produtoAtualizar = new Movimentacao(
                id_categoria,
                codigo,
                nome,
                descricao,
                preco_unitario,
                quantidade_minima
            );
            produtoAtualizar.setIdProduto(id_movimentacao);

            const atualizado = await Movimentacao.atualizarMovimentacao(produtoAtualizar);

            if (atualizado) {
                return res.status(200).json({ mensagem: "Movimentação atualizada com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível atualizar a movimentação. Verifique se ela existe ou está ativa." });
            }
        } catch (error) {
            console.error(`Erro ao atualizar movimentação: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }




}
export default MovimentacaoController;
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
            const body = req.body ?? {};

            const id_produto = Number(body.id_produto ?? body.idProduto ?? 0);
            const id_movimentacao_origem = body.id_movimentacao_origem ?? body.idMovimentacaoOrigem ?? null;
            const motivo_movimentacao = String(body.motivo_movimentacao ?? body.motivo ?? body.motivoMovimentacao ?? "").trim();
            const tipo_movimentacao = String(body.tipo_movimentacao ?? body.tipo ?? body.tipoMovimentacao ?? "").trim();
            const quantidade = Number(body.quantidade ?? body.qtd ?? 0);
            const preco_unitario = Number(body.preco_unitario ?? body.precoUnitario ?? 0);
            const valor_total = Number(body.valor_total ?? body.valorTotal ?? (Number.isFinite(quantidade) && Number.isFinite(preco_unitario) ? quantidade * preco_unitario : 0));
            const observacao = String(body.observacao ?? body.obs ?? "").trim();
            const data_movimentacao = body.data_movimentacao ?? body.dataMovimentacao ?? new Date();

            const tipoNormalizado = tipo_movimentacao.toUpperCase();
            const motivoNormalizado = motivo_movimentacao.toUpperCase();
            const tiposPermitidos = ["ENTRADA", "SAIDA", "CORRECAO"];

            if (!tiposPermitidos.includes(tipoNormalizado)) {
                return res.status(400).json({
                    mensagem: "Tipo de movimentação inválido. Use: ENTRADA, SAIDA ou CORRECAO."
                });
            }

            if (tipoNormalizado === "CORRECAO") {
                if (motivoNormalizado !== "CORRECAO") {
                    return res.status(400).json({
                        mensagem: "Movimentação de correção exige motivo 'CORRECAO'."
                    });
                }

                if (!id_movimentacao_origem || Number(id_movimentacao_origem) <= 0) {
                    return res.status(400).json({
                        mensagem: "Movimentações do tipo CORRECAO exigem id_movimentacao_origem informado."
                    });
                }
            }

            if (!id_produto || !motivo_movimentacao || !tipo_movimentacao || !Number.isFinite(quantidade) || !Number.isFinite(preco_unitario)) {
                return res.status(400).json({
                    mensagem: "Campos obrigatórios incompletos: id_produto, motivo_movimentacao, tipo_movimentacao, quantidade e preco_unitario devem ser informados."
                });
            }

            if (quantidade < 0) {
                return res.status(400).json({ mensagem: "A quantidade não pode ser um valor negativo." });
            }

            if (preco_unitario < 0) {
                return res.status(400).json({ mensagem: "O preço unitário não pode ser um valor negativo." });
            }

            if (valor_total < 0) {
                return res.status(400).json({ mensagem: "O valor total não pode ser negativo." });
            }

            const novaMovimentacao = new Movimentacao(
                0,
                id_produto,
                Number(id_movimentacao_origem) || undefined,
                motivoNormalizado,
                tipoNormalizado,
                quantidade,
                preco_unitario,
                valor_total,
                observacao,
                data_movimentacao,
                true
            );

            const cadastroSucesso = await Movimentacao.cadastrarMovimentacao(novaMovimentacao);

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
            const body = req.body ?? {};

            const id_produto = body.id_produto ?? body.idProduto;
            const id_movimentacao_origem = body.id_movimentacao_origem ?? body.idMovimentacaoOrigem ?? null;
            const motivo_movimentacao = body.motivo_movimentacao ?? body.motivo ?? body.motivoMovimentacao;
            const tipo_movimentacao = body.tipo_movimentacao ?? body.tipo ?? body.tipoMovimentacao;
            const quantidade = body.quantidade ?? body.qtd;
            const preco_unitario = body.preco_unitario ?? body.precoUnitario;
            const valor_total = body.valor_total ?? body.valorTotal;
            const observacao = body.observacao ?? body.obs;
            const data_movimentacao = body.data_movimentacao ?? body.dataMovimentacao;

            if (isNaN(id_movimentacao)) {
                return res.status(400).json({ mensagem: "O ID da movimentação fornecido é inválido." });
            }

            const tipoNormalizado = String(tipo_movimentacao ?? "").trim().toUpperCase();
            const motivoNormalizado = String(motivo_movimentacao ?? "").trim().toUpperCase();
            const tiposPermitidos = ["ENTRADA", "SAIDA", "CORRECAO"];

            if (tipo_movimentacao !== undefined && !tiposPermitidos.includes(tipoNormalizado)) {
                return res.status(400).json({
                    mensagem: "Tipo de movimentação inválido. Use: ENTRADA, SAIDA ou CORRECAO."
                });
            }

            if (tipoNormalizado === "CORRECAO") {
                if (motivoNormalizado !== "CORRECAO") {
                    return res.status(400).json({
                        mensagem: "Movimentação de correção exige motivo 'CORRECAO'."
                    });
                }

                if (!id_movimentacao_origem || Number(id_movimentacao_origem) <= 0) {
                    return res.status(400).json({
                        mensagem: "Movimentações do tipo CORRECAO exigem id_movimentacao_origem informado."
                    });
                }
            }

            if (quantidade !== undefined && Number(quantidade) < 0) {
                return res.status(400).json({ mensagem: "A quantidade não pode ser um valor negativo." });
            }

            if (preco_unitario !== undefined && Number(preco_unitario) < 0) {
                return res.status(400).json({ mensagem: "O preço unitário não pode ser um valor negativo." });
            }

            const movimentacaoAtualizar = new Movimentacao(
                id_movimentacao,
                id_produto ?? 0,
                Number(id_movimentacao_origem) || undefined,
                motivoNormalizado || "",
                tipoNormalizado || "",
                Number(quantidade ?? 0),
                Number(preco_unitario ?? 0),
                Number(valor_total ?? (Number(quantidade ?? 0) * Number(preco_unitario ?? 0))),
                observacao ?? "",
                data_movimentacao,
                true
            );

            const atualizado = await Movimentacao.atualizarMovimentacao(movimentacaoAtualizar);

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
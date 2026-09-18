import { Router, type Request, type Response } from "express";

import ProdutoController from "./src/controller/ProdutoController.js";
import MovimentacaoController from "./src/controller/MovimetacaoController.js";


const router = Router();


router.get('/', (req: Request, res: Response) => {
    return res
        .status(200) // Status HTTP 200 (OK)
        .json(`Aplicação online. Timestamp: ${new Date()}`);
});

router.post('/api/login', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const email = body.email ?? body.login ?? body.username;
    const senha = body.senha ?? body.password;

    if (!email || !senha) {
        return res.status(400).json({
            message: "Email e senha são obrigatórios."
        });
    }

    return res.status(200).json({
        message: "Login realizado com sucesso",
        token: "dev-token",
        user: {
            email,
        }
    });
});

router.get('/api/produtos', ProdutoController.todos);
router.get('/api/produtos/codigo/:codigo', ProdutoController.produtoPorCodigo);
router.get('/api/produtos/:id_produto', ProdutoController.produtoPorId);
router.post('/api/produtos', ProdutoController.novo);
router.delete('/api/produtos/:id_produto', ProdutoController.remover);
router.put('/api/produtos/:id_produto', ProdutoController.atualizar);

router.get('/produtos', ProdutoController.todos);
router.get('/produtos/codigo/:codigo', ProdutoController.produtoPorCodigo);
router.get('/produtos/:id_produto', ProdutoController.produtoPorId);
router.post('/produtos', ProdutoController.novo);
router.delete('/produtos/:id_produto', ProdutoController.remover);
router.put('/produtos/:id_produto', ProdutoController.atualizar);

router.get('/api/movimentacao', MovimentacaoController.todos);
router.get('/api/movimentacao/:id_movimentacao', MovimentacaoController.MovimentacaoPorId);
router.post('/api/movimentacao', MovimentacaoController.novo);
router.delete('/api/movimentacao/:id_movimentacao', MovimentacaoController.remover);
router.put('/api/movimentacao/:id_movimentacao', MovimentacaoController.atualizar);

router.get('/movimentacao', MovimentacaoController.todos);
router.get('/movimentacao/:id_movimentacao', MovimentacaoController.MovimentacaoPorId);
router.post('/movimentacao', MovimentacaoController.novo);
router.delete('/movimentacao/:id_movimentacao', MovimentacaoController.remover);
router.put('/movimentacao/:id_movimentacao', MovimentacaoController.atualizar);

router.get('/api/movimentacoes', MovimentacaoController.todos);
router.get('/api/movimentacoes/:id_movimentacao', MovimentacaoController.MovimentacaoPorId);
router.post('/api/movimentacoes', MovimentacaoController.novo);
router.delete('/api/movimentacoes/:id_movimentacao', MovimentacaoController.remover);
router.put('/api/movimentacoes/:id_movimentacao', MovimentacaoController.atualizar);

router.get('/movimentacoes', MovimentacaoController.todos);
router.get('/movimentacoes/:id_movimentacao', MovimentacaoController.MovimentacaoPorId);
router.post('/movimentacoes', MovimentacaoController.novo);
router.delete('/movimentacoes/:id_movimentacao', MovimentacaoController.remover);
router.put('/movimentacoes/:id_movimentacao', MovimentacaoController.atualizar);


export { router };
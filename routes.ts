import { Router, type Request, type Response } from "express";

import ProdutoController from "./src/controller/ProdutoController.js";


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


export { router };
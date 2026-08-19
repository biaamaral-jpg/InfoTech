
import { Router, type Request, type Response } from "express";

import ProdutoController from "./src/controller/ProdutoController.js";


const router = Router();


router.get('/', (req: Request, res: Response) => {
    return res
        .status(200) // Status HTTP 200 (OK)
        .json(`Aplicação online. Timestamp: ${new Date()}`);
});

router.get('/api/produtos', ProdutoController.todos);
router.get('/api/produtos/codigo/:codigo', ProdutoController.produtoPorCodigo);
router.get('/api/produtos/:id_produto', ProdutoController.produtoPorId);
router.post('/api/produtos', ProdutoController.novo);
router.delete('/api/produtos/:id_produto', ProdutoController.remover);
router.put('/api/produtos/:id_produto', ProdutoController.atualizar);


export { router };
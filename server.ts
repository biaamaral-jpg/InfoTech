// Importa o framework Express — é ele quem cria e gerencia o servidor web da aplicação
import express from "express";
// Importa o middleware CORS (Cross-Origin Resource Sharing)
// O CORS controla quais origens (domínios) têm permissão para acessar a API
// Sem ele, o navegador bloquearia requisições vindas de um domínio diferente do servidor
// Ex: front-end em localhost:3000 tentando acessar API em localhost:3333 seria bloqueado sem CORS
import cors, { type CorsOptions } from "cors";
// Importa o router criado no arquivo routes.ts — contém todos os endpoints da aplicação
import { router } from "./routes.js";

/**
 * Cria servidor express
 */
// Cria a instância do servidor Express e armazena na variável "server"
// É este objeto que recebe todas as configurações e sobe o servidor HTTP
const server = express();

/**
 * Configurações do servidor
 */
// Registra o middleware que permite ao servidor ler e interpretar corpos de requisição em formato JSON
// Sem isso, req.body chegaria como undefined nos controllers — nenhum dado do front-end seria lido
server.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

// Registra o middleware CORS com as configurações padrão
// Na configuração padrão, permite requisições de qualquer origem ("*")
// Em produção, o ideal seria restringir para apenas os domínios autorizados
server.use(cors(corsOptions));
server.options(/.*/, cors(corsOptions));

// Registra o router com todos os endpoints da aplicação
// A partir daqui, toda requisição que chegar ao servidor será direcionada para a rota correspondente
server.use(router);

// Exporta o servidor para que possa ser importado e iniciado em outro arquivo (geralmente o index.ts ou server.ts)
// O uso de exportação nomeada "export { server }" mantém consistência com a exportação do router
export { server };
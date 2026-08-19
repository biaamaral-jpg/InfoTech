import { DatabaseModel } from "./src/model/DatabaseModel.js";
import { server } from "./server.js";
const port: number = Number.parseInt(process.env.PORT ?? "3333", 10);
const host: string = process.env.HOST ?? "localhost";



new DatabaseModel()
  .testeConexao()
  .then((resbd) => {
    if (resbd) {
      server.listen(port, host, () => {
        console.log(`Servidor rodando em http://${host}:${port}`);
      });
    } else {
      console.log("Não foi possível conectar ao banco de dados");
    }
  })
  .catch((error) => {
    console.error("Erro ao iniciar a aplicação:", error);
  });
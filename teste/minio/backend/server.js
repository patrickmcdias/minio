require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Minio = require("minio").Client;
const fileUpload = require("express-fileupload");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Middleware para autenticação dinâmica por Access/Secret Key do usuário
app.use((req, res, next) => {
  if (req.path === "/api/validate-credentials") {
    return next();
  }

  const accessKey = req.headers['x-access-key'];
  const secretKey = req.headers['x-secret-key'];

  if (!accessKey || !secretKey) {
    return res.status(401).json({ error: "Credenciais inválidas ou ausentes." });
  }

  req.minioClient = new Minio({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey,
    secretKey
  });

  next();  // Permite que a requisição continue
});

// Rota para validar credenciais
app.post("/api/validate-credentials", (req, res) => {
  const { accessKey, secretKey } = req.body;

  if (!accessKey || !secretKey) {
    return res.status(400).json({ valid: false, error: "AccessKey e SecretKey são obrigatórias." });
  }

  const minioClient = new Minio({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey,
    secretKey,
  });

  minioClient.listBuckets((err, buckets) => {
    if (err) {
      return res.status(401).json({ valid: false, error: "Credenciais inválidas" });
    }

    res.json({ valid: true });
  });
});

// Listar buckets com detalhes
app.get("/api/buckets", async (req, res) => {
  try {
    const buckets = await req.minioClient.listBuckets();
    const bucketDetails = await Promise.all(buckets.map(async (bucket) => {
      let totalSize = 0, objectCount = 0;
      const objectsStream = req.minioClient.listObjects(bucket.name, '', true);

      return new Promise((resolve) => {
        objectsStream.on('data', (obj) => {
          totalSize += obj.size;
          objectCount++;
        });

        objectsStream.on('end', () => resolve({
          name: bucket.name,
          createdAt: bucket.creationDate,
          objectCount,
          totalSizeBytes: totalSize,
          totalSizeGB: (totalSize / (1024 ** 3)).toFixed(2),
          totalSizeTB: (totalSize / (1024 ** 4)).toFixed(4),
        }));

        objectsStream.on('error', (err) => resolve({ name: bucket.name, error: err.message }));
      });
    }));

    res.json(bucketDetails);
  } catch (error) {
    console.error("Erro ao listar buckets:", error);
    res.status(500).json({ error: error.message });
  }
});

// Listar objetos em um bucket específico com prefixo (para navegação em pastas)
app.get("/api/buckets/:bucketName/objects", async (req, res) => {
  const { bucketName } = req.params;
  const { prefix } = req.query;  // Prefixo da pasta

  const objects = [];
  const stream = req.minioClient.listObjectsV2(bucketName, prefix || '', true);

  stream.on("data", (obj) => objects.push(obj));
  stream.on("end", () => res.json(objects));
  stream.on("error", (err) => {
    console.error(err);
    res.status(500).json({ error: err.message });
  });
});

// Upload de arquivo
app.post("/api/buckets/:bucketName/objects/upload", (req, res) => {
  const { bucketName } = req.params;
  const { path } = req.body;  // Caminho para o arquivo
  const file = req.files ? req.files.file : null;

  if (!file) {
    return res.status(400).json({ error: "Arquivo não enviado." });
  }

  const filePath = path ? `${path}/${file.name}` : file.name;

  req.minioClient.putObject(bucketName, filePath, file.data, (err, etag) => {
    if (err) {
      console.log("Erro ao fazer upload:", err);
      return res.status(500).json({ error: "Erro ao fazer upload." });
    }

    res.json({ message: "Upload realizado com sucesso!", etag });
  });
});

// Excluir objeto de um bucket
app.delete("/api/buckets/:bucketName/objects", (req, res) => {
  const { bucketName } = req.params;
  const { path } = req.body;  // Caminho do objeto a ser excluído

  if (!path) {
    return res.status(400).json({ error: "Caminho do objeto é obrigatório." });
  }

  req.minioClient.removeObject(bucketName, path, (err) => {
    if (err) {
      console.error("Erro ao excluir objeto:", err);
      return res.status(500).json({ error: "Erro ao excluir objeto." });
    }

    res.status(200).json({ message: "Objeto excluído com sucesso!" });
  });
});

// Criar pasta (simulada como objeto vazio)
app.post("/api/buckets/:bucketName/objects/folder", (req, res) => {
  const { bucketName } = req.params;
  const { path, folderName } = req.body;

  if (!folderName) {
    return res.status(400).json({ error: "Nome da pasta é obrigatório." });
  }

  const folderPath = `${path}/${folderName}/`;  // Pasta finalizada com "/"
  req.minioClient.putObject(bucketName, folderPath, Buffer.alloc(0), (err, etag) => {
    if (err) {
      console.error("Erro ao criar a pasta:", err);
      return res.status(500).json({ error: "Erro ao criar pasta." });
    }

    res.json({ message: "Pasta criada com sucesso!", etag });
  });
});

// Iniciar o servidor
app.listen(process.env.PORT, () => {
  console.log(`Backend rodando na porta ${process.env.PORT}`);
});

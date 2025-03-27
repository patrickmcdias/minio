// useObjects.ts
import { useState, useEffect } from "react";
import api from "../api"; // Certifique-se de que o "api" está configurado corretamente para fazer as requisições
import { toast } from "sonner";

export function useObjects(bucketName: string | null) {
  const [objects, setObjects] = useState<any[]>([]);
  const [isLoadingObjects, setIsLoadingObjects] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");

  const loadObjects = (path = "") => {
    if (!bucketName) return;
    setIsLoadingObjects(true);
    api.get(`/buckets/${bucketName}/objects`, {
      params: { prefix: path } // Enviar o prefixo (diretório) como parte da query
    })
      .then(({ data }) => {
        setObjects(data);
        setCurrentPath(path);
      })
      .catch(() => toast.error("Erro ao carregar objetos"))
      .finally(() => setIsLoadingObjects(false));
  };

  const handleUploadObject = (file: File) => {
    if (!bucketName) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", currentPath);

    return api.post(`/buckets/${bucketName}/objects/upload`, formData) // Endpoint para upload de objetos
      .then(() => {
        toast.success("Upload realizado");
        loadObjects(currentPath);
      })
      .catch(() => toast.error("Erro ao fazer upload"));
  };

  const handleDeleteObject = (path: string) => {
    if (!bucketName) return;
    return api.delete(`/buckets/${bucketName}/objects`, { data: { path } }) // Endpoint para exclusão de objetos
      .then(() => {
        toast.success("Objeto excluído");
        loadObjects(currentPath);
      })
      .catch(() => toast.error("Erro ao excluir objeto"));
  };

  const handleDownloadObject = (path: string) => {
    if (!bucketName) return;
    api({
      url: `/buckets/${bucketName}/objects/${encodeURIComponent(path)}`,
      method: "GET",
      responseType: "blob", // Definindo o tipo de resposta como blob para download
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", path.split("/").pop() || "download");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(() => toast.error("Erro ao baixar objeto"));
  };

  const handleCreateFolder = () => {
    const folderName = prompt("Nome da nova pasta:");
    if (!folderName || !bucketName) return;
    api.post(`/buckets/${bucketName}/objects/folder`, {
      path: currentPath,
      folderName,
    }) // Endpoint para criação de pastas
      .then(() => {
        toast.success("Pasta criada com sucesso");
        loadObjects(currentPath);
      })
      .catch(() => toast.error("Erro ao criar pasta"));
  };

  const goBack = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    const newPath = parts.length ? parts.join("/") + "/" : "";
    loadObjects(newPath);
  };

  useEffect(() => {
    if (bucketName) loadObjects();
  }, [bucketName]);

  return {
    objects,
    isLoadingObjects,
    currentPath,
    loadObjects,
    handleUploadObject,
    handleDeleteObject,
    handleDownloadObject,
    handleCreateFolder,
    goBack,
  };
}

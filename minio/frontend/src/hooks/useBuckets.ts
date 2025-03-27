// useBuckets.ts
import { useState, useEffect } from "react";
import api from "../api"; // Certifique-se de que o "api" está configurado corretamente para fazer as requisições
import { toast } from "sonner";

export function useBuckets() {
  const [buckets, setBuckets] = useState<any[]>([]);
  const [isLoadingBuckets, setIsLoadingBuckets] = useState(false);

  const fetchBuckets = () => {
    setIsLoadingBuckets(true);
    api.get("/buckets") // Requisição para listar os buckets
      .then(({ data }) => setBuckets(data))
      .catch(() => toast.error("Erro ao carregar buckets"))
      .finally(() => setIsLoadingBuckets(false));
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  const handleCreateBucket = () => {
    const name = prompt("Nome do novo bucket:");
    if (!name) return;
    api.post("/buckets", { name }) // Endpoint para criar um novo bucket
      .then(() => {
        toast.success("Bucket criado com sucesso");
        fetchBuckets();
      })
      .catch(() => toast.error("Erro ao criar bucket"));
  };

  const handleDeleteBucket = (name: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este bucket?")) return;
    api.delete(`/buckets/${name}`) // Endpoint para excluir um bucket
      .then(() => {
        toast.success("Bucket excluído");
        fetchBuckets();
      })
      .catch(() => toast.error("Erro ao excluir bucket"));
  };

  return {
    buckets,
    isLoadingBuckets,
    handleCreateBucket,
    handleDeleteBucket,
  };
}

// useStorageUsage.ts
import { useState, useEffect } from "react";
import api from "../api"; // Certifique-se de que o "api" está configurado corretamente para fazer as requisições

export function useStorageUsage() {
  const [bucketsDetails, setBucketsDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api.get("/buckets/details") // Endpoint para obter detalhes dos buckets (número de objetos e tamanho)
      .then(({ data }) => setBucketsDetails(data))  // Esperamos que a resposta tenha detalhes do bucket
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Calcular o total de objetos e o tamanho total de todos os buckets
  const totalObjects = bucketsDetails.reduce((acc, bucket) => acc + bucket.objectCount, 0);
  const totalSizeGB = bucketsDetails.reduce((acc, bucket) => acc + parseFloat(bucket.totalSizeGB), 0).toFixed(2);
  const totalSizeTB = bucketsDetails.reduce((acc, bucket) => acc + parseFloat(bucket.totalSizeTB), 0).toFixed(4);

  return {
    bucketsDetails,
    isLoading,
    totalObjects,
    totalSizeGB,
    totalSizeTB,
  };
}

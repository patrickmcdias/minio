import { Button } from "@/components/ui/button";

interface BucketListProps {
  buckets: any[];
  isLoading: boolean;
  onBucketSelect: (bucket: string) => void;
  onBucketCreate: () => void;
  onBucketDelete: (bucket: string) => void;
}

const BucketList: React.FC<BucketListProps> = ({
  buckets,
  isLoading,
  onBucketSelect,
  onBucketCreate,
  onBucketDelete,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Buckets</h2>
        <Button onClick={onBucketCreate}>+ Criar Bucket</Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Carregando buckets...</p>
      ) : (
        <div className="bg-white shadow rounded-md overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Nome</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Criado</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Objetos</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Tamanho</th>
                <th className="px-6 py-3 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buckets.map((bucket) => (
                <tr key={bucket.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 cursor-pointer" onClick={() => onBucketSelect(bucket.name)}>
                    🪣 {bucket.name}
                  </td>
                  <td className="px-6 py-4">{bucket.created || "-"}</td>
                  <td className="px-6 py-4">{bucket.count || 0}</td>
                  <td className="px-6 py-4">{bucket.size || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="destructive" size="sm" onClick={() => onBucketDelete(bucket.name)}>
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BucketList;

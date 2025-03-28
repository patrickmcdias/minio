// frontend/src/components/objects/ObjectList.tsx
import { Button } from "@/components/ui/button";
import { Folder, File, Trash2, ArrowLeftCircle } from "lucide-react";

interface ObjectListProps {
  bucketName: string;
  objects: any[];
  isLoading: boolean;
  onBack: () => void;
  onObjectUpload: (file: File) => void;
  onObjectDelete: (path: string) => void;
  onFolderCreate?: () => void;
}

const ObjectList: React.FC<ObjectListProps> = ({
  bucketName,
  objects,
  isLoading,
  onBack,
  onObjectUpload,
  onObjectDelete,
  onFolderCreate,
}) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onObjectUpload(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftCircle className="mr-1" size={16} /> Voltar
          </Button>
          <h2 className="text-xl font-semibold">Objetos em {bucketName}</h2>
        </div>

        <div className="flex items-center gap-2">
          <input type="file" onChange={handleUpload} className="text-sm" />
          <Button size="sm" onClick={onFolderCreate}>Criar Pasta</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Carregando objetos...</p>
      ) : (
        <div className="bg-white shadow rounded-md overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Nome</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Tamanho</th>
                <th className="px-6 py-3 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {objects.map((obj) => (
                <tr key={obj.path || obj.name}>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {obj.type === "folder" ? <Folder size={16} /> : <File size={16} />}
                    <span className="truncate">{obj.name}</span>
                  </td>
                  <td className="px-6 py-4">{obj.size || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onObjectDelete(obj.path)}
                    >
                      <Trash2 size={16} />
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

export default ObjectList;

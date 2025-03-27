import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthHeaders } from "../api"; // api.js ou axios configurado
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey || !secretKey) {
      toast.error("Informe Access Key e Secret Key.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post("/validate-credentials", {
        accessKey,
        secretKey,
      });

      if (data.valid) {
        // Salva as credenciais no localStorage
        localStorage.setItem("user", JSON.stringify({ accessKey, secretKey }));
        setAuthHeaders(accessKey, secretKey); // Configura os cabeçalhos para autenticação nas futuras requisições
        toast.success("Login realizado com sucesso!");
        navigate("/app"); // Redireciona para o dashboard
      } else {
        toast.error(data.error || "Credenciais inválidas.");
      }
    } catch (error) {
      toast.error("Falha ao autenticar. Confira suas credenciais.");
      console.error("Erro de autenticação no backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* Formulário - Lado Esquerdo */}
      <div className="flex items-center justify-center px-6 py-12 md:px-10 lg:px-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <img
                src="8137a6f8-2b5b-4f04-982a-0486e5f546cc.png"
                alt="HostDime Logo"
                className="h-12"
              />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Entre na sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Acesse seus buckets no Object Storage
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="accessKey">Access Key</Label>
                <Input
                  id="accessKey"
                  name="accessKey"
                  type="text"
                  required
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input
                  id="secretKey"
                  name="secretKey"
                  type="password"
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-hostdime-orange hover:bg-hostdime-orange/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Validando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <a
                href="https://core.hostdime.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-hostdime-orange hover:text-hostdime-orange/80"
              >
                Contate o suporte
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Branding - Lado Direito */}
      <div className="hidden md:block bg-hostdime-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hostdime-orange to-hostdime-dark opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <h2 className="text-3xl font-bold mb-6">HostDime Object Storage</h2>
          <div className="max-w-md space-y-4 text-center">
            <p className="text-lg">
              Armazenamento seguro, escalável e confiável para sua empresa.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Escalável</h3>
                <p className="text-sm text-white/80">
                  Armazene e recupere qualquer volume de dados.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Seguro</h3>
                <p className="text-sm text-white/80">
                  Proteção avançada para seus dados sensíveis.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Confiável</h3>
                <p className="text-sm text-white/80">
                  Alta disponibilidade e replicação de dados.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Acessível</h3>
                <p className="text-sm text-white/80">
                  Custo eficiente com cobrança sob demanda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

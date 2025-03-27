const Support = () => {
  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold mb-4">Central de Ajuda</h2>
      <p className="text-gray-600 mb-6">Clique abaixo para acessar o painel de suporte da HostDime.</p>
      <a
        href="https://core.hostdime.com.br/auth/login"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Ir para o Suporte
      </a>
    </div>
  );
};

export default Support;

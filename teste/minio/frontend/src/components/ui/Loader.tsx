export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-full py-32 text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
      <span className="ml-3">Carregando...</span>
    </div>
  );
};

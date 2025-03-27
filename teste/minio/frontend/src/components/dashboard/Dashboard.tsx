import React from "react";

const Dashboard = ({ buckets, usage, onSelectBucket }) => {
  // Verifica se os dados de uso estão carregados
  if (!usage || usage.used === 0 || usage.total === 0) {
    return <div>Carregando dados de uso de armazenamento...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Uso de Armazenamento</h3>
        <p>Total: {usage.total} GB</p>
        <p>Usado: {usage.used} GB</p>
      </div>
      <div>
        <h3>Buckets</h3>
        {buckets.map((bucket) => (
          <button key={bucket.name} onClick={() => onSelectBucket(bucket.name)}>
            {bucket.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

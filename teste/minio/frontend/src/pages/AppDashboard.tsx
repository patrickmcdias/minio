// AppDashboard.tsx
import React, { useState, useCallback } from "react";
import { PageLoader } from "@/components/ui/Loader";
import BucketList from "@/components/buckets/BucketList";
import ObjectList from "@/components/objects/ObjectList";
import Dashboard from "@/components/dashboard/Dashboard";
import Support from "@/components/help/Support";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { logout } from "@/App"; // Função de logout para ser usada no botão

import { useBuckets } from "@/hooks/useBuckets";
import { useObjects } from "@/hooks/useObjects";
import { useStorageUsage } from "@/hooks/useStorageUsage";

const AppDashboard = () => {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const { buckets, isLoadingBuckets, handleCreateBucket, handleDeleteBucket } = useBuckets();
  const { bucketsDetails, isLoading, totalObjects, totalSizeGB, totalSizeTB } = useStorageUsage();
  const {
    objects,
    isLoadingObjects,
    currentPath,
    loadObjects,
    handleUploadObject,
    handleDeleteObject,
    handleCreateFolder,
    goBack,
  } = useObjects(selectedBucket);

  const handleSelectBucket = (bucket: string | null) => {
    setSelectedBucket(bucket);
    setActiveMenuItem(null);
    setSearchTerm(null);
  };

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
    setSelectedBucket(null);
    setSearchTerm(null);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setActiveMenuItem(null);
  }, []);

  const filteredBuckets = searchTerm && buckets
    ? buckets.filter(bucket => bucket.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : buckets;

  const filteredObjects = searchTerm && objects
    ? objects.filter(obj => obj.key.toLowerCase().includes(searchTerm.toLowerCase()))
    : objects;

  const renderContent = () => {
    if (isLoadingBuckets || isLoading) return <PageLoader />;

    if (selectedBucket) {
      return (
        <ObjectList
          bucketName={selectedBucket}
          objects={searchTerm ? filteredObjects : objects}
          isLoading={isLoadingObjects}
          onBack={() => setSelectedBucket(null)}
          onObjectUpload={handleUploadObject}
          onObjectDelete={handleDeleteObject}
          onFolderCreate={handleCreateFolder}
        />
      );
    }

    if (activeMenuItem === "dashboard") {
      return (
        <Dashboard
          bucketsDetails={bucketsDetails}
          totalObjects={totalObjects}
          totalSizeGB={totalSizeGB}
          totalSizeTB={totalSizeTB}
          onSelectBucket={handleSelectBucket}
        />
      );
    }

    if (activeMenuItem === "help") {
      return <Support />;
    }

    return (
      <BucketList
        buckets={filteredBuckets}
        isLoading={isLoadingBuckets}
        onBucketSelect={handleSelectBucket}
        onBucketCreate={handleCreateBucket}
        onBucketDelete={handleDeleteBucket}
      />
    );
  };

  return (
    <MainLayout
      buckets={buckets}
      selectedBucket={selectedBucket}
      onSelectBucket={handleSelectBucket}
      storageUsed={totalSizeGB} // Ajustado para passar o total de armazenamento usado
      storageTotal={totalSizeGB} // Ajustado para passar o total de armazenamento disponível
      onMenuItemClick={handleMenuItemClick}
      activeMenuItem={activeMenuItem}
      onSearch={handleSearch}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default AppDashboard;

import React from 'react';

interface ExportRunInPostmanButtonProps {
  collectionId: string;
  workspaceId: string | null;
}

export const ExportRunInPostmanButton: React.FC<ExportRunInPostmanButtonProps> = ({
  collectionId,
  workspaceId,
}) => {
  if (!workspaceId) return null;

  const dataUrl = `entityId=${collectionId}&entityType=collection&workspaceId=${workspaceId}`;

  return (
    <div className='flex justify-end'>
      <div
        className='postman-run-button'
        data-postman-action='collection/fork'
        data-postman-visibility='public'
        data-postman-var-1={collectionId}
        data-postman-collection-url={dataUrl}
      />
    </div>
  );
};



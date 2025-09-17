'use client';

import { useEffect } from 'react';

interface RunInPostmanButtonProps {
  collectionId: string;
  workspaceId: string | null;
}

const postmanIdRegex = /^[0-9a-f\-]+$/i;
const postmanUidRegex = /^\d+-[0-9a-f\-]+$/i;
export { postmanIdRegex };

export function parsePostmanUid(
  uid: string
): { userId: string; collectionId: string } | null {
  if (postmanUidRegex.test(uid)) {
    const hyphenIndex = uid.indexOf('-');
    const userId = uid.substring(0, hyphenIndex);
    const collectionId = uid.substring(hyphenIndex + 1);
    return { userId, collectionId };
  }
  if (postmanIdRegex.test(uid)) {
    return { userId: '', collectionId: uid };
  }
  return null;
}

export function RunInPostmanButton({
  collectionId: collectionUid,
  workspaceId,
}: RunInPostmanButtonProps) {
  useEffect(() => {
    const scriptId = 'postman-run-button-script';
    if (document.getElementById(scriptId)) {
      // @ts-expect-error
      window._pm?.PostmanRunObject?.init();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://run.pstmn.io/button.js';
    script.async = true;
    script.onload = () => {
      // @ts-expect-error
      window._pm?.PostmanRunObject?.init();
    };
    document.head.appendChild(script);
  }, [collectionUid, workspaceId]);

  const parsed = parsePostmanUid(collectionUid);

  if (!parsed || !parsed.userId || !workspaceId) {
    return null;
  }

  const dataUrl = `entityId=${collectionUid}&entityType=collection&workspaceId=${workspaceId}`;

  return (
    <div className='flex justify-end'>
      <div
        className='postman-run-button'
        data-postman-action='collection/fork'
        data-postman-visibility='public'
        data-postman-var-1={collectionUid}
        data-postman-collection-url={dataUrl}
      />
    </div>
  );
}

'use client';

import { useEffect } from 'react';

interface RunInPostmanButtonProps {
  collectionId: string;
  workspaceId?: string | null;
}

const postmanIdRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function isValidPostmanId(id: string): boolean {
  return postmanIdRegex.test(id);
}

export function RunInPostmanButton({
  collectionId,
  workspaceId,
}: RunInPostmanButtonProps) {
  useEffect(() => {
    (function (p, o, s, t, m, a, n) {
      !p[s] &&
        (p[s] = function () {
          (p[t] || (p[t] = [])).push(arguments);
        });
      !o.getElementById(s + t) &&
        o
          .getElementsByTagName('head')[0]
          .appendChild(
            ((n = o.createElement('script')),
            (n.id = s + t),
            (n.async = 1),
            (n.src = m),
            n)
          );
    })(
      window,
      document,
      '_pm',
      'PostmanRunObject',
      'https://run.pstmn.io/button.js'
    );
  }, []);

  if (!isValidPostmanId(collectionId)) return null;

  let dataUrl = `entityId=${collectionId}&entityType=collection`;
  if (workspaceId && isValidPostmanId(workspaceId)) {
    dataUrl += `&workspaceId=${workspaceId}`;
  }

  return (
    <div className='flex justify-end mb-6'>
      <div
        className='postman-run-button'
        data-postman-action='collection/fork'
        data-postman-visibility='public'
        data-postman-var-1={collectionId}
        data-postman-collection-url={dataUrl}
      />
    </div>
  );
}

'use client';

import SaveConfig from './SaveConfig';
import ShareButton from './ShareButton';

/**
 * Gộp "💾 Lưu cấu hình" + "🔗 Chia sẻ bảng tính này" thành một khối,
 * dùng chung một cặp getInputs / onRestore của calculator.
 *
 * SaveConfig xử lý ?config=<id> (IndexedDB, chỉ máy này).
 * ShareButton xử lý ?data=<encoded> (nằm trong URL, chia sẻ được).
 */
export default function SaveShareBar({ tool, lang = 'en', getInputs, onRestore, summarise, suggestName }) {
  return (
    <div className="save-share-bar">
      <SaveConfig
        tool={tool}
        lang={lang}
        getInputs={getInputs}
        onRestore={onRestore}
        summarise={summarise}
        suggestName={suggestName}
      />
      <ShareButton tool={tool} lang={lang} getState={getInputs} onRestore={onRestore} />
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';

/**
 * Vùng kéo-thả + chọn nhiều file.
 * @param {{
 *   accept?: string, multiple?: boolean, disabled?: boolean,
 *   label: string, hint?: string,
 *   onFiles: (files: File[]) => void
 * }} props
 */
export default function DropZone({ accept, multiple = true, disabled = false, label, hint, onFiles }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  const emit = (list) => {
    const files = Array.from(list || []).filter((f) => f && f.size >= 0);
    if (files.length) onFiles(files);
  };

  return (
    <div
      className={`dropzone${over ? ' over' : ''}${disabled ? ' disabled' : ''}`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current && inputRef.current.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          inputRef.current && inputRef.current.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!disabled) emit(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          emit(e.target.files);
          e.target.value = '';
        }}
      />
      <span className="dropzone-label">⬆ {label}</span>
      {hint && <span className="dropzone-hint">{hint}</span>}
    </div>
  );
}

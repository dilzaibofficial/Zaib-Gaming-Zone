'use client';

import { useRef, useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { FiUpload, FiX, FiImage, FiCheck } from 'react-icons/fi';

interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

interface Props {
  onUpload: (result: UploadResult) => void;
  folder?: string;
  label?: string;
  currentUrl?: string;
  onRemove?: () => void;
  accept?: string;
  aspectHint?: string;
}

export default function CloudinaryUpload({
  onUpload,
  folder = 'zaib-gaming',
  label = 'Upload Image',
  currentUrl,
  onRemove,
  accept = 'image/*',
  aspectHint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB.');
      return;
    }

    setUploading(true);
    setError('');
    setDone(false);

    // Simulate progress while uploading
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 85));
    }, 200);

    try {
      const result = await uploadToCloudinary(file, folder);
      clearInterval(interval);
      setProgress(100);
      setDone(true);
      onUpload(result);
      setTimeout(() => { setProgress(0); setDone(false); }, 2000);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Upload failed');
      setProgress(0);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Current image preview */}
      {currentUrl && (
        <div className="relative rounded-xl overflow-hidden border border-dark-border group w-full h-36">
          <img
            src={currentUrl}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity btn-neon text-xs px-3 py-1.5"
            >
              Change
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload button */}
      {!currentUrl && (
        <div
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-all ${
            uploading
              ? 'border-neon-green/50 bg-neon-green/5'
              : 'border-dark-border hover:border-neon-green/40 hover:bg-neon-green/5'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            {done ? (
              <>
                <FiCheck size={24} className="text-neon-green" />
                <span className="text-neon-green text-xs font-gaming">Uploaded!</span>
              </>
            ) : uploading ? (
              <>
                <FiUpload size={22} className="text-neon-green animate-bounce" />
                <span className="text-neon-green text-xs font-gaming">{progress}% uploading...</span>
              </>
            ) : (
              <>
                <FiImage size={22} className="text-gray-400" />
                <span className="text-gray-300 text-sm font-semibold">{label}</span>
                {aspectHint && (
                  <span className="text-gray-500 text-xs">{aspectHint}</span>
                )}
                <span className="text-gray-500 text-xs">Click to select • JPG, PNG, WebP • max 10MB</span>
              </>
            )}
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="mt-3 w-full bg-dark-surface rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-neon-green transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Change button when image exists */}
      {currentUrl && !uploading && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-neon-green flex items-center gap-1">
            <FiCheck size={11} /> Image uploaded
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <FiX size={11} /> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}


// ─── Multi-image upload (for gallery) ────────────────────────────────────────

interface MultiProps {
  onUpload: (results: UploadResult[]) => void;
  folder?: string;
  label?: string;
}

export function CloudinaryMultiUpload({ onUpload, folder = 'zaib-gaming/gallery', label = 'Upload Photos' }: MultiProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError('');
    setTotal(files.length);
    setDone(0);

    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadToCloudinary(files[i], folder);
        results.push(result);
        setDone(i + 1);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      } catch (err: any) {
        setError(`Failed: ${files[i].name}`);
      }
    }

    if (results.length > 0) onUpload(results);
    setUploading(false);
    setProgress(0);
    setDone(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-dark-border rounded-xl p-8 text-center hover:border-neon-green/40 hover:bg-neon-green/5 transition-all"
      >
        <FiUpload size={32} className={`mx-auto mb-3 ${uploading ? 'text-neon-green animate-bounce' : 'text-gray-400'}`} />
        {uploading ? (
          <div>
            <div className="text-neon-green font-gaming text-sm mb-2">
              Uploading {done}/{total}...
            </div>
            <div className="w-full bg-dark-surface rounded-full h-2 max-w-xs mx-auto">
              <div className="h-2 rounded-full bg-neon-green transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-white font-semibold text-sm">{label}</div>
            <div className="text-gray-400 text-xs mt-1">Select multiple photos at once</div>
            <div className="text-gray-500 text-xs mt-0.5">Saved to Cloudinary • HD quality preserved</div>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}

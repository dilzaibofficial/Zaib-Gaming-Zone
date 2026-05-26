'use client';

import { useEffect, useState } from 'react';
import { getGalleryImages, updateGallery } from '@/lib/firestore';
import { CloudinaryMultiUpload } from '@/components/CloudinaryUpload';
import toast from 'react-hot-toast';
import { FiTrash2, FiImage, FiMove, FiExternalLink } from 'react-icons/fi';

export default function GalleryPage() {
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    getGalleryImages().then(setImages);
  }, []);

  const handleUploaded = async (results: { url: string; publicId: string }[]) => {
    const newUrls = results.map((r) => r.url);
    const updated = [...images, ...newUrls];
    setSaving(true);
    try {
      await updateGallery(updated);
      setImages(updated);
      toast.success(`${results.length} photo(s) added to gallery!`);
    } catch {
      toast.error('Failed to save gallery');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm('Remove this photo from the gallery?')) return;
    const updated = images.filter((i) => i !== url);
    try {
      await updateGallery(updated);
      setImages(updated);
      toast.success('Photo removed.');
    } catch {
      toast.error('Failed to remove photo.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-gaming font-bold text-2xl text-white">GALLERY MANAGER</h1>
          <p className="text-gray-400 text-xs mt-1">
            Photos appear on the About page. Stored on Cloudinary — HD quality preserved.
          </p>
        </div>
        <div className="text-gray-400 text-sm font-gaming">{images.length} photos</div>
      </div>

      {/* Cloudinary hint */}
      <div className="p-3 rounded-xl bg-neon-green/5 border border-neon-green/20 text-xs text-gray-400 leading-relaxed">
        <span className="text-neon-green font-gaming">☁️ CLOUDINARY</span> — All images are uploaded directly to Cloudinary and served with automatic optimization and CDN.
        Make sure <code className="bg-black/30 px-1 rounded text-neon-green">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> is set in .env.local before uploading.
      </div>

      {/* Upload Zone */}
      <CloudinaryMultiUpload
        onUpload={handleUploaded}
        folder="zaib-gaming/gallery"
        label="Upload Shop Photos (HD Quality)"
      />

      {saving && (
        <div className="text-center text-neon-green font-gaming text-sm animate-pulse">
          Saving to Firestore...
        </div>
      )}

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-16 gaming-card rounded-2xl">
          <FiImage size={50} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-gaming">No photos yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Upload HD photos of your gaming zone — they'll appear on the About page as cards.
          </p>
        </div>
      ) : (
        <>
          <div className="text-xs text-gray-500 font-gaming uppercase tracking-widest">
            {images.length} Photos · Displayed on About Page
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div
                key={img}
                className="relative group aspect-square rounded-xl overflow-hidden border border-dark-border hover:border-neon-green/50 transition-all"
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedImg(img)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40"
                    title="View full size"
                  >
                    <FiExternalLink size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500"
                    title="Remove from gallery"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
                {/* Index badge */}
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-xs text-gray-300 font-gaming">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lightbox */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh]">
            <img
              src={selectedImg}
              alt="Full preview"
              className="rounded-2xl object-contain max-w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
            >
              ✕
            </button>
            <a
              href={selectedImg}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-neon-green hover:underline font-gaming flex items-center gap-1"
            >
              <FiExternalLink size={11} /> Open Cloudinary URL
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { compressImageFile } from '../utils/imageUtils';
import { FolderOpen, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const ImageUploader = ({
  value,
  onChange,
  label = 'Select Image',
  recommendedText = 'Recommended: Landscape or Square (JPEG, PNG, WebP)',
}) => {
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('file'); // 'file' or 'url'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [fileMeta, setFileMeta] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = '';
  };

  const processFile = async (file) => {
    setError('');
    setIsProcessing(true);
    try {
      const result = await compressImageFile(file, 1280, 1280, 0.85);
      setFileMeta({
        name: result.originalName,
        dimensions: `${result.width} × ${result.height}`,
        sizeKb: result.approxSizeKb,
      });
      onChange(result.dataUrl);
    } catch (err) {
      setError(err.message || 'Failed to process image file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClearImage = () => {
    onChange('');
    setFileMeta(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <label className="form-label" style={{ margin: 0 }}>{label} *</label>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${mode === 'file' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
            onClick={() => setMode('file')}
          >
            <FolderOpen size={13} /> Select from Device
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
            onClick={() => setMode('url')}
          >
            🔗 Image URL
          </button>
        </div>
      </div>

      {mode === 'file' ? (
        <div>
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {value ? (
            /* Selected Image Preview Box */
            <div
              style={{
                background: 'var(--bg-charcoal)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '5.5rem',
                  height: '4.5rem',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#000',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={value}
                  alt="Upload preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <CheckCircle2 size={14} /> Image Ready
                </div>
                <div
                  style={{
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {fileMeta?.name || 'Selected from device / presets'}
                </div>
                {fileMeta && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                    {fileMeta.dimensions} • ~{fileMeta.sizeKb} KB (Optimized)
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Choose a different image from device"
                >
                  <FolderOpen size={13} /> Change
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.35rem 0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  onClick={handleClearImage}
                  title="Remove image"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragging
                  ? '2px dashed var(--red-primary)'
                  : '2px dashed var(--border-hover)',
                background: isDragging ? 'var(--red-subtle)' : 'var(--bg-input)',
                borderRadius: 'var(--radius-sm)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {isProcessing ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  ⏳ Compressing & optimizing photo...
                </div>
              ) : (
                <>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--red-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem auto',
                    }}
                  >
                    <FolderOpen size={24} />
                  </div>
                  <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Click to choose photo from your device
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    or drag and drop image here
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    {recommendedText}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Direct URL Input Mode */
        <div>
          <input
            type="text"
            required={!value}
            placeholder="e.g. /images/hero_gym.jpg or https://..."
            className="form-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Tip: You can use local presets like <code>/images/gym_interior.jpg</code>, <code>/images/hero_gym.jpg</code>, or an external URL.
          </div>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
};

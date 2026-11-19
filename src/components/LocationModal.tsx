import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  currentPostalCode: string;
  onClose: () => void;
  onApplyPostalCode: (code: string) => void;
}

const PRESET_SINGAPORE_CODES = [
  { code: '018956', area: 'Marina Bay' },
  { code: '238801', area: 'Orchard Road' },
  { code: '529510', area: 'Tampines' },
  { code: '609601', area: 'Jurong East' },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  currentPostalCode,
  onClose,
  onApplyPostalCode,
}) => {
  const [draft, setDraft] = useState(currentPostalCode);
  const [error, setError] = useState('');

  useEffect(() => {
    setDraft(currentPostalCode);
    setError('');
  }, [currentPostalCode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setError('Please enter a valid 6-digit Singapore postal code.');
      return;
    }
    onApplyPostalCode(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] max-w-[380px] w-full shadow-2xl border border-[#D5D9D9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 bg-[#F0F2F2] border-b border-[#D5D9D9] flex items-center justify-between">
          <h2 id="location-modal-title" className="text-[15px] font-bold text-[#0F1111]">
            Choose your location
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location modal"
            className="p-1 rounded hover:bg-[#E3E6E6] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-[13px] text-[#0F1111]">
          <p className="text-[#565959]">
            Delivery options and delivery speeds may vary for different Singapore districts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <label htmlFor="sg-postal-input" className="block font-semibold">
              Enter a Singapore postal code
            </label>
            <div className="flex gap-2">
              <input
                id="sg-postal-input"
                type="text"
                maxLength={6}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setError('');
                }}
                placeholder="e.g. 018956"
                className="flex-1 px-3 py-1.5 border border-[#888C8C] rounded-[4px] tabular-nums focus:outline-none focus:border-[#007185]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-[7px] text-[13px] shadow-xs cursor-pointer"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-[12px] text-[#B12704]">{error}</p>}
          </form>

          <div className="pt-2 border-t border-[#E7E7E7]">
            <div className="text-[12px] text-[#565959] mb-2">Quick presets:</div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_SINGAPORE_CODES.map((preset) => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => {
                    onApplyPostalCode(preset.code);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[#D5D9D9] rounded-[4px] hover:bg-[#F7FAFA] text-left cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#565959] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-[12px] tabular-nums">{preset.code}</div>
                    <div className="text-[11px] text-[#565959] truncate">{preset.area}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { CheckCircle2, X, MapPin } from 'lucide-react';
import { Product } from '../data/products';
import { PrimeBadge } from './AmazonMarks';

export interface OneClickOrder {
  orderId: string;
  product: Product;
  variantName: string;
  quantity: number;
  unitPriceSGD: number;
  voucherApplied: boolean;
}

interface OneClickModalProps {
  order: OneClickOrder | null;
  postalCode: string;
  onClose: () => void;
  onCancelOrder: () => void;
}

export const OneClickModal: React.FC<OneClickModalProps> = ({
  order,
  postalCode,
  onClose,
  onCancelOrder,
}) => {
  useEffect(() => {
    if (!order) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [order, onClose]);

  if (!order) return null;

  const variantObj =
    order.product.variants.find((v) => v.name === order.variantName) ||
    order.product.variants[0];
  const totalSGD = order.unitPriceSGD * order.quantity;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="one-click-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] max-w-[460px] w-full shadow-2xl border border-[#D5D9D9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 bg-[#F0F2F2] border-b border-[#D5D9D9] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#007600]">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <h2 id="one-click-title" className="text-[15px] font-bold text-[#0F1111]">
              1-Click Order Placed
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close 1-Click confirmation"
            className="p-1 rounded hover:bg-[#E3E6E6] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-[13px] text-[#0F1111]">
          <div className="flex gap-3.5 items-start">
            <div className="w-20 h-20 bg-[#F7F7F7] rounded-[4px] border border-[#EEE] p-1.5 flex items-center justify-center shrink-0">
              <img
                src={variantObj.image}
                alt={order.product.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug line-clamp-2">{order.product.title}</p>
              <p className="text-[12px] text-[#565959] mt-1">
                Colour: <span className="text-[#0F1111]">{order.variantName}</span> · Qty:{' '}
                <span className="text-[#0F1111] tabular-nums">{order.quantity}</span>
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[16px] font-bold text-[#B12704] tabular-nums">
                  S${totalSGD.toFixed(2)}
                </span>
                {order.product.isPrime && <PrimeBadge compact />}
              </div>
            </div>
          </div>

          <div className="bg-[#F7F8F8] border border-[#E7E7E7] rounded-[6px] p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#565959]">Order Number</span>
              <span className="font-mono-tabular font-medium">{order.orderId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px]">
              <MapPin className="w-3.5 h-3.5 text-[#565959] shrink-0" />
              <span>
                Shipping to <strong>Singapore {postalCode}</strong>
              </span>
            </div>
            <p className="text-[12px] text-[#007600] font-semibold">
              Guaranteed delivery: {order.product.deliveryDateText}
            </p>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full text-[13px] font-medium text-[#0F1111] cursor-pointer"
            >
              Continue shopping
            </button>
            <button
              type="button"
              onClick={onCancelOrder}
              className="px-4 py-2 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-full text-[13px] font-medium text-[#0F1111] cursor-pointer"
            >
              Cancel order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

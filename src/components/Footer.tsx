import React from 'react';
import { Globe } from 'lucide-react';
import { AmazonLogo } from './AmazonMarks';

interface FooterProps {
  onBackToTop: () => void;
  onQuickSearch: (query: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onBackToTop, onQuickSearch }) => {
  return (
    <footer className="mt-12 text-white">
      {/* Back to top */}
      <button
        type="button"
        onClick={onBackToTop}
        className="w-full py-3.5 bg-[#37475A] hover:bg-[#485769] text-[13px] font-medium text-center transition-colors cursor-pointer"
      >
        Back to top
      </button>

      {/* Columns */}
      <div className="bg-[#232F3E] py-10 px-4">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
          <div>
            <h4 className="font-bold text-[14px] mb-2.5">Get to Know Us</h4>
            <ul className="space-y-1.5 text-[#DDDDDD]">
              <li>
                <button
                  type="button"
                  onClick={onBackToTop}
                  className="hover:underline text-left cursor-pointer"
                >
                  About Amazon Singapore
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('iphone duo case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Amazon Science
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('iphone duo case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Sustainability
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[14px] mb-2.5">Make Money with Us</h4>
            <ul className="space-y-1.5 text-[#DDDDDD]">
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('spigen iphone duo')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Sell on Amazon.sg
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('iphone duo case magsafe')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Fulfilment by Amazon
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onQuickSearch('iphone duo clear case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Advertise Your Products
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[14px] mb-2.5">Amazon Payment Methods</h4>
            <ul className="space-y-1.5 text-[#DDDDDD]">
              <li>Singapore Dollar (SGD)</li>
              <li>Visa / Mastercard / Amex</li>
              <li>PayNow &amp; GrabPay</li>
              <li>Amazon.sg Gift Cards</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[14px] mb-2.5">Let Us Help You</h4>
            <ul className="space-y-1.5 text-[#DDDDDD]">
              <li>Prime SG Delivery Rates</li>
              <li>Returns &amp; Replacements</li>
              <li>Manage Your Content &amp; Devices</li>
              <li>Customer Service</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Locale Strip */}
      <div className="bg-[#232F3E] border-t border-[#3A4553] py-6 px-4">
        <div className="max-w-[1000px] mx-auto flex flex-wrap items-center justify-center gap-6">
          <AmazonLogo />
          <div className="flex items-center gap-2 text-[12px] text-[#CCCCCC]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#848688] rounded-[3px]">
              <Globe className="w-3.5 h-3.5" />
              English
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#848688] rounded-[3px]">
              SGD - Singapore Dollar
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#848688] rounded-[3px]">
              Singapore
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="bg-[#131A22] py-5 px-4 text-center text-[11px] text-[#CCCCCC]">
        <p>Conditions of Use &amp; Sale &nbsp;·&nbsp; Privacy Notice &nbsp;·&nbsp; Singapore Marketplace</p>
        <p className="mt-1 text-[#999999]">
          &copy; 2026 Amazon.sg UI Replica Showcase
        </p>
      </div>
    </footer>
  );
};

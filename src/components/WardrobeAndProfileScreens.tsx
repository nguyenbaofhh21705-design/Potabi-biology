import React, { useState } from 'react';
import { IMAGES, NOTEBOOK_ENTRIES, OUTFITS } from '../data/biologyData';

interface WardrobeScreenProps {
  diamonds: number;
  equippedOutfitId: string;
  onEquipOutfit: (id: string) => void;
  onBuyOutfit: (id: string, price: number) => void;
}

export const WardrobeScreen: React.FC<WardrobeScreenProps> = ({
  diamonds,
  equippedOutfitId,
  onEquipOutfit,
  onBuyOutfit,
}) => {
  const [ownedIds, setOwnedIds] = useState<string[]>(
    OUTFITS.filter((o) => o.owned).map((o) => o.id)
  );

  const selectedOutfit = OUTFITS.find((o) => o.id === equippedOutfitId) || OUTFITS[0];

  const handleAction = (outfit: (typeof OUTFITS)[0]) => {
    const isOwned = ownedIds.includes(outfit.id);
    if (isOwned) {
      onEquipOutfit(outfit.id);
    } else if (diamonds >= outfit.priceDiamonds) {
      setOwnedIds((prev) => [...prev, outfit.id]);
      onBuyOutfit(outfit.id, outfit.priceDiamonds);
      onEquipOutfit(outfit.id);
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
      <div className="bg-surface-container-low p-space-lg rounded-[2rem] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-[0_4px_0_#4a2433]">
            <span className="material-symbols-outlined text-3xl">apparel</span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm uppercase text-primary font-bold">
              Tủ Đồ Sinh Học • Trang Bị Thám Hiểm
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Trang Phục &amp; Bảo Hộ Của Potabi
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-full shadow-sm">
          <span className="material-symbols-outlined text-tertiary">diamond</span>
          <span className="font-label-lg text-label-lg text-tertiary font-bold">
            {diamonds} Kim cương hiện có
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left: Potabi Character Showcase */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-[2.5rem] p-space-lg shadow-md flex flex-col items-center text-center gap-space-md border-2 border-surface-container-highest">
          <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
            Đang Trang Bị: {selectedOutfit.name}
          </span>
          <div className="relative w-52 h-52 rounded-full bg-gradient-to-b from-surface-container-high to-secondary-fixed flex items-center justify-center p-6 shadow-inner">
            <img
              alt="Potabi Character Preview"
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
              src={IMAGES.potabiAvatar}
            />
            <div
              className="absolute -bottom-2 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: selectedOutfit.accentColor }}
            >
              <span className="material-symbols-outlined text-2xl">
                {selectedOutfit.badgeIcon}
              </span>
            </div>
          </div>
          <div className="bg-surface-container-low p-space-md rounded-2xl w-full flex flex-col gap-1">
            <span className="font-label-md text-label-md text-primary">
              Hiệu ứng Sinh học: {selectedOutfit.roleBonus}
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {selectedOutfit.description}
            </p>
          </div>
        </div>

        {/* Right: Outfit Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          {OUTFITS.map((outfit) => {
            const isOwned = ownedIds.includes(outfit.id);
            const isEquipped = equippedOutfitId === outfit.id;
            return (
              <div
                key={outfit.id}
                className={`rounded-[2rem] p-space-lg flex flex-col justify-between gap-space-md transition-all border-2 ${
                  isEquipped
                    ? 'bg-surface-container-lowest border-primary shadow-md'
                    : 'bg-surface-container-low border-transparent hover:border-outline-variant'
                }`}
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: outfit.accentColor }}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {outfit.badgeIcon}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                      {outfit.rarity}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    {outfit.name}
                  </h3>
                  <p className="font-label-sm text-label-sm text-primary font-bold">
                    {outfit.roleBonus}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {outfit.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAction(outfit)}
                  className={`w-full py-2.5 px-space-md rounded-full font-label-md text-label-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isEquipped
                      ? 'bg-secondary-container text-on-secondary-container'
                      : isOwned
                      ? 'bg-primary text-on-primary shadow-[0_4px_0_#4a2433]'
                      : 'bg-tertiary-fixed text-on-tertiary-fixed shadow-[0_4px_0_#9a6c00]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isEquipped ? 'check_circle' : isOwned ? 'checkroom' : 'diamond'}
                  </span>
                  <span>
                    {isEquipped
                      ? 'Đang mặc'
                      : isOwned
                      ? 'Mặc trang phục'
                      : `Đổi ${outfit.priceDiamonds} Kim cương`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ProfileScreenProps {
  exp: number;
  diamonds: number;
  onOpenNotebook: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  exp,
  diamonds,
  onOpenNotebook,
}) => {
  return (
    <div className="w-full max-w-[1536px] mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
      <div className="bg-surface-container-low p-space-lg rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg">
        <div className="flex flex-col sm:flex-row items-center gap-space-md text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-primary-fixed p-1.5 border-4 border-primary shadow-md">
            <img
              alt="Student Avatar"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              src={IMAGES.potabiAvatar}
            />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                Cấp độ 12
              </span>
              <span className="px-3 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                Học viện Sinh học 2D
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
              Nhà Thám Hiểm Vi Mô
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Chuyên ngành yêu thích: Sinh lý học Cơ thể người &amp; Tế bào học
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-space-sm w-full md:w-auto">
          <div className="bg-surface-container-lowest p-space-md rounded-2xl text-center shadow-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Tổng EXP</span>
            <p className="font-headline-md text-headline-md text-primary">{exp}</p>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-2xl text-center shadow-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Kim Cương</span>
            <p className="font-headline-md text-headline-md text-tertiary">{diamonds}</p>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-2xl text-center shadow-sm">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Tiêu Bản</span>
            <p className="font-headline-md text-headline-md text-on-surface">18/45</p>
          </div>
        </div>
      </div>

      {/* Unlocked Biology Notebook Entries */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Sổ Tay Tiêu Bản Sinh Học Đã Thu Thập
          </h2>
          <button
            onClick={onOpenNotebook}
            className="px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
          >
            Mở Chế Độ Kính Hiển Vi
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {NOTEBOOK_ENTRIES.map((entry) => (
            <div
              key={entry.id}
              className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm border-2 border-surface-container-high flex flex-col justify-between gap-space-sm"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  {entry.category}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary mt-2">
                  {entry.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface mt-1">{entry.summary}</p>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-2xl">
                {entry.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface LabModalsProps {
  activeTool: 'microscope' | 'stain' | 'notebook' | null;
  onClose: () => void;
}

export const LabToolModal: React.FC<LabModalsProps> = ({ activeTool, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(40);
  const [stainType, setStainType] = useState<'none' | 'iodine' | 'methylene'>('iodine');

  if (!activeTool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/75 backdrop-blur-md p-space-md">
      <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-space-lg shadow-2xl border-4 border-primary flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined">
                {activeTool === 'microscope'
                  ? 'zoom_in'
                  : activeTool === 'stain'
                  ? 'colorize'
                  : 'menu_book'}
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              {activeTool === 'microscope' && 'Kính Hiển Vi Quang Học: Soi Màng Tế Bào Vảy Hành'}
              {activeTool === 'stain' && 'Phòng Thí Nghiệm Nhuộm Mẫu Tiêu Bản'}
              {activeTool === 'notebook' && 'Sổ Tay Sinh Học Của Nhà Thám Hiểm'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {(activeTool === 'microscope' || activeTool === 'stain') && (
          <div className="flex flex-col gap-space-md">
            <div
              className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-inverse-surface flex items-center justify-center shadow-inner transition-all"
              style={{
                backgroundImage: `url('${IMAGES.heartThumbnail}')`,
                backgroundSize: `${zoomLevel + 60}%`,
                backgroundPosition: 'center',
                filter:
                  stainType === 'iodine'
                    ? 'sepia(0.55) saturate(1.6) hue-rotate(-10deg)'
                    : stainType === 'methylene'
                    ? 'hue-rotate(190deg) saturate(1.4)'
                    : 'none',
              }}
            >
              <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/70 pointer-events-none"></div>
              <div className="absolute top-3 left-3 bg-inverse-surface/85 text-inverse-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm">
                Độ phóng đại: {zoomLevel}x • Thuốc nhuộm:{' '}
                {stainType === 'iodine'
                  ? 'Dung dịch Iốt (Lugol)'
                  : stainType === 'methylene'
                  ? 'Xanh Methylene'
                  : 'Chưa nhuộm'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-2">
                <span className="font-label-md text-label-md text-on-surface">
                  Chọn vật kính phóng đại:
                </span>
                <div className="flex gap-2">
                  {[10, 40, 100].map((z) => (
                    <button
                      key={z}
                      onClick={() => setZoomLevel(z)}
                      className={`flex-1 py-1.5 rounded-full font-label-md text-label-md cursor-pointer ${
                        zoomLevel === z
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-2">
                <span className="font-label-md text-label-md text-on-surface">
                  Nhỏ thuốc nhuộm tiêu bản:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStainType('iodine')}
                    className={`flex-1 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer ${
                      stainType === 'iodine'
                        ? 'bg-tertiary text-on-tertiary'
                        : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    Iốt (Lugol)
                  </button>
                  <button
                    onClick={() => setStainType('methylene')}
                    className={`flex-1 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer ${
                      stainType === 'methylene'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface'
                    }`}
                  >
                    Xanh Methylen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'notebook' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm max-h-96 overflow-y-auto">
            {NOTEBOOK_ENTRIES.map((entry) => (
              <div
                key={entry.id}
                className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-1 border border-outline-variant/40"
              >
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  {entry.category}
                </span>
                <h4 className="font-label-lg text-label-lg text-on-surface">{entry.title}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{entry.detail}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-space-lg py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
          >
            Hoàn tất quan sát
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WORLD ASSET SHOWCASE & VISUAL DESIGN EXPLORER
 * Live tactile preview of visual designs & reusable game assets for Worlds 6, 7, and 8.
 */

import React, { useState } from 'react';
import {
  exportAssetCatalogJson,
  getAssetsByWorld,
  NEW_WORLDS_ASSETS,
} from '../data/newWorldsAssetCatalog';
import {
  BowmanBouncyPlatform,
  ExcretoryBackgroundDistant,
  ExcretoryBackgroundMid,
  ExcretoryBackgroundNear,
  ExcretoryConceptCard,
  FilteredGlucoseCollectible,
  FluidCurrentSpeedPlatform,
  GlomerulusTuftDeco,
  NephronGuideCellNpc,
  PodocyteCellDeco,
  RenalTubulePlatform,
  UreaSurgeHazard,
  WaterDropletCollectible,
} from './worlds/World6ExcretoryAssets';
import {
  EndocrineBackgroundDistant,
  EndocrineBackgroundMid,
  EndocrineBackgroundNear,
  EndocrineConceptCard,
  EndocrineGuideCellNpc,
  GlandularTissuePlatform,
  HormoneSignalSpeedPlatform,
  HormoneSurgeHazard,
  InsulinHormoneCollectible,
  PancreaticIsletBouncyPlatform,
  TargetReceptorDeco,
  ThyroxineHormoneCollectible,
} from './worlds/World7EndocrineAssets';
import {
  ChromosomeHaploidCollectible,
  CiliatedOviductPlatform,
  FertilizationConceptCard,
  GameteConduitSpeedPlatform,
  GameteDuoDeco,
  OvumNutrientCollectible,
  ReproductiveBackgroundDistant,
  ReproductiveBackgroundMid,
  ReproductiveBackgroundNear,
  ReproductiveGuideCellNpc,
  ViscousMucusHazard,
  ZonaPellucidaBouncyPlatform,
} from './worlds/World8ReproductiveAssets';

export interface WorldAssetShowcaseProps {
  onPlayStage2D: (stageId: string) => void;
  onBackToMap: () => void;
}

type ActiveTab = 'world-6-excretory' | 'world-7-endocrine' | 'world-8-reproductive' | 'json-metadata';

export const WorldAssetShowcase: React.FC<WorldAssetShowcaseProps> = ({
  onPlayStage2D,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('world-6-excretory');
  const [copiedJson, setCopiedJson] = useState(false);
  const [layerOpacityDistant, setLayerOpacityDistant] = useState(0.8);
  const [layerOpacityMid, setLayerOpacityMid] = useState(0.9);
  const [layerOpacityNear, setLayerOpacityNear] = useState(0.85);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportAssetCatalogJson());
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="w-full min-h-screen bg-surface px-3 sm:px-6 md:px-margin py-6 select-none flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
              Asset Studio &amp; Visual Design
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm">
              Bio Blossom Tactile 2D
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
            Kho Tài Nguyên &amp; Thiết Kế Thị Giác 3 Thế Giới Mới
          </h1>
          <p className="text-body-sm text-on-surface-variant max-w-2xl mt-0.5">
            Khám phá thiết kế thị giác, nền cuộn parallax đa lớp, các bục 2D tái sử dụng, vật phẩm thu thập,
            vật cản và sơ đồ học tập Sinh học 8 cho Màn 6, Màn 7 và Màn 8.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">map</span>
            <span>Về Bản Đồ</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-surface-container-low rounded-2xl border border-surface-container-high">
        <button
          onClick={() => setActiveTab('world-6-excretory')}
          className={`px-4 py-2.5 rounded-xl font-label-md text-label-md font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'world-6-excretory'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-lg">water_drop</span>
          <span>World 6: Hệ Bài Tiết (Excretory)</span>
        </button>

        <button
          onClick={() => setActiveTab('world-7-endocrine')}
          className={`px-4 py-2.5 rounded-xl font-label-md text-label-md font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'world-7-endocrine'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-lg">alt_route</span>
          <span>World 7: Hệ Nội Tiết (Endocrine)</span>
        </button>

        <button
          onClick={() => setActiveTab('world-8-reproductive')}
          className={`px-4 py-2.5 rounded-xl font-label-md text-label-md font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'world-8-reproductive'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-lg">spa</span>
          <span>World 8: Hệ Sinh Dục (Reproductive)</span>
        </button>

        <button
          onClick={() => setActiveTab('json-metadata')}
          className={`px-4 py-2.5 rounded-xl font-label-md text-label-md font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'json-metadata'
              ? 'bg-primary text-white shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-lg">data_object</span>
          <span>JSON Metadata &amp; Export</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: WORLD 6 — EXCRETORY SYSTEM                                    */}
      {/* ==================================================================== */}
      {activeTab === 'world-6-excretory' && (
        <div className="flex flex-col gap-8">
          {/* World Intro & Play Launcher */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-purple-900/10 border-2 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-4xl">water_drop</span>
              </div>
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                  Chương Trình Sinh Học 8 • Bài 38 - 40
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Màn 6: Hệ Bài Tiết — Thận, Cầu Thận &amp; Nang Bowman
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Bảng màu chủ đạo: Soft Lavender, Pale Blue, Turquoise, Pink, Warm Cream
                </p>
              </div>
            </div>

            <button
              onClick={() => onPlayStage2D('bai-tiet')}
              className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transform active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-xl">sports_esports</span>
              <span>Chơi Ngay Màn 6 Trong Game 2D ▶</span>
            </button>
          </div>

          {/* Section 1: Wide Scrolling Background Composite Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                1. Wide Scrolling Parallax Background (Nền Cuộn Đa Tầng 2D)
              </h3>
              <span className="text-xs text-on-surface-variant font-medium">
                1920 × 600 px • 3 Lớp Parallax
              </span>
            </div>

            <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-300 bg-slate-950">
              {/* Layer 1 */}
              <div className="absolute inset-0">
                <ExcretoryBackgroundDistant opacity={layerOpacityDistant} />
              </div>
              {/* Layer 2 */}
              <div className="absolute inset-0">
                <ExcretoryBackgroundMid opacity={layerOpacityMid} />
              </div>
              {/* Layer 3 */}
              <div className="absolute inset-0">
                <ExcretoryBackgroundNear opacity={layerOpacityNear} />
              </div>

              {/* Sample In-Game Composite with Platforms */}
              <div className="absolute left-[8%] bottom-[32%] w-[26%]">
                <RenalTubulePlatform label="Thềm Ống Thận Lọc I" />
              </div>
              <div className="absolute left-[38%] bottom-[46%] w-[22%]">
                <BowmanBouncyPlatform label="Nang Bowman Bật Cao" />
              </div>
              <div className="absolute left-[64%] bottom-[38%] w-[28%]">
                <FluidCurrentSpeedPlatform label="Quai Henle Tăng Tốc" />
              </div>

              {/* Sample Collectibles & NPC */}
              <div className="absolute left-[20%] bottom-[46%]">
                <WaterDropletCollectible />
              </div>
              <div className="absolute left-[48%] bottom-[60%]">
                <FilteredGlucoseCollectible />
              </div>
              <div className="absolute left-[78%] bottom-[52%]">
                <NephronGuideCellNpc />
              </div>

              {/* Bottom Hazard */}
              <div className="absolute bottom-0 left-0 right-0">
                <UreaSurgeHazard />
              </div>
            </div>

            {/* Layer Opacity Sliders */}
            <div className="flex flex-wrap items-center gap-6 p-3 rounded-2xl bg-surface-container-low text-xs">
              <span className="font-bold text-primary">Tùy chỉnh lớp Parallax:</span>
              <label className="flex items-center gap-2">
                <span>Lớp xa (Lobe &amp; Cầu thận):</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={layerOpacityDistant}
                  onChange={(e) => setLayerOpacityDistant(parseFloat(e.target.value))}
                  className="w-24 accent-purple-600"
                />
              </label>
              <label className="flex items-center gap-2">
                <span>Lớp giữa (Ống lượn Henle):</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={layerOpacityMid}
                  onChange={(e) => setLayerOpacityMid(parseFloat(e.target.value))}
                  className="w-24 accent-purple-600"
                />
              </label>
              <label className="flex items-center gap-2">
                <span>Lớp gần (Bụi giọt dịch):</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={layerOpacityNear}
                  onChange={(e) => setLayerOpacityNear(parseFloat(e.target.value))}
                  className="w-24 accent-purple-600"
                />
              </label>
            </div>
          </div>

          {/* Section 2 to 7: Distinct Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 2 & 3. Decorations */}
            <div className="p-4 rounded-3xl bg-surface-container-low border border-purple-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">
                  2 &amp; 3. Trang trí Nền &amp; Cận Cảnh
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Búi Mao Mạch Cầu Thận &amp; Tế Bào Có Chân (Podocyte)
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Minh họa màng siêu lọc với các khe lọc ngăn protein lớn và hồng cầu.
                </p>
              </div>
              <div className="flex items-center justify-around py-4 bg-purple-950/80 rounded-2xl mt-3">
                <GlomerulusTuftDeco size={110} />
                <PodocyteCellDeco size={90} />
              </div>
            </div>

            {/* 4. Reusable Platforms */}
            <div className="p-4 rounded-3xl bg-surface-container-low border border-purple-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">
                  4. Bục 2D Tái Sử Dụng (Solid Hitboxes)
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Thềm Ống Thận, Nang Bowman &amp; Dòng Dịch Lọc
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Định dạng trong suốt, có viền nhận diện rõ rệt, hỗ trợ nhảy cao và gia tốc.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 mt-3">
                <RenalTubulePlatform label="Thềm Biểu Mô Ống Thận" />
                <BowmanBouncyPlatform label="Nang Bowman Bật Cao" />
                <FluidCurrentSpeedPlatform label="Dòng Dịch Lọc Gia Tốc" />
              </div>
            </div>

            {/* 5. Collectibles & NPC */}
            <div className="p-4 rounded-3xl bg-surface-container-low border border-purple-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">
                  5. Vật Phẩm Thu Thập &amp; Trạm NPC
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Giọt Nước H2O, Glucozơ &amp; TS. Nephron
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Vật phẩm tương tác có hiệu ứng nhịp thở và câu đố sinh học.
                </p>
              </div>
              <div className="flex items-center justify-around py-2 bg-purple-950/80 rounded-2xl mt-3">
                <WaterDropletCollectible />
                <FilteredGlucoseCollectible />
                <NephronGuideCellNpc size={62} />
              </div>
            </div>

            {/* 6. Hazard */}
            <div className="p-4 rounded-3xl bg-surface-container-low border border-purple-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">
                  6. Vùng Nguy Hiểm &amp; Chướng Ngại Vật
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Dòng Dịch Thải Ure &amp; Axit Uric Đậm Đặc
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Vực sâu sát thương nếu người chơi rơi khỏi các thềm ống thận.
                </p>
              </div>
              <div className="mt-3">
                <UreaSurgeHazard />
              </div>
            </div>

            {/* 7. Educational Card */}
            <div className="p-4 rounded-3xl bg-surface-container-low border border-purple-200 flex flex-col justify-between md:col-span-2">
              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">
                  7. Yếu Tố Giáo Dục Sinh Học 8 (Educational Concept)
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Sơ Đồ 3 Giai Đoạn Tạo Thành Nước Tiểu
                </h4>
              </div>
              <div className="mt-3">
                <ExcretoryConceptCard />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: WORLD 7 — ENDOCRINE SYSTEM                                    */}
      {/* ==================================================================== */}
      {activeTab === 'world-7-endocrine' && (
        <div className="flex flex-col gap-8">
          {/* World Intro & Play Launcher */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-emerald-900/10 border-2 border-emerald-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-4xl">alt_route</span>
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Chương Trình Sinh Học 8 • Bài 55 - 58
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Màn 7: Hệ Nội Tiết — Tuyến Yên, Tuyến Giáp &amp; Đảo Tụy
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Bảng màu chủ đạo: Pastel Purple, Mint Green, Peach, Soft Yellow, Sky Blue
                </p>
              </div>
            </div>

            <button
              onClick={() => onPlayStage2D('noi-tiet')}
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transform active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-xl">sports_esports</span>
              <span>Chơi Ngay Màn 7 Trong Game 2D ▶</span>
            </button>
          </div>

          {/* Section 1: Wide Scrolling Background Composite Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                1. Wide Scrolling Parallax Background (Nền Cuộn Đa Tầng 2D)
              </h3>
              <span className="text-xs text-on-surface-variant font-medium">
                1920 × 600 px • 3 Lớp Parallax
              </span>
            </div>

            <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-300 bg-slate-950">
              <div className="absolute inset-0">
                <EndocrineBackgroundDistant opacity={layerOpacityDistant} />
              </div>
              <div className="absolute inset-0">
                <EndocrineBackgroundMid opacity={layerOpacityMid} />
              </div>
              <div className="absolute inset-0">
                <EndocrineBackgroundNear opacity={layerOpacityNear} />
              </div>

              {/* Sample Platforms */}
              <div className="absolute left-[8%] bottom-[32%] w-[26%]">
                <GlandularTissuePlatform label="Thềm Tuyến Yên Chỉ Huy" />
              </div>
              <div className="absolute left-[38%] bottom-[46%] w-[22%]">
                <PancreaticIsletBouncyPlatform label="Đảo Tụy Langerhans" />
              </div>
              <div className="absolute left-[64%] bottom-[38%] w-[28%]">
                <HormoneSignalSpeedPlatform label="Tín Hiệu Thể Dịch Máu" />
              </div>

              {/* Sample Collectibles & NPC */}
              <div className="absolute left-[20%] bottom-[46%]">
                <InsulinHormoneCollectible />
              </div>
              <div className="absolute left-[48%] bottom-[60%]">
                <ThyroxineHormoneCollectible />
              </div>
              <div className="absolute left-[78%] bottom-[52%]">
                <EndocrineGuideCellNpc />
              </div>

              {/* Bottom Hazard */}
              <div className="absolute bottom-0 left-0 right-0">
                <HormoneSurgeHazard />
              </div>
            </div>
          </div>

          {/* Section 2 to 7: Distinct Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 rounded-3xl bg-surface-container-low border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  2 &amp; 3. Thụ Thể Màng Tế Bào Đích
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Khóa &amp; Chìa Đặc Hiệu (Receptor)
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Mô phỏng thụ thể tiếp nhận hormone đặc thù trên màng tế bào.
                </p>
              </div>
              <div className="flex items-center justify-center py-4 bg-emerald-950/80 rounded-2xl mt-3">
                <TargetReceptorDeco size={120} />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-surface-container-low border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  4. Bục 2D Tuyến Nội Tiết
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Mô Tuyến, Đảo Tụy &amp; Dòng Tín Hiệu
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Thiết kế Tactile mềm mại với bục bật nảy đảo tụy và bục gia tốc.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 mt-3">
                <GlandularTissuePlatform label="Thềm Tuyến Nội Tiết" />
                <PancreaticIsletBouncyPlatform label="Đảo Tụy Langerhans Bật Nhảy" />
                <HormoneSignalSpeedPlatform label="Dòng Hormone Gia Tốc" />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-surface-container-low border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  5. Phân Tử Thu Thập &amp; Trạm Tuyến Yên
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Insulin, Thyroxin &amp; TS. Tuyến Yên
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Minh họa phân tử điều hòa đường huyết và chuyển hóa năng lượng.
                </p>
              </div>
              <div className="flex items-center justify-around py-2 bg-emerald-950/80 rounded-2xl mt-3">
                <InsulinHormoneCollectible />
                <ThyroxineHormoneCollectible />
                <EndocrineGuideCellNpc size={62} />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-surface-container-low border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  6. Vùng Nguy Hiểm Khủng Hoảng
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Xung Rối Loạn Điều Hòa Đường Huyết
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Hố nguy hiểm cảnh báo tình trạng mất cân bằng thể dịch.
                </p>
              </div>
              <div className="mt-3">
                <HormoneSurgeHazard />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-surface-container-low border border-emerald-200 flex flex-col justify-between md:col-span-2">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                  7. Yếu Tố Giáo Dục Sinh Học 8 (Educational Concept)
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Đặc Điểm Hệ Nội Tiết &amp; Tính Đặc Hiệu Hormone
                </h4>
              </div>
              <div className="mt-3">
                <EndocrineConceptCard />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: WORLD 8 — REPRODUCTIVE SYSTEM                                 */}
      {/* ==================================================================== */}
      {activeTab === 'world-8-reproductive' && (
        <div className="flex flex-col gap-8">
          {/* World Intro & Play Launcher */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-rose-900/10 border-2 border-rose-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-4xl">spa</span>
              </div>
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                  Chương Trình Sinh Học 8 • Bài 60 - 62
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Màn 8: Hệ Sinh Dục &amp; Thụ Tinh Khoa Học
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Bảng màu chủ đạo: Soft Rose Pink, Lavender, Pale Blue, Warm Cream, Gentle Coral
                </p>
              </div>
            </div>

            <button
              onClick={() => onPlayStage2D('sinh-duc')}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transform active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-xl">sports_esports</span>
              <span>Chơi Ngay Màn 8 Trong Game 2D ▶</span>
            </button>
          </div>

          {/* Section 1: Wide Scrolling Background Composite Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                1. Wide Scrolling Parallax Background (Nền Cuộn Đa Tầng 2D)
              </h3>
              <span className="text-xs text-on-surface-variant font-medium">
                1920 × 600 px • 3 Lớp Parallax
              </span>
            </div>

            <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-300 bg-slate-950">
              <div className="absolute inset-0">
                <ReproductiveBackgroundDistant opacity={layerOpacityDistant} />
              </div>
              <div className="absolute inset-0">
                <ReproductiveBackgroundMid opacity={layerOpacityMid} />
              </div>
              <div className="absolute inset-0">
                <ReproductiveBackgroundNear opacity={layerOpacityNear} />
              </div>

              {/* Sample Platforms */}
              <div className="absolute left-[8%] bottom-[32%] w-[26%]">
                <CiliatedOviductPlatform label="Thềm Lông Rung Vòi Trứng" />
              </div>
              <div className="absolute left-[38%] bottom-[46%] w-[22%]">
                <ZonaPellucidaBouncyPlatform label="Màng Trong Suốt Đàn Hồi" />
              </div>
              <div className="absolute left-[64%] bottom-[38%] w-[28%]">
                <GameteConduitSpeedPlatform label="Dòng Dịch Nuôi Dưỡng" />
              </div>

              {/* Sample Collectibles & NPC */}
              <div className="absolute left-[20%] bottom-[46%]">
                <ChromosomeHaploidCollectible />
              </div>
              <div className="absolute left-[48%] bottom-[60%]">
                <OvumNutrientCollectible />
              </div>
              <div className="absolute left-[78%] bottom-[52%]">
                <ReproductiveGuideCellNpc />
              </div>

              {/* Bottom Hazard */}
              <div className="absolute bottom-0 left-0 right-0">
                <ViscousMucusHazard />
              </div>
            </div>
          </div>

          {/* Section 2 to 7: Distinct Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 rounded-3xl bg-surface-container-low border border-rose-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide">
                  2 &amp; 3. Giao Tử Khoa Học n=23
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Tế Bào Trứng &amp; Tinh Trùng Khoa Học
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Hình ảnh trong sáng, tế nhị, thể hiện bản chất bộ NST đơn bội.
                </p>
              </div>
              <div className="flex items-center justify-center py-4 bg-rose-950/80 rounded-2xl mt-3">
                <GameteDuoDeco size={120} />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-surface-container-low border border-rose-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide">
                  4. Bục 2D Vòi Trứng &amp; Màng Noãn Bào
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Biểu Bì Lông Rung, Màng Đàn Hồi &amp; Dòng Nuôi Dưỡng
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Bục trong suốt dễ dàng phân biệt khỏi nền, cơ chế đàn hồi chuẩn xác.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 mt-3">
                <CiliatedOviductPlatform label="Thềm Biểu Bì Lông Rung" />
                <ZonaPellucidaBouncyPlatform label="Màng Noãn Bào Đàn Hồi" />
                <GameteConduitSpeedPlatform label="Dòng Nuôi Dưỡng Tế Bào" />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-surface-container-low border border-rose-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide">
                  5. Vật Phẩm NST &amp; Noãn Hoàng
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Bộ NST n=23 &amp; TS. Tế Bào Mầm
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Thu thập bộ gen di truyền và học hỏi sự kỳ diệu của thụ tinh.
                </p>
              </div>
              <div className="flex items-center justify-around py-2 bg-rose-950/80 rounded-2xl mt-3">
                <ChromosomeHaploidCollectible />
                <OvumNutrientCollectible />
                <ReproductiveGuideCellNpc size={62} />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-surface-container-low border border-rose-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide">
                  6. Vùng Dịch Nhầy Cản Trở
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Dịch Nhầy Cổ Tử Cung Chọn Lọc Tự Nhiên
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Chướng ngại vật thử thách khả năng định hướng và nhảy của người chơi.
                </p>
              </div>
              <div className="mt-3">
                <ViscousMucusHazard />
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-surface-container-low border border-rose-200 flex flex-col justify-between md:col-span-2">
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide">
                  7. Yếu Tố Giáo Dục Sinh Học 8 (Educational Concept)
                </span>
                <h4 className="font-bold text-sm text-on-surface mt-1">
                  Sự Thụ Tinh Khoa Học &amp; Thụ Thai Làm Tổ
                </h4>
              </div>
              <div className="mt-3">
                <FertilizationConceptCard />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: JSON METADATA & EXPORT                                        */}
      {/* ==================================================================== */}
      {activeTab === 'json-metadata' && (
        <div className="flex flex-col gap-4 p-6 rounded-3xl bg-surface-container-low border border-surface-container-high">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Asset Metadata Specification (JSON Export)
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Tổng cộng {NEW_WORLDS_ASSETS.length} tài nguyên game 2D có đầy đủ kích thước, nhóm danh mục, bảng màu và ghi chú sư phạm.
              </p>
            </div>

            <button
              onClick={handleCopyJson}
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">
                {copiedJson ? 'check' : 'content_copy'}
              </span>
              <span>{copiedJson ? 'Đã Sao Chép JSON!' : 'Sao Chép JSON Toàn Bộ'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-surface-container-highest text-[11px] text-on-surface font-mono overflow-x-auto max-h-[600px] border border-outline/20">
            {exportAssetCatalogJson()}
          </pre>
        </div>
      )}
    </div>
  );
};

import { OUTFITS } from './biologyData';
import { getSupabaseClient, sanitizeSupabaseError } from '../lib/supabase';

export interface StationSavedProgress {
  phase: 'dialogue' | 'quiz';
  dialogueIdx: number;
  questionIdx: number;
}

export interface GameProgressState {
  exp: number;
  diamonds: number;
  equippedOutfitId: string;
  ownedOutfitIds: string[];
  unlockedStageIds: string[];
  completedStageIds: string[];
  stageProgress: Record<string, number>;
  completedStations: string[];
  unlockedSpecimens: string[];
  weeklyQuests: {
    enzymeQuizDone: boolean;
    bloodCellMatchDone: boolean;
    oxygenPathDone: boolean;
    chestClaimed: boolean;
  };
  cutsceneSeen: boolean;
  microscopeInspected: boolean;
  amylaseInspected?: boolean;
  stationProgressMap?: Record<string, StationSavedProgress>;
  ownerUserId?: string | null;
  pendingCloudSync?: boolean;
  updatedAt?: string;
}

export interface PlayerProfileRecord {
  id: string;
  display_name: string;
  avatar_variant: 'blue';
  grade_class: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_variant: 'blue';
  grade_class: string;
  exp: number;
  explorer_level: number;
  specimens_count: number;
}

const STORAGE_KEY = 'potabi_biology_save_v1';

export const DEFAULT_GAME_STATE: GameProgressState = {
  exp: 5800,
  diamonds: 999,
  equippedOutfitId: 'blouse-bac-si',
  ownedOutfitIds: ['crown-default', 'blouse-bac-si', 'giot-nuoc-nano', 'kinh-hien-vi-quang'],
  unlockedStageIds: [
    'tieu-hoa',
    'tuan-hoan',
    'ho-hap',
    'than-kinh',
    'van-dong',
    'bai-tiet',
    'noi-tiet',
    'sinh-duc',
  ],
  completedStageIds: [
    'tieu-hoa',
    'tuan-hoan',
    'ho-hap',
    'than-kinh',
    'van-dong',
    'bai-tiet',
    'noi-tiet',
    'sinh-duc',
  ],
  stageProgress: {
    'tieu-hoa': 100,
    'tuan-hoan': 100,
    'ho-hap': 100,
    'than-kinh': 100,
    'van-dong': 100,
    'bai-tiet': 100,
    'noi-tiet': 100,
    'sinh-duc': 100,
  },
  completedStations: ['tram-1', 'tram-2', 'tram-3'],
  unlockedSpecimens: [
    'hong-cau',
    'bach-cau',
    'tieu-cau',
    'vay-hanh',
    'amylase',
    'co-da-day',
    'pepsin',
    'chat-nhay-mucin',
    'nephron-podocyte',
    'insulin-hormone',
    'giao-tu-haploid',
  ],
  weeklyQuests: {
    enzymeQuizDone: true,
    bloodCellMatchDone: true,
    oxygenPathDone: true,
    chestClaimed: true,
  },
  cutsceneSeen: true,
  microscopeInspected: true,
  amylaseInspected: true,
  stationProgressMap: {
    'tram-1': { phase: 'quiz', dialogueIdx: 3, questionIdx: 2 },
    'tram-2': { phase: 'quiz', dialogueIdx: 3, questionIdx: 2 },
    'tram-3': { phase: 'quiz', dialogueIdx: 3, questionIdx: 2 },
  },
  ownerUserId: null,
  pendingCloudSync: false,
  updatedAt: new Date().toISOString(),
};

export function hasExistingSaveData(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function loadGameProgress(): GameProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveGameProgress(DEFAULT_GAME_STATE);
      return DEFAULT_GAME_STATE;
    }
    const parsed = JSON.parse(raw);
    const merged: GameProgressState = {
      ...DEFAULT_GAME_STATE,
      ...parsed,
      cutsceneSeen: true,
      microscopeInspected: true,
      amylaseInspected: true,
      unlockedStageIds: Array.from(
        new Set([...DEFAULT_GAME_STATE.unlockedStageIds, ...(parsed.unlockedStageIds || [])])
      ),
      completedStageIds: Array.from(
        new Set([...DEFAULT_GAME_STATE.completedStageIds, ...(parsed.completedStageIds || [])])
      ),
      stageProgress: {
        ...DEFAULT_GAME_STATE.stageProgress,
        ...(parsed.stageProgress || {}),
        'tieu-hoa': 100,
        'tuan-hoan': 100,
        'ho-hap': 100,
        'than-kinh': 100,
        'van-dong': 100,
        'bai-tiet': 100,
        'noi-tiet': 100,
        'sinh-duc': 100,
      },
      completedStations: Array.from(
        new Set([...DEFAULT_GAME_STATE.completedStations, ...(parsed.completedStations || [])])
      ),
      unlockedSpecimens: Array.from(
        new Set([...DEFAULT_GAME_STATE.unlockedSpecimens, ...(parsed.unlockedSpecimens || [])])
      ),
      ownedOutfitIds: Array.from(
        new Set([...DEFAULT_GAME_STATE.ownedOutfitIds, ...(parsed.ownedOutfitIds || [])])
      ),
      weeklyQuests: {
        ...DEFAULT_GAME_STATE.weeklyQuests,
        ...(parsed.weeklyQuests || {}),
        enzymeQuizDone: true,
        bloodCellMatchDone: true,
        oxygenPathDone: true,
        chestClaimed: true,
      },
      exp: Math.max(DEFAULT_GAME_STATE.exp, parsed.exp || 0),
      diamonds: Math.max(DEFAULT_GAME_STATE.diamonds, parsed.diamonds || 0),
    };
    saveGameProgress(merged);
    return merged;
  } catch {
    return DEFAULT_GAME_STATE;
  }
}

export function saveGameProgress(state: GameProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted frames
  }
}

export function calculateExplorerLevel(exp: number): {
  level: number;
  currentLevelExp: number;
  nextLevelExp: number;
  percent: number;
} {
  const level = Math.max(1, Math.floor(exp / 200) + 1);
  const currentLevelExp = exp % 200;
  const nextLevelExp = 200;
  const percent = Math.min(100, Math.round((currentLevelExp / nextLevelExp) * 100));
  return { level, currentLevelExp, nextLevelExp, percent };
}

/**
 * Deterministic Smart Merge (Union + Max without duplicate reward inflation)
 * Resolves conflicts between localStorage and Supabase cloud state safely.
 */
export function mergeGameProgress(
  local: GameProgressState,
  cloud: GameProgressState,
  userId: string
): GameProgressState {
  // If local data belonged to a different logged-in student on a shared school PC,
  // do NOT merge the previous student's progress into the new student's account.
  if (local.ownerUserId && local.ownerUserId !== userId) {
    return {
      ...cloud,
      ownerUserId: userId,
      pendingCloudSync: false,
      updatedAt: new Date().toISOString(),
    };
  }

  const unionArray = (a: string[] = [], b: string[] = []) =>
    Array.from(new Set([...a, ...b]));

  const ownedOutfitIds = unionArray(local.ownedOutfitIds, cloud.ownedOutfitIds);
  const completedStations = unionArray(local.completedStations, cloud.completedStations);
  const unlockedSpecimens = unionArray(local.unlockedSpecimens, cloud.unlockedSpecimens);
  const completedStageIds = unionArray(local.completedStageIds, cloud.completedStageIds);
  const unlockedStageSet = new Set(unionArray(local.unlockedStageIds, cloud.unlockedStageIds));

  if (
    completedStations.includes('tram-1') &&
    completedStations.includes('tram-2') &&
    completedStations.includes('tram-3')
  ) {
    completedStageIds.push('tieu-hoa');
    unlockedStageSet.add('tuan-hoan');
  }
  const uniqueCompletedStages = Array.from(new Set(completedStageIds));
  if (uniqueCompletedStages.includes('tuan-hoan')) {
    unlockedStageSet.add('ho-hap');
  }
  if (uniqueCompletedStages.includes('ho-hap')) {
    unlockedStageSet.add('than-kinh');
  }
  if (uniqueCompletedStages.includes('than-kinh')) {
    unlockedStageSet.add('van-dong');
  }
  if (uniqueCompletedStages.includes('van-dong')) {
    unlockedStageSet.add('bai-tiet');
  }
  if (uniqueCompletedStages.includes('bai-tiet')) {
    unlockedStageSet.add('noi-tiet');
  }
  if (uniqueCompletedStages.includes('noi-tiet')) {
    unlockedStageSet.add('sinh-duc');
  }

  const weeklyQuests = {
    enzymeQuizDone: Boolean(local.weeklyQuests?.enzymeQuizDone || cloud.weeklyQuests?.enzymeQuizDone),
    bloodCellMatchDone: Boolean(
      local.weeklyQuests?.bloodCellMatchDone || cloud.weeklyQuests?.bloodCellMatchDone
    ),
    oxygenPathDone: Boolean(local.weeklyQuests?.oxygenPathDone || cloud.weeklyQuests?.oxygenPathDone),
    chestClaimed: Boolean(local.weeklyQuests?.chestClaimed || cloud.weeklyQuests?.chestClaimed),
  };

  // Determine which snapshot has higher base EXP and add only unique newly completed achievements
  // from the other snapshot so EXP and Diamonds are never lost and never double-counted.
  const useLocalAsBase = local.exp >= cloud.exp;
  const base = useLocalAsBase ? local : cloud;
  const other = useLocalAsBase ? cloud : local;

  let bonusExp = 0;
  let bonusDiamonds = 0;

  // Check stations present in 'other' but not in 'base'
  for (const stId of other.completedStations || []) {
    if (!(base.completedStations || []).includes(stId)) {
      bonusExp += 250;
      bonusDiamonds += 15;
    }
  }

  // Check stage quizzes present in 'other' but not in 'base'
  if (
    (other.completedStageIds || []).includes('tuan-hoan') &&
    !(base.completedStageIds || []).includes('tuan-hoan')
  ) {
    bonusExp += 300;
    bonusDiamonds += 20;
  }
  if (
    (other.completedStageIds || []).includes('ho-hap') &&
    !(base.completedStageIds || []).includes('ho-hap')
  ) {
    bonusExp += 320;
    bonusDiamonds += 25;
  }

  // Check weekly quests present in 'other' but not in 'base'
  if (other.weeklyQuests?.enzymeQuizDone && !base.weeklyQuests?.enzymeQuizDone) {
    bonusExp += 120;
    bonusDiamonds += 25;
  }
  if (other.weeklyQuests?.bloodCellMatchDone && !base.weeklyQuests?.bloodCellMatchDone) {
    bonusExp += 150;
    bonusDiamonds += 30;
  }
  if (other.weeklyQuests?.chestClaimed && !base.weeklyQuests?.chestClaimed) {
    bonusExp += 200;
    bonusDiamonds += 50;
  }

  const mergedExp = Math.min(100000, Math.max(local.exp, cloud.exp) + bonusExp);
  const mergedDiamonds = Math.min(50000, Math.max(local.diamonds, cloud.diamonds) + bonusDiamonds);

  const tieuHoaProgress = Math.max(
    local.stageProgress?.['tieu-hoa'] || 0,
    cloud.stageProgress?.['tieu-hoa'] || 0,
    Math.min(100, Math.round((completedStations.length / 3) * 100))
  );

  const stageProgress: Record<string, number> = {
    'tieu-hoa': tieuHoaProgress,
    'tuan-hoan': Math.max(
      local.stageProgress?.['tuan-hoan'] || 0,
      cloud.stageProgress?.['tuan-hoan'] || 0,
      uniqueCompletedStages.includes('tuan-hoan') ? 100 : 0
    ),
    'ho-hap': Math.max(
      local.stageProgress?.['ho-hap'] || 0,
      cloud.stageProgress?.['ho-hap'] || 0,
      uniqueCompletedStages.includes('ho-hap') ? 100 : 0
    ),
    'than-kinh': Math.max(
      local.stageProgress?.['than-kinh'] || 0,
      cloud.stageProgress?.['than-kinh'] || 0
    ),
    'van-dong': Math.max(
      local.stageProgress?.['van-dong'] || 0,
      cloud.stageProgress?.['van-dong'] || 0
    ),
  };

  // Merge in-progress station progress map, keeping the furthest step for stations not yet completed
  const mergedStationMap: Record<string, StationSavedProgress> = {
    ...(cloud.stationProgressMap || {}),
    ...(local.stationProgressMap || {}),
  };
  for (const doneId of completedStations) {
    delete mergedStationMap[doneId];
  }

  const preferredEquipped =
    ownedOutfitIds.includes(local.equippedOutfitId)
      ? local.equippedOutfitId
      : ownedOutfitIds.includes(cloud.equippedOutfitId)
      ? cloud.equippedOutfitId
      : 'crown-default';

  return {
    exp: mergedExp,
    diamonds: mergedDiamonds,
    equippedOutfitId: preferredEquipped,
    ownedOutfitIds,
    unlockedStageIds: Array.from(unlockedStageSet),
    completedStageIds: uniqueCompletedStages,
    stageProgress,
    completedStations,
    unlockedSpecimens,
    weeklyQuests,
    cutsceneSeen: Boolean(local.cutsceneSeen || cloud.cutsceneSeen),
    microscopeInspected: Boolean(local.microscopeInspected || cloud.microscopeInspected),
    amylaseInspected: Boolean(local.amylaseInspected || cloud.amylaseInspected),
    stationProgressMap: mergedStationMap,
    ownerUserId: userId,
    pendingCloudSync: false,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Convert database row from public.player_progress into GameProgressState
 */
function rowToGameProgressState(row: Record<string, any>): GameProgressState {
  const json = (row.progress_data || {}) as Partial<GameProgressState>;
  return {
    ...DEFAULT_GAME_STATE,
    ...json,
    exp: typeof row.exp === 'number' ? row.exp : DEFAULT_GAME_STATE.exp,
    diamonds: typeof row.diamonds === 'number' ? row.diamonds : DEFAULT_GAME_STATE.diamonds,
    equippedOutfitId:
      typeof row.equipped_outfit_id === 'string'
        ? row.equipped_outfit_id
        : DEFAULT_GAME_STATE.equippedOutfitId,
    cutsceneSeen:
      typeof row.cutscene_seen === 'boolean' ? row.cutscene_seen : Boolean(json.cutsceneSeen),
    stageProgress: {
      ...DEFAULT_GAME_STATE.stageProgress,
      ...(json.stageProgress || {}),
    },
    weeklyQuests: {
      ...DEFAULT_GAME_STATE.weeklyQuests,
      ...(json.weeklyQuests || {}),
    },
    stationProgressMap: {
      ...(json.stationProgressMap || {}),
    },
    ownerUserId: row.user_id || null,
    pendingCloudSync: false,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/**
 * Ensure user profile exists in public.profiles and return it
 */
export async function ensurePlayerProfile(
  userId: string,
  defaultDisplayName: string,
  avatarVariant: 'blue' = 'blue'
): Promise<{ profile: PlayerProfileRecord | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { profile: null, error: null };
  }

  try {
    const { data: existing, error: selectErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (selectErr) {
      return { profile: null, error: sanitizeSupabaseError(selectErr) };
    }

    if (existing) {
      return { profile: existing as PlayerProfileRecord, error: null };
    }

    const newProfile: PlayerProfileRecord = {
      id: userId,
      display_name: defaultDisplayName || 'Nhà Thám Hiểm Vi Mô',
      avatar_variant: avatarVariant,
      grade_class: 'Sinh học 8',
    };

    const { data: inserted, error: insertErr } = await supabase
      .from('profiles')
      .upsert(newProfile, { onConflict: 'id' })
      .select('*')
      .single();

    if (insertErr) {
      return { profile: newProfile, error: sanitizeSupabaseError(insertErr) };
    }

    return { profile: inserted as PlayerProfileRecord, error: null };
  } catch (err) {
    return { profile: null, error: sanitizeSupabaseError(err) };
  }
}

/**
 * Update player's display name or avatar variant in public.profiles
 */
export async function updatePlayerProfile(
  userId: string,
  updates: { display_name?: string; avatar_variant?: 'blue'; grade_class?: string }
): Promise<{ profile: PlayerProfileRecord | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { profile: null, error: 'Chưa cấu hình kết nối đám mây.' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          ...updates,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    if (error) {
      return { profile: null, error: sanitizeSupabaseError(error) };
    }
    return { profile: data as PlayerProfileRecord, error: null };
  } catch (err) {
    return { profile: null, error: sanitizeSupabaseError(err) };
  }
}

/**
 * Fetch player progress from Supabase, merge with local progress if applicable, and persist back
 */
export async function pullAndMergeCloudProgress(
  userId: string,
  localState: GameProgressState
): Promise<{ mergedState: GameProgressState; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { mergedState: localState, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('player_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return {
        mergedState: { ...localState, pendingCloudSync: true },
        error: sanitizeSupabaseError(error),
      };
    }

    let finalState: GameProgressState;
    if (!data) {
      // First time this account syncs to cloud:
      // If local save belongs to guest (ownerUserId === null) or this user, migrate local progress up!
      // Otherwise if local save belonged to another user on this browser, start fresh default state.
      const baseToUpload =
        !localState.ownerUserId || localState.ownerUserId === userId
          ? localState
          : DEFAULT_GAME_STATE;

      finalState = {
        ...baseToUpload,
        ownerUserId: userId,
        pendingCloudSync: false,
        updatedAt: new Date().toISOString(),
      };
    } else {
      const cloudState = rowToGameProgressState(data);
      finalState = mergeGameProgress(localState, cloudState, userId);
    }

    const pushResult = await pushProgressToCloud(userId, finalState);
    return {
      mergedState: pushResult.ok
        ? { ...finalState, pendingCloudSync: false }
        : { ...finalState, pendingCloudSync: true },
      error: pushResult.error,
    };
  } catch (err) {
    return {
      mergedState: { ...localState, pendingCloudSync: true },
      error: sanitizeSupabaseError(err),
    };
  }
}

/**
 * Push current GameProgressState to public.player_progress
 */
export async function pushProgressToCloud(
  userId: string,
  state: GameProgressState
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, error: null };
  }

  try {
    const { level } = calculateExplorerLevel(state.exp);
    const payload = {
      user_id: userId,
      exp: Math.max(0, Math.min(100000, Math.round(state.exp))),
      diamonds: Math.max(0, Math.min(50000, Math.round(state.diamonds))),
      explorer_level: level,
      equipped_outfit_id: state.equippedOutfitId,
      cutscene_seen: Boolean(state.cutsceneSeen),
      progress_data: {
        ownedOutfitIds: state.ownedOutfitIds,
        unlockedStageIds: state.unlockedStageIds,
        completedStageIds: state.completedStageIds,
        stageProgress: state.stageProgress,
        completedStations: state.completedStations,
        unlockedSpecimens: state.unlockedSpecimens,
        weeklyQuests: state.weeklyQuests,
        microscopeInspected: Boolean(state.microscopeInspected),
        amylaseInspected: Boolean(state.amylaseInspected),
        stationProgressMap: state.stationProgressMap || {},
      },
      schema_version: 1,
    };

    const { error } = await supabase
      .from('player_progress')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      return { ok: false, error: sanitizeSupabaseError(error) };
    }
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: sanitizeSupabaseError(err) };
  }
}

/**
 * Fetch top explorers for the Leaderboard from public.leaderboard_view (or fallback to profiles + player_progress)
 */
export async function fetchCloudLeaderboard(): Promise<{
  entries: LeaderboardEntry[];
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { entries: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .order('exp', { ascending: false })
      .limit(15);

    if (!error && Array.isArray(data)) {
      return {
        entries: data.map((row: any) => ({
          user_id: row.user_id,
          display_name: row.display_name || 'Nhà Thám Hiểm Vi Mô',
          avatar_variant: 'blue',
          grade_class: row.grade_class || 'Sinh học 8',
          exp: typeof row.exp === 'number' ? row.exp : 2370,
          explorer_level:
            typeof row.explorer_level === 'number'
              ? row.explorer_level
              : calculateExplorerLevel(row.exp || 2370).level,
          specimens_count: typeof row.specimens_count === 'number' ? row.specimens_count : 7,
        })),
        error: null,
      };
    }

    return { entries: [], error: error ? sanitizeSupabaseError(error) : null };
  } catch (err) {
    return { entries: [], error: sanitizeSupabaseError(err) };
  }
}

export type IdleEffectStyle =
  | "mist" | "qi_sparks" | "runes" | "petals" | "water" | "wind"
  | "lotus" | "golden_flame" | "starfield" | "solar_ring" | "spirit_orbs"
  | "phoenix" | "thunder" | "celestial_seal" | "dragon_wind" | "immortal_halo";

export type BreakthroughEffectStyle =
  | "qi_gathering" | "jade_flash" | "spirit_pulse" | "petal_burst" | "foundation_ring"
  | "river_rise" | "lotus_opening" | "golden_core" | "starfall" | "dan_breakthrough"
  | "nascent_soul" | "phoenix_ascent" | "heavenly_thunder" | "divine_descent"
  | "dragon_roar" | "transcendent_gate";

export interface IdleEffectProfile {
  style: IdleEffectStyle;
  primary: string;
  secondary: string;
  particles: number;
  orbitCount: number;
  intensity: number;
  motionSpeed: number;
}

export interface BreakthroughEffectProfile {
  style: BreakthroughEffectStyle;
  primary: string;
  secondary: string;
  durationMs: number;
  particles: number;
  rings: number;
  intensity: number;
}

export interface RealmVisualProfile {
  realmIndex: number;
  id: string;
  /** PNG path relative to the Vite public assets root. One designed form per realm. */
  characterAsset: string;
  idle: IdleEffectProfile;
  /** This is the arrival effect played after successfully entering this realm. */
  breakthrough: BreakthroughEffectProfile | null;
}

export const REALM_VISUALS: readonly RealmVisualProfile[] = [
  { realmIndex: 0, id: "pham_nhan", characterAsset: "/characters/realms/realm_00_pham_nhan.png",
    idle: { style: "mist", primary: "#b8c4c9", secondary: "#71899b", particles: 5, orbitCount: 1, intensity: 0.22, motionSpeed: 0.45 }, breakthrough: null },
  { realmIndex: 1, id: "luyen_khi_so", characterAsset: "/characters/realms/realm_01_luyen_khi_so.png",
    idle: { style: "qi_sparks", primary: "#a6dfcf", secondary: "#4e9a8c", particles: 7, orbitCount: 1, intensity: 0.27, motionSpeed: 0.58 },
    breakthrough: { style: "qi_gathering", primary: "#a6dfcf", secondary: "#4e9a8c", durationMs: 1_450, particles: 14, rings: 2, intensity: 0.42 } },
  { realmIndex: 2, id: "luyen_khi_trung", characterAsset: "/characters/realms/realm_02_luyen_khi_trung.png",
    idle: { style: "runes", primary: "#d7cf92", secondary: "#75b9a1", particles: 8, orbitCount: 1, intensity: 0.31, motionSpeed: 0.7 },
    breakthrough: { style: "jade_flash", primary: "#bdebd6", secondary: "#5ab89c", durationMs: 1_550, particles: 18, rings: 2, intensity: 0.48 } },
  { realmIndex: 3, id: "luyen_khi_hau", characterAsset: "/characters/realms/realm_03_luyen_khi_hau.png",
    idle: { style: "petals", primary: "#9ed9c1", secondary: "#d6bd79", particles: 10, orbitCount: 1, intensity: 0.35, motionSpeed: 0.76 },
    breakthrough: { style: "spirit_pulse", primary: "#8ee5c2", secondary: "#e1ca84", durationMs: 1_650, particles: 20, rings: 3, intensity: 0.52 } },
  { realmIndex: 4, id: "truc_co_so", characterAsset: "/characters/realms/realm_04_truc_co_so.png",
    idle: { style: "water", primary: "#9bc8e8", secondary: "#77a8cf", particles: 9, orbitCount: 2, intensity: 0.39, motionSpeed: 0.68 },
    breakthrough: { style: "petal_burst", primary: "#a8e2d3", secondary: "#e8ce8d", durationMs: 1_750, particles: 22, rings: 3, intensity: 0.58 } },
  { realmIndex: 5, id: "truc_co_trung", characterAsset: "/characters/realms/realm_05_truc_co_trung.png",
    idle: { style: "wind", primary: "#b6d9e8", secondary: "#6da9cb", particles: 11, orbitCount: 2, intensity: 0.42, motionSpeed: 0.9 },
    breakthrough: { style: "foundation_ring", primary: "#b6e5e5", secondary: "#7799d4", durationMs: 1_850, particles: 22, rings: 4, intensity: 0.61 } },
  { realmIndex: 6, id: "truc_co_hau", characterAsset: "/characters/realms/realm_06_truc_co_hau.png",
    idle: { style: "lotus", primary: "#e7a9ca", secondary: "#e7d08a", particles: 12, orbitCount: 2, intensity: 0.46, motionSpeed: 0.64 },
    breakthrough: { style: "river_rise", primary: "#9dcff0", secondary: "#81dbc9", durationMs: 1_950, particles: 24, rings: 4, intensity: 0.65 } },
  { realmIndex: 7, id: "ket_dan_so", characterAsset: "/characters/realms/realm_07_ket_dan_so.png",
    idle: { style: "golden_flame", primary: "#ffd47c", secondary: "#df8d4b", particles: 13, orbitCount: 2, intensity: 0.5, motionSpeed: 0.82 },
    breakthrough: { style: "lotus_opening", primary: "#f6c7df", secondary: "#f6db91", durationMs: 2_050, particles: 26, rings: 4, intensity: 0.7 } },
  { realmIndex: 8, id: "ket_dan_trung", characterAsset: "/characters/realms/realm_08_ket_dan_trung.png",
    idle: { style: "starfield", primary: "#b6a4f0", secondary: "#83cce4", particles: 14, orbitCount: 2, intensity: 0.54, motionSpeed: 0.72 },
    breakthrough: { style: "golden_core", primary: "#ffdf91", secondary: "#f09154", durationMs: 2_150, particles: 28, rings: 4, intensity: 0.74 } },
  { realmIndex: 9, id: "ket_dan_hau", characterAsset: "/characters/realms/realm_09_ket_dan_hau.png",
    idle: { style: "solar_ring", primary: "#ffe4a0", secondary: "#ed9e64", particles: 15, orbitCount: 3, intensity: 0.58, motionSpeed: 0.56 },
    breakthrough: { style: "starfall", primary: "#c8b8ff", secondary: "#86def0", durationMs: 2_250, particles: 30, rings: 5, intensity: 0.77 } },
  { realmIndex: 10, id: "nguyen_anh_so", characterAsset: "/characters/realms/realm_10_nguyen_anh_so.png",
    idle: { style: "spirit_orbs", primary: "#a5d8ff", secondary: "#cbb5ff", particles: 16, orbitCount: 3, intensity: 0.61, motionSpeed: 0.62 },
    breakthrough: { style: "dan_breakthrough", primary: "#ffe89b", secondary: "#ee9f69", durationMs: 2_350, particles: 32, rings: 5, intensity: 0.8 } },
  { realmIndex: 11, id: "nguyen_anh_trung", characterAsset: "/characters/realms/realm_11_nguyen_anh_trung.png",
    idle: { style: "phoenix", primary: "#ffb274", secondary: "#ffe18a", particles: 17, orbitCount: 3, intensity: 0.66, motionSpeed: 0.94 },
    breakthrough: { style: "nascent_soul", primary: "#c4e4ff", secondary: "#c1a8ff", durationMs: 2_450, particles: 34, rings: 5, intensity: 0.83 } },
  { realmIndex: 12, id: "nguyen_anh_hau", characterAsset: "/characters/realms/realm_12_nguyen_anh_hau.png",
    idle: { style: "thunder", primary: "#c3a3ff", secondary: "#81dbf4", particles: 18, orbitCount: 3, intensity: 0.7, motionSpeed: 1.08 },
    breakthrough: { style: "phoenix_ascent", primary: "#ffb36e", secondary: "#ffdf8c", durationMs: 2_550, particles: 36, rings: 6, intensity: 0.86 } },
  { realmIndex: 13, id: "hoa_than_so", characterAsset: "/characters/realms/realm_13_hoa_than_so.png",
    idle: { style: "celestial_seal", primary: "#fff1bb", secondary: "#b5d9ff", particles: 19, orbitCount: 4, intensity: 0.73, motionSpeed: 0.5 },
    breakthrough: { style: "heavenly_thunder", primary: "#d2b9ff", secondary: "#9bebff", durationMs: 2_650, particles: 38, rings: 6, intensity: 0.89 } },
  { realmIndex: 14, id: "hoa_than_trung", characterAsset: "/characters/realms/realm_14_hoa_than_trung.png",
    idle: { style: "dragon_wind", primary: "#9ce6db", secondary: "#f2d68d", particles: 20, orbitCount: 4, intensity: 0.78, motionSpeed: 0.86 },
    breakthrough: { style: "divine_descent", primary: "#fff2c3", secondary: "#d2baff", durationMs: 2_800, particles: 42, rings: 7, intensity: 0.93 } },
  { realmIndex: 15, id: "hoa_than_hau", characterAsset: "/characters/realms/realm_15_hoa_than_hau.png",
    idle: { style: "immortal_halo", primary: "#fff3cf", secondary: "#e1b6ff", particles: 24, orbitCount: 5, intensity: 0.86, motionSpeed: 0.72 },
    breakthrough: { style: "dragon_roar", primary: "#a9f5e1", secondary: "#ffe79c", durationMs: 2_950, particles: 46, rings: 7, intensity: 0.96 } },
];

export function realmVisualProfile(realmIndex: number): RealmVisualProfile {
  return REALM_VISUALS[Math.max(0, Math.min(REALM_VISUALS.length - 1, Math.floor(realmIndex)))]!;
}

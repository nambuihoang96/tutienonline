# Realm character sprites

Place exactly one distinct character portrait for each realm in this folder. Use the filenames and per-realm art brief in `GDD_Pham_Tu_v3_2.md`, section 10.1.

- 384×480 px, transparent RGBA PNG, sRGB.
- Seated full-body pose, centered with 8% transparent safety margin.
- Keep camera, scale, face identity and baseline pose consistent across all 16 forms so the same cultivator reads as progressing.
- Make each tier visibly different through silhouette, costume layers, hair, ornament and spiritual presence. Do not rely on a color swap alone.
- Keep aura, particles, text, background, throne and effects out of the character PNG; the game draws realm-specific idle and breakthrough effects separately.

The expected filenames are `realm_00_pham_nhan.png` through `realm_15_hoa_than_hau.png`. They are already mapped in `src/shared/realmVisuals.ts`.

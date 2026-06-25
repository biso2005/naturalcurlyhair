import { describe, it, expect } from 'vitest'
import { resolve, type PostcodeProfile } from './diagnostic'

// ── Fixture profiles ─────────────────────────────────────────────────────────

const extremeWater: PostcodeProfile = {
  district: 'SE18',
  water_hardness_mgl: 320,
  water_band: 'extreme',
  water_uk_percentile: 95,
  humidity_avg: 74,
  humidity_band: 'moderate',
  chlorine_level: 'high',
  region: 'London SE',
  salon_density: 'high',
}

const veryHardWater: PostcodeProfile = {
  district: 'EC1',
  water_hardness_mgl: 260,
  water_band: 'very_hard',
  water_uk_percentile: 88,
  humidity_avg: 73,
  humidity_band: 'moderate',
  chlorine_level: 'moderate',
  region: 'London City',
  salon_density: 'high',
}

const hardWater: PostcodeProfile = {
  district: 'B5',
  water_hardness_mgl: 160,
  water_band: 'hard',
  water_uk_percentile: 65,
  humidity_avg: 71,
  humidity_band: 'moderate',
  chlorine_level: 'moderate',
  region: 'West Midlands',
  salon_density: 'moderate',
}

const softWater: PostcodeProfile = {
  district: 'M14',
  water_hardness_mgl: 70,
  water_band: 'moderate',
  water_uk_percentile: 25,
  humidity_avg: 76,
  humidity_band: 'high',
  chlorine_level: 'low',
  region: 'Greater Manchester',
  salon_density: 'moderate',
}

const veryLowHumidity: PostcodeProfile = {
  district: 'EH1',
  water_hardness_mgl: 45,
  water_band: 'soft',
  water_uk_percentile: 10,
  humidity_avg: 55,
  humidity_band: 'low',
  chlorine_level: 'low',
  region: 'Edinburgh',
  salon_density: 'low',
}

const fallback: PostcodeProfile = {
  district: 'UNKNOWN',
  water_hardness_mgl: 180,
  water_band: 'hard',
  water_uk_percentile: 50,
  humidity_avg: 72,
  humidity_band: 'moderate',
  chlorine_level: 'moderate',
  region: 'UK (national average)',
  salon_density: 'low',
  _is_fallback: true,
}

// ── S1-dry ────────────────────────────────────────────────────────────────────

describe('S1-dry — coated descriptor', () => {
  it('extreme water + coated → hard_water_buildup, high confidence', () => {
    const r = resolve('S1-dry', extremeWater, 'coated')
    expect(r.most_likely_cause).toBe('hard_water_buildup')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-hard_water_buildup')
    expect(r.medical_exit_fires).toBe(false)
    expect(r.medical_exit_code).toBeNull()
  })

  it('very_hard water + coated → hard_water_buildup, high confidence', () => {
    const r = resolve('S1-dry', veryHardWater, 'coated')
    expect(r.most_likely_cause).toBe('hard_water_buildup')
    expect(r.confidence).toBe('high')
  })

  it('hard water + coated → hard_water_buildup, medium confidence', () => {
    const r = resolve('S1-dry', hardWater, 'coated')
    expect(r.most_likely_cause).toBe('hard_water_buildup')
    expect(r.confidence).toBe('medium')
  })

  it('soft water + coated → low_porosity_sealed_wrong, medium confidence', () => {
    const r = resolve('S1-dry', softWater, 'coated')
    expect(r.most_likely_cause).toBe('low_porosity_sealed_wrong')
    expect(r.confidence).toBe('medium')
    expect(r.recommendation_code).toBe('REC-low_porosity_sealed_wrong')
  })
})

describe('S1-dry — rough descriptor', () => {
  it('low humidity + rough → seasonal_humidity_loss, medium confidence', () => {
    const r = resolve('S1-dry', veryLowHumidity, 'rough')
    expect(r.most_likely_cause).toBe('seasonal_humidity_loss')
    expect(r.confidence).toBe('medium')
    expect(r.recommendation_code).toBe('REC-seasonal_humidity_loss')
  })

  it('moderate humidity + rough → protein_overload, medium confidence', () => {
    const r = resolve('S1-dry', softWater, 'rough')
    expect(r.most_likely_cause).toBe('protein_overload')
    expect(r.confidence).toBe('medium')
    expect(r.recommendation_code).toBe('REC-protein_overload')
  })
})

describe('S1-dry — limp and looks_dry descriptors', () => {
  it('limp → moisture_overload', () => {
    const r = resolve('S1-dry', extremeWater, 'limp')
    expect(r.most_likely_cause).toBe('moisture_overload')
    expect(r.recommendation_code).toBe('REC-moisture_overload')
    expect(r.medical_exit_fires).toBe(false)
  })

  it('looks_dry → seasonal_humidity_loss, high confidence', () => {
    const r = resolve('S1-dry', softWater, 'looks_dry')
    expect(r.most_likely_cause).toBe('seasonal_humidity_loss')
    expect(r.confidence).toBe('high')
  })
})

describe('S1-dry — not_near_hair (low confidence default)', () => {
  it('extreme water + not_near_hair → hard_water_buildup, low confidence', () => {
    const r = resolve('S1-dry', extremeWater, 'not_near_hair')
    expect(r.most_likely_cause).toBe('hard_water_buildup')
    expect(r.confidence).toBe('low')
  })

  it('soft water + not_near_hair → protein_overload, low confidence', () => {
    const r = resolve('S1-dry', softWater, 'not_near_hair')
    expect(r.most_likely_cause).toBe('protein_overload')
    expect(r.confidence).toBe('low')
  })
})

// ── S2-growth ─────────────────────────────────────────────────────────────────

describe('S2-growth — broken pieces (no medical exit)', () => {
  it('broken_pieces → mechanical_breakage, high, no medical exit', () => {
    const r = resolve('S2-growth', extremeWater, 'broken_pieces')
    expect(r.most_likely_cause).toBe('mechanical_breakage')
    expect(r.confidence).toBe('high')
    expect(r.medical_exit_fires).toBe(false)
    expect(r.medical_exit_code).toBeNull()
    expect(r.recommendation_code).toBe('REC-mechanical_breakage')
  })
})

describe('S2-growth — MEDICAL EXIT: whole bulbs', () => {
  it('whole_bulbs → scalp_or_medical, MEDICAL EXIT fires with shedding code', () => {
    const r = resolve('S2-growth', softWater, 'whole_bulbs')
    expect(r.most_likely_cause).toBe('scalp_or_medical')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-shedding')
    expect(r.confidence).toBe('high')
  })
})

describe('S2-growth — MEDICAL EXIT: hairline thinning (traction)', () => {
  it('hairline_thinning → traction_damage, MEDICAL EXIT fires with traction code', () => {
    const r = resolve('S2-growth', hardWater, 'hairline_thinning')
    expect(r.most_likely_cause).toBe('traction_damage')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-traction')
    expect(r.recommendation_code).toBe('REC-traction_damage')
  })
})

describe('S2-growth — length plateau', () => {
  it('very_hard water + wont_grow_past_length → mechanical_breakage, medium (hard water compounding)', () => {
    const r = resolve('S2-growth', veryHardWater, 'wont_grow_past_length')
    expect(r.most_likely_cause).toBe('mechanical_breakage')
    expect(r.confidence).toBe('medium')
    expect(r.recommendation_code).toBe('REC-hard_water_buildup')
    expect(r.medical_exit_fires).toBe(false)
  })

  it('soft water + wont_grow_past_length → mechanical_breakage, high', () => {
    const r = resolve('S2-growth', softWater, 'wont_grow_past_length')
    expect(r.most_likely_cause).toBe('mechanical_breakage')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-mechanical_breakage')
  })
})

describe('S2-growth — chemical history', () => {
  it('chemical_history → chemical_damage_history, high', () => {
    const r = resolve('S2-growth', extremeWater, 'chemical_history')
    expect(r.most_likely_cause).toBe('chemical_damage_history')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-chemical_damage_history')
    expect(r.medical_exit_fires).toBe(false)
  })
})

// ── S3-products ───────────────────────────────────────────────────────────────

describe('S3-products — coated/filmy', () => {
  it('very_hard water + prod_coated → hard_water_buildup, high', () => {
    const r = resolve('S3-products', veryHardWater, 'prod_coated')
    expect(r.most_likely_cause).toBe('hard_water_buildup')
    expect(r.confidence).toBe('high')
  })

  it('soft water + prod_coated → product_buildup, medium', () => {
    const r = resolve('S3-products', softWater, 'prod_coated')
    expect(r.most_likely_cause).toBe('product_buildup')
    expect(r.confidence).toBe('medium')
    expect(r.recommendation_code).toBe('REC-product_buildup')
  })
})

describe('S3-products — same routine', () => {
  it('prod_same_routine → porosity_shifted, medium', () => {
    const r = resolve('S3-products', hardWater, 'prod_same_routine')
    expect(r.most_likely_cause).toBe('porosity_shifted')
    expect(r.confidence).toBe('medium')
    expect(r.recommendation_code).toBe('REC-porosity_shifted')
  })
})

describe('S3-products — seasonal', () => {
  it('prod_seasonal → seasonal_humidity_loss, high', () => {
    const r = resolve('S3-products', softWater, 'prod_seasonal')
    expect(r.most_likely_cause).toBe('seasonal_humidity_loss')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-seasonal_humidity_loss')
  })
})

describe('S3-products — moved house', () => {
  it('prod_moved → water_change, high', () => {
    const r = resolve('S3-products', extremeWater, 'prod_moved')
    expect(r.most_likely_cause).toBe('water_change')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-water_change')
    expect(r.medical_exit_fires).toBe(false)
  })
})

describe('S3-products — chemical treatment', () => {
  it('prod_chemical → porosity_shifted, high', () => {
    const r = resolve('S3-products', softWater, 'prod_chemical')
    expect(r.most_likely_cause).toBe('porosity_shifted')
    expect(r.confidence).toBe('high')
  })
})

// ── S4-parent ─────────────────────────────────────────────────────────────────

describe('S4-parent — dry and tangly', () => {
  it('hard water + parent_dry_tangly → under_moisturised, high', () => {
    const r = resolve('S4-parent', hardWater, 'parent_dry_tangly')
    expect(r.most_likely_cause).toBe('under_moisturised')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-under_moisturised')
    expect(r.medical_exit_fires).toBe(false)
  })

  it('soft water + parent_dry_tangly → under_moisturised, high', () => {
    const r = resolve('S4-parent', softWater, 'parent_dry_tangly')
    expect(r.most_likely_cause).toBe('under_moisturised')
    expect(r.confidence).toBe('high')
  })
})

describe('S4-parent — wrong products', () => {
  it('parent_wrong_products → wrong_products_for_texture, high', () => {
    const r = resolve('S4-parent', softWater, 'parent_wrong_products')
    expect(r.most_likely_cause).toBe('wrong_products_for_texture')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-wrong_products_for_texture')
    expect(r.medical_exit_fires).toBe(false)
  })
})

describe('S4-parent — detangling causes crying', () => {
  it('parent_crying → over_manipulation, high', () => {
    const r = resolve('S4-parent', hardWater, 'parent_crying')
    expect(r.most_likely_cause).toBe('over_manipulation')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-over_manipulation')
  })
})

describe('S4-parent — MEDICAL EXIT: patchy breakage', () => {
  it('parent_patches → medical_pattern, MEDICAL EXIT fires', () => {
    const r = resolve('S4-parent', softWater, 'parent_patches')
    expect(r.most_likely_cause).toBe('medical_pattern')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-patches')
    expect(r.confidence).toBe('high')
  })
})

describe('S4-parent — MEDICAL EXIT: scalp issues', () => {
  it('parent_scalp → medical_pattern, MEDICAL EXIT fires with infection code', () => {
    const r = resolve('S4-parent', extremeWater, 'parent_scalp')
    expect(r.most_likely_cause).toBe('medical_pattern')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-infection')
  })
})

// ── S5-scalp ──────────────────────────────────────────────────────────────────

describe('S5-scalp — routine causes (no medical exit)', () => {
  it('scalp_itchy_mild → dry_scalp_routine, high, no exit', () => {
    const r = resolve('S5-scalp', extremeWater, 'scalp_itchy_mild')
    expect(r.most_likely_cause).toBe('dry_scalp_routine')
    expect(r.confidence).toBe('high')
    expect(r.medical_exit_fires).toBe(false)
    expect(r.medical_exit_code).toBeNull()
  })

  it('scalp_new_product → product_irritation, high, no exit', () => {
    const r = resolve('S5-scalp', softWater, 'scalp_new_product')
    expect(r.most_likely_cause).toBe('product_irritation')
    expect(r.confidence).toBe('high')
    expect(r.recommendation_code).toBe('REC-product_irritation')
    expect(r.medical_exit_fires).toBe(false)
  })
})

describe('S5-scalp — MEDICAL EXIT: seborrhoeic dermatitis', () => {
  it('scalp_greasy_scales → seborrhoeic_dermatitis_pattern, MEDICAL EXIT fires', () => {
    const r = resolve('S5-scalp', hardWater, 'scalp_greasy_scales')
    expect(r.most_likely_cause).toBe('seborrhoeic_dermatitis_pattern')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-seb-derm')
    expect(r.confidence).toBe('high')
  })
})

describe('S5-scalp — MEDICAL EXIT: CCCA (crown loss)', () => {
  it('scalp_crown_loss → ccca_pattern, MEDICAL EXIT fires with ccca code', () => {
    const r = resolve('S5-scalp', extremeWater, 'scalp_crown_loss')
    expect(r.most_likely_cause).toBe('ccca_pattern')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-ccca')
    expect(r.confidence).toBe('high')
  })
})

describe('S5-scalp — MEDICAL EXIT: infection', () => {
  it('scalp_sores → folliculitis_or_infection, MEDICAL EXIT fires with infection code', () => {
    const r = resolve('S5-scalp', softWater, 'scalp_sores')
    expect(r.most_likely_cause).toBe('folliculitis_or_infection')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-infection')
    expect(r.confidence).toBe('high')
  })
})

// ── Structural invariants ─────────────────────────────────────────────────────

describe('Structural invariants — every resolution has required fields', () => {
  const cases: Array<Parameters<typeof resolve>> = [
    ['S1-dry', extremeWater, 'coated'],
    ['S1-dry', softWater, 'rough'],
    ['S2-growth', softWater, 'broken_pieces'],
    ['S3-products', veryHardWater, 'prod_coated'],
    ['S4-parent', softWater, 'parent_dry_tangly'],
    ['S5-scalp', hardWater, 'scalp_itchy_mild'],
  ]

  for (const [symptom, profile, descriptor] of cases) {
    it(`${symptom}/${descriptor} always returns all required fields`, () => {
      const r = resolve(symptom, profile, descriptor)
      expect(typeof r.most_likely_cause).toBe('string')
      expect(['high', 'medium', 'low']).toContain(r.confidence)
      expect(typeof r.confidence_reason).toBe('string')
      expect(r.confidence_reason.length).toBeGreaterThan(0)
      expect(typeof r.recommendation_code).toBe('string')
      expect(r.recommendation_code.startsWith('REC-')).toBe(true)
      expect(typeof r.next_branch_code).toBe('string')
      expect(typeof r.medical_exit_fires).toBe('boolean')
      if (r.medical_exit_fires) {
        expect(r.medical_exit_code).not.toBeNull()
        expect(typeof r.medical_exit_code).toBe('string')
      } else {
        expect(r.medical_exit_code).toBeNull()
      }
    })
  }
})

describe('Fallback profile — resolves usably, not just without throwing', () => {
  it('fallback profile returns a usable resolution with all required fields', () => {
    const r = resolve('S1-dry', fallback, 'coated')
    expect(r.most_likely_cause).toBeDefined()
    expect(['high', 'medium', 'low']).toContain(r.confidence)
    expect(r.confidence_reason.length).toBeGreaterThan(0)
    expect(r.recommendation_code.startsWith('REC-')).toBe(true)
    expect(r.medical_exit_fires).toBe(false)
    expect(r.medical_exit_code).toBeNull()
  })

  it('fallback profile propagates to resolver without error on all five symptoms', () => {
    const descriptors = ['coated', 'broken_pieces', 'prod_moved', 'parent_dry_tangly', 'scalp_itchy_mild'] as const
    const symptoms = ['S1-dry', 'S2-growth', 'S3-products', 'S4-parent', 'S5-scalp'] as const
    symptoms.forEach((sym, i) => {
      expect(() => resolve(sym, fallback, descriptors[i])).not.toThrow()
    })
  })
})

describe('Confidence invariant — confidence_reason is never empty', () => {
  const allCombinations: Array<Parameters<typeof resolve>> = [
    ['S1-dry', extremeWater, 'coated'],
    ['S1-dry', hardWater, 'coated'],
    ['S1-dry', softWater, 'coated'],
    ['S1-dry', veryLowHumidity, 'rough'],
    ['S1-dry', softWater, 'rough'],
    ['S1-dry', extremeWater, 'limp'],
    ['S1-dry', softWater, 'looks_dry'],
    ['S1-dry', extremeWater, 'not_near_hair'],
    ['S1-dry', softWater, 'not_near_hair'],
    ['S2-growth', softWater, 'broken_pieces'],
    ['S2-growth', softWater, 'whole_bulbs'],
    ['S2-growth', hardWater, 'hairline_thinning'],
    ['S2-growth', veryHardWater, 'wont_grow_past_length'],
    ['S2-growth', softWater, 'wont_grow_past_length'],
    ['S2-growth', extremeWater, 'chemical_history'],
    ['S3-products', veryHardWater, 'prod_coated'],
    ['S3-products', softWater, 'prod_coated'],
    ['S3-products', hardWater, 'prod_same_routine'],
    ['S3-products', softWater, 'prod_seasonal'],
    ['S3-products', extremeWater, 'prod_moved'],
    ['S3-products', softWater, 'prod_chemical'],
    ['S4-parent', hardWater, 'parent_dry_tangly'],
    ['S4-parent', softWater, 'parent_wrong_products'],
    ['S4-parent', hardWater, 'parent_crying'],
    ['S4-parent', softWater, 'parent_patches'],
    ['S4-parent', extremeWater, 'parent_scalp'],
    ['S5-scalp', extremeWater, 'scalp_itchy_mild'],
    ['S5-scalp', softWater, 'scalp_new_product'],
    ['S5-scalp', hardWater, 'scalp_greasy_scales'],
    ['S5-scalp', extremeWater, 'scalp_crown_loss'],
    ['S5-scalp', softWater, 'scalp_sores'],
  ]

  for (const [symptom, profile, descriptor] of allCombinations) {
    it(`${symptom}/${descriptor} — confidence_reason is non-empty string`, () => {
      const r = resolve(symptom, profile, descriptor)
      expect(typeof r.confidence_reason).toBe('string')
      expect(r.confidence_reason.trim().length).toBeGreaterThan(10)
    })
  }
})

describe('Medical exit parity — hair-track recommendation present alongside exit ramp', () => {
  it('whole_bulbs: medical exit fires AND hair recommendation is present', () => {
    const r = resolve('S2-growth', softWater, 'whole_bulbs')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-shedding')
    // Hair track is still present
    expect(r.recommendation_code.startsWith('REC-')).toBe(true)
    expect(r.most_likely_cause).toBeDefined()
  })

  it('hairline_thinning: medical exit fires AND hair recommendation is present', () => {
    const r = resolve('S2-growth', hardWater, 'hairline_thinning')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-traction')
    expect(r.recommendation_code).toBe('REC-traction_damage')
    expect(r.most_likely_cause).toBe('traction_damage')
  })

  it('scalp_crown_loss: medical exit fires AND hair recommendation is present', () => {
    const r = resolve('S5-scalp', extremeWater, 'scalp_crown_loss')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-ccca')
    expect(r.recommendation_code.startsWith('REC-')).toBe(true)
    expect(r.most_likely_cause).toBeDefined()
  })

  it('scalp_sores: medical exit fires AND hair recommendation is present', () => {
    const r = resolve('S5-scalp', softWater, 'scalp_sores')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).toBe('EXIT-INTRO-infection')
    expect(r.recommendation_code.startsWith('REC-')).toBe(true)
  })

  it('parent_patches: medical exit fires AND hair recommendation is present', () => {
    const r = resolve('S4-parent', softWater, 'parent_patches')
    expect(r.medical_exit_fires).toBe(true)
    expect(r.medical_exit_code).not.toBeNull()
    expect(r.recommendation_code.startsWith('REC-')).toBe(true)
    expect(r.most_likely_cause).toBeDefined()
  })
})

// ── Medical exit coverage — all five triggers ─────────────────────────────────

describe('Medical exit completeness — all five trigger codes fire', () => {
  it('shedding exit fires (S2 whole_bulbs)', () => {
    const r = resolve('S2-growth', softWater, 'whole_bulbs')
    expect(r.medical_exit_code).toBe('EXIT-INTRO-shedding')
  })
  it('traction exit fires (S2 hairline_thinning)', () => {
    const r = resolve('S2-growth', softWater, 'hairline_thinning')
    expect(r.medical_exit_code).toBe('EXIT-INTRO-traction')
  })
  it('ccca exit fires (S5 crown loss)', () => {
    const r = resolve('S5-scalp', softWater, 'scalp_crown_loss')
    expect(r.medical_exit_code).toBe('EXIT-INTRO-ccca')
  })
  it('seb-derm exit fires (S5 greasy scales)', () => {
    const r = resolve('S5-scalp', softWater, 'scalp_greasy_scales')
    expect(r.medical_exit_code).toBe('EXIT-INTRO-seb-derm')
  })
  it('infection exit fires (S5 sores)', () => {
    const r = resolve('S5-scalp', softWater, 'scalp_sores')
    expect(r.medical_exit_code).toBe('EXIT-INTRO-infection')
  })
})

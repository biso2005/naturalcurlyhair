export type SymptomCode = 'S1-dry' | 'S2-growth' | 'S3-products' | 'S4-parent' | 'S5-scalp'

export type WaterBand = 'soft' | 'moderate' | 'hard' | 'very_hard' | 'extreme'
export type HumidityBand = 'low' | 'moderate' | 'high'
export type ChlorineLevel = 'low' | 'moderate' | 'high'
export type SalonDensity = 'high' | 'moderate' | 'low' | 'very_low'
export type Confidence = 'high' | 'medium' | 'low'

export interface PostcodeProfile {
  district: string
  water_hardness_mgl: number
  water_band: WaterBand
  water_uk_percentile: number
  humidity_avg: number
  humidity_band: HumidityBand
  chlorine_level: ChlorineLevel
  region: string
  salon_density: SalonDensity
  _is_fallback?: boolean
}

export type SurfaceDescriptor =
  // S1-dry
  | 'coated'
  | 'rough'
  | 'limp'
  | 'looks_dry'
  | 'not_near_hair'
  // S2-growth
  | 'broken_pieces'
  | 'whole_bulbs'
  | 'hairline_thinning'
  | 'wont_grow_past_length'
  | 'chemical_history'
  // S3-products
  | 'prod_coated'
  | 'prod_same_routine'
  | 'prod_seasonal'
  | 'prod_moved'
  | 'prod_chemical'
  // S4-parent
  | 'parent_dry_tangly'
  | 'parent_wrong_products'
  | 'parent_crying'
  | 'parent_patches'
  | 'parent_scalp'
  // S5-scalp
  | 'scalp_itchy_mild'
  | 'scalp_new_product'
  | 'scalp_greasy_scales'
  | 'scalp_crown_loss'
  | 'scalp_sores'

export type CauseCode =
  | 'hard_water_buildup'
  | 'low_porosity_sealed_wrong'
  | 'protein_overload'
  | 'moisture_overload'
  | 'seasonal_humidity_loss'
  | 'mechanical_breakage'
  | 'protein_moisture_imbalance'
  | 'traction_damage'
  | 'chemical_damage_history'
  | 'scalp_or_medical'
  | 'product_buildup'
  | 'porosity_shifted'
  | 'water_change'
  | 'seasonal_shift'
  | 'under_moisturised'
  | 'wrong_products_for_texture'
  | 'over_manipulation'
  | 'dry_scalp_routine'
  | 'product_irritation'
  | 'seborrhoeic_dermatitis_pattern'
  | 'ccca_pattern'
  | 'folliculitis_or_infection'
  | 'medical_pattern'

export type MedicalExitCode =
  | 'EXIT-INTRO-shedding'
  | 'EXIT-INTRO-traction'
  | 'EXIT-INTRO-ccca'
  | 'EXIT-INTRO-seb-derm'
  | 'EXIT-INTRO-infection'
  | 'EXIT-INTRO-patches'

export interface Resolution {
  most_likely_cause: CauseCode
  confidence: Confidence
  confidence_reason: string
  recommendation_code: string
  next_branch_code: string
  medical_exit_fires: boolean
  medical_exit_code: MedicalExitCode | null
}

function isHardWater(band: WaterBand): boolean {
  return band === 'hard' || band === 'very_hard' || band === 'extreme'
}

function isVeryHardOrExtreme(band: WaterBand): boolean {
  return band === 'very_hard' || band === 'extreme'
}

function resolveS1(profile: PostcodeProfile, descriptor: SurfaceDescriptor): Resolution {
  switch (descriptor) {
    case 'coated':
      if (isVeryHardOrExtreme(profile.water_band)) {
        return {
          most_likely_cause: 'hard_water_buildup',
          confidence: 'high',
          confidence_reason: 'Very hard or extreme water combined with a coated feeling is a strong match for mineral film buildup.',
          recommendation_code: 'REC-hard_water_buildup',
          next_branch_code: 'BRANCH-from-hard-water',
          medical_exit_fires: false,
          medical_exit_code: null,
        }
      }
      if (profile.water_band === 'hard') {
        return {
          most_likely_cause: 'hard_water_buildup',
          confidence: 'medium',
          confidence_reason: 'Hard water is a plausible factor for a coated feeling, but not certain at this hardness level.',
          recommendation_code: 'REC-hard_water_buildup',
          next_branch_code: 'BRANCH-from-hard-water',
          medical_exit_fires: false,
          medical_exit_code: null,
        }
      }
      return {
        most_likely_cause: 'low_porosity_sealed_wrong',
        confidence: 'medium',
        confidence_reason: 'Soft or moderate water makes mineral buildup unlikely; a coated feeling in soft-water areas typically points to low porosity and products sitting on top.',
        recommendation_code: 'REC-low_porosity_sealed_wrong',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'rough':
      if (profile.humidity_band === 'low') {
        return {
          most_likely_cause: 'seasonal_humidity_loss',
          confidence: 'medium',
          confidence_reason: 'Low humidity combined with rough, straw-like hair is consistent with moisture being pulled out by dry air, especially in UK winters.',
          recommendation_code: 'REC-seasonal_humidity_loss',
          next_branch_code: 'BRANCH-from-protein',
          medical_exit_fires: false,
          medical_exit_code: null,
        }
      }
      return {
        most_likely_cause: 'protein_overload',
        confidence: 'medium',
        confidence_reason: 'Rough or straw-like texture without low humidity is the classic protein overload presentation.',
        recommendation_code: 'REC-protein_overload',
        next_branch_code: 'BRANCH-from-protein',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'limp':
      return {
        most_likely_cause: 'moisture_overload',
        confidence: 'medium',
        confidence_reason: 'Limp, weighed-down hair is the signature of moisture overload — too much conditioning, not enough protein.',
        recommendation_code: 'REC-moisture_overload',
        next_branch_code: 'BRANCH-from-protein',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'looks_dry':
      return {
        most_likely_cause: 'seasonal_humidity_loss',
        confidence: 'high',
        confidence_reason: 'Hair that looks dry but feels normal to touch is characteristic of low ambient humidity — dry air makes hair appear dull without changing texture.',
        recommendation_code: 'REC-seasonal_humidity_loss',
        next_branch_code: 'BRANCH-from-protein',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'not_near_hair':
    default:
      if (isVeryHardOrExtreme(profile.water_band)) {
        return {
          most_likely_cause: 'hard_water_buildup',
          confidence: 'low',
          confidence_reason: 'Without a surface descriptor, relying on postcode data only. Very hard water areas lean toward mineral buildup as the default first check.',
          recommendation_code: 'REC-hard_water_buildup',
          next_branch_code: 'BRANCH-from-hard-water',
          medical_exit_fires: false,
          medical_exit_code: null,
        }
      }
      return {
        most_likely_cause: 'protein_overload',
        confidence: 'low',
        confidence_reason: "Without a surface descriptor and without a strong hard-water signal, this is a low-confidence default. The first try is a protein elimination test.",
        recommendation_code: 'REC-protein_overload',
        next_branch_code: 'BRANCH-from-protein',
        medical_exit_fires: false,
        medical_exit_code: null,
      }
  }
}

function resolveS2(profile: PostcodeProfile, descriptor: SurfaceDescriptor): Resolution {
  switch (descriptor) {
    case 'broken_pieces':
      return {
        most_likely_cause: 'mechanical_breakage',
        confidence: 'high',
        confidence_reason: 'Short broken pieces without root bulbs is the clearest indicator of mechanical breakage — the retention problem, not a growth problem.',
        recommendation_code: 'REC-mechanical_breakage',
        next_branch_code: 'BRANCH-from-mechanical',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'whole_bulbs':
      return {
        most_likely_cause: 'scalp_or_medical',
        confidence: 'high',
        confidence_reason: 'Whole hairs with white root bulbs indicate shedding from the follicle, not breakage. This warrants clinical assessment.',
        recommendation_code: 'REC-mechanical_breakage',
        next_branch_code: 'BRANCH-from-mechanical',
        medical_exit_fires: true,
        medical_exit_code: 'EXIT-INTRO-shedding',
      }

    case 'hairline_thinning':
      return {
        most_likely_cause: 'traction_damage',
        confidence: 'high',
        confidence_reason: 'Hairline thinning or lost edges is the signature presentation of traction alopecia from repeated tension styling.',
        recommendation_code: 'REC-traction_damage',
        next_branch_code: 'BRANCH-from-mechanical',
        medical_exit_fires: true,
        medical_exit_code: 'EXIT-INTRO-traction',
      }

    case 'wont_grow_past_length':
      if (isVeryHardOrExtreme(profile.water_band)) {
        return {
          most_likely_cause: 'mechanical_breakage',
          confidence: 'medium',
          confidence_reason: 'Length plateau in a very hard water area suggests mineral-induced brittleness is compounding mechanical breakage at the ends.',
          recommendation_code: 'REC-hard_water_buildup',
          next_branch_code: 'BRANCH-from-mechanical',
          medical_exit_fires: false,
          medical_exit_code: null,
        }
      }
      return {
        most_likely_cause: 'mechanical_breakage',
        confidence: 'high',
        confidence_reason: 'A consistent length plateau means breakage at the ends is matching growth rate. This is a retention problem.',
        recommendation_code: 'REC-mechanical_breakage',
        next_branch_code: 'BRANCH-from-mechanical',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'chemical_history':
      return {
        most_likely_cause: 'chemical_damage_history',
        confidence: 'high',
        confidence_reason: 'Recent relaxer, heat, or dye use with ongoing breakage is consistent with chemical damage weakening the shaft.',
        recommendation_code: 'REC-chemical_damage_history',
        next_branch_code: 'BRANCH-from-mechanical',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    default:
      return {
        most_likely_cause: 'mechanical_breakage',
        confidence: 'low',
        confidence_reason: 'Without a clear surface descriptor, mechanical breakage is the most common cause of perceived lack of growth.',
        recommendation_code: 'REC-mechanical_breakage',
        next_branch_code: 'BRANCH-from-mechanical',
        medical_exit_fires: false,
        medical_exit_code: null,
      }
  }
}

function resolveS3(profile: PostcodeProfile, descriptor: SurfaceDescriptor): Resolution {
  switch (descriptor) {
    case 'prod_coated':
      if (isVeryHardOrExtreme(profile.water_band)) {
        return {
          most_likely_cause: 'hard_water_buildup',
          confidence: 'high',
          confidence_reason: 'A coated or filmy feeling in a very hard water area is a strong match for mineral buildup blocking product absorption.',
          recommendation_code: 'REC-hard_water_buildup',
          next_branch_code: 'BRANCH-from-hard-water',
          medical_exit_fires: false,
          medical_exit_code: null,
        }
      }
      return {
        most_likely_cause: 'product_buildup',
        confidence: 'medium',
        confidence_reason: 'A coated feeling without a strong hard-water signal points to product buildup from layering.',
        recommendation_code: 'REC-product_buildup',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'prod_same_routine':
      return {
        most_likely_cause: 'porosity_shifted',
        confidence: 'medium',
        confidence_reason: 'Same routine, different results is the hallmark of porosity shift — the hair has changed, not the products.',
        recommendation_code: 'REC-porosity_shifted',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'prod_seasonal':
      return {
        most_likely_cause: 'seasonal_humidity_loss',
        confidence: 'high',
        confidence_reason: 'A seasonal pattern — works in summer, fails in winter or vice versa — is characteristic of humidity-driven routine failure.',
        recommendation_code: 'REC-seasonal_humidity_loss',
        next_branch_code: 'BRANCH-from-protein',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'prod_moved':
      return {
        most_likely_cause: 'water_change',
        confidence: 'high',
        confidence_reason: 'Moving house is a classic trigger for products stopping working — different water chemistry changes how every product behaves.',
        recommendation_code: 'REC-water_change',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'prod_chemical':
      return {
        most_likely_cause: 'porosity_shifted',
        confidence: 'high',
        confidence_reason: 'A recent chemical service changes hair porosity directly — products that worked before are now wrong for the current hair state.',
        recommendation_code: 'REC-porosity_shifted',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    default:
      return {
        most_likely_cause: 'product_buildup',
        confidence: 'low',
        confidence_reason: 'Without a clear descriptor, product buildup is the most common first cause to rule out.',
        recommendation_code: 'REC-product_buildup',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }
  }
}

function resolveS4(profile: PostcodeProfile, descriptor: SurfaceDescriptor): Resolution {
  switch (descriptor) {
    case 'parent_dry_tangly':
      if (isHardWater(profile.water_band)) {
        return {
          most_likely_cause: 'under_moisturised',
          confidence: 'high',
          confidence_reason: 'Dry, tangly, difficult-to-comb children\'s hair in a hard water area — moisture deficiency compounded by mineral buildup is very likely.',
          recommendation_code: 'REC-under_moisturised',
          next_branch_code: 'BRANCH-from-hard-water',
          medical_exit_fires: false,
          medical_exit_code: null,
        }
      }
      return {
        most_likely_cause: 'under_moisturised',
        confidence: 'high',
        confidence_reason: 'Dry, tangly, painful-to-comb hair is the most common presenting issue for children\'s coily hair — almost always a moisture and technique problem.',
        recommendation_code: 'REC-under_moisturised',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'parent_wrong_products':
      return {
        most_likely_cause: 'wrong_products_for_texture',
        confidence: 'high',
        confidence_reason: 'Standard kids\' or European-hair products stripping coily hair is the most direct cause of dryness and breakage.',
        recommendation_code: 'REC-wrong_products_for_texture',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'parent_crying':
      return {
        most_likely_cause: 'over_manipulation',
        confidence: 'high',
        confidence_reason: 'Painful detangling is almost always a technique problem — wrong tools, wrong order, insufficient slip.',
        recommendation_code: 'REC-over_manipulation',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'parent_patches':
      return {
        most_likely_cause: 'medical_pattern',
        confidence: 'high',
        confidence_reason: 'Patchy breakage in children warrants medical assessment to rule out tinea capitis, alopecia areata, or traction-related causes.',
        recommendation_code: 'REC-over_manipulation',
        next_branch_code: 'BRANCH-from-mechanical',
        medical_exit_fires: true,
        medical_exit_code: 'EXIT-INTRO-patches',
      }

    case 'parent_scalp':
      return {
        most_likely_cause: 'medical_pattern',
        confidence: 'high',
        confidence_reason: 'Flaking, sores, or odour on a child\'s scalp needs a GP to rule out fungal infection or seborrhoeic dermatitis.',
        recommendation_code: 'REC-dry_scalp_routine',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: true,
        medical_exit_code: 'EXIT-INTRO-infection',
      }

    default:
      return {
        most_likely_cause: 'under_moisturised',
        confidence: 'low',
        confidence_reason: 'Moisture deficiency is the most common starting point for children\'s coily hair issues when no specific descriptor is available.',
        recommendation_code: 'REC-under_moisturised',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }
  }
}

function resolveS5(_profile: PostcodeProfile, descriptor: SurfaceDescriptor): Resolution {
  switch (descriptor) {
    case 'scalp_itchy_mild':
      return {
        most_likely_cause: 'dry_scalp_routine',
        confidence: 'high',
        confidence_reason: 'Mild itching and flaking without pain or patches is consistent with routine dry scalp — the most common and most manageable cause.',
        recommendation_code: 'REC-dry_scalp_routine',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'scalp_new_product':
      return {
        most_likely_cause: 'product_irritation',
        confidence: 'high',
        confidence_reason: 'Symptoms starting after a product change points directly to ingredient irritation.',
        recommendation_code: 'REC-product_irritation',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }

    case 'scalp_greasy_scales':
      return {
        most_likely_cause: 'seborrhoeic_dermatitis_pattern',
        confidence: 'high',
        confidence_reason: 'Greasy patches with yellow scales, especially along the hairline, is consistent with seborrhoeic dermatitis — a medical presentation.',
        recommendation_code: 'REC-dry_scalp_routine',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: true,
        medical_exit_code: 'EXIT-INTRO-seb-derm',
      }

    case 'scalp_crown_loss':
      return {
        most_likely_cause: 'ccca_pattern',
        confidence: 'high',
        confidence_reason: 'Hair loss at the crown combined with scalp symptoms is the presentation pattern of CCCA — early assessment matters significantly for outcome.',
        recommendation_code: 'REC-dry_scalp_routine',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: true,
        medical_exit_code: 'EXIT-INTRO-ccca',
      }

    case 'scalp_sores':
      return {
        most_likely_cause: 'folliculitis_or_infection',
        confidence: 'high',
        confidence_reason: 'Sores, scabs, or pus on the scalp is consistent with folliculitis or infection and requires prompt clinical assessment.',
        recommendation_code: 'REC-dry_scalp_routine',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: true,
        medical_exit_code: 'EXIT-INTRO-infection',
      }

    default:
      return {
        most_likely_cause: 'dry_scalp_routine',
        confidence: 'low',
        confidence_reason: 'Without a specific descriptor, dry scalp routine is the safest first check for scalp complaints.',
        recommendation_code: 'REC-dry_scalp_routine',
        next_branch_code: 'BRANCH-from-hard-water',
        medical_exit_fires: false,
        medical_exit_code: null,
      }
  }
}

export function resolve(
  symptom_code: SymptomCode,
  postcode_profile: PostcodeProfile,
  surface_descriptor: SurfaceDescriptor,
): Resolution {
  switch (symptom_code) {
    case 'S1-dry':
      return resolveS1(postcode_profile, surface_descriptor)
    case 'S2-growth':
      return resolveS2(postcode_profile, surface_descriptor)
    case 'S3-products':
      return resolveS3(postcode_profile, surface_descriptor)
    case 'S4-parent':
      return resolveS4(postcode_profile, surface_descriptor)
    case 'S5-scalp':
      return resolveS5(postcode_profile, surface_descriptor)
  }
}

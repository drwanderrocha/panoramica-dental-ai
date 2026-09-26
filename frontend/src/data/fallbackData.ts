import type { AnalysisResponse, SampleItem, FindingItem } from '../types/dental';

export const FALLBACK_SAMPLES: SampleItem[] = [
  {
    "id": "sample_panoramic_01.jpg",
    "filename": "sample_panoramic_01.jpg",
    "modality": "panoramic",
    "url": "/static/samples/sample_panoramic_01.jpg",
    "description": "Panor\u00e2mica: Terceiros molares inclusos e apinhamento anterior",
    "size_bytes": 2329326
  },
  {
    "id": "sample_panoramic_02.jpg",
    "filename": "sample_panoramic_02.jpg",
    "modality": "panoramic",
    "url": "/static/samples/sample_panoramic_02.jpg",
    "description": "Panor\u00e2mica: C\u00e1rie no dente 18 e dente 48 (siso) impactado",
    "size_bytes": 622262
  },
  {
    "id": "periapical/sample_periapical_01_lesao_apical.jpg",
    "filename": "sample_periapical_01_lesao_apical.jpg",
    "modality": "periapical",
    "url": "/static/samples/periapical/sample_periapical_01_lesao_apical.jpg",
    "description": "Periapical: Pr\u00e9-molares com Les\u00e3o Periapical (Periodontite Apical) e RCF",
    "size_bytes": 51125
  },
  {
    "id": "periapical/sample_periapical_02_carie_profunda.jpg",
    "filename": "sample_periapical_02_carie_profunda.jpg",
    "modality": "periapical",
    "url": "/static/samples/periapical/sample_periapical_02_carie_profunda.jpg",
    "description": "Periapical: Molares com C\u00e1rie Interproximal profunda e polpa evidente",
    "size_bytes": 50564
  },
  {
    "id": "periapical/sample_periapical_03_perda_ossea.jpg",
    "filename": "sample_periapical_03_perda_ossea.jpg",
    "modality": "periapical",
    "url": "/static/samples/periapical/sample_periapical_03_perda_ossea.jpg",
    "description": "Periapical: Regi\u00e3o posterior com Reabsor\u00e7\u00e3o \u00d3ssea Alveolar (Periodontia)",
    "size_bytes": 49914
  },
  {
    "id": "periapical/sample_periapical_04_higido.jpg",
    "filename": "sample_periapical_04_higido.jpg",
    "modality": "periapical",
    "url": "/static/samples/periapical/sample_periapical_04_higido.jpg",
    "description": "Periapical: Dentes posteriores h\u00edgidos (Controle com crista \u00f3ssea intacta)",
    "size_bytes": 44057
  }
];

export const FALLBACK_ANALYSES: Record<string, AnalysisResponse> = {
  "sample_panoramic_01.jpg": {
    "exam_id": "789d292a-d413-40dc-8b4e-61f049c2000c",
    "modality": {
      "detected": "panoramic",
      "confidence": 0.96,
      "is_panoramic": true,
      "is_periapical": false
    },
    "image_quality": {
      "score": 0.99,
      "usable": true,
      "is_panoramic": true,
      "panoramic_confidence": 0.96,
      "is_periapical": false,
      "periapical_confidence": 0.1,
      "sharpness": 747.1,
      "mean_brightness": 107.7,
      "contrast_std": 62.6,
      "aspect_ratio": 2.14,
      "dimensions": {
        "width": 3292,
        "height": 1536
      },
      "warnings": []
    },
    "teeth": [
      {
        "fdi_number": 11,
        "presence": "present",
        "confidence": 0.609,
        "bbox_normalized": [
          0.451,
          0.179,
          0.0445,
          0.2815
        ]
      },
      {
        "fdi_number": 12,
        "presence": "present",
        "confidence": 0.59,
        "bbox_normalized": [
          0.4241,
          0.1725,
          0.0398,
          0.2833
        ]
      },
      {
        "fdi_number": 13,
        "presence": "present",
        "confidence": 0.567,
        "bbox_normalized": [
          0.3829,
          0.1298,
          0.0517,
          0.336
        ]
      },
      {
        "fdi_number": 14,
        "presence": "present",
        "confidence": 0.574,
        "bbox_normalized": [
          0.3535,
          0.1766,
          0.0575,
          0.2869
        ]
      },
      {
        "fdi_number": 15,
        "presence": "present",
        "confidence": 0.603,
        "bbox_normalized": [
          0.3271,
          0.175,
          0.0566,
          0.2844
        ]
      },
      {
        "fdi_number": 16,
        "presence": "present",
        "confidence": 0.609,
        "bbox_normalized": [
          0.279,
          0.1808,
          0.0678,
          0.2759
        ]
      },
      {
        "fdi_number": 17,
        "presence": "present",
        "confidence": 0.619,
        "bbox_normalized": [
          0.2303,
          0.1904,
          0.0641,
          0.268
        ]
      },
      {
        "fdi_number": 21,
        "presence": "present",
        "confidence": 0.622,
        "bbox_normalized": [
          0.4874,
          0.1729,
          0.048,
          0.2857
        ]
      },
      {
        "fdi_number": 22,
        "presence": "present",
        "confidence": 0.615,
        "bbox_normalized": [
          0.5229,
          0.1883,
          0.0447,
          0.2699
        ]
      },
      {
        "fdi_number": 23,
        "presence": "present",
        "confidence": 0.583,
        "bbox_normalized": [
          0.5718,
          0.1668,
          0.0599,
          0.3053
        ]
      },
      {
        "fdi_number": 24,
        "presence": "present",
        "confidence": 0.535,
        "bbox_normalized": [
          0.597,
          0.1555,
          0.0675,
          0.3124
        ]
      },
      {
        "fdi_number": 25,
        "presence": "present",
        "confidence": 0.597,
        "bbox_normalized": [
          0.6319,
          0.1802,
          0.0866,
          0.2811
        ]
      },
      {
        "fdi_number": 26,
        "presence": "present",
        "confidence": 0.664,
        "bbox_normalized": [
          0.7311,
          0.1754,
          0.053,
          0.2067
        ]
      },
      {
        "fdi_number": 31,
        "presence": "present",
        "confidence": 0.549,
        "bbox_normalized": [
          0.4927,
          0.4662,
          0.0354,
          0.2457
        ]
      },
      {
        "fdi_number": 32,
        "presence": "present",
        "confidence": 0.634,
        "bbox_normalized": [
          0.5155,
          0.4677,
          0.0368,
          0.2492
        ]
      },
      {
        "fdi_number": 33,
        "presence": "present",
        "confidence": 0.529,
        "bbox_normalized": [
          0.5379,
          0.4711,
          0.0481,
          0.3162
        ]
      },
      {
        "fdi_number": 34,
        "presence": "present",
        "confidence": 0.634,
        "bbox_normalized": [
          0.5678,
          0.4801,
          0.0489,
          0.2816
        ]
      },
      {
        "fdi_number": 35,
        "presence": "present",
        "confidence": 0.652,
        "bbox_normalized": [
          0.5928,
          0.4726,
          0.0559,
          0.2875
        ]
      },
      {
        "fdi_number": 36,
        "presence": "present",
        "confidence": 0.638,
        "bbox_normalized": [
          0.6273,
          0.4676,
          0.0913,
          0.2605
        ]
      },
      {
        "fdi_number": 37,
        "presence": "present",
        "confidence": 0.622,
        "bbox_normalized": [
          0.6925,
          0.1843,
          0.0601,
          0.2803
        ]
      },
      {
        "fdi_number": 38,
        "presence": "present",
        "confidence": 0.551,
        "bbox_normalized": [
          0.6933,
          0.4513,
          0.0792,
          0.2585
        ]
      },
      {
        "fdi_number": 41,
        "presence": "present",
        "confidence": 0.524,
        "bbox_normalized": [
          0.4703,
          0.4664,
          0.035,
          0.2465
        ]
      },
      {
        "fdi_number": 42,
        "presence": "present",
        "confidence": 0.562,
        "bbox_normalized": [
          0.4438,
          0.4673,
          0.0393,
          0.2629
        ]
      },
      {
        "fdi_number": 43,
        "presence": "present",
        "confidence": 0.598,
        "bbox_normalized": [
          0.4082,
          0.4632,
          0.0484,
          0.3355
        ]
      },
      {
        "fdi_number": 44,
        "presence": "present",
        "confidence": 0.649,
        "bbox_normalized": [
          0.3474,
          0.4627,
          0.0665,
          0.3014
        ]
      },
      {
        "fdi_number": 45,
        "presence": "present",
        "confidence": 0.607,
        "bbox_normalized": [
          0.2852,
          0.4573,
          0.0966,
          0.2813
        ]
      },
      {
        "fdi_number": 46,
        "presence": "present",
        "confidence": 0.682,
        "bbox_normalized": [
          0.234,
          0.4585,
          0.0824,
          0.2595
        ]
      }
    ],
    "findings": [
      {
        "id": "fnd-f85a9024",
        "fdi_number": 46,
        "category": "structural",
        "type": "wisdom_tooth",
        "label": "Terceiro molar / Siso (incluso/erupcionado) \u2014 Dente 46",
        "confidence": 0.393,
        "confidence_tier": "low",
        "bbox_normalized": [
          0.1766,
          0.4343,
          0.0821,
          0.1315
        ],
        "status": "pending",
        "source": "ai",
        "notes": null
      },
      {
        "id": "fnd-aae08329",
        "fdi_number": 38,
        "category": "structural",
        "type": "wisdom_tooth",
        "label": "Terceiro molar / Siso (incluso/erupcionado) \u2014 Dente 38",
        "confidence": 0.358,
        "confidence_tier": "low",
        "bbox_normalized": [
          0.7494,
          0.4883,
          0.0925,
          0.1266
        ],
        "status": "pending",
        "source": "ai",
        "notes": null
      }
    ],
    "segmentations": null,
    "image_url": "/static/samples/sample_panoramic_01.jpg",
    "meta": {
      "model_pipeline": "ONNX (abychkov/dental-fdi + liodon-ai/panoramic-pathology)",
      "inference_duration_ms": 835,
      "processed_at": "2026-09-26T00:46:58.914043"
    }
  },
  "sample_panoramic_02.jpg": {
    "exam_id": "08940f24-2387-4add-b656-1cd79e0e6330",
    "modality": {
      "detected": "panoramic",
      "confidence": 0.96,
      "is_panoramic": true,
      "is_periapical": false
    },
    "image_quality": {
      "score": 0.84,
      "usable": true,
      "is_panoramic": true,
      "panoramic_confidence": 0.96,
      "is_periapical": false,
      "periapical_confidence": 0.1,
      "sharpness": 98.7,
      "mean_brightness": 104.7,
      "contrast_std": 57.0,
      "aspect_ratio": 1.89,
      "dimensions": {
        "width": 1935,
        "height": 1024
      },
      "warnings": []
    },
    "teeth": [
      {
        "fdi_number": 11,
        "presence": "present",
        "confidence": 0.587,
        "bbox_normalized": [
          0.458,
          0.3115,
          0.0375,
          0.2109
        ]
      },
      {
        "fdi_number": 12,
        "presence": "present",
        "confidence": 0.565,
        "bbox_normalized": [
          0.43,
          0.3143,
          0.0367,
          0.2034
        ]
      },
      {
        "fdi_number": 13,
        "presence": "present",
        "confidence": 0.639,
        "bbox_normalized": [
          0.3998,
          0.2842,
          0.0408,
          0.2471
        ]
      },
      {
        "fdi_number": 14,
        "presence": "present",
        "confidence": 0.504,
        "bbox_normalized": [
          0.3592,
          0.3109,
          0.0526,
          0.2178
        ]
      },
      {
        "fdi_number": 16,
        "presence": "present",
        "confidence": 0.623,
        "bbox_normalized": [
          0.3195,
          0.3145,
          0.0608,
          0.2164
        ]
      },
      {
        "fdi_number": 17,
        "presence": "present",
        "confidence": 0.629,
        "bbox_normalized": [
          0.2764,
          0.3248,
          0.0552,
          0.2039
        ]
      },
      {
        "fdi_number": 18,
        "presence": "present",
        "confidence": 0.647,
        "bbox_normalized": [
          0.2392,
          0.3275,
          0.0546,
          0.1778
        ]
      },
      {
        "fdi_number": 21,
        "presence": "present",
        "confidence": 0.622,
        "bbox_normalized": [
          0.4901,
          0.3083,
          0.0401,
          0.2154
        ]
      },
      {
        "fdi_number": 22,
        "presence": "present",
        "confidence": 0.607,
        "bbox_normalized": [
          0.5189,
          0.3178,
          0.0397,
          0.1988
        ]
      },
      {
        "fdi_number": 23,
        "presence": "present",
        "confidence": 0.577,
        "bbox_normalized": [
          0.5437,
          0.2719,
          0.0415,
          0.2501
        ]
      },
      {
        "fdi_number": 24,
        "presence": "present",
        "confidence": 0.547,
        "bbox_normalized": [
          0.57,
          0.2987,
          0.0534,
          0.2282
        ]
      },
      {
        "fdi_number": 26,
        "presence": "present",
        "confidence": 0.626,
        "bbox_normalized": [
          0.604,
          0.308,
          0.0632,
          0.2166
        ]
      },
      {
        "fdi_number": 27,
        "presence": "present",
        "confidence": 0.638,
        "bbox_normalized": [
          0.6509,
          0.3137,
          0.0546,
          0.2034
        ]
      },
      {
        "fdi_number": 31,
        "presence": "present",
        "confidence": 0.597,
        "bbox_normalized": [
          0.4907,
          0.5105,
          0.03,
          0.1477
        ]
      },
      {
        "fdi_number": 32,
        "presence": "present",
        "confidence": 0.606,
        "bbox_normalized": [
          0.5116,
          0.5024,
          0.0349,
          0.1713
        ]
      },
      {
        "fdi_number": 33,
        "presence": "present",
        "confidence": 0.585,
        "bbox_normalized": [
          0.5343,
          0.4944,
          0.045,
          0.2249
        ]
      },
      {
        "fdi_number": 34,
        "presence": "present",
        "confidence": 0.616,
        "bbox_normalized": [
          0.5613,
          0.5067,
          0.0627,
          0.2203
        ]
      },
      {
        "fdi_number": 36,
        "presence": "present",
        "confidence": 0.686,
        "bbox_normalized": [
          0.5968,
          0.5063,
          0.0727,
          0.2165
        ]
      },
      {
        "fdi_number": 37,
        "presence": "present",
        "confidence": 0.681,
        "bbox_normalized": [
          0.6487,
          0.4949,
          0.0759,
          0.214
        ]
      },
      {
        "fdi_number": 38,
        "presence": "present",
        "confidence": 0.663,
        "bbox_normalized": [
          0.6976,
          0.4571,
          0.0693,
          0.212
        ]
      },
      {
        "fdi_number": 41,
        "presence": "present",
        "confidence": 0.605,
        "bbox_normalized": [
          0.4661,
          0.5121,
          0.0293,
          0.1465
        ]
      },
      {
        "fdi_number": 42,
        "presence": "present",
        "confidence": 0.609,
        "bbox_normalized": [
          0.4393,
          0.5017,
          0.036,
          0.1785
        ]
      },
      {
        "fdi_number": 43,
        "presence": "present",
        "confidence": 0.584,
        "bbox_normalized": [
          0.4111,
          0.5047,
          0.0392,
          0.2241
        ]
      },
      {
        "fdi_number": 44,
        "presence": "present",
        "confidence": 0.611,
        "bbox_normalized": [
          0.3626,
          0.512,
          0.0592,
          0.2214
        ]
      },
      {
        "fdi_number": 46,
        "presence": "present",
        "confidence": 0.661,
        "bbox_normalized": [
          0.3156,
          0.513,
          0.0726,
          0.2135
        ]
      },
      {
        "fdi_number": 47,
        "presence": "present",
        "confidence": 0.7,
        "bbox_normalized": [
          0.2596,
          0.5077,
          0.0741,
          0.2083
        ]
      },
      {
        "fdi_number": 48,
        "presence": "present",
        "confidence": 0.652,
        "bbox_normalized": [
          0.2073,
          0.4779,
          0.0772,
          0.2021
        ]
      }
    ],
    "findings": [
      {
        "id": "fnd-0ec8414c",
        "fdi_number": 18,
        "category": "pathology",
        "type": "decay",
        "label": "Suspeita de les\u00e3o cariosa coron\u00e1ria \u2014 Dente 18",
        "confidence": 0.372,
        "confidence_tier": "low",
        "bbox_normalized": [
          0.2314,
          0.3488,
          0.069,
          0.1525
        ],
        "status": "pending",
        "source": "ai",
        "notes": "Les\u00e3o cariosa coron\u00e1ria no terceiro molar superior direito (dente 18)."
      },
      {
        "id": "fnd-5832f755",
        "fdi_number": 48,
        "category": "structural",
        "type": "wisdom_tooth",
        "label": "Terceiro molar / Siso (incluso/impactado) \u2014 Dente 48",
        "confidence": 0.88,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.2018,
          0.4812,
          0.0922,
          0.1665
        ],
        "status": "pending",
        "source": "ai",
        "notes": "Terceiro molar inferior direito (48) impactado em posi\u00e7\u00e3o mesioangular contra a raiz distal do dente 47."
      }
    ],
    "segmentations": null,
    "image_url": "/static/samples/sample_panoramic_02.jpg",
    "meta": {
      "model_pipeline": "ONNX (abychkov/dental-fdi + liodon-ai/panoramic-pathology)",
      "inference_duration_ms": 728,
      "processed_at": "2026-09-26T00:46:59.647299"
    }
  },
  "periapical/sample_periapical_01_lesao_apical.jpg": {
    "exam_id": "7605901a-0bcb-4511-bb82-1712ed1b7c22",
    "modality": {
      "detected": "periapical",
      "confidence": 0.95,
      "is_panoramic": false,
      "is_periapical": true
    },
    "image_quality": {
      "score": 0.85,
      "usable": true,
      "is_panoramic": false,
      "panoramic_confidence": 0.15,
      "is_periapical": true,
      "periapical_confidence": 0.95,
      "sharpness": 2006.3,
      "mean_brightness": 150.2,
      "contrast_std": 54.4,
      "aspect_ratio": 1.0,
      "dimensions": {
        "width": 337,
        "height": 337
      },
      "warnings": []
    },
    "teeth": [
      {
        "fdi_number": 34,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.0,
          0.0772,
          0.2582,
          0.7596
        ]
      },
      {
        "fdi_number": 35,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.2374,
          0.0772,
          0.2819,
          0.7596
        ]
      },
      {
        "fdi_number": 36,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.4985,
          0.0772,
          0.2789,
          0.7596
        ]
      },
      {
        "fdi_number": 37,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.7596,
          0.0772,
          0.2404,
          0.7596
        ]
      }
    ],
    "findings": [
      {
        "id": "finding_rcf_35",
        "fdi_number": 35,
        "category": "treatment",
        "type": "root_canal_filling",
        "label": "Tratamento Endod\u00f4ntico \u2022 D 35",
        "confidence": 0.96,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.3599,
          0.2899,
          0.0338,
          0.4558
        ],
        "status": "pending",
        "source": "ai",
        "notes": "Obtura\u00e7\u00e3o Adequada (1.1 mm do \u00e1pice). Material obturador radiopaco preenchendo o sistema de canais radiculares."
      },
      {
        "id": "finding_rcf_36",
        "fdi_number": 36,
        "category": "treatment",
        "type": "root_canal_filling",
        "label": "Tratamento Endod\u00f4ntico \u2022 D 36",
        "confidence": 0.96,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.6212,
          0.2899,
          0.0335,
          0.4558
        ],
        "status": "pending",
        "source": "ai",
        "notes": "Obtura\u00e7\u00e3o Adequada (0.8 mm do \u00e1pice). Material obturador radiopaco preenchendo o sistema de canais radiculares."
      },
      {
        "id": "finding_apical_lesion_36",
        "fdi_number": 36,
        "category": "pathology",
        "type": "apical_periodontitis",
        "label": "Periodontite Apical \u2022 D 36",
        "confidence": 0.9,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.5519,
          0.6973,
          0.181,
          0.1662
        ],
        "status": "pending",
        "source": "ai",
        "notes": "\u00c1rea radiol\u00facida circunscrita periapical associada ao \u00e1pice de 36 (~4.5 mm). Rarefa\u00e7\u00e3o \u00f3ssea periapical."
      }
    ],
    "segmentations": [
      {
        "id": "seg_tooth_34",
        "layer": "tooth",
        "label": "Dente 34 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.0,
            0.1911
          ],
          [
            0.0516,
            0.0772
          ],
          [
            0.2065,
            0.0772
          ],
          [
            0.2582,
            0.1911
          ],
          [
            0.2323,
            0.457
          ],
          [
            0.1678,
            0.8368
          ],
          [
            0.0904,
            0.8368
          ],
          [
            0.0258,
            0.457
          ]
        ],
        "bbox_normalized": [
          0.0,
          0.0772,
          0.2582,
          0.7596
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 34,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.94
        }
      },
      {
        "id": "seg_tooth_35",
        "layer": "tooth",
        "label": "Dente 35 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.2374,
            0.1911
          ],
          [
            0.2938,
            0.0772
          ],
          [
            0.4629,
            0.0772
          ],
          [
            0.5193,
            0.1911
          ],
          [
            0.4911,
            0.457
          ],
          [
            0.4206,
            0.8368
          ],
          [
            0.3361,
            0.8368
          ],
          [
            0.2656,
            0.457
          ]
        ],
        "bbox_normalized": [
          0.2374,
          0.0772,
          0.2819,
          0.7596
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 35,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.69
        }
      },
      {
        "id": "seg_tooth_36",
        "layer": "tooth",
        "label": "Dente 36 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.4985,
            0.1911
          ],
          [
            0.5543,
            0.0772
          ],
          [
            0.7217,
            0.0772
          ],
          [
            0.7774,
            0.1911
          ],
          [
            0.7496,
            0.457
          ],
          [
            0.6798,
            0.8368
          ],
          [
            0.5961,
            0.8368
          ],
          [
            0.5264,
            0.457
          ]
        ],
        "bbox_normalized": [
          0.4985,
          0.0772,
          0.2789,
          0.7596
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 36,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.72
        }
      },
      {
        "id": "seg_tooth_37",
        "layer": "tooth",
        "label": "Dente 37 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.7596,
            0.1911
          ],
          [
            0.8077,
            0.0772
          ],
          [
            0.9519,
            0.0772
          ],
          [
            1.0,
            0.1911
          ],
          [
            0.976,
            0.457
          ],
          [
            0.9159,
            0.8368
          ],
          [
            0.8438,
            0.8368
          ],
          [
            0.7837,
            0.457
          ]
        ],
        "bbox_normalized": [
          0.7596,
          0.0772,
          0.2404,
          0.7596
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 37,
          "root_length_mm": 19.0,
          "aspect_ratio": 3.16
        }
      },
      {
        "id": "seg_pulp_34",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 34",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.1095,
            0.2136
          ],
          [
            0.1457,
            0.2136
          ],
          [
            0.1379,
            0.4792
          ],
          [
            0.1353,
            0.8064
          ],
          [
            0.1199,
            0.8064
          ],
          [
            0.1173,
            0.4792
          ]
        ],
        "bbox_normalized": [
          0.1095,
          0.2136,
          0.0361,
          0.5312
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 34,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_35",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 35",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.3571,
            0.2136
          ],
          [
            0.3966,
            0.2136
          ],
          [
            0.3881,
            0.4792
          ],
          [
            0.3853,
            0.8064
          ],
          [
            0.3684,
            0.8064
          ],
          [
            0.3656,
            0.4792
          ]
        ],
        "bbox_normalized": [
          0.3571,
          0.2136,
          0.0395,
          0.5312
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 35,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_36",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 36",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.6185,
            0.2136
          ],
          [
            0.6575,
            0.2136
          ],
          [
            0.6491,
            0.4792
          ],
          [
            0.6464,
            0.8064
          ],
          [
            0.6296,
            0.8064
          ],
          [
            0.6268,
            0.4792
          ]
        ],
        "bbox_normalized": [
          0.6185,
          0.2136,
          0.0391,
          0.5312
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 36,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_37",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 37",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.8615,
            0.2136
          ],
          [
            0.8952,
            0.2136
          ],
          [
            0.888,
            0.4792
          ],
          [
            0.8855,
            0.8064
          ],
          [
            0.8711,
            0.8064
          ],
          [
            0.8687,
            0.4792
          ]
        ],
        "bbox_normalized": [
          0.8615,
          0.2136,
          0.0336,
          0.5312
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 37,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_alveolar_bone",
        "layer": "alveolar_bone",
        "label": "Crista \u00d3ssea Alveolar (N\u00edvel \u00d3sseo Fisiol\u00f3gico Preservado)",
        "color": "#10b981",
        "polygon_normalized": [
          [
            0.02,
            0.4392
          ],
          [
            0.25,
            0.457
          ],
          [
            0.5,
            0.4303
          ],
          [
            0.75,
            0.4688
          ],
          [
            0.98,
            0.4392
          ],
          [
            0.98,
            0.96
          ],
          [
            0.02,
            0.96
          ]
        ],
        "bbox_normalized": [
          0.02,
          0.4392,
          0.96,
          0.5608
        ],
        "confidence": 0.92,
        "metrics": {
          "bone_loss_percent": 9.5,
          "distance_cej_crest_mm": 1.4,
          "clinical_classification": "N\u00edvel \u00d3sseo Fisiol\u00f3gico Preservado"
        }
      },
      {
        "id": "seg_rcf_35",
        "layer": "root_canal_filling",
        "label": "Obtura\u00e7\u00e3o de Canal Dente 35 (Obtura\u00e7\u00e3o Adequada (1.1 mm do \u00e1pice))",
        "color": "#eab308",
        "polygon_normalized": [
          [
            0.3599,
            0.2899
          ],
          [
            0.3938,
            0.2899
          ],
          [
            0.3881,
            0.7456
          ],
          [
            0.3656,
            0.7456
          ]
        ],
        "bbox_normalized": [
          0.3599,
          0.2899,
          0.0338,
          0.4558
        ],
        "confidence": 0.96,
        "metrics": {
          "fdi_number": 35,
          "dist_apex_mm": 1.1,
          "evaluation": "Obtura\u00e7\u00e3o Adequada (1.1 mm do \u00e1pice)"
        }
      },
      {
        "id": "seg_rcf_36",
        "layer": "root_canal_filling",
        "label": "Obtura\u00e7\u00e3o de Canal Dente 36 (Obtura\u00e7\u00e3o Adequada (0.8 mm do \u00e1pice))",
        "color": "#eab308",
        "polygon_normalized": [
          [
            0.6212,
            0.2899
          ],
          [
            0.6547,
            0.2899
          ],
          [
            0.6491,
            0.7456
          ],
          [
            0.6268,
            0.7456
          ]
        ],
        "bbox_normalized": [
          0.6212,
          0.2899,
          0.0335,
          0.4558
        ],
        "confidence": 0.96,
        "metrics": {
          "fdi_number": 36,
          "dist_apex_mm": 0.8,
          "evaluation": "Obtura\u00e7\u00e3o Adequada (0.8 mm do \u00e1pice)"
        }
      },
      {
        "id": "seg_lesion_36",
        "layer": "apical_periodontitis",
        "label": "Les\u00e3o Periapical Dente 36 (~4.5 mm)",
        "color": "#ef4444",
        "polygon_normalized": [
          [
            0.5519,
            0.7638
          ],
          [
            0.6062,
            0.6973
          ],
          [
            0.6786,
            0.6973
          ],
          [
            0.7329,
            0.7638
          ],
          [
            0.6967,
            0.8635
          ],
          [
            0.5881,
            0.8635
          ]
        ],
        "bbox_normalized": [
          0.5519,
          0.6973,
          0.181,
          0.1662
        ],
        "confidence": 0.9,
        "metrics": {
          "fdi_number": 36,
          "diameter_mm": 4.5,
          "diagnosis_suggestion": "Periodontite Apical Cr\u00f4nica / Rarefa\u00e7\u00e3o \u00d3ssea Periapical"
        }
      }
    ],
    "image_url": "/static/samples/periapical/sample_periapical_01_lesao_apical.jpg",
    "meta": {
      "model_pipeline": "PRAD / PRNet Benchmark (9-Layer Periapical Segmentation & Endodontic Analysis)",
      "inference_duration_ms": 11,
      "processed_at": "2026-09-26T00:46:59.661043"
    }
  },
  "periapical/sample_periapical_02_carie_profunda.jpg": {
    "exam_id": "e20c5129-a3ed-45cb-9ec5-30ddc5d9ef81",
    "modality": {
      "detected": "periapical",
      "confidence": 0.95,
      "is_panoramic": false,
      "is_periapical": true
    },
    "image_quality": {
      "score": 0.83,
      "usable": true,
      "is_panoramic": false,
      "panoramic_confidence": 0.15,
      "is_periapical": true,
      "periapical_confidence": 0.95,
      "sharpness": 2715.7,
      "mean_brightness": 159.7,
      "contrast_std": 51.0,
      "aspect_ratio": 1.0,
      "dimensions": {
        "width": 337,
        "height": 337
      },
      "warnings": []
    },
    "teeth": [
      {
        "fdi_number": 34,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.0,
          0.0772,
          0.2582,
          0.7596
        ]
      },
      {
        "fdi_number": 35,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.2374,
          0.0772,
          0.2819,
          0.7596
        ]
      },
      {
        "fdi_number": 36,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.4985,
          0.0772,
          0.2789,
          0.7596
        ]
      },
      {
        "fdi_number": 37,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.7596,
          0.0772,
          0.2404,
          0.7596
        ]
      }
    ],
    "findings": [
      {
        "id": "finding_decay_35",
        "fdi_number": 35,
        "category": "pathology",
        "type": "decay",
        "label": "C\u00e1rie Dent\u00e1ria \u2022 D 35",
        "confidence": 0.89,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.3917,
          0.1513,
          0.0979,
          0.1513
        ],
        "status": "pending",
        "source": "ai",
        "notes": "\u00c1rea radiol\u00facida em coroa de 35 com envolvimento de esmalte e dentina, sugestiva de c\u00e1rie interproximal/oclusal ativa."
      },
      {
        "id": "finding_decay_36",
        "fdi_number": 36,
        "category": "pathology",
        "type": "decay",
        "label": "C\u00e1rie Dent\u00e1ria \u2022 D 36",
        "confidence": 0.89,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.5401,
          0.1513,
          0.095,
          0.1513
        ],
        "status": "pending",
        "source": "ai",
        "notes": "\u00c1rea radiol\u00facida em coroa de 36 com envolvimento de esmalte e dentina, sugestiva de c\u00e1rie interproximal/oclusal ativa."
      }
    ],
    "segmentations": [
      {
        "id": "seg_tooth_34",
        "layer": "tooth",
        "label": "Dente 34 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.0,
            0.1911
          ],
          [
            0.0516,
            0.0772
          ],
          [
            0.2065,
            0.0772
          ],
          [
            0.2582,
            0.1911
          ],
          [
            0.2323,
            0.457
          ],
          [
            0.1678,
            0.8368
          ],
          [
            0.0904,
            0.8368
          ],
          [
            0.0258,
            0.457
          ]
        ],
        "bbox_normalized": [
          0.0,
          0.0772,
          0.2582,
          0.7596
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 34,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.94
        }
      },
      {
        "id": "seg_tooth_35",
        "layer": "tooth",
        "label": "Dente 35 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.2374,
            0.1911
          ],
          [
            0.2938,
            0.0772
          ],
          [
            0.4629,
            0.0772
          ],
          [
            0.5193,
            0.1911
          ],
          [
            0.4911,
            0.457
          ],
          [
            0.4206,
            0.8368
          ],
          [
            0.3361,
            0.8368
          ],
          [
            0.2656,
            0.457
          ]
        ],
        "bbox_normalized": [
          0.2374,
          0.0772,
          0.2819,
          0.7596
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 35,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.69
        }
      },
      {
        "id": "seg_tooth_36",
        "layer": "tooth",
        "label": "Dente 36 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.4985,
            0.1911
          ],
          [
            0.5543,
            0.0772
          ],
          [
            0.7217,
            0.0772
          ],
          [
            0.7774,
            0.1911
          ],
          [
            0.7496,
            0.457
          ],
          [
            0.6798,
            0.8368
          ],
          [
            0.5961,
            0.8368
          ],
          [
            0.5264,
            0.457
          ]
        ],
        "bbox_normalized": [
          0.4985,
          0.0772,
          0.2789,
          0.7596
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 36,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.72
        }
      },
      {
        "id": "seg_tooth_37",
        "layer": "tooth",
        "label": "Dente 37 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.7596,
            0.1911
          ],
          [
            0.8077,
            0.0772
          ],
          [
            0.9519,
            0.0772
          ],
          [
            1.0,
            0.1911
          ],
          [
            0.976,
            0.457
          ],
          [
            0.9159,
            0.8368
          ],
          [
            0.8438,
            0.8368
          ],
          [
            0.7837,
            0.457
          ]
        ],
        "bbox_normalized": [
          0.7596,
          0.0772,
          0.2404,
          0.7596
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 37,
          "root_length_mm": 19.0,
          "aspect_ratio": 3.16
        }
      },
      {
        "id": "seg_pulp_34",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 34",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.1095,
            0.2136
          ],
          [
            0.1457,
            0.2136
          ],
          [
            0.1379,
            0.4792
          ],
          [
            0.1353,
            0.8064
          ],
          [
            0.1199,
            0.8064
          ],
          [
            0.1173,
            0.4792
          ]
        ],
        "bbox_normalized": [
          0.1095,
          0.2136,
          0.0361,
          0.5312
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 34,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_35",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 35",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.3571,
            0.2136
          ],
          [
            0.3966,
            0.2136
          ],
          [
            0.3881,
            0.4792
          ],
          [
            0.3853,
            0.8064
          ],
          [
            0.3684,
            0.8064
          ],
          [
            0.3656,
            0.4792
          ]
        ],
        "bbox_normalized": [
          0.3571,
          0.2136,
          0.0395,
          0.5312
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 35,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_36",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 36",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.6185,
            0.2136
          ],
          [
            0.6575,
            0.2136
          ],
          [
            0.6491,
            0.4792
          ],
          [
            0.6464,
            0.8064
          ],
          [
            0.6296,
            0.8064
          ],
          [
            0.6268,
            0.4792
          ]
        ],
        "bbox_normalized": [
          0.6185,
          0.2136,
          0.0391,
          0.5312
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 36,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_37",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 37",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.8615,
            0.2136
          ],
          [
            0.8952,
            0.2136
          ],
          [
            0.888,
            0.4792
          ],
          [
            0.8855,
            0.8064
          ],
          [
            0.8711,
            0.8064
          ],
          [
            0.8687,
            0.4792
          ]
        ],
        "bbox_normalized": [
          0.8615,
          0.2136,
          0.0336,
          0.5312
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 37,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_alveolar_bone",
        "layer": "alveolar_bone",
        "label": "Crista \u00d3ssea Alveolar (N\u00edvel \u00d3sseo Fisiol\u00f3gico Preservado)",
        "color": "#10b981",
        "polygon_normalized": [
          [
            0.02,
            0.4392
          ],
          [
            0.25,
            0.457
          ],
          [
            0.5,
            0.4303
          ],
          [
            0.75,
            0.4688
          ],
          [
            0.98,
            0.4392
          ],
          [
            0.98,
            0.96
          ],
          [
            0.02,
            0.96
          ]
        ],
        "bbox_normalized": [
          0.02,
          0.4392,
          0.96,
          0.5608
        ],
        "confidence": 0.92,
        "metrics": {
          "bone_loss_percent": 9.5,
          "distance_cej_crest_mm": 1.4,
          "clinical_classification": "N\u00edvel \u00d3sseo Fisiol\u00f3gico Preservado"
        }
      },
      {
        "id": "seg_decay_35",
        "layer": "decay",
        "label": "C\u00e1rie Coronal Dente 35",
        "color": "#f97316",
        "polygon_normalized": [
          [
            0.3917,
            0.1816
          ],
          [
            0.4407,
            0.1513
          ],
          [
            0.4896,
            0.1967
          ],
          [
            0.47,
            0.3027
          ],
          [
            0.3917,
            0.2724
          ]
        ],
        "bbox_normalized": [
          0.3917,
          0.1513,
          0.0979,
          0.1513
        ],
        "confidence": 0.89,
        "metrics": {
          "fdi_number": 35,
          "depth": "Esmalte e Dentina Profunda"
        }
      },
      {
        "id": "seg_decay_36",
        "layer": "decay",
        "label": "C\u00e1rie Coronal Dente 36",
        "color": "#f97316",
        "polygon_normalized": [
          [
            0.5401,
            0.1816
          ],
          [
            0.5875,
            0.1513
          ],
          [
            0.635,
            0.1967
          ],
          [
            0.616,
            0.3027
          ],
          [
            0.5401,
            0.2724
          ]
        ],
        "bbox_normalized": [
          0.5401,
          0.1513,
          0.095,
          0.1513
        ],
        "confidence": 0.89,
        "metrics": {
          "fdi_number": 36,
          "depth": "Esmalte e Dentina Profunda"
        }
      }
    ],
    "image_url": "/static/samples/periapical/sample_periapical_02_carie_profunda.jpg",
    "meta": {
      "model_pipeline": "PRAD / PRNet Benchmark (9-Layer Periapical Segmentation & Endodontic Analysis)",
      "inference_duration_ms": 7,
      "processed_at": "2026-09-26T00:46:59.672099"
    }
  },
  "periapical/sample_periapical_03_perda_ossea.jpg": {
    "exam_id": "54afbf87-9ba8-4e9d-81c5-44f370faf051",
    "modality": {
      "detected": "periapical",
      "confidence": 0.95,
      "is_panoramic": false,
      "is_periapical": true
    },
    "image_quality": {
      "score": 0.85,
      "usable": true,
      "is_panoramic": false,
      "panoramic_confidence": 0.15,
      "is_periapical": true,
      "periapical_confidence": 0.95,
      "sharpness": 1851.5,
      "mean_brightness": 130.9,
      "contrast_std": 62.1,
      "aspect_ratio": 1.0,
      "dimensions": {
        "width": 337,
        "height": 338
      },
      "warnings": []
    },
    "teeth": [
      {
        "fdi_number": 35,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.0,
          0.0799,
          0.3175,
          0.7574
        ]
      },
      {
        "fdi_number": 36,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.2997,
          0.0799,
          0.3798,
          0.7574
        ]
      },
      {
        "fdi_number": 37,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.6588,
          0.0799,
          0.3412,
          0.7574
        ]
      }
    ],
    "findings": [
      {
        "id": "finding_bone_loss_056abd",
        "fdi_number": null,
        "category": "pathology",
        "type": "alveolar_bone_loss",
        "label": "Perda \u00d3ssea Alveolar (28.5% de reabsor\u00e7\u00e3o)",
        "confidence": 0.91,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.04,
          0.5799,
          0.92,
          0.24
        ],
        "status": "pending",
        "source": "ai",
        "notes": "Dist\u00e2ncia JCE \u00e0 crista alveolar: 4.2 mm. Reabsor\u00e7\u00e3o \u00f3ssea interproximal moderada/severa."
      },
      {
        "id": "finding_rcf_37",
        "fdi_number": 37,
        "category": "treatment",
        "type": "root_canal_filling",
        "label": "Tratamento Endod\u00f4ntico \u2022 D 37",
        "confidence": 0.95,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.8108,
          0.3222,
          0.0341,
          0.409
        ],
        "status": "pending",
        "source": "ai",
        "notes": "Obtura\u00e7\u00e3o Adequada (0.9 mm do \u00e1pice). Tratamento de canal pr\u00e9vio radicular."
      },
      {
        "id": "finding_rest_37",
        "fdi_number": 37,
        "category": "treatment",
        "type": "dental_filling",
        "label": "Restaura\u00e7\u00e3o Coronal \u2022 D 37",
        "confidence": 0.94,
        "confidence_tier": "high",
        "bbox_normalized": [
          0.7418,
          0.1243,
          0.1691,
          0.1805
        ],
        "status": "pending",
        "source": "ai",
        "notes": "Material restaurador radiopaco na coroa cl\u00ednica do dente 37."
      }
    ],
    "segmentations": [
      {
        "id": "seg_tooth_35",
        "layer": "tooth",
        "label": "Dente 35 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.0,
            0.1935
          ],
          [
            0.0635,
            0.0799
          ],
          [
            0.254,
            0.0799
          ],
          [
            0.3175,
            0.1935
          ],
          [
            0.2858,
            0.4586
          ],
          [
            0.2064,
            0.8373
          ],
          [
            0.1111,
            0.8373
          ],
          [
            0.0318,
            0.4586
          ]
        ],
        "bbox_normalized": [
          0.0,
          0.0799,
          0.3175,
          0.7574
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 35,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.39
        }
      },
      {
        "id": "seg_tooth_36",
        "layer": "tooth",
        "label": "Dente 36 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.2997,
            0.1935
          ],
          [
            0.3757,
            0.0799
          ],
          [
            0.6036,
            0.0799
          ],
          [
            0.6795,
            0.1935
          ],
          [
            0.6415,
            0.4586
          ],
          [
            0.5466,
            0.8373
          ],
          [
            0.4326,
            0.8373
          ],
          [
            0.3377,
            0.4586
          ]
        ],
        "bbox_normalized": [
          0.2997,
          0.0799,
          0.3798,
          0.7574
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 36,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.0
        }
      },
      {
        "id": "seg_tooth_37",
        "layer": "tooth",
        "label": "Dente 37 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.6588,
            0.1935
          ],
          [
            0.727,
            0.0799
          ],
          [
            0.9318,
            0.0799
          ],
          [
            1.0,
            0.1935
          ],
          [
            0.9659,
            0.4586
          ],
          [
            0.8806,
            0.8373
          ],
          [
            0.7782,
            0.8373
          ],
          [
            0.6929,
            0.4586
          ]
        ],
        "bbox_normalized": [
          0.6588,
          0.0799,
          0.3412,
          0.7574
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 37,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.23
        }
      },
      {
        "id": "seg_pulp_35",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 35",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.135,
            0.216
          ],
          [
            0.1795,
            0.216
          ],
          [
            0.17,
            0.4808
          ],
          [
            0.1668,
            0.807
          ],
          [
            0.1477,
            0.807
          ],
          [
            0.1446,
            0.4808
          ]
        ],
        "bbox_normalized": [
          0.135,
          0.216,
          0.0445,
          0.5296
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 35,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_36",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 36",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.463,
            0.216
          ],
          [
            0.5162,
            0.216
          ],
          [
            0.5048,
            0.4808
          ],
          [
            0.501,
            0.807
          ],
          [
            0.4782,
            0.807
          ],
          [
            0.4744,
            0.4808
          ]
        ],
        "bbox_normalized": [
          0.463,
          0.216,
          0.0532,
          0.5296
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 36,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_37",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 37",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.804,
            0.216
          ],
          [
            0.8518,
            0.216
          ],
          [
            0.8415,
            0.4808
          ],
          [
            0.8381,
            0.807
          ],
          [
            0.8177,
            0.807
          ],
          [
            0.8142,
            0.4808
          ]
        ],
        "bbox_normalized": [
          0.804,
          0.216,
          0.0478,
          0.5296
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 37,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_alveolar_bone",
        "layer": "alveolar_bone",
        "label": "Crista \u00d3ssea Alveolar (Perda \u00d3ssea Alveolar Moderada / Redu\u00e7\u00e3o da Crista)",
        "color": "#10b981",
        "polygon_normalized": [
          [
            0.02,
            0.5799
          ],
          [
            0.25,
            0.5976
          ],
          [
            0.5,
            0.571
          ],
          [
            0.75,
            0.6095
          ],
          [
            0.98,
            0.5799
          ],
          [
            0.98,
            0.96
          ],
          [
            0.02,
            0.96
          ]
        ],
        "bbox_normalized": [
          0.02,
          0.5799,
          0.96,
          0.4201
        ],
        "confidence": 0.92,
        "metrics": {
          "bone_loss_percent": 28.5,
          "distance_cej_crest_mm": 4.2,
          "clinical_classification": "Perda \u00d3ssea Alveolar Moderada / Redu\u00e7\u00e3o da Crista"
        }
      },
      {
        "id": "seg_rcf_37",
        "layer": "root_canal_filling",
        "label": "Obtura\u00e7\u00e3o de Canal Dente 37 (Obtura\u00e7\u00e3o Adequada (0.9 mm do \u00e1pice))",
        "color": "#eab308",
        "polygon_normalized": [
          [
            0.8108,
            0.3222
          ],
          [
            0.845,
            0.3222
          ],
          [
            0.8381,
            0.7312
          ],
          [
            0.8177,
            0.7312
          ]
        ],
        "bbox_normalized": [
          0.8108,
          0.3222,
          0.0341,
          0.409
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 37,
          "dist_apex_mm": 0.9,
          "evaluation": "Obtura\u00e7\u00e3o Adequada (0.9 mm do \u00e1pice)"
        }
      },
      {
        "id": "seg_filling_37",
        "layer": "dental_filling",
        "label": "Restaura\u00e7\u00e3o Coronal Dente 37",
        "color": "#a855f7",
        "polygon_normalized": [
          [
            0.7418,
            0.1243
          ],
          [
            0.911,
            0.1243
          ],
          [
            0.911,
            0.3047
          ],
          [
            0.7418,
            0.3047
          ]
        ],
        "bbox_normalized": [
          0.7418,
          0.1243,
          0.1691,
          0.1805
        ],
        "confidence": 0.94,
        "metrics": {
          "fdi_number": 37,
          "adaptation": "Regular / Boa radiopacidade"
        }
      }
    ],
    "image_url": "/static/samples/periapical/sample_periapical_03_perda_ossea.jpg",
    "meta": {
      "model_pipeline": "PRAD / PRNet Benchmark (9-Layer Periapical Segmentation & Endodontic Analysis)",
      "inference_duration_ms": 7,
      "processed_at": "2026-09-26T00:46:59.682898"
    }
  },
  "periapical/sample_periapical_04_higido.jpg": {
    "exam_id": "018b4752-ecee-43f3-b142-5b3a6bd6d300",
    "modality": {
      "detected": "periapical",
      "confidence": 0.95,
      "is_panoramic": false,
      "is_periapical": true
    },
    "image_quality": {
      "score": 0.84,
      "usable": true,
      "is_panoramic": false,
      "panoramic_confidence": 0.15,
      "is_periapical": true,
      "periapical_confidence": 0.95,
      "sharpness": 1312.9,
      "mean_brightness": 141.4,
      "contrast_std": 52.5,
      "aspect_ratio": 1.0,
      "dimensions": {
        "width": 337,
        "height": 338
      },
      "warnings": []
    },
    "teeth": [
      {
        "fdi_number": 34,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.0,
          0.0799,
          0.2582,
          0.7574
        ]
      },
      {
        "fdi_number": 35,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.2374,
          0.0799,
          0.2819,
          0.7574
        ]
      },
      {
        "fdi_number": 36,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.4985,
          0.0799,
          0.2789,
          0.7574
        ]
      },
      {
        "fdi_number": 37,
        "presence": "present",
        "confidence": 0.95,
        "bbox_normalized": [
          0.7596,
          0.0799,
          0.2404,
          0.7574
        ]
      }
    ],
    "findings": [],
    "segmentations": [
      {
        "id": "seg_tooth_34",
        "layer": "tooth",
        "label": "Dente 34 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.0,
            0.1935
          ],
          [
            0.0516,
            0.0799
          ],
          [
            0.2065,
            0.0799
          ],
          [
            0.2582,
            0.1935
          ],
          [
            0.2323,
            0.4586
          ],
          [
            0.1678,
            0.8373
          ],
          [
            0.0904,
            0.8373
          ],
          [
            0.0258,
            0.4586
          ]
        ],
        "bbox_normalized": [
          0.0,
          0.0799,
          0.2582,
          0.7574
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 34,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.94
        }
      },
      {
        "id": "seg_tooth_35",
        "layer": "tooth",
        "label": "Dente 35 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.2374,
            0.1935
          ],
          [
            0.2938,
            0.0799
          ],
          [
            0.4629,
            0.0799
          ],
          [
            0.5193,
            0.1935
          ],
          [
            0.4911,
            0.4586
          ],
          [
            0.4206,
            0.8373
          ],
          [
            0.3361,
            0.8373
          ],
          [
            0.2656,
            0.4586
          ]
        ],
        "bbox_normalized": [
          0.2374,
          0.0799,
          0.2819,
          0.7574
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 35,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.69
        }
      },
      {
        "id": "seg_tooth_36",
        "layer": "tooth",
        "label": "Dente 36 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.4985,
            0.1935
          ],
          [
            0.5543,
            0.0799
          ],
          [
            0.7217,
            0.0799
          ],
          [
            0.7774,
            0.1935
          ],
          [
            0.7496,
            0.4586
          ],
          [
            0.6798,
            0.8373
          ],
          [
            0.5961,
            0.8373
          ],
          [
            0.5264,
            0.4586
          ]
        ],
        "bbox_normalized": [
          0.4985,
          0.0799,
          0.2789,
          0.7574
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 36,
          "root_length_mm": 19.0,
          "aspect_ratio": 2.72
        }
      },
      {
        "id": "seg_tooth_37",
        "layer": "tooth",
        "label": "Dente 37 (Anatomia Coroa/Raiz)",
        "color": "#38bdf8",
        "polygon_normalized": [
          [
            0.7596,
            0.1935
          ],
          [
            0.8077,
            0.0799
          ],
          [
            0.9519,
            0.0799
          ],
          [
            1.0,
            0.1935
          ],
          [
            0.976,
            0.4586
          ],
          [
            0.9159,
            0.8373
          ],
          [
            0.8438,
            0.8373
          ],
          [
            0.7837,
            0.4586
          ]
        ],
        "bbox_normalized": [
          0.7596,
          0.0799,
          0.2404,
          0.7574
        ],
        "confidence": 0.95,
        "metrics": {
          "fdi_number": 37,
          "root_length_mm": 19.0,
          "aspect_ratio": 3.16
        }
      },
      {
        "id": "seg_pulp_34",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 34",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.1095,
            0.216
          ],
          [
            0.1457,
            0.216
          ],
          [
            0.1379,
            0.4808
          ],
          [
            0.1353,
            0.807
          ],
          [
            0.1199,
            0.807
          ],
          [
            0.1173,
            0.4808
          ]
        ],
        "bbox_normalized": [
          0.1095,
          0.216,
          0.0361,
          0.5296
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 34,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_35",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 35",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.3571,
            0.216
          ],
          [
            0.3966,
            0.216
          ],
          [
            0.3881,
            0.4808
          ],
          [
            0.3853,
            0.807
          ],
          [
            0.3684,
            0.807
          ],
          [
            0.3656,
            0.4808
          ]
        ],
        "bbox_normalized": [
          0.3571,
          0.216,
          0.0395,
          0.5296
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 35,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_36",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 36",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.6185,
            0.216
          ],
          [
            0.6575,
            0.216
          ],
          [
            0.6491,
            0.4808
          ],
          [
            0.6464,
            0.807
          ],
          [
            0.6296,
            0.807
          ],
          [
            0.6268,
            0.4808
          ]
        ],
        "bbox_normalized": [
          0.6185,
          0.216,
          0.0391,
          0.5296
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 36,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_pulp_37",
        "layer": "pulp",
        "label": "Canal Radicular / Polpa Dente 37",
        "color": "#f43f5e",
        "polygon_normalized": [
          [
            0.8615,
            0.216
          ],
          [
            0.8952,
            0.216
          ],
          [
            0.888,
            0.4808
          ],
          [
            0.8855,
            0.807
          ],
          [
            0.8711,
            0.807
          ],
          [
            0.8687,
            0.4808
          ]
        ],
        "bbox_normalized": [
          0.8615,
          0.216,
          0.0336,
          0.5296
        ],
        "confidence": 0.92,
        "metrics": {
          "fdi_number": 37,
          "canal_status": "Conduto radiogr\u00e1fico evidente"
        }
      },
      {
        "id": "seg_alveolar_bone",
        "layer": "alveolar_bone",
        "label": "Crista \u00d3ssea Alveolar (N\u00edvel \u00d3sseo Fisiol\u00f3gico Preservado)",
        "color": "#10b981",
        "polygon_normalized": [
          [
            0.02,
            0.4379
          ],
          [
            0.25,
            0.4556
          ],
          [
            0.5,
            0.429
          ],
          [
            0.75,
            0.4675
          ],
          [
            0.98,
            0.4379
          ],
          [
            0.98,
            0.96
          ],
          [
            0.02,
            0.96
          ]
        ],
        "bbox_normalized": [
          0.02,
          0.4379,
          0.96,
          0.5621
        ],
        "confidence": 0.92,
        "metrics": {
          "bone_loss_percent": 9.5,
          "distance_cej_crest_mm": 1.4,
          "clinical_classification": "N\u00edvel \u00d3sseo Fisiol\u00f3gico Preservado"
        }
      }
    ],
    "image_url": "/static/samples/periapical/sample_periapical_04_higido.jpg",
    "meta": {
      "model_pipeline": "PRAD / PRNet Benchmark (9-Layer Periapical Segmentation & Endodontic Analysis)",
      "inference_duration_ms": 8,
      "processed_at": "2026-09-26T00:46:59.694371"
    }
  }
};

export function generateFallbackReport(analysis: AnalysisResponse, confirmedFindings: FindingItem[]): string {
  const isPeri = analysis.modality.is_periapical;
  const modalityTitle = isPeri
    ? "Radiografia Periapical Intraoral (Endodontia / Periodontia)"
    : "Radiografia Panorâmica dos Maxilares (Ortopantomografia)";
  const patientName = isPeri ? "Paciente Exame Periapical" : "Paciente Exame Panorâmica";
  const nowStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const accepted = confirmedFindings.filter(f => f.status === 'accepted' || f.status === 'edited' || f.status === 'manual_entry');

  const findingsByTooth: Record<string, FindingItem[]> = {};
  for (const f of accepted) {
    const key = f.fdi_number ? `Dente ${f.fdi_number}` : 'Região Geral / Crista Óssea';
    if (!findingsByTooth[key]) findingsByTooth[key] = [];
    findingsByTooth[key].push(f);
  }

  let findingsMd = "";
  if (accepted.length === 0) {
    findingsMd = `_Nenhum achado patológico ou alteração anatômica expressiva foi confirmado pelo cirurgião-dentista nesta ${modalityTitle.toLowerCase()}._\n\n`;
  } else {
    for (const [tooth, fList] of Object.entries(findingsByTooth)) {
      findingsMd += `#### ${tooth}\n`;
      for (const item of fList) {
        const statusTag = item.status === 'accepted' ? '✓ Confirmado' : (item.status === 'edited' ? '✎ Editado' : '+ Inclusão Manual');
        findingsMd += `- **${item.label}** \`[${statusTag}]\` (Confiança analítica: ${(item.confidence * 100).toFixed(1)}%)\n`;
        if (item.notes) {
          findingsMd += `  > _Nota do profissional:_ ${item.notes}\n`;
        }
      }
      findingsMd += '\n';
    }
  }

  return `# LAUDO RADIOGRÁFICO ODONTOLÓGICO ASSISTIDO POR IA

**Paciente:** ${patientName}  
**Exame ID:** \`${analysis.exam_id}\`  
**Modalidade:** ${modalityTitle}  
**Data da Revisão:** ${nowStr}  
**Responsável Técnico:** Dr. Cirurgião-Dentista Habilitado  

---

### 1. TÉCNICA E QUALIDADE DA IMAGEM
- **Padrão de aquisição:** ${modalityTitle} realizada com parâmetros técnicos adequados, demonstrando boa definição anatômica e contraste trabecular satisfatório.
- **Índice de Qualidade da Imagem:** \`${analysis.image_quality.score.toFixed(2)} / 1.00\`
- **Condição:** Exame tecnicamente satisfatório para análise ${isPeri ? 'endodôntica e periodontal de alta resolução' : 'anatômica e identificação de anomalias dentárias e ósseas'}.

---

### 2. ACHADOS RADIOGRÁFICOS CONFIRMADOS
${findingsMd}---

### 3. SÍNTESE CLÍNICO-RADIOGRÁFICA
- Total de achados validados pelo profissional: **${accepted.length}**.
- As detecções visuais e segmentações geradas pelos modelos de visão computacional (PRAD Benchmark / OralXrays-9) foram devidamente avaliadas, filtradas e ratificadas pelo cirurgião-dentista responsável.

---

### 4. NOTA ÉTICA E LEGAL
> _Este documento sintetiza os achados radiográficos triados por inteligência artificial e **integralmente validados por cirurgião-dentista habilitado**. A imagem radiográfica é um exame complementar e seus achados devem ser correlacionados com o exame clínico intraoral, testes de sensibilidade/percussão e histórico anamnésico do paciente para a determinação do plano de tratamento definitivo._
`;
}


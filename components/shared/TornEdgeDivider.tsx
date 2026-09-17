import React from 'react';

type TornEdgeDividerProps = {
  /** Color of the section ABOVE (the "torn-away" section) */
  fromColor?: string;
  /** Color of the section BELOW (revealed underneath) */
  toColor?: string;
  /** Which visual variant to use — each has unique organic irregularity */
  variant?: 1 | 2 | 3 | 4 | 5;
  /** Flip horizontally for extra variation */
  flipX?: boolean;
  className?: string;
};

/**
 * Organic distressed section divider inspired by reference 1 (Brooklyn Suya) and
 * reference 2 (BakeBerry Bakery). Creates irregular, asymmetrical, hand-painted
 * brush-stroke or torn-paper edges that span the full viewport width.
 *
 * Uses SVG feTurbulence + feDisplacementMap filters to generate genuinely organic,
 * non-repeating, noise-based edge distortion — not CSS clip-path, polygon, or
 * repeating patterns. Each variant applies different turbulence frequencies and
 * displacement amounts to produce a unique paint texture:
 *
 *   1 — Heavy brush stroke: thick paint drag, warm and weighted
 *   2 — Torn paper: ragged, chunky tear with fibrous edges
 *   3 — Dry brush drag: streaky, uneven paint with gaps
 *   4 — Rough splatter edge: chunky paint drops, chaotic
 *   5 — Mixed organic: torn-paper meets paint drip
 */
export function TornEdgeDivider({
  fromColor = 'var(--color-surface)',
  toColor = 'var(--color-background)',
  variant = 1,
  flipX = false,
  className,
}: TornEdgeDividerProps) {
  const filterId = `brush-edge-v${variant}`;

  return (
    <div
      className={`relative w-full overflow-hidden select-none pointer-events-none ${className ?? ''}`}
      aria-hidden="true"
      style={{ backgroundColor: toColor }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full"
        style={{
          height: 'clamp(50px, 10vw, 120px)',
          transform: flipX ? 'scaleX(-1)' : undefined,
        }}
        fill={fromColor}
      >
        <defs>{getFilterDef(variant, filterId)}</defs>
        <g filter={`url(#${filterId})`}>
          {getVariantPaths(variant)}
        </g>
        <g
          filter={`url(#${filterId})`}
          opacity="0.6"
        >
          {getSplatterElements(variant)}
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG Filter Definitions — one unique organic distortion per variant  */
/* ------------------------------------------------------------------ */

function getFilterDef(variant: number, id: string): React.ReactNode {
  switch (variant) {
    case 1:
      // Heavy brush stroke — thick paint, warm weighted feel
      return (
        <filter id={id} x="-20%" y="-80%" width="140%" height="300%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves={4}
            seed={11}
            result="coarse"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.08"
            numOctaves={3}
            seed={23}
            result="fine"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="coarse"
            scale={22}
            xChannelSelector="R"
            yChannelSelector="G"
            result="coarse-displaced"
          />
          <feDisplacementMap
            in="coarse-displaced"
            in2="fine"
            scale={8}
            xChannelSelector="R"
            yChannelSelector="B"
            result="fine-displaced"
          />
          <feGaussianBlur in="fine-displaced" stdDeviation="0.8" result="softened" />
          <feComposite in="softened" in2="SourceGraphic" operator="atop" />
        </filter>
      );

    case 2:
      // Torn paper — ragged tear with fibrous edge detail
      return (
        <filter id={id} x="-25%" y="-100%" width="150%" height="350%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.012"
            numOctaves={5}
            seed={37}
            result="tear"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06 0.12"
            numOctaves={3}
            seed={53}
            result="fibers"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="tear"
            scale={30}
            xChannelSelector="G"
            yChannelSelector="R"
            result="torn"
          />
          <feDisplacementMap
            in="torn"
            in2="fibers"
            scale={10}
            xChannelSelector="B"
            yChannelSelector="G"
            result="fibrous"
          />
          <feGaussianBlur in="fibrous" stdDeviation="0.6" result="softened" />
          <feComposite in="softened" in2="SourceGraphic" operator="atop" />
        </filter>
      );

    case 3:
      // Dry brush drag — streaky paint with bristle marks
      return (
        <filter id={id} x="-20%" y="-80%" width="140%" height="300%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.003"
            numOctaves={4}
            seed={71}
            result="streak"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.02"
            numOctaves={3}
            seed={89}
            result="bristle"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="streak"
            scale={18}
            xChannelSelector="R"
            yChannelSelector="B"
            result="streaked"
          />
          <feDisplacementMap
            in="streaked"
            in2="bristle"
            scale={6}
            xChannelSelector="G"
            yChannelSelector="R"
            result="bristled"
          />
          <feGaussianBlur in="bristled" stdDeviation="0.5" result="softened" />
          <feComposite in="softened" in2="SourceGraphic" operator="atop" />
        </filter>
      );

    case 4:
      // Rough splatter edge — chaotic paint drops, very irregular
      return (
        <filter id={id} x="-30%" y="-120%" width="160%" height="400%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.01"
            numOctaves={5}
            seed={103}
            result="chaos"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.07 0.05"
            numOctaves={4}
            seed={127}
            result="drops"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="chaos"
            scale={35}
            xChannelSelector="R"
            yChannelSelector="G"
            result="chaosed"
          />
          <feDisplacementMap
            in="chaosed"
            in2="drops"
            scale={12}
            xChannelSelector="B"
            yChannelSelector="R"
            result="dropped"
          />
          <feGaussianBlur in="dropped" stdDeviation="1" result="softened" />
          <feComposite in="softened" in2="SourceGraphic" operator="atop" />
        </filter>
      );

    case 5:
    default:
      // Mixed organic — torn paper meets paint drip
      return (
        <filter id={id} x="-25%" y="-100%" width="150%" height="350%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.018"
            numOctaves={4}
            seed={149}
            result="tear"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.06"
            numOctaves={5}
            seed={167}
            result="drip"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.09 0.14"
            numOctaves={3}
            seed={191}
            result="detail"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="tear"
            scale={26}
            xChannelSelector="R"
            yChannelSelector="G"
            result="torn"
          />
          <feDisplacementMap
            in="torn"
            in2="drip"
            scale={10}
            xChannelSelector="G"
            yChannelSelector="B"
            result="dripped"
          />
          <feDisplacementMap
            in="dripped"
            in2="detail"
            scale={4}
            xChannelSelector="B"
            yChannelSelector="R"
            result="detailed"
          />
          <feGaussianBlur in="detailed" stdDeviation="0.7" result="softened" />
          <feComposite in="softened" in2="SourceGraphic" operator="atop" />
        </filter>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Main paint paths — one primary shape + one translucent overlay      */
/* ------------------------------------------------------------------ */

function getVariantPaths(variant: number): React.ReactNode {
  switch (variant) {
    case 1:
      return (
        <>
          <path d="M0,0 L0,48 C12,55 28,35 52,52 C78,70 95,30 128,44 C158,56 182,38 212,54 C248,72 268,26 302,42 C335,56 362,32 398,48 C428,62 458,22 492,38 C522,52 548,34 578,46 C612,62 638,18 672,34 C702,48 728,28 762,44 C792,58 818,16 852,32 C882,46 908,24 942,40 C972,54 998,14 1032,30 C1062,44 1088,22 1122,38 C1152,52 1178,12 1212,28 C1242,42 1268,20 1302,36 C1332,50 1358,16 1392,32 C1418,44 1432,36 1440,40 L1440,0 Z" />
          <path
            d="M0,0 L0,38 C18,46 42,28 68,40 C98,54 118,22 152,34 C182,46 208,18 238,30 C268,42 288,14 318,26 C348,38 372,10 402,22 C432,34 452,8 482,18 C512,28 532,4 562,14 C592,24 612,2 642,10 C672,18 692,0 722,8 C752,16 772,0 802,6 C832,14 852,0 882,4 C912,12 932,0 962,2 C992,10 1012,0 1042,0 L1440,0 Z"
            opacity="0.42"
          />
        </>
      );

    case 2:
      return (
        <>
          <path d="M0,0 L0,62 C8,58 18,68 32,54 C48,40 58,72 74,48 C88,30 102,66 118,42 C132,24 148,60 164,38 C178,20 194,56 210,34 C224,18 240,52 256,30 C270,14 286,48 302,26 C316,10 332,44 348,22 C362,8 378,40 394,18 C408,4 424,36 440,14 C454,0 470,30 486,10 C500,0 516,24 532,6 C546,0 562,18 578,2 C592,0 608,14 624,0 L1440,0 Z" />
          <path
            d="M0,0 L0,52 C15,58 28,44 45,56 C65,70 80,36 100,50 C120,64 135,28 155,44 C175,58 190,22 210,38 C230,52 245,16 265,32 C285,46 300,10 320,26 C340,40 355,6 375,20 C395,34 410,2 430,14 C450,26 465,0 485,8 C505,18 520,0 540,4 C560,12 575,0 595,0 L1440,0 Z"
            opacity="0.35"
          />
        </>
      );

    case 3:
      return (
        <>
          <path d="M0,0 L0,72 C40,60 65,78 108,65 C148,52 172,76 215,58 C255,40 280,68 322,52 C362,36 388,62 428,46 C468,30 495,56 535,40 C575,24 602,50 642,34 C682,18 708,44 748,28 C788,12 815,38 855,22 C895,8 922,32 962,18 C1002,4 1028,28 1068,14 C1108,0 1135,22 1175,10 C1215,0 1242,16 1282,6 C1322,0 1358,12 1440,4 L1440,0 Z" />
          <path
            d="M0,0 L0,58 C50,50 85,64 135,54 C185,44 218,62 268,48 C318,34 350,54 400,44 C450,34 482,50 532,40 C582,30 614,46 664,36 C714,26 746,42 796,32 C846,22 878,38 928,28 C978,18 1010,34 1060,24 C1110,14 1142,30 1192,20 C1242,10 1274,26 1324,16 C1374,6 1408,22 1440,12 L1440,0 Z"
            opacity="0.48"
          />
          <path
            d="M0,0 L0,40 C65,34 105,44 158,36 C208,28 248,40 298,32 C348,24 388,36 438,28 C488,20 528,32 578,24 C628,16 668,28 718,20 C768,12 808,24 858,16 C908,8 948,20 998,12 C1048,4 1088,16 1138,8 C1188,0 1228,12 1278,4 C1328,0 1378,10 1440,2 L1440,0 Z"
            opacity="0.22"
          />
        </>
      );

    case 4:
      return (
        <>
          <path d="M0,0 L0,54 Q28,72 58,50 Q88,28 118,58 Q148,86 178,54 Q208,22 238,52 Q268,82 298,50 Q328,18 358,48 Q388,78 418,46 Q448,14 478,44 Q508,74 538,42 Q568,10 598,40 Q628,70 658,38 Q688,6 718,36 Q748,66 778,34 Q808,2 838,32 Q868,62 898,30 Q928,0 958,28 Q988,56 1018,26 Q1048,0 1078,24 Q1108,52 1138,22 Q1168,0 1198,20 Q1228,48 1258,18 Q1288,0 1318,16 Q1348,44 1378,14 Q1408,0 1440,10 L1440,0 Z" />
          <path
            d="M0,0 L0,34 Q42,50 82,30 Q122,10 162,38 Q202,66 242,34 Q282,2 322,30 Q362,58 402,26 Q442,0 482,22 Q522,44 562,16 Q602,0 642,18 Q682,36 722,10 Q762,0 802,14 Q842,30 882,6 Q922,0 962,10 Q1002,22 1042,2 Q1082,0 1122,6 Q1162,18 1202,0 L1440,0 Z"
            opacity="0.38"
          />
        </>
      );

    case 5:
    default:
      return (
        <>
          <path d="M0,0 L0,58 C10,64 24,46 40,60 C58,76 72,38 90,54 C108,70 124,30 142,46 C158,62 174,22 192,38 C208,54 224,14 242,30 C258,46 274,8 292,24 C308,40 324,4 342,18 C358,34 374,0 392,12 C408,28 424,0 442,8 C458,20 474,0 492,6 C508,16 524,0 542,4 C558,14 574,0 592,2 C608,12 624,0 642,0 L1440,0 Z" />
          <path
            d="M0,0 L0,44 C18,50 36,36 56,48 C76,62 92,26 112,40 C132,54 148,18 168,32 C188,46 204,10 224,24 C244,38 260,4 280,16 C300,28 316,0 336,10 C356,22 372,0 392,6 C412,18 428,0 448,4 C468,14 484,0 504,2 C524,12 544,0 564,0 L1440,0 Z"
            opacity="0.4"
          />
        </>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Splatter elements — irregular ellipses, not uniform circles         */
/* ------------------------------------------------------------------ */

function getSplatterElements(variant: number): React.ReactNode {
  switch (variant) {
    case 1:
      return (
        <>
          <ellipse cx="92" cy="60" rx="5" ry="3.5" transform="rotate(-12 92 60)" />
          <ellipse cx="228" cy="66" rx="3.5" ry="2.5" transform="rotate(8 228 66)" />
          <ellipse cx="385" cy="58" rx="6" ry="4" transform="rotate(-5 385 58)" />
          <ellipse cx="520" cy="54" rx="3" ry="2" transform="rotate(15 520 54)" />
          <ellipse cx="672" cy="60" rx="4.5" ry="3" transform="rotate(-8 672 60)" />
          <ellipse cx="818" cy="56" rx="3.5" ry="2.5" transform="rotate(10 818 56)" />
          <ellipse cx="965" cy="52" rx="5" ry="3.5" transform="rotate(-15 965 52)" />
          <ellipse cx="1108" cy="58" rx="3" ry="2" transform="rotate(6 1108 58)" />
          <ellipse cx="1255" cy="54" rx="4" ry="2.5" transform="rotate(-10 1255 54)" />
          <ellipse cx="1385" cy="50" rx="3.5" ry="2" transform="rotate(12 1385 50)" />
          <ellipse cx="152" cy="72" rx="2.5" ry="1.5" transform="rotate(-18 152 72)" />
          <ellipse cx="448" cy="76" rx="2" ry="1.5" transform="rotate(20 448 76)" />
          <ellipse cx="745" cy="64" rx="3" ry="2" transform="rotate(-8 745 64)" />
          <ellipse cx="1035" cy="58" rx="2" ry="1.5" transform="rotate(14 1035 58)" />
          <ellipse cx="1328" cy="56" rx="2.5" ry="1.5" transform="rotate(-6 1328 56)" />
        </>
      );

    case 2:
      return (
        <>
          <ellipse cx="52" cy="75" rx="3.5" ry="2.5" transform="rotate(-20 52 75)" />
          <ellipse cx="178" cy="70" rx="4" ry="3" transform="rotate(10 178 70)" />
          <ellipse cx="308" cy="66" rx="3" ry="2" transform="rotate(-8 308 66)" />
          <ellipse cx="438" cy="62" rx="5" ry="3.5" transform="rotate(15 438 62)" />
          <ellipse cx="568" cy="58" rx="3" ry="2" transform="rotate(-12 568 58)" />
          <ellipse cx="698" cy="54" rx="4" ry="2.5" transform="rotate(8 698 54)" />
          <ellipse cx="828" cy="50" rx="3.5" ry="2" transform="rotate(-15 828 50)" />
          <ellipse cx="958" cy="46" rx="3" ry="2" transform="rotate(18 958 46)" />
          <ellipse cx="1088" cy="42" rx="4" ry="2.5" transform="rotate(-10 1088 42)" />
          <ellipse cx="1218" cy="38" rx="3" ry="2" transform="rotate(6 1218 38)" />
          <ellipse cx="1348" cy="34" rx="3.5" ry="2" transform="rotate(-8 1348 34)" />
          <ellipse cx="118" cy="78" rx="2" ry="1.5" transform="rotate(22 118 78)" />
        </>
      );

    case 3:
      return (
        <>
          <ellipse cx="78" cy="68" rx="4.5" ry="2.5" transform="rotate(-5 78 68)" />
          <ellipse cx="218" cy="60" rx="3" ry="2" transform="rotate(10 218 60)" />
          <ellipse cx="358" cy="54" rx="5" ry="3" transform="rotate(-8 358 54)" />
          <ellipse cx="498" cy="48" rx="3.5" ry="2" transform="rotate(12 498 48)" />
          <ellipse cx="638" cy="42" rx="3" ry="2" transform="rotate(-10 638 42)" />
          <ellipse cx="778" cy="36" rx="4.5" ry="2.5" transform="rotate(5 778 36)" />
          <ellipse cx="918" cy="30" rx="3" ry="2" transform="rotate(-12 918 30)" />
          <ellipse cx="1058" cy="24" rx="3.5" ry="2" transform="rotate(8 1058 24)" />
          <ellipse cx="1198" cy="18" rx="3" ry="2" transform="rotate(-6 1198 18)" />
          <ellipse cx="1338" cy="12" rx="2.5" ry="1.5" transform="rotate(15 1338 12)" />
        </>
      );

    case 4:
      return (
        <>
          <ellipse cx="42" cy="58" rx="5" ry="3.5" transform="rotate(-22 42 58)" />
          <ellipse cx="162" cy="68" rx="3" ry="2" transform="rotate(15 162 68)" />
          <ellipse cx="282" cy="60" rx="4.5" ry="3" transform="rotate(-8 282 60)" />
          <ellipse cx="402" cy="52" rx="3.5" ry="2.5" transform="rotate(18 402 52)" />
          <ellipse cx="522" cy="48" rx="3" ry="2" transform="rotate(-12 522 48)" />
          <ellipse cx="642" cy="42" rx="4.5" ry="3" transform="rotate(8 642 42)" />
          <ellipse cx="762" cy="38" rx="3" ry="2" transform="rotate(-15 762 38)" />
          <ellipse cx="882" cy="32" rx="3.5" ry="2.5" transform="rotate(20 882 32)" />
          <ellipse cx="1002" cy="28" rx="3" ry="2" transform="rotate(-10 1002 28)" />
          <ellipse cx="1122" cy="22" rx="4.5" ry="3" transform="rotate(6 1122 22)" />
          <ellipse cx="1242" cy="18" rx="3" ry="2" transform="rotate(-18 1242 18)" />
          <ellipse cx="1362" cy="14" rx="3.5" ry="2" transform="rotate(12 1362 14)" />
        </>
      );

    case 5:
    default:
      return (
        <>
          <ellipse cx="62" cy="62" rx="3.5" ry="2.5" transform="rotate(-14 62 62)" />
          <ellipse cx="192" cy="54" rx="4.5" ry="3" transform="rotate(10 192 54)" />
          <ellipse cx="322" cy="46" rx="3" ry="2" transform="rotate(-8 322 46)" />
          <ellipse cx="452" cy="38" rx="5" ry="3.5" transform="rotate(16 452 38)" />
          <ellipse cx="582" cy="30" rx="3" ry="2" transform="rotate(-12 582 30)" />
          <ellipse cx="712" cy="22" rx="3.5" ry="2.5" transform="rotate(8 712 22)" />
          <ellipse cx="842" cy="16" rx="3" ry="2" transform="rotate(-10 842 16)" />
          <ellipse cx="972" cy="10" rx="4.5" ry="3" transform="rotate(14 972 10)" />
          <ellipse cx="1102" cy="6" rx="3" ry="2" transform="rotate(-6 1102 6)" />
        </>
      );
  }
}

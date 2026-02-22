# Promath — Sitemap

## URL-struktur

| Side                   | Beskrivelse                   | Breadcrumb                                               | Eksempel-URL             |
| ---------------------- | ----------------------------- | -------------------------------------------------------- | ------------------------ |
| `/`                    | Landing page (marketing)      | (ingen — forside)                                        |                          |
| `/om`                  | Om Promath                    | Om os                                                    |                          |
| `/kontakt`             | Kontakt                       | Kontakt                                                  |                          |
| `/faq`                 | FAQ                           | FAQ                                                      |                          |
| `/pensum`              | Pensum-overblik (matrix-grid) | Pensum                                                   |                          |
| `/trin`                | Trin-overblik (1-12 grid)     | Trin                                                     |                          |
| `/trin/[klasse]`       | Emner for et givent trin      | Trin › 7. klasse                                         | `/trin/7`                |
| `/omraader`            | Alle kategorier (grid)        | Områder                                                  |                          |
| `/omraader/[kategori]` | Emner inden for en kategori   | Områder › [kategori-navn]                                | `/omraader/geometri`     |
| `/emne/[emne]`         | Emne-side med lektioner       | Områder › [kategori-navn] › [emne-navn]                  | `/emne/trigonometri`     |
| `/lektion/[lektion]`   | Enkelt lektion                | Områder › [kategori-navn] › [emne-navn] › [lektion-navn] | `/lektion/cosinusreglen` |

## Link-referencer

| Fil                                                   | Link                            | Eksempel-URL                               |
| ----------------------------------------------------- | ------------------------------- | ------------------------------------------ |
| `src/components/nav/category-sidebar.tsx`             | `/emne/${topic.id}`             | `/emne/naturlige-tal`                      |
| `src/components/nav/grade-sidebar.tsx`                | `/emne/${topic.id}`             | `/emne/broekregler`                        |
| `src/components/nav/mobile-nav.tsx`                   | `/emne/${topic.id}`             | `/emne/trigonometri`                       |
| `src/components/pensum-grid.tsx`                      | `/emne/${topic.id}`             | `/emne/ligninger`                          |
| `src/components/pensum-grid.tsx`                      | `/emne/${topic.id}#klasse-${g}` | `/emne/ligninger#klasse-7`                 |
| `src/app/[locale]/(app)/trin/[klasse]/page.tsx`       | `/emne/${topic.id}`             | `/emne/polynomier-og-rationale-funktioner` |
| `src/app/[locale]/(app)/omraader/[kategori]/page.tsx` | `/emne/${topic.id}`             | `/emne/statistik`                          |
| `src/app/[locale]/(marketing)/page.tsx`               | `/emne/${tp.slug}`              | `/emne/cosinusrelationen`                  |
| `src/app/[locale]/(app)/emne/[emne]/page.tsx`         | `/lektion/${lesson.id}`         | `/lektion/cosinusreglen`                   |

## Route-filer

| Fil                                                 | Ansvar                                  |
| --------------------------------------------------- | --------------------------------------- |
| `src/app/[locale]/(app)/emne/[emne]/layout.tsx`     | SubNav + GradeFilter                    |
| `src/app/[locale]/(app)/emne/[emne]/page.tsx`       | Emne-side (lektioner per klassetrin)    |
| `src/app/[locale]/(app)/lektion/[lektion]/page.tsx` | Lektion-side (bruger `getLessonBySlug`) |
| `src/app/[locale]/(app)/omraader/page.tsx`          | Alle kategorier (grid)                  |
| `src/app/[locale]/(app)/pensum/page.tsx`            | Pensum-overblik (matrix-grid)           |

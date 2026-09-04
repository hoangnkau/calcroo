/* ============================================================
   CALCROO — CV KEYWORD SCANNER (pure, client-side, testable)
   So khớp Job Description với CV bằng string matching cơ bản.
   Không gọi mạng, không phụ thuộc React.
   ============================================================ */

export const STOPWORDS = new Set(
  (
    'a about above after again against all am an and any are as at be because been before being below ' +
    'between both but by could did do does doing down during each few for from further had has have having ' +
    'he her here hers herself him himself his how i if in into is it its itself just me more most my myself ' +
    'no nor not now of off on once only or other our ours ourselves out over own same she should so some such ' +
    'than that the their theirs them themselves then there these they this those through to too under until ' +
    'up very was we were what when where which while who whom why will with you your yours yourself yourselves ' +
    'able across also always among another apply applicant applicants applying available background based basic ' +
    'candidate candidates capable currently day days duties eligible etc every excellent experience good great ' +
    'high highly hour hours ideal including job jobs looking must need needed needs offer offering opportunity ' +
    'position preferred required requirement requirements responsibilities role strong successful suitable team ' +
    'time using week weeks well work working works would year years please email send resume cv join company ' +
    'us we our you they this that will can may per within around ability responsible including etc'
  ).split(/\s+/),
);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Bóc tách từ khoá quan trọng từ text tin tuyển dụng.
 * @param {string} text
 * @param {number} [max=18]
 * @returns {Array<{term:string, weight:number}>}
 */
export function extractKeywords(text, max = 18) {
  if (!text || !text.trim()) return [];
  const clauses = String(text).split(/[.,;:!?()\n/•|]+/);
  const freq = new Map();

  for (const clause of clauses) {
    const words = (clause.toLowerCase().match(/[a-z][a-z'+.-]*[a-z]|[a-z]/g) || [])
      .map((w) => w.replace(/^['.-]+|['.-]+$/g, ''))
      .filter((w) => w.length >= 3 && !STOPWORDS.has(w));

    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

    // bigram: "customer service", "data entry"...
    for (let i = 0; i < words.length - 1; i += 1) {
      const bg = words[i] + ' ' + words[i + 1];
      freq.set(bg, (freq.get(bg) || 0) + 1.6);
    }
  }

  const sorted = [...freq.entries()].sort(
    (a, b) => b[1] - a[1] || b[0].length - a[0].length,
  );

  const out = [];
  for (const [term, weight] of sorted) {
    // bỏ unigram nếu đã có bigram chứa nó
    if (!term.includes(' ') && out.some((o) => o.term.includes(' ') && o.term.split(' ').includes(term))) {
      continue;
    }
    out.push({ term, weight: Math.round(weight * 10) / 10 });
    if (out.length >= max) break;
  }
  return out;
}

/** CV -> một khối text phẳng để so khớp. */
export function cvToText(cv) {
  if (!cv) return '';
  const exp = (cv.experience || []).flatMap((e) => [e.role, e.company, e.bullets]);
  const edu = (cv.education || []).flatMap((e) => [e.degree, e.school]);
  return [cv.name, cv.title, cv.summary, cv.skills, ...exp, ...edu]
    .filter(Boolean)
    .join('  \n  ')
    .toLowerCase();
}

const hasTerm = (haystack, term) =>
  new RegExp('(^|[^a-z])' + escapeRe(term) + '([^a-z]|$)', 'i').test(haystack);

/**
 * So khớp JD với CV.
 * @returns {{
 *   keywords: Array<{term:string, weight:number}>,
 *   matched: string[], missing: string[],
 *   score: number,            // 0..1
 *   enough: boolean           // đủ từ khoá để phân tích không
 * }}
 */
export function scanJobAd(jobAdText, cv) {
  const keywords = extractKeywords(jobAdText);
  if (keywords.length < 3) {
    return { keywords, matched: [], missing: [], score: 0, enough: false };
  }
  const cvText = cvToText(cv);
  const matched = [];
  const missing = [];
  for (const { term } of keywords) {
    (hasTerm(cvText, term) ? matched : missing).push(term);
  }
  return {
    keywords,
    matched,
    missing,
    score: keywords.length ? matched.length / keywords.length : 0,
    enough: true,
  };
}

/**
 * Cắt text thành các đoạn để highlight từ khoá đã khớp trong preview CV.
 * @returns {Array<{text:string, hit:boolean}>}
 */
export function highlightSegments(text, terms) {
  if (!text) return [];
  const list = (terms || []).filter(Boolean).map(escapeRe).sort((a, b) => b.length - a.length);
  if (!list.length) return [{ text, hit: false }];

  const re = new RegExp('(' + list.join('|') + ')', 'ig');
  const out = [];
  let last = 0;
  let m = re.exec(text);
  while (m) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), hit: false });
    out.push({ text: m[0], hit: true });
    last = m.index + m[0].length;
    if (re.lastIndex === m.index) re.lastIndex += 1;
    m = re.exec(text);
  }
  if (last < text.length) out.push({ text: text.slice(last), hit: false });
  return out;
}

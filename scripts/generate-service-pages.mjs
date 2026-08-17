import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = "https://baegwan119care.co.kr";
const phone = "01082162991";
const today = "2026-08-17";

const services = {
  "sink-clog": {
    name: "싱크대막힘",
    eyebrow: "KITCHEN DRAIN",
    summary: "물이 천천히 내려가거나 하부장 바닥으로 역류하는 싱크대 배관 증상을 확인합니다.",
    causes: ["기름과 음식물 슬러지 축적", "주름관 또는 벽 배관의 굴곡", "공용 배관 구간의 흐름 저하"],
    checks: ["싱크대 물 빠짐과 역류 위치", "하부 호스와 연결부 누수", "벽 배관 안쪽 오염 구간"],
    method: "배수구 입구만 처리하지 않고 주름관과 벽 배관을 구분해 확인합니다. 반복 막힘은 내시경으로 오염 구간을 살펴보고 현장 상태에 맞는 플렉스샤프트나 세척 작업을 안내합니다.",
    faqs: [
      ["싱크대 물이 천천히 내려가면 바로 작업해야 하나요?", "물을 많이 사용할 때 역류하거나 하부장 바닥으로 새기 시작했다면 추가 사용을 줄이고 연결부와 벽 배관 상태를 확인하는 것이 좋습니다."],
      ["뜨거운 물이나 약품으로 해결할 수 있나요?", "가벼운 기름때에는 일시적으로 도움이 될 수 있지만 굳은 슬러지나 깊은 배관 막힘은 다시 발생할 수 있습니다. 강한 약품은 배관과 고무 부속을 손상시킬 수 있습니다."],
      ["작업 후에는 무엇을 확인하나요?", "물을 충분히 흘려보내 배수 속도와 역류 여부를 확인하고 하부 연결부에 누수가 없는지 함께 점검합니다."]
    ]
  },
  "drain-clog": {
    name: "하수구막힘",
    eyebrow: "BATHROOM · FLOOR DRAIN",
    summary: "욕실·베란다·세탁실·상가 바닥 배수구의 물 고임과 역류 원인을 구간별로 점검합니다.",
    causes: ["머리카락과 생활 이물질 축적", "비누 찌꺼기와 석회성 오염", "횡주관 또는 공용관 흐름 저하"],
    checks: ["물이 고이는 배수구 위치", "다른 배수구의 동시 반응", "악취·기포·역류 발생 시점"],
    method: "트랩 주변의 단순 막힘과 배관 깊은 구간의 막힘을 먼저 구분합니다. 배관 구조와 오염 정도를 확인한 뒤 석션, 플렉스샤프트, 내시경 또는 고압세척 중 필요한 작업만 안내합니다.",
    faqs: [
      ["바닥 하수구에서 물이 올라오면 어떻게 해야 하나요?", "세탁기와 욕실 물 사용을 멈추고 어느 배수구에서 먼저 올라오는지 확인해 주세요. 여러 곳이 동시에 반응하면 깊은 배관 구간을 점검해야 할 수 있습니다."],
      ["악취만 나도 하수구가 막힌 건가요?", "트랩의 봉수 부족이나 오염 때문일 수도 있고 배관 흐름 저하의 초기 증상일 수도 있습니다. 냄새와 함께 물 빠짐이 느려졌는지 확인하는 것이 좋습니다."],
      ["고압세척은 항상 필요한가요?", "아닙니다. 배관 길이와 슬러지 상태를 확인한 뒤 일반 장비로 제거하기 어려운 오염 구간에 필요한 경우 안내합니다."]
    ]
  },
  "toilet-clog": {
    name: "변기막힘",
    eyebrow: "TOILET · SOIL PIPE",
    summary: "변기 수위 상승, 물 내림 불량과 오수관 역류를 구분해 막힌 위치를 확인합니다.",
    causes: ["휴지·물티슈의 과다 사용", "장난감·칫솔 등 생활용품 유입", "변기 뒤 오수관 또는 공용관 막힘"],
    checks: ["물을 내렸을 때 수위 변화", "이물질이 들어간 시점", "욕실 바닥 배수구의 동시 반응"],
    method: "변기 내부의 이물질과 변기 아래 오수관 문제를 구분합니다. 억지로 여러 번 물을 내리지 않고, 필요하면 변기 탈거 여부와 사용할 장비를 작업 전에 설명합니다.",
    faqs: [
      ["변기 물이 차오르면 다시 내려도 되나요?", "넘칠 수 있으므로 반복해서 물을 내리지 않는 것이 안전합니다. 급수 밸브를 잠그고 현재 수위와 이물질 유입 여부를 확인해 주세요."],
      ["뚫어뻥으로 해결되지 않는 이유는 무엇인가요?", "단단한 이물질이 변기 굴곡에 걸렸거나 막힘 위치가 오수관 안쪽이면 압력만으로 제거되지 않을 수 있습니다."],
      ["변기를 꼭 탈거해야 하나요?", "모든 현장에서 탈거하는 것은 아닙니다. 이물질 위치와 장비 접근 가능 여부를 확인한 뒤 필요한 경우에만 안내합니다."]
    ]
  },
  leak: {
    name: "누수",
    eyebrow: "LEAK INSPECTION",
    summary: "천장·벽·바닥의 물 자국과 계량기 움직임을 바탕으로 급수·배수 누수 가능성을 구분합니다.",
    causes: ["급수·온수 배관의 미세 파손", "배수 연결부 또는 방수층 문제", "수전·밸브·고압호스 노후"],
    checks: ["물이 보이는 위치와 시간", "물을 쓰지 않을 때 계량기 움직임", "윗집·욕실·주방 사용과의 연관성"],
    method: "보이는 물 자국만으로 원인을 단정하지 않고 물 사용 패턴, 계량기와 주변 설비를 먼저 확인합니다. 급수관과 배수관, 방수 문제를 구분해 필요한 점검 범위를 안내합니다.",
    faqs: [
      ["물을 사용하지 않아도 계량기가 움직이면 누수인가요?", "집 안의 모든 수전을 잠근 상태에서도 별침이 계속 움직인다면 급수 배관이나 설비의 누수를 의심할 수 있습니다."],
      ["천장 물 자국은 무조건 윗집 누수인가요?", "윗집 배관이나 방수 문제 외에도 공용관, 외벽 결로 등 원인이 다양할 수 있어 발생 시간과 물 사용 연관성을 함께 확인해야 합니다."],
      ["누수 위치를 바로 찾을 수 있나요?", "현장 구조와 누수량에 따라 점검 범위가 달라집니다. 먼저 증상과 계량기 상태를 확인한 뒤 필요한 탐지 방법을 안내합니다."]
    ]
  },
  "faucet-replacement": {
    name: "수전교체",
    eyebrow: "FAUCET REPLACEMENT",
    summary: "싱크대·세면대·샤워기 수전의 누수, 흔들림과 사용 불편을 확인하고 교체 범위를 안내합니다.",
    causes: ["카트리지와 패킹 노후", "수전 몸체 또는 고압호스 누수", "고정 너트 풀림과 부식"],
    checks: ["물이 새는 정확한 위치", "설치 공간과 기존 수전 형태", "앵글밸브·고압호스의 노후 상태"],
    method: "싱크대 수전만이 아니라 세면대, 샤워기와 벽 수전도 상담합니다. 기존 제품의 설치 방식과 하부 공간을 확인하고 교체할 부속과 작업 범위를 먼저 안내합니다.",
    faqs: [
      ["어떤 수전이든 교체할 수 있나요?", "설치 구멍 수, 벽붙이·대붙이 방식과 배관 간격에 맞는 제품이어야 합니다. 기존 수전 사진을 보내주시면 호환 여부 확인에 도움이 됩니다."],
      ["수전만 준비하면 교체할 수 있나요?", "대부분 가능하지만 고압호스, 앵글밸브나 연결 부속이 노후된 경우 함께 교체가 필요할 수 있습니다."],
      ["수전에서 물이 새면 전체 교체해야 하나요?", "패킹이나 카트리지 문제는 부속 교체로 해결될 수 있지만 몸체 균열이나 심한 부식은 전체 교체가 안전할 수 있습니다."]
    ]
  }
};

const cityDirs = fs.readdirSync(root, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !entry.name.startsWith(".") && !["images", "scripts", "cases"].includes(entry.name))
  .map(entry => entry.name)
  .filter(city => fs.existsSync(path.join(root, city, "index.html")))
  .sort((a, b) => a.localeCompare(b, "ko"));

const esc = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const localNames = city => fs.readdirSync(path.join(root, city)).filter(file => file.endsWith(".html") && file !== "index.html" && !Object.keys(services).map(slug => `${slug}.html`).includes(file)).map(file => file.replace(".html", ""));
const caseByCity = {
  "양평군": ["/cases/yangpyeong-apartment-sink-clog.html", "/images/case-yangpyeong.jpg", "양평 아파트 싱크대막힘"],
  "부천시": ["/cases/bucheon-apartment-sink-clog.html", "/images/case-bucheon-1.jpg", "부천 아파트 싱크대막힘"],
  "남양주시": ["/cases/namyangju-wabu-apartment-sink-clog.html", "/images/case-wabu-1.jpg", "남양주 와부 아파트 싱크대막힘"],
  "화성시": ["/cases/dongtan-bathroom-floor-drain-clog.html", "/images/case-dongtan-1.jpg", "동탄 화장실 바닥 하수구막힘"],
  "원주시": ["/cases/wonju-apartment-sink-clog.html", "/images/case-wonju-1.jpg", "원주 아파트 싱크대막힘"],
  "의왕시": ["/cases/uiwang-apartment-sink-clog.html", "/images/case-uiwang-1.jpg", "의왕 아파트 싱크대막힘"],
  "여주시": ["/cases/yeoju-apartment-sink-clog.html", "/images/case-yeoju-1.jpg", "여주 아파트 싱크대막힘"]
};

const nav = city => `<nav class="service-nav" aria-label="${city} 서비스별 안내">${Object.entries(services).map(([slug, service]) => `<a href="/${city}/${slug}.html">${city} ${service.name}</a>`).join("")}</nav>`;

function render(city, slug, service) {
  const canonical = `${base}/${city}/${slug}.html`;
  const locals = localNames(city).slice(0, 12);
  const serviceLinks = Object.entries(services).filter(([key]) => key !== slug);
  const localContext = locals.length ? `${locals.slice(0, 5).join("·")} 등 ${city} 주요 지역` : `${city} 아파트·주택·상가`;
  const description = `${city} ${service.name} 증상과 원인, 점검 방법 및 출장 상담 안내. ${localContext} 상담, 작업 전 범위와 비용 안내. 010-8216-2991`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", name: `${city} ${service.name}`, serviceType: service.name, url: canonical, areaServed: { "@type": "AdministrativeArea", name: city }, provider: { "@type": ["LocalBusiness", "Plumber"], name: "배관119케어", telephone: "+82-10-8216-2991", url: `${base}/` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: city, item: `${base}/${city}/index.html` },
        { "@type": "ListItem", position: 3, name: `${city} ${service.name}`, item: canonical }
      ] },
      { "@type": "FAQPage", mainEntity: service.faqs.map(([question, answer]) => ({ "@type": "Question", name: `${city} ${question}`, acceptedAnswer: { "@type": "Answer", text: answer } })) }
    ]
  };
  const actualCase = caseByCity[city];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${city} ${service.name} | 원인·증상·출장상담 - 배관119케어</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="배관119케어"><meta property="og:title" content="${city} ${service.name} | 배관119케어"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${base}${actualCase?.[1] || "/images/case-clean-pipe.jpg"}"><link rel="stylesheet" href="/region.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><div class="top"><div class="w"><span>365일 연중무휴 · 24시간 배관 상담</span><a href="tel:${phone}">010-8216-2991</a></div></div><header class="head"><div class="w"><a class="brand" href="/">배관119케어</a><nav class="headnav"><a href="/지역안내.html">출장지역</a><a href="/#cases">시공사례</a></nav></div></header><section class="hero"><div class="w"><div class="crumb"><a href="/">홈</a> › <a href="/${city}/index.html">${city}</a> › ${service.name}</div><span class="tag">${service.eyebrow} · ${city}</span><h1>${city} ${service.name}<br>증상별 점검 안내</h1><p class="lead">${service.summary} ${localContext}에서 나타나는 증상을 기준으로 필요한 작업 범위를 안내합니다.</p><div class="actions"><a class="btn" href="tel:${phone}">☎ 전화 상담</a><a class="btn alt" href="sms:${phone}">사진 문자 상담</a></div></div></section><main class="w">${nav(city)}<section class="grid"><article class="card"><span class="k">COMMON CAUSES</span><h2>${city} ${service.name} 주요 원인</h2><ul>${service.causes.map(item => `<li>${item}</li>`).join("")}</ul></article><article class="card"><span class="k">FIRST CHECK</span><h2>상담 전 확인사항</h2><ul>${service.checks.map(item => `<li>${item}</li>`).join("")}</ul></article><article class="card"><span class="k">ON-SITE PROCESS</span><h2>현장 점검과 작업</h2><p>${service.method}</p></article></section><section class="check"><h2>${city} ${service.name} 상담 순서</h2><div class="checks"><div><b>01 증상 확인</b>물이 새거나 막힌 위치와 발생 시점</div><div><b>02 사진 상담</b>현장과 주변 배관 구조 사진 전달</div><div><b>03 현장 점검</b>원인과 필요한 장비·범위 확인</div><div><b>04 작업 안내</b>작업 전 방법과 비용 설명</div></div></section>${actualCase ? `<section class="card case"><img src="${actualCase[1]}" alt="${actualCase[2]} 실제 작업 현장" loading="lazy"><div><span class="k">REAL WORK CASE</span><h2>${city} 실제 시공사례</h2><p>배관119케어가 현장에서 직접 촬영한 작업 기록입니다.</p><p><a class="btn" href="${actualCase[0]}">실제 사례 자세히 보기</a></p></div></section>` : ""}<section class="card faq"><span class="k">FREQUENTLY ASKED QUESTIONS</span><h2>${city} ${service.name} 자주 묻는 질문</h2>${service.faqs.map(([question, answer]) => `<details><summary>${city} ${question}</summary><p>${answer}</p></details>`).join("")}</section>${locals.length ? `<section class="card"><span class="k">SERVICE AREA</span><h2>${city} 세부 상담지역</h2><div class="links">${locals.map(local => `<a href="/${city}/${local}.html">${local}<span>지역 안내 →</span></a>`).join("")}</div></section>` : ""}<section class="card"><span class="k">OTHER SERVICES</span><h2>${city} 다른 배관 서비스</h2><div class="links">${serviceLinks.map(([key, item]) => `<a href="/${city}/${key}.html">${city} ${item.name}<span>상세 안내 →</span></a>`).join("")}<a href="/${city}/index.html">${city} 종합 안내<span>지역 홈 →</span></a></div></section><section class="card notice"><h2>현장 확인 후 작업 전 비용을 안내합니다</h2><p>건물 구조, 문제 위치, 배관 길이와 필요한 장비에 따라 작업 범위가 달라질 수 있습니다. 상태를 확인하고 작업 전에 방법과 비용을 먼저 설명합니다.</p></section></main><footer class="foot"><div class="w"><b>배관119케어</b><p>대표전화 010-8216-2991 · 작업 전 범위와 비용 안내</p></div></footer><div class="mobile"><a href="sms:${phone}">사진 문자</a><a href="tel:${phone}">긴급 전화</a></div></body></html>`;
}

for (const city of cityDirs) {
  for (const [slug, service] of Object.entries(services)) {
    fs.writeFileSync(path.join(root, city, `${slug}.html`), render(city, slug, service));
  }
  const indexPath = path.join(root, city, "index.html");
  let index = fs.readFileSync(indexPath, "utf8");
  if (!index.includes('class="service-nav"')) {
    index = index.replace('<main class="w">', `<main class="w">${nav(city)}`);
  }
  const cardTargets = [
    ["BATHROOM · FLOOR", "하수구막힘", "drain-clog"],
    ["KITCHEN DRAIN", "싱크대막힘", "sink-clog"],
    ["TOILET · SOIL PIPE", "변기막힘", "toilet-clog"],
  ];
  for (const [label, name, serviceSlug] of cardTargets) {
    const pattern = new RegExp(`<article class="card"><span class="k">${label}</span><h2>${city} ${name}</h2>([\\s\\S]*?)</article>`);
    index = index.replace(pattern, `<a class="card service-card-link" href="/${city}/${serviceSlug}.html" aria-label="${city} ${name} 자세히 보기"><span class="k">${label}</span><h2>${city} ${name}</h2>$1<b class="card-more">${city} ${name} 자세히 보기 →</b></a>`);
  }
  fs.writeFileSync(indexPath, index);
}

let sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const additions = [];
for (const city of cityDirs) for (const slug of Object.keys(services)) {
  const url = `${base}/${city}/${slug}.html`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) additions.push(`  <url><loc>${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`);
}
sitemap = sitemap.replace("</urlset>", `${additions.join("\n")}\n</urlset>`);
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

let css = fs.readFileSync(path.join(root, "region.css"), "utf8");
if (!css.includes(".service-nav{")) {
  css += `.service-nav{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:0 0 28px}.service-nav a{display:flex;align-items:center;justify-content:center;min-height:54px;padding:10px;border:1px solid var(--line);border-radius:13px;background:#fff;color:var(--blue);font-size:13px;font-weight:900;text-align:center}.service-nav a:hover{border-color:var(--blue);background:var(--sky)}@media(max-width:820px){.service-nav{grid-template-columns:repeat(2,1fr)}}`;
  fs.writeFileSync(path.join(root, "region.css"), css);
}
if (!css.includes(".service-card-link{")) {
  css += `.service-card-link{display:block;color:inherit;text-decoration:none;cursor:pointer;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.service-card-link:hover{transform:translateY(-3px);border-color:var(--blue);box-shadow:0 12px 28px #07162d1c}.service-card-link:focus-visible{outline:3px solid #1461d155;outline-offset:3px}.card-more{display:block;margin-top:15px;color:var(--blue);font-size:13px}`;
  fs.writeFileSync(path.join(root, "region.css"), css);
}

console.log(`Generated ${cityDirs.length * Object.keys(services).length} service pages for ${cityDirs.length} regions.`);

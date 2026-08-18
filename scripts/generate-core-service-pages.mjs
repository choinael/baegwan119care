import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = "https://baegwan119care.co.kr";
const phone = "01082162991";
const updated = "2026-08-18";

const services = {
  "drain-clog": {
    name: "하수구막힘", label: "BATHROOM · FLOOR DRAIN",
    summary: "욕실·베란다·세탁실·상가 바닥 배수구의 물 고임, 역류와 악취 증상을 확인합니다.",
    symptoms: ["물이 천천히 내려가거나 바닥에 고임", "다른 배수구를 사용할 때 기포·역류 발생", "악취와 꾸르륵 소리가 반복됨"],
    causes: ["머리카락·비누 찌꺼기·생활 이물질", "배관 벽면의 석회성 오염과 슬러지", "횡주관 또는 공용 배관의 흐름 저하"],
    process: "막힌 배수구와 다른 배수구의 반응을 함께 살핀 뒤 트랩 주변과 깊은 배관 구간을 구분합니다. 배관 구조와 오염 상태에 맞춰 흡입 장비, 플렉스샤프트, 내시경 또는 고압세척의 필요 여부를 안내합니다.",
    faq: [["하수구에서 물이 올라오면 어떻게 해야 하나요?","추가 물 사용을 멈추고 어느 배수구에서 먼저 역류하는지 확인해 주세요. 여러 곳이 동시에 반응하면 깊은 배관 구간 점검이 필요할 수 있습니다."],["악취만 나도 막힘인가요?","트랩의 봉수 부족이나 오염일 수도 있고 배관 흐름 저하의 초기 증상일 수도 있습니다. 냄새와 함께 배수가 느려졌는지 확인하는 것이 좋습니다."],["고압세척은 항상 필요한가요?","아닙니다. 배관 길이와 슬러지 상태를 확인한 뒤 일반 장비로 제거하기 어려운 오염 구간에 필요한 경우 안내합니다."]],
    cases: [["동탄 화장실 바닥 하수구막힘","/cases/dongtan-bathroom-floor-drain-clog.html","/images/case-dongtan-1.jpg"]]
  },
  "sink-clog": {
    name: "싱크대막힘", label: "KITCHEN DRAIN",
    summary: "물이 천천히 내려가거나 하부장과 배수구로 역류하는 싱크대 배관 증상을 확인합니다.",
    symptoms: ["물을 많이 사용할 때 배수가 늦어짐", "싱크대 배수구 또는 하부장으로 역류", "꼬르륵 소리·악취·연결부 누수"],
    causes: ["기름과 음식물 슬러지의 경화", "주름관 노후·변형 또는 연결부 문제", "벽 배관이나 공용 배관의 흐름 저하"],
    process: "싱크대 하부 연결관과 벽 배관을 구분해 확인합니다. 반복되는 막힘은 내시경으로 오염 구간을 살펴보고 배관 상태에 맞는 플렉스샤프트, 흡입 또는 세척 작업을 안내합니다.",
    faq: [["뜨거운 물이나 약품으로 해결할 수 있나요?","가벼운 기름때에는 일시적으로 도움이 될 수 있지만 굳은 슬러지나 깊은 배관 막힘은 다시 발생할 수 있습니다. 강한 약품은 배관과 고무 부속을 손상시킬 수 있습니다."],["싱크대막힘 상담에는 어떤 사진이 필요한가요?","싱크대 배수구와 하부장 전체, 주름관과 벽 배관 연결부가 보이도록 촬영하면 증상 상담에 도움이 됩니다."],["작업 후에는 무엇을 확인하나요?","물을 충분히 흘려보내 배수 속도와 역류 여부를 확인하고 하부 연결부에 누수가 없는지 함께 점검합니다."]],
    cases: [["양평 아파트 싱크대막힘","/cases/yangpyeong-apartment-sink-clog.html","/images/case-yangpyeong.jpg"],["부천 아파트 싱크대막힘","/cases/bucheon-apartment-sink-clog.html","/images/case-bucheon-1.jpg"],["의왕 아파트 싱크대막힘","/cases/uiwang-apartment-sink-clog.html","/images/case-uiwang-1.jpg"]]
  },
  "toilet-clog": {
    name: "변기막힘", label: "TOILET · SOIL PIPE",
    summary: "변기 수위 상승과 물 내림 불량, 변기 내부 이물질과 오수관 문제 가능성을 구분합니다.",
    symptoms: ["물을 내리면 수위가 올라옴", "물이 천천히 빠지거나 소리가 남", "욕실 바닥 배수구도 함께 반응함"],
    causes: ["휴지·물티슈의 과다 사용", "장난감·칫솔 등 생활용품 유입", "변기 뒤 오수관 또는 공용관 막힘"],
    process: "변기 내부 트랩의 이물질과 변기 아래 오수관 문제를 구분합니다. 반복해서 물을 내리지 않고 이물질 위치와 장비 접근 가능 여부를 확인한 뒤 필요한 경우에만 변기 탈거를 안내합니다.",
    faq: [["변기 물이 차오르면 다시 내려도 되나요?","넘칠 수 있으므로 반복해서 물을 내리지 않는 것이 안전합니다. 급수 밸브를 잠그고 현재 수위와 이물질 유입 여부를 알려주세요."],["뚫어뻥으로 해결되지 않는 이유는 무엇인가요?","단단한 이물질이 변기 굴곡에 걸렸거나 막힘 위치가 오수관 안쪽이면 압력만으로 제거되지 않을 수 있습니다."],["변기를 꼭 탈거해야 하나요?","모든 현장에서 탈거하는 것은 아닙니다. 이물질 위치와 장비 접근 가능 여부를 확인한 뒤 필요한 경우에만 안내합니다."]], cases: []
  },
  "faucet-replacement": {
    name: "수전교체", label: "FAUCET REPLACEMENT",
    summary: "싱크대·세면대·샤워기 수전의 누수, 흔들림과 레버 고장을 확인하고 설치 규격에 맞춰 교체합니다.",
    symptoms: ["수전 몸체·레버·호스 주변에서 물이 샘", "수전이 흔들리거나 고정이 풀림", "냉수·온수 조절 또는 인출식 헤드 작동 불량"],
    causes: ["카트리지와 패킹 노후", "고정 너트 풀림 또는 부식", "수전 몸체·고압호스·인출식 호스 손상"],
    process: "설치 위치와 원홀·투홀·벽붙이 방식, 냉온수 연결 규격을 확인합니다. 급수 밸브를 잠근 뒤 기존 수전을 분리하고 새 수전을 고정한 후 상부와 하부 연결부의 누수와 작동 상태를 확인합니다.",
    faq: [["교체할 수전을 미리 준비해야 하나요?","고객이 준비한 제품으로 교체할 수 있지만 설치 방식과 연결 규격이 맞는지 먼저 확인해야 합니다. 제품과 기존 수전 사진을 보내주시면 상담에 도움이 됩니다."],["수전에서 물이 새면 전체 교체해야 하나요?","패킹이나 카트리지 문제는 부속 교체가 가능할 수 있지만 몸체 균열이나 심한 부식은 전체 교체가 안전할 수 있습니다."],["수전교체 후 무엇을 확인하나요?","냉수와 온수, 레버와 헤드 작동 상태를 확인하고 수전 본체·호스·밸브 연결부에 누수가 없는지 점검합니다."]], cases: []
  },
  "leak-detection": {
    name: "누수탐지", label: "LEAK INSPECTION",
    summary: "벽·천장·바닥의 물자국과 수도요금 증가, 계량기 움직임을 바탕으로 누수 의심 구간을 확인합니다.",
    symptoms: ["수도요금이 갑자기 증가함", "벽·천장·바닥에 물자국이나 습기가 생김", "물을 사용하지 않아도 계량기가 움직임"],
    causes: ["급수·온수 배관의 미세 파손", "수전·밸브·연결부 노후", "배수 연결부·방수층·외벽 또는 결로 문제"],
    process: "보이는 물자국만으로 원인을 단정하지 않고 발생 시점, 물 사용 패턴과 계량기 상태를 확인합니다. 급수관·배수관·방수 문제 가능성을 구분해 필요한 점검 및 탐지 범위를 작업 전에 안내합니다.",
    faq: [["물을 사용하지 않아도 계량기가 움직이면 누수인가요?","집 안의 모든 수전을 잠근 상태에서도 별침이 계속 움직인다면 급수 배관이나 설비 누수를 의심할 수 있습니다."],["천장 물자국은 무조건 윗집 누수인가요?","윗집 배관이나 방수 문제 외에도 공용관, 외벽과 결로 등 원인이 다양할 수 있어 발생 시간과 물 사용 연관성을 함께 확인해야 합니다."],["누수 위치를 바로 찾을 수 있나요?","현장 구조와 누수량에 따라 점검 범위가 달라집니다. 증상과 계량기 상태를 확인한 뒤 필요한 탐지 방법과 범위를 안내합니다."]], cases: []
  },
  "high-pressure-cleaning": {
    name: "배관 고압세척", label: "HIGH PRESSURE CLEANING",
    summary: "반복되는 막힘과 넓은 배관 구간의 슬러지를 고압수로 세척하는 작업입니다.",
    symptoms: ["막힘이 짧은 기간에 반복됨", "여러 배수구가 동시에 느리거나 역류함", "상가·식당 배관에 기름 오염이 누적됨"],
    causes: ["배관 벽면의 넓은 기름층", "토사와 침전물 누적", "공용관·메인관의 흐름 저하"],
    process: "배관 접근 위치, 길이와 직경, 굴곡과 노후도를 확인합니다. 내시경 등으로 오염 구간을 살펴 고압세척이 필요한지 판단하고 노즐과 압력, 작업 범위를 안내합니다.",
    faq: [["고압세척은 모든 막힘에 필요한가요?","아닙니다. 일반 장비로 제거 가능한 단순 이물질 막힘보다 넓은 구간에 오염이 누적되거나 반복 막힘이 있는 경우 검토합니다."],["오래된 배관도 고압세척이 가능한가요?","노후도와 손상 여부를 먼저 확인해야 합니다. 배관 상태에 따라 압력과 작업 방법을 조정하거나 다른 방법을 안내할 수 있습니다."],["작업 후 무엇을 확인하나요?","배관 내부 상태와 회수된 오염물을 확인하고 충분한 물을 흘려 배수와 재역류 여부를 점검합니다."]], cases: []
  }
};

const esc = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const dir = path.join(root, "services");
fs.mkdirSync(dir, { recursive: true });

for (const [slug, service] of Object.entries(services)) {
  const canonical = `${base}/services/${slug}.html`;
  const description = `배관119케어 ${service.name} 증상, 원인, 점검 과정과 출장 상담 안내. 작업 전 범위와 비용 안내. 010-8216-2991`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", name: service.name, serviceType: service.name, description: service.summary, url: canonical, provider: { "@id": `${base}/#business` }, areaServed: { "@type": "Country", name: "대한민국" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: `${base}/` }, { "@type": "ListItem", position: 2, name: service.name, item: canonical }] },
    { "@type": "FAQPage", mainEntity: service.faq.map(([q,a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  ] };
  const others = Object.entries(services).filter(([key]) => key !== slug);
  const cases = service.cases.length ? `<section class="card"><span class="k">REAL WORK CASES</span><h2>${service.name} 관련 실제 시공사례</h2><p>배관119케어가 현장에서 직접 촬영한 작업 기록입니다.</p><div class="grid" style="margin-top:20px">${service.cases.map(([title,href,img]) => `<a href="${href}"><img src="${img}" alt="${title} 실제 작업 현장" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px"><b style="display:block;margin-top:9px">${title}</b></a>`).join("")}</div></section>` : "";
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${service.name} 원인·증상·출장상담 | 배관119케어</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="배관119케어"><meta property="og:title" content="${service.name} 원인·증상·출장상담 | 배관119케어"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${base}/images/case-clean-pipe.jpg"><link rel="stylesheet" href="/region.css"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><div class="top"><div class="w"><span>365일 전화·문자 배관 상담</span><a href="tel:${phone}">010-8216-2991</a></div></div><header class="head"><div class="w"><a class="brand" href="/">배관119케어</a><nav class="headnav"><a href="/지역안내.html">출장지역</a><a href="/#cases">시공사례</a></nav></div></header><section class="hero"><div class="w"><div class="crumb"><a href="/">홈</a> › ${service.name}</div><span class="tag">${service.label}</span><h1>${service.name}<br>증상과 원인 점검 안내</h1><p class="lead">${service.summary}</p><div class="actions"><a class="btn" href="tel:${phone}">☎ 전화 상담</a><a class="btn alt" href="sms:${phone}">사진 문자 상담</a></div></div></section><main class="w"><section class="grid"><article class="card"><span class="k">COMMON SYMPTOMS</span><h2>이런 증상이 있나요?</h2><ul>${service.symptoms.map(x=>`<li>${x}</li>`).join("")}</ul></article><article class="card"><span class="k">POSSIBLE CAUSES</span><h2>가능한 원인</h2><ul>${service.causes.map(x=>`<li>${x}</li>`).join("")}</ul></article><article class="card"><span class="k">ON-SITE PROCESS</span><h2>현장 점검과 작업</h2><p>${service.process}</p></article></section><section class="check"><h2>${service.name} 상담 순서</h2><div class="checks"><div><b>01 증상 확인</b>문제가 생긴 위치와 발생 시점</div><div><b>02 사진 상담</b>현장과 주변 구조 사진 전달</div><div><b>03 현장 점검</b>원인과 필요한 작업 범위 확인</div><div><b>04 작업 안내</b>작업 전 방법과 비용 설명</div></div></section>${cases}<section class="card faq"><span class="k">QUICK ANSWERS</span><h2>${service.name} 자주 묻는 질문</h2>${service.faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section><section class="card"><span class="k">OTHER SERVICES</span><h2>다른 배관 서비스</h2><div class="links">${others.map(([key,item])=>`<a href="/services/${key}.html">${item.name}<span>상세 안내 →</span></a>`).join("")}<a href="/지역안내.html">전국 출장지역<span>지역 보기 →</span></a></div></section><section class="card notice"><h2>현장 확인 후 작업 전 비용을 안내합니다</h2><p>건물 구조, 문제 위치, 배관 길이와 필요한 장비에 따라 작업 범위가 달라질 수 있습니다. 상태를 확인하고 작업 전에 방법과 비용을 먼저 설명합니다.</p></section></main><footer class="foot"><div class="w"><b>배관119케어</b><p>대표전화 010-8216-2991 · 작업 전 범위와 비용 안내</p></div></footer><div class="mobile"><a href="sms:${phone}">사진 문자</a><a href="tel:${phone}">긴급 전화</a></div></body></html>`;
  fs.writeFileSync(path.join(dir, `${slug}.html`), html);
}

const sitemapPath = path.join(root, "sitemap.xml");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
const entries = Object.keys(services).map(slug => `  <url><loc>${base}/services/${slug}.html</loc><lastmod>${updated}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`).join("\n");
if (!sitemap.includes(`${base}/services/drain-clog.html`)) sitemap = sitemap.replace("</urlset>", `${entries}\n</urlset>`);
fs.writeFileSync(sitemapPath, sitemap);

console.log(`Generated ${Object.keys(services).length} core service pages.`);

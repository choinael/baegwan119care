import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const marker='data-detailed-region-guide="v1"';
const phone="01082162991";
const escapeHtml=value=>value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const seoul=new Set(["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"]);
const gyeonggi=new Set(["가평군","고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","양평군","여주시","연천군","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시"]);
const gangwon=new Set(["강릉시","고성군","동해시","삼척시","속초시","양구군","양양군","영월군","원주시","인제군","정선군","철원군","춘천시","태백시","평창군","홍천군","화천군","횡성군"]);
const profiles={
 seoul:{setting:"아파트·빌라·오피스텔·상가가 밀집해 같은 지역 안에서도 건물 연식, 층수와 공용배관 구조가 다양합니다",drain:"여러 세대가 사용하는 공용배관과 세대 내부 배관을 구분하지 않으면 막힘이 반복될 수 있어 증상이 나타나는 범위를 먼저 확인합니다",sink:"주거시설과 음식점 모두 기름 슬러지 축적 여부, 하부 연결관 상태와 벽 배관의 흐름을 차례로 살펴봅니다",toilet:"변기 단독 막힘인지 공용 오수관과 관련된 문제인지 물 수위와 다른 배수구 반응을 함께 확인합니다",access:"주차와 엘리베이터 사용, 관리실 작업 절차, 상가 영업시간을 상담 전에 확인하면 장비 준비가 수월합니다"},
 gyeonggi:{setting:"대단지 아파트와 빌라, 단독주택, 상가가 함께 분포해 건물 연식과 배관 구조에 따라 증상이 다르게 나타납니다",drain:"욕실·베란다 배수구와 공용배관이 연결된 공동주택에서는 한 곳의 물 고임이 다른 배수구의 꿀렁거림이나 역류로 이어질 수 있습니다",sink:"주방의 기름과 음식물 찌꺼기가 굳어 벽 안쪽 배관의 물길을 좁히는 경우를 먼저 살펴봅니다",toilet:"변기만 막힌 것인지 욕실 바닥배수구까지 영향을 받는 오수관 흐름 문제인지 구분해야 합니다",access:"아파트는 관리실 확인과 장비 이동 경로, 주택과 상가는 외부 점검구 위치를 함께 확인하면 상담에 도움이 됩니다"},
 gangwon:{setting:"도심 공동주택부터 단독주택·펜션·숙박시설까지 건물 형태와 배관 길이가 다양합니다",drain:"외부 배관 구간이 길거나 사용 간격이 큰 건물은 실내 배수구뿐 아니라 집수정과 외부 연결부의 흐름도 확인할 필요가 있습니다",sink:"주방 배관의 기름 찌꺼기와 굳은 침전물, 연결관 노후 여부를 함께 살펴봅니다",toilet:"변기 내부 이물질과 정화조·외부 오수관 방향의 배수 저하 가능성을 구분합니다",access:"펜션과 전원주택은 진입로와 외부 점검구 위치, 공동주택은 관리실 확인 사항을 알려주시면 장비 준비에 도움이 됩니다"},
 metro:{setting:"공동주택과 오래된 주택가, 상업시설이 함께 있어 세대 내부 배관과 공용배관의 영향을 구분하는 것이 중요합니다",drain:"욕실과 세탁실, 베란다 배수구에서 동시에 소리나 냄새가 나면 연결 배관의 흐름도 함께 확인해야 합니다",sink:"주방 사용량이 많은 세대와 상가는 기름 슬러지가 굳어 반복 막힘이 생기는지 살펴봅니다",toilet:"휴지나 생활용품에 의한 변기 내부 막힘과 공동 오수관의 배수 저하를 나누어 확인합니다",access:"공동주택은 관리실 안내와 작업 가능 시간, 상가는 영업시간과 장비 진입 경로를 먼저 알려주시면 좋습니다"},
 rural:{setting:"도심 공동주택과 기존 주택가, 상가·산업시설 및 외곽 단독주택이 함께 있어 사용량과 배관 구조의 차이가 큽니다",drain:"한 개 배수구의 국소 막힘과 여러 시설이 연결된 메인 배관의 흐름 저하를 증상 발생 범위로 구분합니다",sink:"가정 주방은 기름 슬러지, 음식점은 사용량에 따른 퇴적과 바닥 배수구 동시 증상을 살펴봅니다",toilet:"변기 수위 변화와 욕실 배수구 반응을 확인해 변기 내부와 오수관 문제를 나누어 봅니다",access:"공동주택 관리 절차와 상가·시설의 작업 가능 시간, 장비 이동 공간을 미리 확인하면 좋습니다"}
};
const specific={
 "양평군":{setting:"양평읍의 아파트·상가부터 강상면·강하면·서종면·용문면 등의 단독주택과 전원주택, 펜션까지 건물 형태와 배관 길이가 다양합니다",access:"전원주택과 펜션은 외부 배관과 집수정 위치, 진입로와 장비 이동 공간을 함께 확인하고 아파트는 관리실 절차를 확인하면 좋습니다"},
 "하남시":{setting:"미사·감일·위례 생활권의 공동주택과 기존 주택가, 상가가 함께 있어 신축 건물과 기존 건물의 배관 구조 차이를 고려해야 합니다"},
 "화성시":{setting:"동탄의 대단지 공동주택부터 향남·남양·봉담 생활권의 주택과 상가, 산업시설까지 사용 환경이 폭넓습니다"},
 "안성시":{setting:"도심 아파트와 공도·대덕 생활권의 공동주택, 외곽 단독주택과 상가·공장시설이 함께 있어 배관 길이와 사용량 차이가 큽니다"},
 "광주시":{setting:"태전·경안 생활권의 공동주택과 오포권 빌라·전원주택, 외곽 상가가 함께 있어 외부 배관 구간까지 고려해야 합니다"},
 "남양주시":{setting:"다산·별내·평내호평의 공동주택과 와부·화도·진접의 주택·상가가 함께 있어 세대 배관과 외부 연결 구간을 구분해야 합니다"},
 "평택시":{setting:"고덕·비전·동삭의 공동주택과 안중·포승권 주택·상가, 산업시설이 함께 있어 시설별 사용량 차이가 큽니다"},
 "구리시":{setting:"수택·인창·갈매의 아파트와 빌라, 상가가 밀집해 세대 내부와 공용배관 증상을 구분하는 것이 중요합니다"},
 "원주시":{setting:"무실·혁신도시의 공동주택과 단계·단구 생활권 상가, 문막·지정 등 외곽 주택까지 건물 형태가 다양합니다"},
 "천안시":{setting:"불당·성성·두정의 공동주택과 기존 주택가, 성환·입장·목천권 상가·산업시설까지 배관 사용 환경이 다양합니다"}
};
function profileFor(city){
 let base=profiles.rural;
 if(seoul.has(city))base=profiles.seoul;else if(gyeonggi.has(city))base=profiles.gyeonggi;else if(gangwon.has(city))base=profiles.gangwon;else if(/^(인천|부산|대구|광주-|대전-|울산-)/.test(city)||city.endsWith("광역시"))base=profiles.metro;
 return{...base,...(specific[city]||{})};
}
function localsFrom(html){return[...html.matchAll(/href="\/[^"]+\/([^/"#]+)\.html"/g)].map(m=>m[1]).filter(name=>!['sink-clog','drain-clog','toilet-clog','leak','faucet-replacement'].includes(name)).filter((name,i,a)=>a.indexOf(name)===i).slice(0,6);}
function render(city,html){
 const p=profileFor(city);const locals=localsFrom(html);const localLine=locals.length?`${locals.map(escapeHtml).join("·")} 등 ${escapeHtml(city)} 세부 지역`: `${escapeHtml(city)}의 아파트·주택·상가`;
 return `<section class="detailed-region-guide" ${marker}><span class="k">DETAILED LOCAL GUIDE</span><h2>${escapeHtml(city)} 배관막힘을 증상별로 확인하는 방법</h2><div class="detail-intro"><p>${escapeHtml(city)}은(는) ${p.setting} 같은 지역 안에서도 세대 내부 배관, 공동 배관과 외부 배관처럼 구조가 다르므로 ‘물이 안 내려간다’는 증상만으로 작업 방법을 정하기 어렵습니다. 막힌 위치, 처음 발생한 시점, 다른 배수구의 반응과 반복 여부를 함께 확인해야 필요한 점검 범위를 줄일 수 있습니다.</p><p>${localLine} 상담도 같은 기준으로 진행합니다. 아래 내용은 현장에서 원인을 확정하는 진단 결과가 아니라 전화 또는 사진 문자 상담 전에 증상을 정리하기 위한 안내입니다.</p></div><div class="detail-grid"><article><span>01 · DRAIN</span><h3>${escapeHtml(city)} 하수구막힘과 역류</h3><p>${p.drain}. 물을 사용하지 않을 때도 악취가 나거나 한 곳에 물을 흘렸는데 다른 배수구에서 소리가 난다면 발생 위치를 기록해 주세요. 깊은 구간에 약품이나 도구를 무리하게 넣으면 이물질을 더 안쪽으로 밀거나 배관을 손상시킬 수 있습니다.</p></article><article><span>02 · KITCHEN</span><h3>${escapeHtml(city)} 싱크대막힘 점검</h3><p>${p.sink}. 싱크대에 물이 고이는지, 한꺼번에 흘릴 때만 역류하는지, 하부장 연결관 주변에 냄새나 누수가 있는지 확인하면 도움이 됩니다. 트랩과 연결관, 벽 배관의 상태를 순서대로 확인하는 것이 안전합니다.</p></article><article><span>03 · TOILET</span><h3>${escapeHtml(city)} 변기막힘 확인</h3><p>${p.toilet}. 물을 내렸을 때 수위가 올라왔다가 천천히 빠지는지, 욕실 바닥배수구에서도 소리나 역류가 나타나는지 살펴보세요. 물티슈나 생활용품 유입이 의심되면 반복해서 물을 내리지 말고 사용을 멈춰야 넘침을 줄일 수 있습니다.</p></article><article><span>04 · FAUCET & LEAK</span><h3>${escapeHtml(city)} 수전교체와 누수</h3><p>싱크대·세면대·샤워기 수전은 물이 새는 위치와 설치 규격을 먼저 확인해야 합니다. 토수구, 수전 몸체, 연결호스 중 어디에서 새는지 사진을 보내주시면 도움이 됩니다. 벽·바닥 습기나 계량기 사용량 증가처럼 누수가 의심되는 증상은 막힘과 구분해 점검 범위를 안내합니다.</p></article></div><div class="detail-check"><div><span class="k">BEFORE DRAIN WORK</span><h3>${escapeHtml(city)} 작업 전 확인사항</h3><p>${p.access}. 장비는 막힘 재질과 위치, 배관 직경·굴곡·노후도와 손상 가능성을 확인한 뒤 정해야 합니다.</p></div><ol><li><b>증상 범위</b><span>어느 배수구에서 시작됐고 다른 곳도 동시에 느린지 확인합니다.</span></li><li><b>현장 구조</b><span>아파트·빌라·주택·상가 여부와 층수, 공용배관 가능성을 확인합니다.</span></li><li><b>작업 방법</b><span>내시경·석션·플렉스샤프트·고압세척 중 필요한 장비와 이유를 확인합니다.</span></li><li><b>비용 안내</b><span>기본·추가 작업 범위와 작업 후 배수 테스트 항목을 시작 전에 확인합니다.</span></li></ol></div><p class="detail-action"><a class="btn" href="sms:${phone}">${escapeHtml(city)} 현장 사진 문자 상담</a></p></section>`;
}
const dirs=fs.readdirSync(root,{withFileTypes:true}).filter(e=>e.isDirectory()&&!e.name.startsWith('.')&&!['images','scripts','cases'].includes(e.name)).map(e=>e.name).filter(city=>fs.existsSync(path.join(root,city,'index.html')));
let changed=0;
for(const city of dirs){const file=path.join(root,city,'index.html');let html=fs.readFileSync(file,'utf8');if(html.includes(marker))continue;const block=render(city,html);const anchors=['<section class="card case"','<section class="card" id="area"','<section class="card" id="cases"'];const anchor=anchors.find(item=>html.includes(item));if(!anchor)continue;html=html.replace(anchor,`${block}${anchor}`);fs.writeFileSync(file,html);changed++;}
const cssPath=path.join(root,'region.css');let css=fs.readFileSync(cssPath,'utf8');if(!css.includes('.detailed-region-guide{')){css+=`\n.detailed-region-guide{margin:32px 0;padding:34px;border:1px solid var(--line);border-radius:20px;background:#fff}.detailed-region-guide>h2{font-size:30px;margin:8px 0 20px}.detail-intro{color:#40536b;line-height:1.85}.detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;margin-top:22px}.detail-grid article{padding:23px;border-radius:16px;background:#f3f7fc}.detail-grid article>span{color:var(--blue);font-size:11px;font-weight:900;letter-spacing:.08em}.detail-grid h3{font-size:20px;margin:9px 0}.detail-grid p,.detail-check p{color:#40536b;line-height:1.8;margin:0}.detail-check{display:grid;grid-template-columns:.9fr 1.1fr;gap:25px;margin-top:18px;padding:24px;border-radius:16px;background:#fff7ed}.detail-check h3{font-size:23px;margin:7px 0 12px}.detail-check ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}.detail-check li{display:grid;grid-template-columns:95px 1fr;gap:10px;padding:11px 13px;border-radius:10px;background:#fff}.detail-check li b{color:var(--blue)}.detail-action{margin:20px 0 0}@media(max-width:720px){.detailed-region-guide{padding:24px 18px}.detailed-region-guide>h2{font-size:25px}.detail-grid,.detail-check{grid-template-columns:1fr}.detail-grid article{padding:19px}.detail-check{padding:18px}.detail-check li{grid-template-columns:1fr;gap:3px}}\n`;fs.writeFileSync(cssPath,css);}
console.log(`Added detailed regional guides to ${changed} representative pages (${dirs.length} checked).`);

const result = (code, fileName, worksite, version, status, uploader, uploaded, size = "16.2 MB") => ({
  code, fileName, type: "文件", worksite, version, status, uploader, uploaded, size, note: "—"
});
const results = {
  bridge: result("XX-CL-0128", "桥梁工点测量成果", "K12+350 大桥", "V3", "中间成果", "李工", "2025-05-21 14:18", "28.6 MB"),
  roadbed: result("XX-CL-0129", "路基工点测量成果", "K10+800 路基", "V2", "最终成果", "王工", "2025-05-20 09:32"),
  tunnel: result("XX-CL-0130", "隧道工点测量成果", "K14+000 隧道", "V1", "中间成果", "张工", "2025-05-19 16:08", "18.4 MB"),
  "terrain-10000": result("XX-CL-DX-10000", "1:10000 地形图", "全线", "V2", "最终成果", "李工", "2025-05-20 10:32"),
  "terrain-2000": result("XX-CL-DX-02000", "1:2000 地形图", "全线", "V2", "最终成果", "李工", "2025-05-20 10:35"),
  "terrain-500": result("XX-CL-DX-00500", "1:500 地形图", "K12+350 大桥", "V3", "中间成果", "李工", "2025-05-21 14:18", "28.6 MB"),
  "terrain-land": result("XX-CL-DX-LY", "陆域地形图", "全线", "V1", "最终成果", "王工", "2025-05-18 09:15"),
  "terrain-water": result("XX-CL-DX-SY", "水域地形图", "跨河段", "V1", "中间成果", "张工", "2025-05-19 16:40"),
  dem: result("XX-CL-DEM-01", "数字高程模型（DEM）", "全线", "V2", "最终成果", "孙工", "2025-05-20 09:45"),
  "control-result": result("XX-CL-KZ-001", "控制点成果", "全线", "V2", "最终成果", "赵工", "2025-05-19 12:22"),
  "control-note": result("XX-CL-KZ-002", "控制点点之记", "全线", "V1", "最终成果", "赵工", "2025-05-18 17:05"),
  "route-center": result("XX-CL-ZZ-001", "路线中桩测量成果表", "全线", "V2", "中间成果", "张工", "2025-05-19 11:20"),
  "route-section": result("XX-CL-HD-001", "路线横断面测量成果图", "全线", "V2", "中间成果", "李工", "2025-05-20 15:33"),
  "pipeline-map": result("XX-CL-GX-001", "管线探测成果图", "K12+350 大桥", "V1", "最终成果", "赵工", "2025-05-18 17:05"),
  "pipeline-table": result("XX-CL-GX-002", "管线探测成果表", "K12+350 大桥", "V2", "最终成果", "赵工", "2025-05-19 12:22"),
  flight: result("XX-CL-HF-001", "航飞影像资料", "全线", "V1", "中间成果", "孙工", "2025-05-20 09:45"),
  pointcloud: result("XX-CL-DY-001", "全线点云数据", "全线", "V1", "中间成果", "孙工", "2025-05-20 10:00"),
  dom: result("XX-CL-DOM-001", "数字正射影像（DOM）", "全线", "V1", "最终成果", "孙工", "2025-05-20 10:05"),
  gnss: result("XX-CL-YS-001", "GNSS静态观测原始数据", "全线", "V1", "中间成果", "王工", "2025-05-18 08:40"),
  level: result("XX-CL-YS-002", "水准测量原始数据", "全线", "V1", "中间成果", "王工", "2025-05-18 08:55"),
  "report-outline": result("XX-CL-BG-001", "工程测量大纲", "全线", "V2", "最终成果", "李工", "2025-05-20 10:20"),
  "report-summary": result("XX-CL-BG-002", "技术总结报告", "全线", "V2", "最终成果", "李工", "2025-05-20 11:10"),
  "report-adjust": result("XX-CL-BG-003", "平差计算书", "全线", "V1", "最终成果", "王工", "2025-05-19 14:05"),
  "report-selfcheck": result("XX-CL-BG-004", "测量自检报告", "全线", "V1", "中间成果", "张工", "2025-05-21 09:30"),
  "report-pipeline": result("XX-CL-BG-005", "管线探测报告（若有）", "全线", "V1", "中间成果", "赵工", "2025-05-21 10:15")
};

const details = document.getElementById("objectDetails");
const tabs = document.getElementById("objectTabs");
const modal = document.getElementById("gisFilePreview");
const toast = document.getElementById("toast");
const objectIds = ["bridge", "roadbed", "tunnel"];
let selectedResult = "bridge";
let selectedObject = "bridge";
let activeTab = "basic";
let toastTimer;

function showToast(message = "Demo演示功能"){
  toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}
function resultTag(status){ return `<span class="tag ${status === "最终成果" ? "final" : "middle"}">${status}</span>`; }
function syncEbsSelection(){
  document.querySelectorAll(".ebs-file").forEach(button => button.classList.toggle("active", button.dataset.result === selectedResult));
  const active = document.querySelector(`.ebs-file[data-result="${selectedResult}"]`);
  let parent = active?.parentElement;
  while(parent){ if(parent.tagName === "DETAILS") parent.open = true; parent = parent.parentElement; }
}
function basicDetail(o){
  return `<dl class="info-grid"><dt>文件编码</dt><dd>${o.code}</dd><dd><button class="outline-btn" data-demo>编码管理</button></dd><dt>文件名称</dt><dd>${o.fileName}</dd><dd></dd><dt>类型</dt><dd>${o.type}</dd><dd></dd><dt>工点</dt><dd>${o.worksite}</dd><dd></dd><dt>版本</dt><dd>${o.version}</dd><dd><button class="outline-btn" data-demo>版本管理</button></dd><dt>状态</dt><dd>${resultTag(o.status)}</dd><dd><button class="outline-btn" data-demo>状态管理</button></dd><dt>上传人</dt><dd>${o.uploader}</dd><dd></dd><dt>上传时间</dt><dd>${o.uploaded}</dd><dd></dd><dt>文件大小</dt><dd>${o.size}</dd><dd></dd><dt>备注</dt><dd>${o.note}</dd><dd></dd></dl><div class="detail-actions"><button class="primary-btn" data-download>⇩&nbsp; 下载</button><button data-preview>◎&nbsp; 在线预览</button><button data-demo>更多操作&nbsp;⌄</button></div><div class="drawing-thumb"><img src="assets/file-preview.svg" alt="工程成果预览缩略图"></div>`;
}
function renderResult(){
  const o = results[selectedResult];
  if(activeTab === "basic") details.innerHTML = basicDetail(o);
  else if(activeTab === "preview") details.innerHTML = `<div class="drawing-thumb" style="height:480px;margin-top:0"><img src="assets/file-preview.svg" alt="工程成果预览"></div><div class="detail-actions"><button class="primary-btn" data-preview>放大预览</button><button data-download>下载</button><button data-demo>打印</button></div>`;
  else if(activeTab === "spatial") details.innerHTML = `<div class="spatial-card"><small>当前空间位置</small><h2>${o.worksite}</h2><p>所属路线：XX高速公路<br>成果状态：${o.status}<br>当前成果已定位至三维场景中的对应工程对象。</p><button class="primary-btn" data-demo>重新定位</button></div>`;
  else details.innerHTML = `<div class="placeholder-tab"><b>${tabs.querySelector(`[data-tab="${activeTab}"]`).textContent}</b>Demo 已保留该功能入口，当前无更多记录。</div>`;
  details.querySelectorAll("[data-demo]").forEach(button => button.addEventListener("click", () => showToast()));
  details.querySelectorAll("[data-download]").forEach(button => button.addEventListener("click", () => showToast("Demo：文件下载")));
  details.querySelectorAll("[data-preview]").forEach(button => button.addEventListener("click", openPreview));
}
function openPreview(){
  const o = results[selectedResult];
  modal.querySelector("h2").innerHTML = `${o.fileName} <em>${o.version}</em>`;
  modal.querySelector("footer span").textContent = `${o.code} · ${o.size}`;
  modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
}
function closePreview(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
function selectResult(id){
  if(!results[id]) return;
  selectedResult = id; activeTab = "basic";
  if(objectIds.includes(id)) selectedObject = id;
  tabs.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.tab === "basic"));
  document.querySelectorAll(".object-hotspot").forEach(hotspot => hotspot.classList.toggle("selected", hotspot.dataset.object === selectedObject));
  syncEbsSelection(); renderResult();
}

tabs.addEventListener("click", event => {
  const button = event.target.closest("button[data-tab]"); if(!button) return;
  activeTab = button.dataset.tab; tabs.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button)); renderResult();
});
document.querySelectorAll(".object-hotspot").forEach(hotspot => hotspot.addEventListener("click", () => selectResult(hotspot.dataset.object)));
document.querySelectorAll(".ebs-file").forEach(button => button.addEventListener("click", () => selectResult(button.dataset.result)));
document.querySelectorAll(".topbar [data-demo]").forEach(button => button.addEventListener("click", () => showToast()));
document.querySelectorAll(".map-float-controls button,.chain-label").forEach(button => button.addEventListener("click", () => showToast()));
modal.querySelector(".modal-close").addEventListener("click", closePreview);
modal.addEventListener("click", event => { if(event.target === modal) closePreview(); });
modal.querySelector("[data-download]").addEventListener("click", () => showToast("Demo：文件下载"));
document.addEventListener("keydown", event => { if(event.key === "Escape") closePreview(); });

syncEbsSelection(); renderResult();
if(new URLSearchParams(location.search).get("object") === "bridge-k12350"){
  const bridge = document.querySelector('[data-object="bridge"]'); bridge.classList.add("locating"); setTimeout(() => bridge.classList.remove("locating"), 1900);
}

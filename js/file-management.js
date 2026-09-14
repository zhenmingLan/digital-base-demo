const folder = (key, name) => ({ type: "folder", key, name });
const file = (code, name, worksite, version, status, uploader, updated, size = "16.2 MB") => ({
  type: "file", code, name, category: "文件", worksite, version, status, uploader, updated, size
});

const directories = {
  root: { name: "XX高速公路", parent: null, items: [folder("measurement", "测量成果")] },
  measurement: { name: "测量成果", parent: "root", items: [
    folder("terrain", "地形图成果"), folder("control", "控制点资料"), folder("route", "路线测量成果"),
    folder("pipeline", "管线资料"), folder("flight", "航飞影像资料"), folder("pointcloud", "点云数据"),
    folder("dom", "数字正射影像（DOM）"), folder("raw", "原始数据"), folder("reports", "测量报告")
  ]},
  terrain: { name: "地形图成果", parent: "measurement", items: [
    file("XX-CL-DX-10000", "1:10000 地形图", "全线", "V2", "最终成果", "李工", "2025-05-20 10:32"),
    file("XX-CL-DX-02000", "1:2000 地形图", "全线", "V2", "最终成果", "李工", "2025-05-20 10:35"),
    file("XX-CL-DX-00500", "1:500 地形图", "K12+350 大桥", "V3", "中间成果", "李工", "2025-05-21 14:18", "28.6 MB"),
    file("XX-CL-DX-LY", "陆域地形图", "全线", "V1", "最终成果", "王工", "2025-05-18 09:15"),
    file("XX-CL-DX-SY", "水域地形图", "跨河段", "V1", "中间成果", "张工", "2025-05-19 16:40"),
    file("XX-CL-DEM-01", "数字高程模型（DEM）", "全线", "V2", "最终成果", "孙工", "2025-05-20 09:45")
  ]},
  control: { name: "控制点资料", parent: "measurement", items: [
    file("XX-CL-KZ-001", "控制点成果", "全线", "V2", "最终成果", "赵工", "2025-05-19 12:22"),
    file("XX-CL-KZ-002", "控制点点之记", "全线", "V1", "最终成果", "赵工", "2025-05-18 17:05")
  ]},
  route: { name: "路线测量成果", parent: "measurement", items: [
    folder("route-center", "中桩测量成果"), folder("route-section", "横断面测量成果"), folder("route-point", "工点测量成果")
  ]},
  "route-center": { name: "中桩测量成果", parent: "route", items: [file("XX-CL-ZZ-001", "路线中桩测量成果表", "全线", "V2", "中间成果", "张工", "2025-05-19 11:20")] },
  "route-section": { name: "横断面测量成果", parent: "route", items: [file("XX-CL-HD-001", "路线横断面测量成果图", "全线", "V2", "中间成果", "李工", "2025-05-20 15:33")] },
  "route-point": { name: "工点测量成果", parent: "route", items: [
    file("XX-CL-0128", "桥梁工点测量成果", "K12+350 大桥", "V3", "中间成果", "李工", "2025-05-21 14:18", "28.6 MB"),
    file("XX-CL-0129", "路基工点测量成果", "K10+800 路基", "V2", "最终成果", "王工", "2025-05-20 09:32"),
    file("XX-CL-0130", "隧道工点测量成果", "K14+000 隧道", "V1", "中间成果", "张工", "2025-05-19 16:08")
  ]},
  pipeline: { name: "管线资料", parent: "measurement", items: [
    file("XX-CL-GX-001", "管线探测成果图", "K12+350 大桥", "V1", "最终成果", "赵工", "2025-05-18 17:05"),
    file("XX-CL-GX-002", "管线探测成果表", "K12+350 大桥", "V2", "最终成果", "赵工", "2025-05-19 12:22")
  ]},
  flight: { name: "航飞影像资料", parent: "measurement", items: [file("XX-CL-HF-001", "航飞影像资料", "全线", "V1", "中间成果", "孙工", "2025-05-20 09:45")] },
  pointcloud: { name: "点云数据", parent: "measurement", items: [file("XX-CL-DY-001", "全线点云数据", "全线", "V1", "中间成果", "孙工", "2025-05-20 10:00")] },
  dom: { name: "数字正射影像（DOM）", parent: "measurement", items: [file("XX-CL-DOM-001", "数字正射影像（DOM）", "全线", "V1", "最终成果", "孙工", "2025-05-20 10:05")] },
  raw: { name: "原始数据", parent: "measurement", items: [
    file("XX-CL-YS-001", "GNSS静态观测原始数据", "全线", "V1", "中间成果", "王工", "2025-05-18 08:40"),
    file("XX-CL-YS-002", "水准测量原始数据", "全线", "V1", "中间成果", "王工", "2025-05-18 08:55")
  ]},
  reports: { name: "测量报告", parent: "measurement", items: [
    file("XX-CL-BG-001", "工程测量大纲", "全线", "V2", "最终成果", "李工", "2025-05-20 10:20"),
    file("XX-CL-BG-002", "技术总结报告", "全线", "V2", "最终成果", "李工", "2025-05-20 11:10"),
    file("XX-CL-BG-003", "平差计算书", "全线", "V1", "最终成果", "王工", "2025-05-19 14:05"),
    file("XX-CL-BG-004", "测量自检报告", "全线", "V1", "中间成果", "张工", "2025-05-21 09:30"),
    file("XX-CL-BG-005", "管线探测报告（若有）", "全线", "V1", "中间成果", "赵工", "2025-05-21 10:15")
  ]}
};

const rows = document.getElementById("fileRows");
const detailContent = document.getElementById("detailContent");
const tabs = document.getElementById("detailTabs");
const modal = document.getElementById("previewModal");
const toast = document.getElementById("toast");
const breadcrumb = document.getElementById("directoryBreadcrumb");
const itemCount = document.getElementById("itemCount");
const footerCount = document.getElementById("footerCount");
let currentDirectory = "route-point";
let activeItem = directories[currentDirectory].items[0];
let activeTab = "basic";
let toastTimer;

function tag(status){ return `<span class="tag ${status === "最终成果" ? "final" : "middle"}">${status}</span>`; }
function showToast(message = "Demo演示功能"){
  toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}
function directoryPath(key){
  const path = []; let cursor = key;
  while(cursor){ path.unshift({ key: cursor, name: directories[cursor].name }); cursor = directories[cursor].parent; }
  return path;
}
function renderBreadcrumb(){
  breadcrumb.innerHTML = directoryPath(currentDirectory).map((node,index,array) =>
    `<button type="button" data-open-folder="${node.key}" ${index === array.length - 1 ? 'aria-current="page"' : ""}>${node.name}</button>${index < array.length - 1 ? "<span>›</span>" : ""}`
  ).join("");
  breadcrumb.querySelectorAll("[data-open-folder]").forEach(button => button.addEventListener("click", () => openDirectory(button.dataset.openFolder)));
}
function syncTreeSelection(){
  document.querySelectorAll("#directoryTree .tree-row").forEach(row => row.classList.remove("selected"));
  const row = document.querySelector(`#directoryTree [data-folder="${currentDirectory}"]`);
  if(!row) return;
  row.classList.add("selected");
  let parent = row.parentElement;
  while(parent){ if(parent.tagName === "DETAILS") parent.open = true; parent = parent.parentElement; }
}
function openDirectory(key){
  if(!directories[key]) return;
  currentDirectory = key; activeItem = null; activeTab = "basic";
  tabs.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.tab === "basic"));
  renderBreadcrumb(); syncTreeSelection(); renderRows(); renderDetail();
}
function renderRows(){
  const items = directories[currentDirectory].items;
  itemCount.textContent = `共 ${items.length} 项`; footerCount.textContent = `共 ${items.length} 项`;
  rows.innerHTML = items.map((item,index) => {
    if(item.type === "folder") return `<tr class="folder-row" data-index="${index}" tabindex="0"><td></td><td>—</td><td title="${item.name}"><span class="table-folder-icon">▱</span>${item.name}</td><td>文件夹</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>`;
    return `<tr data-index="${index}" class="${item === activeItem ? "selected" : ""}" tabindex="0"><td><i class="fake-check"></i></td><td>${item.code}</td><td title="${item.name}">${item.name}</td><td>${item.category}</td><td>${item.worksite}</td><td>${item.version}</td><td>${tag(item.status)}</td><td>${item.uploader}</td><td>${item.updated}</td></tr>`;
  }).join("");
  rows.querySelectorAll("tr").forEach(row => {
    const select = () => {
      const item = items[Number(row.dataset.index)];
      if(item.type === "folder"){ openDirectory(item.key); return; }
      activeItem = item; activeTab = "basic";
      tabs.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.tab === "basic"));
      renderRows(); renderDetail();
    };
    row.addEventListener("click", select);
    row.addEventListener("keydown", event => { if(event.key === "Enter" || event.key === " "){ event.preventDefault(); select(); } });
  });
}
function folderDetail(){
  const directory = directories[currentDirectory];
  const folderCount = directory.items.filter(item => item.type === "folder").length;
  const fileCount = directory.items.filter(item => item.type === "file").length;
  const parent = directory.parent ? directories[directory.parent].name : "—";
  return `<dl class="info-grid"><dt>目录名称</dt><dd>${directory.name}</dd><dd></dd><dt>目录类型</dt><dd>文件夹</dd><dd></dd><dt>上级目录</dt><dd>${parent}</dd><dd></dd><dt>子文件夹</dt><dd>${folderCount} 个</dd><dd></dd><dt>文件数量</dt><dd>${fileCount} 个</dd><dd></dd><dt>目录路径</dt><dd>${directoryPath(currentDirectory).map(item => item.name).join(" / ")}</dd><dd></dd></dl><div class="folder-hint">请在中间区域选择子文件夹或文件查看详细信息。</div>`;
}
function fileDetail(){
  const f = activeItem;
  return `<dl class="info-grid"><dt>文件编码</dt><dd>${f.code}</dd><dd><button class="outline-btn" data-demo>编码管理</button></dd><dt>文件名称</dt><dd>${f.name}</dd><dd></dd><dt>类型</dt><dd>${f.category}</dd><dd></dd><dt>工点</dt><dd>${f.worksite}</dd><dd></dd><dt>版本</dt><dd>${f.version}</dd><dd><button class="outline-btn" data-demo>版本管理</button></dd><dt>状态</dt><dd>${tag(f.status)}</dd><dd><button class="outline-btn" data-demo>状态管理</button></dd><dt>上传人</dt><dd>${f.uploader}</dd><dd></dd><dt>上传时间</dt><dd>${f.updated}</dd><dd></dd><dt>文件大小</dt><dd>${f.size}</dd><dd></dd><dt>备注</dt><dd>—</dd><dd></dd></dl><div class="detail-actions"><button class="primary-btn" data-download>⇩&nbsp; 下载</button><button data-preview>◎&nbsp; 在线预览</button><button data-demo>更多操作&nbsp;⌄</button></div><div class="drawing-thumb"><img src="assets/file-preview.svg" alt="工程成果预览缩略图"></div>`;
}
function openPreview(){
  if(!activeItem) return;
  modal.querySelector("h2").innerHTML = `${activeItem.name} <em>${activeItem.version}</em>`;
  modal.querySelector("footer span").textContent = `${activeItem.code} · ${activeItem.size}`;
  modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
}
function closePreview(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
function renderDetail(){
  if(activeTab === "basic") detailContent.innerHTML = activeItem ? fileDetail() : folderDetail();
  else if(!activeItem) detailContent.innerHTML = `<div class="placeholder-tab"><b>${tabs.querySelector(`[data-tab="${activeTab}"]`).textContent}</b>请先在中间区域选择一个文件。</div>`;
  else if(activeTab === "preview") detailContent.innerHTML = `<div class="drawing-thumb" style="height:480px;margin-top:0"><img src="assets/file-preview.svg" alt="工程成果预览"></div><div class="detail-actions"><button class="primary-btn" data-preview>放大预览</button><button data-download>下载</button><button data-demo>打印</button></div>`;
  else if(activeTab === "spatial") detailContent.innerHTML = `<div class="spatial-card"><small>已建立空间关联</small><h2>${activeItem.worksite}</h2><p>所属路线：XX高速公路<br>成果状态：${activeItem.status}<br>该文件已与工程对象建立空间位置关联。</p><a href="gis.html?object=bridge-k12350">⌖&nbsp; 空间定位</a></div>`;
  else detailContent.innerHTML = `<div class="placeholder-tab"><b>${tabs.querySelector(`[data-tab="${activeTab}"]`).textContent}</b>Demo 已保留该功能入口，当前无更多记录。</div>`;
  detailContent.querySelectorAll("[data-demo]").forEach(button => button.addEventListener("click", () => showToast()));
  detailContent.querySelectorAll("[data-download]").forEach(button => button.addEventListener("click", () => showToast("Demo：文件下载")));
  detailContent.querySelectorAll("[data-preview]").forEach(button => button.addEventListener("click", openPreview));
}

tabs.addEventListener("click", event => {
  const button = event.target.closest("button[data-tab]"); if(!button) return;
  activeTab = button.dataset.tab;
  tabs.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
  renderDetail();
});
document.getElementById("directoryTree").addEventListener("click", event => {
  const row = event.target.closest(".tree-row[data-folder]"); if(!row) return;
  if(row.tagName === "SUMMARY"){
    // Selection reveals ancestors; handle this branch explicitly so the native
    // summary toggle cannot immediately close a branch we have just revealed.
    event.preventDefault();
    const branch = row.parentElement;
    const wasOpen = branch.open;
    openDirectory(row.dataset.folder);
    branch.open = !wasOpen;
  } else {
    openDirectory(row.dataset.folder);
  }
});
document.querySelectorAll("[data-demo]").forEach(button => button.addEventListener("click", () => showToast()));
modal.querySelector(".modal-close").addEventListener("click", closePreview);
modal.addEventListener("click", event => { if(event.target === modal) closePreview(); });
modal.querySelector("[data-demo]").addEventListener("click", () => showToast("Demo：文件下载"));
document.addEventListener("keydown", event => { if(event.key === "Escape") closePreview(); });

renderBreadcrumb(); syncTreeSelection(); renderRows(); renderDetail();

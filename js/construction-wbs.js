/* Project-specific WBS adaptation of Files folders and attributes, not a native mandatory Forma taxonomy. */
window.WBS = (()=>{
'use strict';
const {icon,esc,dialog}=CDE;
const nodes=[
['T1',null,'合同段 T1','合同工作范围','全项目','项目经理部','已建示例工作范围 · 非完整合同 WBS'],
['T1.00','T1','项目管理与公共交付','控制账户','全项目','项目经理部','跨工作包的管理与交付要求'],
['T1.00.01','T1.00','施工组织与交付策划','工作包','全项目','项目技术部','施工组织、编码规则与阶段交付要求'],
['T1.01','T1','桥梁工程','工程组成','K12+350 大桥','桥梁分部','桥梁下部结构、桥面工程'],
['T1.01.01','T1.01','下部结构','工程分解','K12+350 大桥','桥梁分部','桥台与预埋构件施工'],
['T1.01.01.01','T1.01.01','桥台与预埋件施工','工作包','K12+350 大桥','桥梁分部','钢筋、支座与预埋件施工及隐蔽验收'],
['T1.01.02','T1.01','桥面工程','工程分解','K12+350 大桥','桥梁分部','桥面铺装及排水施工'],
['T1.01.02.01','T1.01.02','桥面铺装与排水施工','工作包','K12+350 大桥','桥梁分部','混凝土配合比、浇筑与排水构造'],
['T1.02','T1','隧道机电工程','工程组成','K14+000 隧道','机电分部','通风、排水与供配电系统施工'],
['T1.02.01','T1.02','通风系统安装','工作包','K14+000 隧道','机电分部','通风设备报审、安装与单机调试'],
['T1.02.02','T1.02','排水系统安装与试验','工作包','K14+000 隧道','机电分部','管线安装、泵组安装与系统试验'],
['T1.02.03','T1.02','供配电安装与验收','工作包','K14+000 隧道','机电分部','配电柜安装、用电检查与资料移交'],
['T1.03','T1','管理站工程','工程组成','综合管理站','房建分部','管理站机电施工与验收'],
['T1.03.01','T1.03','管理站配电安装','工作包','综合管理站','房建分部','设备房施工界面、配电深化与安装'],
['T1.04','T1','联合调试与交付','工程组成','全项目','项目经理部','单系统完成后开展跨系统联合调试'],
['T1.04.01','T1.04','机电联合调试与交接','工作包','K14+000 隧道','调试工作组','跨系统联调、接口确认与交接记录']
].map(([id,parent,name,level,zone,owner,scope])=>({id,parent,name,level,zone,owner,scope}));
const activityMap={'ACT-01':'T1.01.01.01','ACT-02':'T1.01.02.01','ACT-03':'T1.02.01','ACT-04':'T1.02.02','ACT-05':'T1.03.01','ACT-06':'T1.04.01'};
const docs=[
['001','T1.00.01','施工组织设计（示例）','方案','PDF','V2','方案示例',null],
['002','T1.00.01','资产编码与交付要求清单','移交资料','XLSX','V1','要求示例',null],
['003','T1.01.01.01','桥台施工图发行包','图纸','PDF','V3','发行示例','S-101'],
['004','T1.01.01.01','桥台预埋件施工专项方案','方案','PDF','V2','待核验','ISS-001'],
['005','T1.01.01.01','支座产品资料与试验报告','报审资料','PDF','V1','关联报审','SUB-001'],
['006','T1.01.01.01','桥台隐蔽工程验收记录','检查记录','FORM','V1','关联表单','FRM-001'],
['007','T1.01.01.01','预埋件定位技术澄清记录','技术澄清','RFI','V1','关联澄清','RFI-001'],
['008','T1.01.02.01','桥面铺装及排水构造图','图纸','PDF','V2','发行示例','S-102'],
['009','T1.01.02.01','C50 混凝土配合比报告','报审资料','PDF','V1','关联报审','SUB-003'],
['010','T1.01.02.01','桥面混凝土浇筑日报','检查记录','FORM','V1','关联表单','FRM-003'],
['011','T1.02.01','隧道通风设备布置图','图纸','PDF','V4','发行示例','S-201'],
['012','T1.02.01','射流风机设备报审资料','报审资料','PDF','V1','关联报审','SUB-002'],
['013','T1.02.01','风机单机调试记录','调试记录','PDF','V1','调试资料示例','FAN-01'],
['014','T1.02.01','风机运维手册索引','移交资料','PDF','V1','待核验','FAN-01'],
['015','T1.02.02','隧道排水系统安装图','图纸','PDF','V2','发行示例','S-202'],
['016','T1.02.02','排水系统试验与复核记录','检查记录','PDF','V1','待复核','ISS-003'],
['017','T1.02.02','排水泵安装记录','调试记录','PDF','V1','安装资料示例','PUMP-01'],
['018','T1.02.03','隧道临时用电巡检记录','检查记录','FORM','V1','关联表单','FRM-002'],
['019','T1.02.03','配电柜移交资料清单','移交资料','XLSX','V1','清单示例','DB-01'],
['020','T1.03.01','管理站设备房平面图','图纸','PDF','V2','发行示例','S-301'],
['021','T1.03.01','管理站配电系统图','图纸','PDF','V1','发行示例','S-302'],
['022','T1.03.01','配电柜深化接线图报审','报审资料','PDF','V1','关联报审','SUB-004'],
['023','T1.04.01','机电联合调试与交接方案','方案','PDF','V1','待核验',null]
].map(([num,wbs,name,category,format,version,status,ref])=>({id:'DOC-'+num,wbs,name,category,format,version,status,ref}));
const state={node:'T1',category:'全部类型',search:'',descendants:false,selected:null,treeQuery:'',expanded:new Set(nodes.filter(n=>n.level!=='工作包').map(n=>n.id))};
let host,api;
const node=id=>nodes.find(n=>n.id===id),within=(id,parent)=>id===parent||id.startsWith(parent+'.'),scopeDocs=id=>docs.filter(d=>within(d.wbs,id));
function filtered(){return docs.filter(d=>(state.descendants?within(d.wbs,state.node):d.wbs===state.node)&&(state.category==='全部类型'||d.category===state.category)&&(!state.search||[d.id,d.name,d.wbs,d.ref].join(' ').toLowerCase().includes(state.search.toLowerCase())));}
function breadcrumb(id){const a=[];let n=node(id);while(n){a.unshift(n);n=node(n.parent);}return a;}
function record(d){return Object.values(window.BUILD?.rows||{}).flat().find(r=>r.id===d.ref);}
function status(d){return record(d)&&['报审资料','技术澄清','检查记录'].includes(d.category)?record(d).status:d.status;}
function tree(n,depth=0){const children=nodes.filter(x=>x.parent===n.id),matches=nodes.filter(x=>[x.id,x.name].join(' ').toLowerCase().includes(state.treeQuery.toLowerCase()));if(state.treeQuery&&!matches.some(m=>within(m.id,n.id)||within(n.id,m.id)))return '';const open=state.treeQuery||state.expanded.has(n.id);return `<div class="wbs-branch"><div class="wbs-node ${state.node===n.id?'active':''}" style="padding-left:${depth*16+8}px"><button class="wbs-expand" data-wbs-toggle="${n.id}" aria-label="${open?'收起':'展开'}${n.name}" ${children.length?'':'disabled'}>${children.length?(open?'⌄':'›'):''}</button><button data-wbs-node="${n.id}" title="${n.id} ${n.name}"><span class="wbs-node-icon">${icon('folder')}</span><span>${n.name}</span><em>${scopeDocs(n.id).length}</em></button></div>${open?children.map(c=>tree(c,depth+1)).join(''):''}</div>`;}
function folders(){return state.descendants||state.category!=='全部类型'?[]:nodes.filter(n=>n.parent===state.node&&(!state.search||[n.id,n.name].join(' ').toLowerCase().includes(state.search.toLowerCase())));}
function table(){const ds=filtered(),fs=folders();return `<table class="wbs-table"><thead><tr><th>文件名称 / 编码</th><th>归属 WBS</th><th>资料类型</th><th>版本</th><th>业务状态</th><th>关联项</th></tr></thead><tbody>${fs.map(n=>`<tr data-wbs-node="${n.id}" tabindex="0" aria-label="打开文件夹 ${n.name}"><td><div class="wbs-file-name"><span class="wbs-folder-icon">${icon('folder')}</span><span><strong>${n.name}</strong><small>${n.id}</small></span></div></td><td>${n.id}</td><td>文件夹</td><td>—</td><td>${scopeDocs(n.id).length} 份文件</td><td>进入 ›</td></tr>`).join('')}${ds.map(d=>`<tr data-wbs-doc="${d.id}" class="${state.selected===d.id?'selected':''}" tabindex="0"><td><div class="wbs-file-name"><span class="wbs-format">${d.format}</span><span><strong>${esc(d.name)}</strong><small>${d.id}</small></span></div></td><td><button class="text-button" data-wbs-node="${d.wbs}">${d.wbs}</button></td><td>${d.category}</td><td><span class="version-pill">${d.version}</span></td><td><span class="wbs-status">${esc(status(d))}</span></td><td>${d.ref?`<button class="text-button" data-wbs-ref="${d.ref}">${d.ref} ↗</button>`:'—'}</td></tr>`).join('')}</tbody></table>${!ds.length&&!fs.length?'<div class="build-empty">当前范围没有符合条件的文件<br><button class="text-button" data-wbs-action="clear">重置资料筛选</button></div>':''}`;}
function summary(){const n=node(state.node);return `<div class="wbs-meta"><span>${n.id} · ${n.level}</span><span>责任单位：${n.owner}</span><span>工点：${n.zone}</span><button class="text-button" data-wbs-action="dictionary">目录属性与关联 ↗</button></div>`;}
function main(){return `<div class="wbs-tools"><button class="cde-primary" data-wbs-action="upload">＋ 归档文件</button><label><input type="checkbox" id="wbsDescendants" ${state.descendants?'checked':''}>包含下级</label><span class="toolbar-spacer"></span><select id="wbsType" aria-label="资料类型">${['全部类型',...new Set(docs.map(d=>d.category))].map(c=>`<option ${state.category===c?'selected':''}>${c}</option>`).join('')}</select><label class="wbs-search">${icon('search')}<input id="wbsFileSearch" placeholder="搜索文件名称或编码" value="${esc(state.search)}" aria-label="搜索 WBS 文件"></label></div><div class="wbs-breadcrumb">${breadcrumb(state.node).map(n=>`<button data-wbs-node="${n.id}">${n.name}</button>`).join('<span>›</span>')}</div>${summary()}<div class="wbs-table-scroll">${table()}</div><footer class="wbs-footer"><span id="wbsCount">${countLabel()}</span><span>${state.descendants?'包含下级文件':'当前文件夹'} · 文件按工作包归档</span></footer>`;}
function countLabel(){return `${folders().length} 个文件夹 · ${filtered().length} 份文件`;}
function syncURL(push=false){const u=new URL(location.href);u.search='';u.searchParams.set('wbs',state.node);if(state.descendants)u.searchParams.set('all','1');if(state.search)u.searchParams.set('q',state.search);if(state.category!=='全部类型')u.searchParams.set('type',state.category);if(state.selected)u.searchParams.set('file',state.selected);u.hash='files';if(u.href!==location.href)history[push?'pushState':'replaceState'](null,'',u);}
function restoreURL(){const q=new URLSearchParams(location.search);state.node=node(q.get('wbs'))?q.get('wbs'):'T1';state.descendants=q.get('all')==='1';state.search=q.get('q')||'';state.category=['全部类型',...docs.map(d=>d.category)].includes(q.get('type'))?q.get('type'):'全部类型';state.selected=q.get('file');state.treeQuery='';breadcrumb(state.node).forEach(n=>state.expanded.add(n.id));if(!filtered().some(d=>d.id===state.selected))state.selected=null;}
function repaintTree(){const el=host.querySelector('.wbs-tree-scroll'),top=el.scrollTop;el.innerHTML=tree(nodes[0])||'<p class="build-empty">没有匹配节点</p>';el.scrollTop=top;}
function paint(){const top=host.querySelector('.wbs-tree-scroll')?.scrollTop||0;host.innerHTML=`<div class="wbs-layout"><aside class="wbs-tree"><header><strong>项目文件</strong><button class="text-button" data-wbs-action="collapse">收起</button></header><label class="wbs-tree-search">${icon('search')}<input id="wbsTreeSearch" aria-label="搜索 WBS 节点" value="${esc(state.treeQuery)}" placeholder="查找编码或工作包"></label><div class="wbs-tree-scroll">${tree(nodes[0])||'<p class="build-empty">没有匹配节点</p>'}</div><footer>WBS 工作分解结构<br>右侧数字为包含下级的文件数</footer></aside><section class="wbs-main">${main()}</section></div>`;bindInputs();host.querySelector('.wbs-tree-scroll').scrollTop=top;const selected=filtered().find(d=>d.id===state.selected);if(selected)docPanel(selected,false);else state.selected=null;}
function redrawTable(){host.querySelector('.wbs-table-scroll').innerHTML=table();host.querySelector('#wbsCount').textContent=countLabel();}
function closeDoc(){state.selected=null;host.querySelector('.wbs-doc-panel')?.remove();host.querySelectorAll('[data-wbs-doc]').forEach(r=>r.classList.remove('selected'));syncURL();}
function bindInputs(){host.querySelector('#wbsFileSearch').oninput=e=>{state.search=e.target.value;closeDoc();redrawTable();};host.querySelector('#wbsType').onchange=e=>{state.category=e.target.value;closeDoc();paint();};host.querySelector('#wbsDescendants').onchange=e=>{state.descendants=e.target.checked;closeDoc();paint();};host.querySelector('#wbsTreeSearch').oninput=e=>{state.treeQuery=e.target.value;repaintTree();};}
function choose(id){if(!node(id)||id===state.node)return;state.node=id;state.selected=null;state.treeQuery='';state.category='全部类型';state.search='';state.descendants=false;breadcrumb(id).forEach(n=>state.expanded.add(n.id));syncURL(true);paint();}
function docPanel(d,update=true){if(!d)return;state.selected=d.id;if(update)syncURL();host.querySelectorAll('[data-wbs-doc]').forEach(r=>r.classList.toggle('selected',r.dataset.wbsDoc===d.id));host.querySelector('.wbs-doc-panel')?.remove();const n=node(d.wbs);const panel=document.createElement('aside');panel.className='wbs-doc-panel';panel.innerHTML=`<header><strong>文件详情</strong><button class="quiet-button" data-wbs-action="close-doc" aria-label="关闭文件详情">×</button></header><div><span class="wbs-format">${d.format}</span><h2>${esc(d.name)}</h2><dl><dt>文件编号</dt><dd>${d.id}</dd><dt>主归属 WBS</dt><dd><button class="text-button" data-wbs-node="${n.id}">${n.id} ↗</button><p>${n.name}</p></dd><dt>资料类型</dt><dd>${d.category}</dd><dt>当前版本</dt><dd>${d.version}</dd><dt>业务状态</dt><dd>${esc(status(d))}</dd><dt>责任单位</dt><dd>${n.owner}</dd><dt>物理位置</dt><dd>${n.zone}</dd></dl><h3>关联业务</h3>${d.ref?`<button class="build-reference" data-wbs-ref="${d.ref}">${d.ref} · ${esc(record(d)?.title||(d.ref.startsWith('S-')?'施工图纸':'资产记录'))} ↗</button>`:'<p>当前文件尚未建立业务记录关联。</p>'}<h3>归档与引用</h3><p>文件主归属固定在工作包内。图纸、检查、报审与设备记录通过引用关联，不按资料类型复制多份文件。</p><p>文件内容和版本为演示索引；未读取真实附件。关联业务状态不代表整份文件已正式批准。</p></div><footer><button class="cde-primary" data-wbs-action="preview">查看资料摘要</button></footer>`;host.querySelector('.wbs-layout').append(panel);}
function dictionary(){const n=node(state.node),acts=(window.BUILD?.tasks||[]).filter(t=>within(activityMap[t[0]]||'',n.id));dialog('WBS 字典 · '+n.id,`<h3>${n.name}</h3><p>层级：${n.level}<br>工作范围：${n.scope}<br>责任单位：${n.owner}<br>物理位置：${n.zone}</p><h3>关联进度活动</h3>${acts.map(t=>`<p><a href="construction.html?activity=${t[0]}#schedule">${t[0]} · ${t[1]} ↗</a><br>主归属：${activityMap[t[0]]}</p>`).join('')||'<p>该工作包尚未登记示例进度活动，不自动创建计划。</p>'}<h3>归档要求</h3><p>核对 WBS、文件类型、版本、来源和关联业务；交付验收仍按批准流程和接收要求进行。</p><p>WBS 编码用于工作范围分解，ACT 编号用于计划活动，物理位置用于现场定位。此目录为项目适配示例，并非 Autodesk 强制目录模板。</p>`,'关闭',()=>{});}
function upload(){const d=dialog('按工作包归档文件',`<label class="field">目标工作包<select id="wbsUploadTarget"><option value="">请选择归档工作包</option>${nodes.filter(n=>n.level==='工作包'&&within(n.id,state.node)).map(n=>`<option value="${n.id}" ${state.node===n.id?'selected':''}>${n.id} · ${n.name}</option>`).join('')}</select></label><label class="field">文件名称<input id="wbsUploadName" placeholder="输入示例文件名称"></label><label class="field">资料类型<select id="wbsUploadType">${[...new Set(docs.map(d=>d.category))].map(t=>`<option>${t}</option>`).join('')}</select></label><p id="wbsUploadError"></p><p>只新增归档索引示例，不上传真实附件；WBS 工作包是主归属，资料类型作为属性。</p>`,'添加索引示例');document.querySelector('#dialogConfirm').onclick=()=>{const name=document.querySelector('#wbsUploadName').value.trim();if(!name){document.querySelector('#wbsUploadError').textContent='请输入文件名称。';return;}const wbs=document.querySelector('#wbsUploadTarget').value;if(!node(wbs)||node(wbs).level!=='工作包'){document.querySelector('#wbsUploadError').textContent='请选择目标工作包。';return;}const id='DOC-'+String(Math.max(0,...docs.map(d=>Number(d.id.split('-')[1])||0))+1).padStart(3,'0');docs.push({id,wbs,name,category:document.querySelector('#wbsUploadType').value,format:'FILE',version:'V1',status:'待核验',ref:null});d.close();choose(wbs);state.search='';state.category='全部类型';paint();docPanel(docs.at(-1));sessionStorageSafe();};}
function render(el){host=el;restoreURL();paint();if(!host.dataset.wbsBound){host.dataset.wbsBound='true';host.addEventListener('click',e=>{const b=e.target.closest('button,tr');if(!b)return;if(b.dataset.wbsNode)choose(b.dataset.wbsNode);else if(b.dataset.wbsToggle){state.expanded.has(b.dataset.wbsToggle)?state.expanded.delete(b.dataset.wbsToggle):state.expanded.add(b.dataset.wbsToggle);repaintTree();}else if(b.dataset.wbsDoc)docPanel(docs.find(d=>d.id===b.dataset.wbsDoc));else if(b.dataset.wbsRef){const id=b.dataset.wbsRef;sessionStorageSafe();location.href=LC.buildUrl(id,id.startsWith('S-')?'sheets':'issues');}else if(b.dataset.wbsAction){const a=b.dataset.wbsAction;if(a==='close-doc')closeDoc();if(a==='collapse'){state.expanded=new Set(['T1']);repaintTree();}if(a==='dictionary')dictionary();if(a==='upload')upload();if(a==='clear'){state.category='全部类型';state.search='';closeDoc();paint();}if(a==='preview'){const d=docs.find(d=>d.id===state.selected);dialog('资料摘要',`<h3>${esc(d.name)}</h3><p>${d.id} · ${d.version}<br>主归属：${d.wbs}<br>类型：${d.category}</p><p>此为归档索引，不包含真实附件正文；可通过关联业务查看现场记录或图纸示意。</p>`,'关闭',()=>{});}}});host.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('tr[data-wbs-doc],tr[data-wbs-node]'))e.target.click();if(e.key==='Escape')closeDoc();});}}
window.addEventListener('popstate',()=>{if(location.hash==='#files'&&host?.isConnected){restoreURL();paint();}});
const key='lifecycle-wbs-v1';function sessionStorageSafe(){try{sessionStorage.setItem(key,JSON.stringify(docs));}catch{}}
try{const saved=JSON.parse(sessionStorage.getItem(key)||'null');if(Array.isArray(saved)&&saved.every(d=>node(d.wbs)&&d.id&&d.name)){docs.splice(0,docs.length,...saved);}}catch{}
window.addEventListener('pagehide',sessionStorageSafe);
function reset(){docs.splice(23);try{sessionStorage.removeItem(key);}catch{}}
return {nodes,docs,state,activityMap,node,within,filtered,render,reset};
})();

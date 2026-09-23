// Frontend regression in isolated browser contexts. No Autodesk or production writes.
// NODE_PATH=<playwright modules> BASE_URL=http://127.0.0.1:8765/ node tests/browser-regression.cjs
// Optional: QA_OUT, BROWSER_EXECUTABLE, QA_INTERACTIONS_ONLY=1. Output defaults to OS temp.
const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const base=(process.env.BASE_URL||'http://127.0.0.1:8765/').replace(/\/?$/,'/');
const out=process.env.QA_OUT||path.join(require('os').tmpdir(),'digital-base-browser-qa');fs.mkdirSync(out,{recursive:true});
const report={base,started:new Date().toISOString(),checks:[],errors:[],requests:[],screenshots:[]};
const routeGroups={
 'file-management.html':[''], 'gis.html':[''], 'road-modeling.html':[''],
 'workflows.html':['issues','reviews','transmittals','activity','members','bridge','settings'],
 'construction.html':['home','sheets','files','issues','forms','rfis','submittals','schedule','cost','assets','meetings','reports'],
 'operations.html':['home','facilities','manage','twin','inventory','spaces','systems','documents','docs','connections','streams','dashboard','handover','setup','history']
};
const routes=Object.entries(routeGroups).flatMap(([file,hashes])=>hashes.map(h=>file+(h?'#'+h:'')));
function ok(value,label,details){report.checks.push({label,pass:!!value,details});if(!value)throw Error(label+' '+JSON.stringify(details));}
async function test(label,fn){try{await fn();console.log('PASS '+label);}catch(e){report.checks.push({label,pass:false,error:e.stack});console.log('FAIL '+label+' '+e.message);}}
async function closeDialog(p){const d=p.locator('dialog[open]');if(await d.count()){await p.keyboard.press('Escape');await d.waitFor({state:'hidden',timeout:3000});}}
async function clickAny(p,selectors){for(const s of selectors){const l=p.locator(s).first();if(await l.isVisible().catch(()=>false)){await l.click();return true;}}throw Error('No visible selector: '+selectors.join(' | '));}
(async()=>{
 const executablePath=process.env.BROWSER_EXECUTABLE||(process.platform==='darwin'&&fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined);
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
 try{
  for(const viewport of (process.env.QA_INTERACTIONS_ONLY?[]:[{width:1366,height:900},{width:1920,height:1080}])){
   const ctx=await browser.newContext({viewport});const p=await ctx.newPage();
   p.on('pageerror',e=>report.errors.push({url:p.url(),message:e.message}));
   p.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))report.requests.push({url:r.url(),status:r.status()});});
   for(const route of routes){await test(viewport.width+' '+route,async()=>{
    const response=await p.goto(base+route,{waitUntil:'networkidle',timeout:30000});ok(!response || response.status()===200,'HTTP '+route);
    await p.waitForTimeout(120);const title=await p.locator('h1').first().innerText();ok(title.trim().length>0,'heading '+route,title);
    const layout=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth,height:innerHeight,main:[...document.querySelectorAll('main,.cde-workspace')].filter(x=>x.getBoundingClientRect().width>0).map(x=>({right:x.getBoundingClientRect().right,bottom:x.getBoundingClientRect().bottom})),bad:/\[object Object\]|\bundefined\b|NaN/.test(document.body.innerText)}));
    ok(layout.scroll<=viewport.width+1,'no document horizontal overflow '+route,layout);ok(!layout.bad,'no leaked JS values '+route);
    if(['file-management.html','road-modeling.html','operations.html#facilities','operations.html#twin','construction.html#home','construction.html#files','workflows.html#reviews'].includes(route)){
      const file=path.join(out,viewport.width+'-'+route.replace(/[.#]/g,'-')+'.png');await p.screenshot({path:file,fullPage:false});report.screenshots.push(file);
    }
   });}
   await ctx.close();
  }
  const ctx=await browser.newContext({viewport:{width:1440,height:1000}});const p=await ctx.newPage();p.on('pageerror',e=>report.errors.push({url:p.url(),message:e.message}));
  await test('Root redirect',async()=>{await p.goto(base);await p.waitForURL('**/file-management.html*');ok(p.url().includes('/file-management.html'),'root opens file workspace');});
  await test('Product menu navigation',async()=>{
   await p.goto(base+'file-management.html');await p.locator('#appSwitch').click();
   for(const text of ['道路接入与建模','Forma Data Management','Forma Build','Autodesk Tandem'])ok(await p.locator('#switchMenu').getByText(text,{exact:true}).count()>0,'product menu '+text);
   await p.keyboard.press('Escape');ok(await p.locator('#switchMenu').isHidden(),'Escape closes product picker');
  });
  await test('File review status is consistent between list and detail',async()=>{
   await p.goto(base+'file-management.html?folder=road-route&selected=ei-sample-icd');
   const rowState=await p.locator('tr[data-select="ei-sample-icd"] .fw-review-status').innerText();
   const detailState=await p.locator('#dsDetail dt').filter({hasText:'审阅状态'}).locator('xpath=following-sibling::dd[1]').innerText();
   ok(rowState.trim()===detailState.trim(),'review status matches list and detail',{rowState,detailState});
  });
  await test('EI import library samples and validation',async()=>{
   await p.goto(base+'road-modeling.html');await p.locator('#dmGenerate').click();ok(!(await p.locator('#dmArchive').isEnabled()),'Incomplete source cannot archive');
   for(const kind of ['icd','sqx','dmx','breaks','hdx','gzx']){
    await p.locator('[data-upload="'+kind+'"]').first().click();
    const options=await p.locator('#dmLibraryPick option').evaluateAll(os=>os.map(o=>({value:o.value,text:o.textContent})).filter(o=>o.value));ok(options.length>0,kind+' has library sample');
    await p.locator('#dmLibraryPick').selectOption(options[0].value);await p.locator('#dialogConfirm').click();
   }
   ok((await p.evaluate(()=>MODELING.validate())).length===0,'Complete model inputs pass validation');
   await p.locator('[data-upload="icd"]').first().click();await p.locator('[data-import-tab="local"]').click();
   await p.locator('#dmUpload').setInputFiles({name:'invalid.pdf',mimeType:'application/pdf',buffer:Buffer.from('demo')});
   ok((await p.locator('#uploadError').textContent()).length>0,'Wrong EI extension rejected');await closeDialog(p);
  });
  await test('Road configuration dialogs and generation',async()=>{
   for(const tab of ['road','bridge','tunnel']){await p.locator('[data-tab="'+tab+'"]').click();ok(await p.locator('#dmTable tbody tr').count()>0,tab+' config row');}
   await p.locator('[data-tab="road"]').click();await p.locator('[data-act="section"]').first().click();
   await p.locator('[name="laneWidth"]').fill('-1');await p.locator('#dialogConfirm').click();ok((await p.locator('#editError').textContent()).length>0,'Negative lane width rejected');
   await p.locator('[name="laneWidth"]').fill('3.75');await p.locator('#dialogConfirm').click();
   await p.locator('[data-tab="bridge"]').click();await p.locator('[data-act="spans"]').first().click();await p.locator('[name="spanLayout"]').fill('bad');await p.locator('#dialogConfirm').click();ok((await p.locator('#editError').textContent()).length>0,'Invalid bridge span rejected');await p.locator('[name="spanLayout"]').fill('4×30');await p.locator('#dialogConfirm').click();
   await p.locator('[data-tab="tunnel"]').click();await p.locator('[data-act="tunnel"]').first().click();ok(await p.locator('[name="profile"]').count()===1,'Tunnel profile configured');await closeDialog(p);
   await p.locator('#dmGenerate').click();await p.waitForFunction(()=>!document.querySelector('#dmArchive').disabled,{timeout:15000});await p.locator('#dmArchive').click();
   const versions=await p.evaluate(()=>Object.fromEntries(Object.entries(DESIGN_DATA.state.models).map(([k,v])=>[k,v.version])));ok(['road','bridge','tunnel'].every(k=>versions[k]==='V2'),'all three generated model versions archived',versions);
   await p.locator('[data-tab="route"]').click();await p.locator('[data-act="coordinate"]').click();await p.locator('[name="meridian"]').fill('120');await p.locator('#dialogConfirm').click();ok(!(await p.locator('#dmArchive').isEnabled()),'Changed configuration invalidates old preview');
   await p.goto(base+'gis.html?object=road-model');ok(await p.locator('#dsDetail').isVisible(),'Archived model linked to scene detail');ok((await p.locator('#dsDetail').innerText()).includes('V2'),'Scene references archived V2');
  });
  await test('Remove modeling source only',async()=>{
   await p.goto(base+'road-modeling.html');await p.locator('[data-tab="route"]').click();await p.locator('[data-source-check]').first().check();await p.locator('#dmBatchDelete').click();await p.locator('#dialogConfirm').click();
   const s=await p.evaluate(()=>({n:Object.keys(MODELING.config.routes[0].files).length,sample:!!DESIGN_DATA.object('ei-sample-icd'),issues:MODELING.validate().length}));ok(s.n===5&&s.sample&&s.issues>0,'removes source ref; original file remains; model incomplete',s);
  });
  await test('Library upload persists across application navigation',async()=>{
   await p.goto(base+'file-management.html?selected=road-route');await clickAny(p,['[data-library-upload]','[data-file-action="upload"]']);
   await p.locator('#dsUploadFiles').setInputFiles({name:'QA-integration.ICD',mimeType:'text/plain',buffer:Buffer.from('K 10000 15000\n')});await p.locator('#dialogConfirm').click();
   const uploaded=await p.evaluate(()=>DESIGN_DATA.files().find(f=>f.name==='QA-integration.ICD'));ok(!!uploaded,'uploaded file added to index');
   await p.goto(base+'road-modeling.html?import='+uploaded.id);ok(await p.locator('#cdeDialog[open]').count()===1,'deep link opens matching EI type');ok(await p.locator('#dmLibraryPick').inputValue()===uploaded.id,'deep link preselects uploaded file');await p.locator('#dialogConfirm').click();
   ok(await p.evaluate(id=>MODELING.config.routes[0].files.icd.sourceId===id,uploaded.id),'modeling reference uses uploaded source ID');
   await p.goto(base+'file-management.html?selected='+uploaded.id);await p.locator('[data-check-file="'+uploaded.id+'"]').check();await p.locator('[data-fw-action="delete"]').click();await p.locator('#dialogConfirm').click();
   ok(await p.evaluate(id=>!DESIGN_DATA.object(id),uploaded.id),'library deletion hides live file');
   await p.goto(base+'road-modeling.html');ok((await p.evaluate(()=>MODELING.validate())).length>0,'deleted source invalidates model');
   await p.goto(base+'file-management.html');await p.locator('[data-files-tab="deleted"]').click();await p.locator('[data-check-file="'+uploaded.id+'"]').check();await p.locator('[data-fw-action="restore"]').click();ok(await p.evaluate(id=>!!DESIGN_DATA.object(id),uploaded.id),'deleted file restored');
  });
  await test('Viewer drag, zoom and splitter',async()=>{
   await p.goto(base+'road-modeling.html');const canvas=p.locator('#dmCanvas'),b=await canvas.boundingBox();const before=await p.evaluate(()=>({angle:MODELING.scene.angle,distance:MODELING.scene.distance}));
   await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await p.mouse.move(b.x+b.width/2+65,b.y+b.height/2+20,{steps:6});await p.mouse.up();await p.mouse.wheel(0,-180);
   const after=await p.evaluate(()=>({angle:MODELING.scene.angle,distance:MODELING.scene.distance}));ok(before.angle!==after.angle,'drag changes orbit');ok(before.distance!==after.distance,'wheel changes zoom');
   const split=p.locator('.dm-resizer'),height=await p.locator('.dm-scene-area').evaluate(el=>el.clientHeight);await split.focus();await p.keyboard.press('ArrowDown');ok(await p.locator('.dm-scene-area').evaluate(el=>el.clientHeight)>height,'keyboard resizes scene split');
  });
  await test('Shared project files visible in Build',async()=>{
   await p.goto(base+'file-management.html');const shared=await p.evaluate(()=>{const D=DESIGN_DATA;const f=D.addFolder('QA shared root folder','root');return D.addFiles([{name:'QA-shared-file.pdf',size:120}],f.id)[0];});
   await p.goto(base+'construction.html?wbs=T1&view=shared#files');ok((await p.locator('body').innerText()).includes(shared.name),'Build shared files includes a custom root folder file');
   await p.goto(base+'file-management.html?selected='+shared.id);const newer=await p.evaluate(id=>DESIGN_DATA.newVersion(id,{name:'QA-shared-file.pdf',size:180}).version,shared.id);
   await p.goto(base+'construction.html?wbs=T1&view=shared#files');const row=p.locator('tr').filter({hasText:shared.name});ok((await row.innerText()).includes(newer),'Build shared file current version matches Data Management');
  });
  await test('Tandem explicit model import and update',async()=>{
   await p.goto(base+'file-management.html');const source=await p.evaluate(()=>DESIGN_DATA.addFiles([{name:'QA-tandem-model.ifc',size:240}], 'tunnel-models')[0]);
   await p.goto(base+'operations.html#documents');await p.locator('[data-tm-import]').click();await p.locator('#tmSourceFile').selectOption(source.id);await p.locator('#dialogConfirm').click();
   const imported=await p.evaluate(id=>TANDEM_FILES.models().find(m=>m.sourceId===id),source.id);ok(imported?.version==='V1','Tandem import fixes source V1');
   await p.goto(base+'file-management.html');await p.evaluate(id=>DESIGN_DATA.newVersion(id,{name:'QA-tandem-model.ifc',size:480}),source.id);
   await p.goto(base+'operations.html#documents');const stale=await p.evaluate(id=>{const m=TANDEM_FILES.models().find(m=>m.id===id);return {version:m.version,status:TANDEM_FILES.sourceStatus(m)}},imported.id);ok(stale.version==='V1'&&stale.status.includes('V2'),'upstream V2 does not auto update Tandem',stale);
   await p.locator('[data-tm-more="'+imported.id+'"]').click();await p.locator('[data-tm-menu="update"]').click();await p.locator('#dialogConfirm').click();const updated=await p.evaluate(id=>TANDEM_FILES.models().find(m=>m.id===id),imported.id);ok(updated.version==='V2'&&updated.versions[0].version==='V1','explicit update keeps old version history');
   await p.locator('[data-tm-more="'+imported.id+'"]').click();await p.locator('[data-tm-menu="delete"]').click();await p.locator('#dialogConfirm').click();ok(await p.evaluate(id=>!TANDEM_FILES.models().some(m=>m.sourceId===id)&&!!DESIGN_DATA.object(id),source.id),'Tandem model deletion retains CDE source');
  });
  await test('Tandem document library and asset Link',async()=>{
   await p.goto(base+'file-management.html');const source=await p.evaluate(()=>DESIGN_DATA.addFiles([{name:'QA-tandem-manual.pdf',size:128}], 'tunnel-general')[0]);
   await p.goto(base+'operations.html#docs');await p.locator('[data-tm-adddoc]').click();await p.locator('[data-tm-docmethod="docs"]').click();await p.locator('#tmDocumentSource').selectOption(source.id);await p.locator('#dialogConfirm').click();
   const doc=await p.evaluate(id=>TANDEM_FILES.docs().find(d=>d.sourceId===id),source.id);ok(!!doc,'CDE document added to facility');await p.locator('[data-tm-link="'+doc.id+'"]').click();await p.locator('#tmLinkAsset').selectOption('FAN-01');await p.locator('#tmLinkParameter').selectOption({label:'运维手册'});await p.locator('#dialogConfirm').click();
   const linked=await p.evaluate(id=>TANDEM_FILES.linksFor(OPS_DATA.assets.find(a=>a.id==='FAN-01')).some(l=>l.documentId===id&&l.type==='Link'),doc.id);ok(linked,'asset Link points to facility document');
   ok(await p.evaluate(()=>TANDEM_FILES.linksFor(OPS_DATA.assets.find(a=>a.id==='FAN-01')).filter(l=>l.parameter==='运维手册').length)>=2,'multiple documents remain independently linked');
   await p.goto(base+'file-management.html');await p.evaluate(id=>DESIGN_DATA.newVersion(id,{name:'QA-tandem-manual.pdf',size:256}),source.id);await p.goto(base+'operations.html#docs');
   ok(await p.evaluate(id=>TANDEM_FILES.docs().find(d=>d.id===id).version==='V1',doc.id),'upstream doc revision remains pending manual update');await p.locator('[data-tm-updatedoc="'+doc.id+'"]').click();await p.locator('#dialogConfirm').click();
   ok(await p.evaluate(id=>{const d=TANDEM_FILES.docs().find(d=>d.id===id);return d.version==='V2'&&d.versions[0].version==='V1'&&TANDEM_FILES.linksFor(OPS_DATA.assets.find(a=>a.id==='FAN-01')).find(l=>l.documentId===id).version==='V2';},doc.id),'document update preserves V1 and updates Link version');
   await p.goto(base+'operations.html?asset=FAN-01#inventory');ok(await p.evaluate(id=>TANDEM_FILES.linksFor(OPS_DATA.assets.find(a=>a.id==='FAN-01')).some(l=>l.documentId===id),doc.id),'asset document link survives route reload');
   await p.goto(base+'operations.html#docs');await p.locator('[data-tm-deletedoc="'+doc.id+'"]').click();await p.locator('#dialogConfirm').click();ok(await p.evaluate(ids=>!TANDEM_FILES.docs().some(d=>d.id===ids.doc)&&!!DESIGN_DATA.object(ids.source)&&!TANDEM_FILES.linksFor(OPS_DATA.assets.find(a=>a.id==='FAN-01')).some(l=>l.documentId===ids.doc),{doc:doc.id,source:source.id}),'facility document deletion removes Link but preserves source');
  });
  await test('Snapshot and review version invariants',async()=>{
   await p.goto(base+'file-management.html');const result=await p.evaluate(()=>{
    const D=DESIGN_DATA,f=D.object('road-drawing'),old=f.version;
    const r=D.createRecord('review',f.id,{title:'QA version review',person:'审阅人',approver:'批准人',due:'2026-10-01'});
    D.reviewAction(r.id,'submit');D.reviewAction(r.id,'approve');
    const share=D.createRecord('transmittal',f.id,{title:'QA frozen transmittal',person:'接收方'});
    const next=D.newVersion(f.id,{name:'next.pdf',size:1});
    D.receiveTransmittal(share.id);D.receiveTransmittal(share.id);
    return{old,next:next.version,oldReview:r.fileDecisions[f.id],currentReview:next.reviewStatus,snapshot:share.target.files[0].version,receipts:share.history.filter(h=>h.action==='确认接收').length};
   });
   ok(result.oldReview==='已批准'&&result.currentReview==='未提交','approval does not carry to new version',result);ok(result.snapshot===result.old&&result.next!==result.old,'transmittal remains frozen at old version',result);ok(result.receipts===1,'duplicate receipt is idempotent');
  });
  await ctx.close();
 }finally{await browser.close();report.finished=new Date().toISOString();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks:report.checks.length,failed:report.checks.filter(x=>!x.pass),pageErrors:report.errors,requestErrors:report.requests,report:path.join(out,'report.json')},null,2));if(report.checks.some(x=>!x.pass)||report.errors.length||report.requests.length)process.exitCode=1;}
})();

/* Explicitly synthetic facility data. One dataset drives scenes, inventory, charts and handover. */
window.OPS_DATA = (() => {
 const facilities=[
  {id:'tunnel',name:'K14+000 隧道',subtitle:'隧道机电设施',location:'K13+600 — K14+400',type:'隧道',owner:'XX高速运营管理处',model:'隧道机电竣工模型.ifc',view:'隧道机电总览',spaces:[['left','左洞 · 通风区'],['right','右洞 · 通风区'],['pump','排水泵房'],['power','配电室'],['portal','洞口设备区']],systems:[['vent','通风与环境'],['drain','排水系统'],['electric','供配电系统'],['security','视频监控']]},
  {id:'bridge',name:'K12+350 大桥',subtitle:'桥梁结构与附属设施',location:'K12+000 — K12+700',type:'桥梁',owner:'XX高速运营管理处',model:'桥梁结构竣工模型.ifc',view:'桥梁健康监测',spaces:[['deck','主桥桥面'],['pier','主墩区域'],['room','监测机房']],systems:[['structure','结构监测'],['lighting','桥面照明'],['drain','桥面排水']]},
  {id:'station',name:'综合管理站',subtitle:'站房与机电设施',location:'K10+800 管理站',type:'站房',owner:'XX高速运营管理处',model:'综合管理站竣工模型.rvt',view:'管理站设备总览',spaces:[['l1','一层 · 值班大厅'],['l2','二层 · 监控中心'],['plant','设备机房']],systems:[['hvac','暖通空调'],['electric','供配电系统'],['fire','消防系统']]}
 ];
 const rows=[
 // id, facility, name, classification, system, space, measured value, unit, warning, upper bound, online, metric
 ['FAN-01','tunnel','左洞射流风机 01','射流风机','vent','left',6.8,'mm/s',4.5,7.1,true,'振动速度'],
 ['FAN-02','tunnel','右洞射流风机 02','射流风机','vent','right',2.3,'mm/s',4.5,7.1,true,'振动速度'],
 ['PUMP-01','tunnel','排水泵 01','潜水泵','drain','pump',0.42,'m',0.8,1.1,true,'集水井水位'],
 ['PUMP-02','tunnel','排水泵 02','潜水泵','drain','pump',null,'A',18,22,false,'工作电流'],
 ['CO-01','tunnel','左洞 CO 传感器','环境传感器','vent','left',24,'ppm',50,100,true,'CO 浓度'],
 ['TEMP-01','tunnel','右洞温度传感器','环境传感器','vent','right',26.4,'°C',35,45,true,'环境温度'],
 ['DB-01','tunnel','隧道低压配电柜','配电柜','electric','power',43.6,'°C',55,70,true,'柜内温度'],
 ['CAM-01','tunnel','洞口监控摄像机','摄像机','security','portal',null,'',null,null,null,''],
 ['DISP-01','bridge','主梁位移监测点','位移传感器','structure','deck',8.2,'mm',12,18,true,'竖向位移'],
 ['VIB-01','bridge','主墩振动监测点','振动传感器','structure','pier',1.4,'mm/s',3,5,true,'振动速度'],
 ['TEMP-B1','bridge','桥面温度监测点','温度传感器','structure','deck',31.2,'°C',45,60,true,'桥面温度'],
 ['LIGHT-01','bridge','桥面照明配电箱','配电箱','lighting','room',8.5,'A',15,20,true,'工作电流'],
 ['DRAIN-01','bridge','桥面泄水装置','排水构件','drain','deck',null,'',null,null,null,''],
 ['AHU-01','station','监控中心空调机组','空气处理机组','hvac','plant',24.5,'°C',28,32,true,'送风温度'],
 ['METER-01','station','管理站总电表','智能电表','electric','plant',52.8,'kW',80,100,true,'有功功率'],
 ['SMOKE-01','station','值班大厅烟感','烟感探测器','fire','l1',0,'%',5,10,true,'烟雾浓度'],
 ['TEMP-S1','station','监控中心温度传感器','温度传感器','hvac','l2',25.1,'°C',28,32,true,'室内温度'],
 ['UPS-01','station','监控中心 UPS','不间断电源','electric','l2',82,'%',90,98,true,'负载率']
 ];
 const required=[['manufacturer','制造商'],['model','设备型号'],['serial','序列号'],['commissioned','投运日期'],['warranty','质保到期日'],['manual','运维手册']];
 const assets=rows.map((r,i)=>{const a={id:r[0],facility:r[1],name:r[2],classification:r[3],system:r[4],space:r[5],value:r[6],unit:r[7],warning:r[8],limit:r[9],online:r[10],metric:r[11],manufacturer:'示例设备制造商',model:({'射流风机':'SDS-1000','潜水泵':'WQ-40','环境传感器':'ENV-200'})[r[3]]||'STD-'+String(i+1).padStart(3,'0'),serial:'SN-2026-'+String(i+1).padStart(4,'0'),commissioned:'2026-10-01',warranty:'2028-10-01',manual:r[3]+'使用维护说明书.pdf',sourceId:'IFC-'+String(10001+i),responsible:i%2?'王工':'李工',connection:r[10]===null?null:'CON-'+r[0],stream:r[10]===null?null:'STR-'+r[0],updated:r[10]===false?'2026-10-11 07:40':'2026-10-11 10:00',designCode:r[1]==='bridge'?'DES-BR-001':r[1]==='tunnel'?'DES-TN-001':null};
 if(['CAM-01','UPS-01'].includes(a.id))a.serial='';if(['PUMP-02','DRAIN-01'].includes(a.id))a.manual='';if(a.id==='PUMP-02')a.warranty='';
 a.series=a.stream&&a.online?Array.from({length:24},(_,j)=>{const raw=a.id==='FAN-01'?2.2+j*.16+Math.sin(j*.8)*.4:a.value*(.86+Math.sin(j*.6+i)*.09)+j*a.value*.004;return +Math.max(0,raw).toFixed(2);}):[];
 if(a.series.length)a.series[23]=a.value;
 return a;});
 return {facilities,assets,required,snapshot:'2026-10-11 10:00',views:[{id:'all',name:'设施总览',system:'',space:'',status:''},{id:'vent',name:'通风与环境系统',system:'vent',space:'',status:''},{id:'attention',name:'需关注的设备',system:'',space:'',status:'attention'},{id:'incomplete',name:'交付待补齐',system:'',space:'',status:'missing'}]};
})();

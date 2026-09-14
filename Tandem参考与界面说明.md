# 运营期界面参考与适配说明

本次将 Autodesk Tandem 的设施数字孪生工作流适配到公路运营场景，沿用设计期白色顶栏、浅灰导航、蓝色强调色、表格及属性侧栏。此演示独立于 Autodesk 产品，不调用其服务。

## 功能与参考依据

| 页面或流程 | 参考逻辑 | 官方资料 |
| --- | --- | --- |
| 设施总览 | 多设施入口、设施信息和保存视图 | [界面导航](https://help.autodesk.com/cloudhelp/ENU/Tandem-Getting-Started/files/tandem-navigate-ui.html) |
| 数字孪生、资产、空间 | 模型工作区、筛选器、底部清单、右侧属性，资产与空间关联 | [关键概念](https://help.autodesk.com/cloudhelp/ENU/Tandem-Getting-Started/files/tandem-key-concepts.html) |
| 保存视图 | 保存筛选、着色和视图设置，以任务视角再次查看设施 | [Views](https://help.autodesk.com/cloudhelp/ENU/Tandem-Facilities/files/tandem-views.html) |
| 系统追踪 | 系统资产、服务空间与上游、下游路径 | [System tracing](https://help.autodesk.com/view/TANDEM/ENU/?guid=tandem-system-tracing) |
| 模型与文档 | 来源文件、模型版本、资产文档关联 | [Files](https://help.autodesk.com/cloudhelp/ENU/Tandem-Facilities/files/tandem-files.html) |
| 连接与数据流 | 将连接配置与监测点数据流分开；显示趋势、阈值和异常 | [阈值功能介绍](https://intandem.autodesk.com/resource/march-2024-four-new-features-in-autodesk-tandem/) |
| 运行看板 | 聚合资产状态、趋势与需要关注的对象 | [Dashboards Beta 介绍](https://intandem.autodesk.com/resource/introducing-tandems-new-dashboards-beta/) |
| 数据交付 | 指定要求、采集映射、验证和移交 | [About Tandem](https://help.autodesk.com/cloudhelp/ENU/Tandem-About/files/Tandem_About_about_tandem_html.html) |

## 在本项目中的适配

示例设施为隧道、大桥和综合管理站。空间、资产、系统、文档、监测数据通过资产编码及设施标识关联；不同页面使用同一组数据计算数量与状态。资产参数补全后，交付完整率按必填字段重新计算。离线数据保持缺测，不以零代替。修改预警、超限阈值后，状态与看板同步变化。

“指定要求 → 采集与映射 → 验证并移交”保留设计成果转入运维所需的中间环节。测量基础资料与设备设计来源分开显示；未建立的关联不推定为已完成交付。系统追踪展示逻辑连接，不代表工程拓扑校核或水力、电力仿真。

## 演示边界

模型为 SVG 空间示意，监测数据为模拟快照；没有真实 BIM 加载、物联网连接、后端存储、远程设备控制或正式移交。资产编辑和阈值在当前标签页会话中保留，可通过“阶段关联”重置；保存视图仍在当前页面内有效。文件导入、参数映射和连接配置弹窗用于展示操作逻辑。运行看板参考了官方 Beta 介绍，并做了公路运营场景适配，不对 Tandem 当前商业版本的可用功能作保证。

原设计期成果资料库、空间场景、EBS 树与 25 个示例成果关联保留。

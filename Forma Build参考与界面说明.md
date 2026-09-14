# 施工期界面参考与适配说明

本次参考 Autodesk Forma Build 官方帮助中的业务组织与界面截图，保留本项目白色顶栏、浅灰工具导航、蓝色主操作、列表和右侧详情的风格。左上角只保留设计期、施工期、运营期三个应用入口。

## 参考来源

| 模块 | 采用的逻辑 | 官方资料 |
| --- | --- | --- |
| 项目概览与左侧导航 | 图纸、问题、表单、技术协作、进度、资产与成本入口 | [About Forma Build](https://help.autodesk.com/cloudhelp/ENG/Build-GS/files/What_is_Build.html) |
| 施工图纸 | 图纸列表与缩略图、版本集、图纸发布、图号复核及问题标记 | [发布图纸](https://help.autodesk.com/cloudhelp/ENG/Build-Sheets/files/Upload_And_Publish_Sheets.html)；[官方界面截图](https://help.autodesk.com/cloudhelp/ENG/Build-Sheets/images/sheets_tool_general.png) |
| RFI | 创建提交、经理分派、专业审查、正式答复与关闭；引用关联事项 | [RFI 入门与工作流](https://help.autodesk.com/cloudhelp/ENG/Build-Rfis/files/getting_started_rfis/RFIs_Overview.html) |
| 报审 | 规范章节与报审包、提交方、审查意见和最终答复、修订与再提交 | [Submittals 入门](https://help.autodesk.com/cloudhelp/ENG/Build-Submittals/files/getting_started_submittals/Submittals_Overview.html) |
| 进度计划 | 第三方计划导入、甘特图、版本比较与作业关联 | [Schedule and Workplan](https://help.autodesk.com/cloudhelp/ENG/Build-Schedule/files/About_Schedule.html) |
| 成本与变更 | 将 RFI 与潜在变更关联，并区分变更、合同及支付 | [Forma Build 概览](https://help.autodesk.com/cloudhelp/ENG/Build-GS/files/What_is_Build.html)；[成本管理](https://construction.autodesk.com/workflows/construction-cost-management/) |

## 本项目的适配

公路示例设有大桥、隧道和综合管理站三个工点。施工记录采用独立编号，问题、图纸、RFI、报审、表单、进度作业与设备通过编号建立引用。问题详情可定位图纸，图纸标记可返回问题；检查不符合项可生成问题；技术澄清可以继续关联潜在变更。

项目概览、报表与导航计数从同一组示例记录计算。截止日期以 2026-09-11 的演示快照为准。修订预算按“原始预算 + 已批准变更”汇总，待评估潜在变更单列；这些计算口径用于演示，不代表真实项目核算规则。原始 EBS 和测量数据保留；运营期日期与来源关联已在生态审查中校正。

## 边界

本页面不是 Autodesk 服务客户端，也不是 Forma Build 的全部功能复制。它展示与本项目有关的主要业务流程，未实现真实权限引擎、OCR、BIM 或计划文件解析、正式审批、通知发送、合同支付和后台存储。图纸为自绘 SVG 示意，历史版本切换使用同一示意图，不做几何差异分析。照片管理、移动端和完整管理设置不在本次页面范围内。

所有本页编辑、创建和流转保存在当前标签页的浏览器会话中；可通过“阶段关联”重置。发布图纸、文件上传、计划导入仅展示步骤。设备与移交页可进入运营期示例，但不表示施工数据已经自动同步至运营期。原有 EBS 树、25 个成果关联和运营期资产数据保留。

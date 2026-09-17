# 产品界面迭代 · 2026-09-17

## 官方参考

- [Forma Data Management](https://help.autodesk.com/cloudhelp/ENU/Docs-Getting-Started/files/About_Autodesk_Docs.html)：公共数据环境，共享项目文件与协作信息。
- [Forma Build](https://help.autodesk.com/cloudhelp/ENU/Build-GS/files/What_is_Build.html)：施工管理、现场记录、问题与技术协作。
- [Tandem 界面](https://help.autodesk.com/cloudhelp/ENU/Tandem-Getting-Started/files/tandem-navigate-ui.html)：主页、设施、管理属于账户层级；设施内区分 Files、Docs、Systems、Connections、Streams 和 Inventory。
- [Tandem 概念](https://help.autodesk.com/cloudhelp/ENU/Tandem-Getting-Started/files/tandem-key-concepts.html)：设施模板定义分类和参数；Connection 表示设备，Stream 保存时序读数。
- [Power BI 连接](https://help.autodesk.com/cloudhelp/CHS/Docs-Insight/files/data-connector/Connect_PowerBi.html)：读取最近一次 Data Connector 提取；提取和 Power BI 刷新分别安排，不是实时数据接口。本次未增加真实 Power BI 接口。

## 项目应用

| 应用 | 页面与导航 | 本次整理 |
| --- | --- | --- |
| 道路接入与建模 | road-modeling.html | 保留按格式接入 EI、横断面/布跨/隧道配置、生成预览与归档；精简重复工作流说明，调整查看器和配置表布局 |
| Forma Data Management | file-management.html / gis.html / workflows.html | 保留成果资料库、空间场景、对象协作、版本和分发；详情面板按选择显示 |
| Forma Build | construction.html | 保留 WBS 文件和现场模块；首页以待办、快速入口、近期作业为中心，移除宣传横幅 |
| Autodesk Tandem | operations.html | 顶部账户导航，设施内工具导航；模型/文档、连接/数据流拆开；增加管理与最近访问入口 |

道路建模、路桥隧目录、WBS 是工程项目适配，不是 Autodesk 默认功能清单。界面采用统一浅色工作区，不声称逐像素复制官方产品。原型保留自有项目标识，帮助中集中说明模拟数据和功能边界。

## 信息显示原则

- 标题、工具栏、列表、右侧详情承担不同任务；不重复显示同一流程。
- 正常状态显示业务数据；仅在缺失输入、校验失败或执行删除时给出必要说明。
- 文件编码、版本、宿主资产、数据来源、阈值、错误提示保留；长篇操作说明放入帮助。
- 通过应用切换延续对象上下文，不暗示文件已移交或实时同步。

## 验证范围

使用 Chromium 检查全部工作区入口，验证对象详情、应用切换、模型导入草稿、道路生成与归档、EI 来源删除、缺失来源提示、资料库样例以及 1280px 布局。可视检查覆盖资料库、建模、Build 首页/WBS、Tandem 设施/查看器/配置/连接/管理、协作列表。未接入真实 BIM 解析、传感器或 Autodesk 服务。

# Forma / Tandem 界面与数据流参考

更新：2026-09-22。以下资料用于本次前端实现与核查。界面文本为中文工程项目适配；本项目是独立演示，不是 Autodesk 官方产品。

## 已核查的官方页面

- [Forma 导航](https://help.autodesk.com/cloudhelp/ENU/Docs-Getting-Started/files/Getting_Started_Navigation.html)：产品切换、项目切换、左侧工具。
- [Files 文件与文件夹操作](https://help.autodesk.com/cloudhelp/ENU/Docs-Files/files/File_Folder_Actions_Docs.html)：文件树、选择工具栏、行末操作菜单、版本与删除恢复。
- [创建审阅](https://help.autodesk.com/cloudhelp/ENU/Docs-Reviews/files/Reviews_Start_Review.html)和[审批工作流](https://help.autodesk.com/cloudhelp/ENU/Docs-Reviews/files/getting-started-reviews/Reviews_Create_Edit.html)：选文件、选择工作流、逐步审阅及逐文件结论。
- [创建分发](https://help.autodesk.com/cloudhelp/ENU/Docs-Transmittals/files/Create_Transmittal.html)和[分发详情](https://help.autodesk.com/cloudhelp/ENG/Docs-Transmittals/files/View_Transmittal.html)：文件版本快照、收件人、发送与接收信息。
- [Build 项目首页](https://help.autodesk.com/cloudhelp/ENU/Build-Hub/files/Project_Home.html)：工作状态、个人待办、近期活动。
- [Tandem 导航](https://help.autodesk.com/cloudhelp/ENU/Tandem-Getting-Started/files/tandem-navigate-ui.html)：Home / Facilities / Manage 账户导航；设施工具与查看器。
- [Tandem Files](https://help.autodesk.com/cloudhelp/ENU/Tandem-Facilities/files/tandem-files.html)：本地 RVT/IFC 或 Autodesk Docs 来源导入、默认可见、手动更新版本及删除。
- [Tandem Docs](https://help.autodesk.com/cloudhelp/ENU/Tandem-Facilities/files/tandem-docs.html)：文档独立管理、版本更新、通过 Link 参数关联资产。
- [Power BI 连接](https://help.autodesk.com/cloudhelp/CHS/Docs-Insight/files/data-connector/Connect_PowerBi.html)：读取最近一次 Data Connector 提取，提取与 Power BI 刷新分别安排。本次没有增加真实连接。

## 界面实现

Data Management 采用窄侧栏、白色工作区、文件夹树、紧凑表格、选择操作栏、版本胶囊、行末菜单与右侧详情。问题、审阅、分发使用统一列表和详情面板。日常页面不常驻流程教程，使用说明从问号进入。

Tandem 账户页按官方截图使用深灰设施列表、顶部账户导航、右侧所选设施视图；设施查看器采用窄图标栏、浅色过滤和属性面板、深色模型画布。Files 与 Docs 分开，导入与更新使用不同操作。

道路接入与建模保持独立应用；EI 各数据类型、横断面、布跨和隧道配置沿用工程业务，视觉统一到 Forma 控件。几何预览增加道路标线、桥梁结构与洞口地形，保留旋转、平移、缩放、点选和调整分区。

## 数据约束

- 同一项目的共享设计文件由 Data Management 索引提供；Build 共享视图直接读取当前版本和审阅状态，不产生一份独立副本。既有施工资料按自定义 WBS 保留。
- 审阅对提交版本产生结论。审阅流程结束为“已关闭”，文件结论为已批准、批准并附注或已退回。上传新版本不继承旧版结论。
- 分发保存提交时的对象、文件和版本快照；接收确认不等于审批或工程验收。作废记录保留历史。
- Tandem 导入保存固定版本；上游变化显示可更新，需手动确认。删除设施内模型或文档不删除 CDE 来源。文档先添加，再经资产 Link 参数关联。
- 浏览器会话索引不保存真实文件内容；模型几何、资产和传感器仍为预置示例。没有实际 Autodesk API、邮件、人员权限、BIM/EI 解析或现场传感器连接。

## 本地检查

```sh
python3 -m http.server 8765
node tests/workflow-state.cjs
node tests/wbs-shared-state.cjs
# 需要本机已安装 Playwright 及浏览器
BASE_URL=http://127.0.0.1:8765/ node tests/browser-regression.cjs
```

浏览器回归覆盖两种桌面尺寸的所有路由、上传与删除恢复、EI 分类导入及参数校验、几何交互与归档、审阅版本隔离、固定分发快照、Build 共享版本、Tandem 显式更新及文档 Link。

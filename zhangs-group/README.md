# zhang’s group — 网站编辑

网站：<https://szxshawn.github.io/zhangs-group/>

**这个目录是线上网站的直接发布来源。** 修改并提交到 `main` 后，等待 GitHub Pages 部署完成，原网址便会更新。

## 换照片

进入 [`assets/photos/`](assets/photos/)，点击 **Add file → Upload files**，上传同名 PNG 即可替换：

| 位置 | 文件名 |
| --- | --- |
| 张元建教授（课题组负责人） | `faculty-01.png` |
| 首席学术顾问 | `advisor.png` |
| 指导老师（博士后，预留） | `postdoc-01.png` |
| 博士生 01—10 | `phd-01.png` 至 `phd-10.png` |
| 硕士生 01—16 | `masters-01.png` 至 `masters-16.png` |

建议使用 4:5 竖版照片，人物居中，至少 600 × 750 像素。也可上传 JPG / WebP，但需同步修改资料中的 `photo` 文件路径。不要把 JPG 仅通过改扩展名伪装成 PNG。

## 改文字

编辑 [`content/site-data.js`](content/site-data.js)，中文写在 `zh`，英文写在 `en`。

- `advisor`：顾问；陈虹教授资料参考[同济大学官方主页](https://see.tongji.edu.cn/info/1376/10290.htm)，任职关系待确认。
- `faculty`：课题组负责人，目前仅张元建教授，位于顾问上方。简介参考[同济大学官方介绍](https://cdhk.tongji.edu.cn/cd/e7/c38347a380391/page.htm)。
- `postdocs`：指导老师栏目中的博士后人物名片，已预留一张照片与姓名占位卡。
- `students`：研究生，数组可增删；`degree` 为 `phd` 或 `masters`。
- `research`：研究方向正文。
- `ui`：首页与其他栏目文案。
- `contactEmail`：课题组邮箱。
- `publications`：论文数组，真实论文完善后再填入。

英文直达链接：<https://szxshawn.github.io/zhangs-group/?lang=en>。

所有人物照片均为占位图。内容为初稿，没有虚构研究成果。私有仓库 `szxshawn/zhangs-group` 保存了初始源码和资料模板，**不会自动同步到此目录**；修改线上网站请直接编辑本目录。

English: replace same-name PNGs in `assets/photos/`, and edit both `zh` and `en` copy in `content/site-data.js`. This directory is the live publishing source. The private source backup does not sync automatically.

## 指导老师与研究生资料

“指导老师”位于首席学术顾问下方，以独立人物名片展示，身份标注“博士后”。下方的研究生分为“博士研究生”和“硕士研究生”两个分组，默认全部收起；点击分组标题即可独立展开或收起，支持键盘操作。中英文切换保留当前展开状态。

- `postdocs`：指导老师的博士后名片数组。编辑 `name`（中英文姓名）、`role`（身份）、`bio`（简介）、`photo`（照片路径）；`englishName` 可选填姓名拼音。已预留一张名片，也可继续添加。示例见私有源码仓库 `szxshawn/zhangs-group` 中的 `materials/team/postdoc-example.json`。
- 博士生：统一预留 10 个位置，`phd-01` 至 `phd-10`。
- 硕士生：统一预留 16 个位置，`masters-01` 至 `masters-16`。

每个学历分组显示一份完整名单，人数由资料数组自动统计。姓名、照片与入学年份均保留为待补充位置，按实际资料填写即可。

照片现在按分组编号：`phd-01.png` 至 `phd-10.png`、`masters-01.png` 至 `masters-16.png`，博士后预留 `postdoc-01.png`。早期 `student-01.png` 至 `student-06.png` 仍保留作备份，当前页面使用上述新文件名。请上传同名 PNG 以替换照片。

每位研究生可填写以下字段，中文写在 `zh`、英文写在 `en`：

```js
enrollmentYear: '',
email: '',
website: '',
scholar: ''
```

入学年份留空时显示待补充。链接留空时不显示图标，填入有效地址后自动出现对应入口。`interest` 为中英文研究主题，可留空隐藏。研究生使用圆形头像，建议人脸位于照片中心偏上位置；指导老师名片使用竖版照片。

卡片布局参考 [PRLab 学生页面](https://prlab-nju.com/nju/people/) 的圆形头像和居中信息结构；未使用对方的人员资料或照片。


## 首页配图

首页使用实景照片，来源为 Kindel Media 和 Pavel Danilyuk / Pexels，仅作为研究方向的主题配图。摄影来源与许可见 `assets/photo-sources.json`。后续可替换 `assets/photos/research-electric-vehicle.jpg` 和 `assets/photos/research-robotics.jpg`；同名上传即可，页面自动适配裁切。


## 时空背景

深蓝色背景由 `assets/spacetime.css` 与 `assets/spacetime-grid.svg` 控制，使用透视隧道线条与缓慢扩散的光环。右下角可暂停或开启动效，浏览器会记住选择；系统开启“减少动态效果”时自动显示静态背景，页面切到后台时动画暂停。手机端会降低背景强度。正文、人物照片和资料结构不受影响。

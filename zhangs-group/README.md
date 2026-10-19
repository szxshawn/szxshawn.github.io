# zhang’s group — 网站编辑

网站：<https://szxshawn.github.io/zhangs-group/>

**这个目录是线上网站的直接发布来源。** 修改并提交到 `main` 后，等待 GitHub Pages 部署完成，原网址便会更新。

## 换照片

进入 [`assets/photos/`](assets/photos/)，点击 **Add file → Upload files**，上传同名 PNG 即可替换：

| 位置 | 文件名 |
| --- | --- |
| 张元建教授（课题组负责人） | `faculty-01.png` |
| 首席学术顾问 | `advisor.png` |
| 学生 1—6 | `student-01.png` 至 `student-06.png` |

建议使用 4:5 竖版照片，人物居中，至少 600 × 750 像素。也可上传 JPG / WebP，但需同步修改资料中的 `photo` 文件路径。不要把 JPG 仅通过改扩展名伪装成 PNG。

## 改文字

编辑 [`content/site-data.js`](content/site-data.js)，中文写在 `zh`，英文写在 `en`。

- `advisor`：顾问；陈虹教授资料参考[同济大学官方主页](https://see.tongji.edu.cn/info/1376/10290.htm)，任职关系待确认。
- `faculty`：课题组负责人，目前仅张元建教授，位于顾问上方。简介参考[同济大学官方介绍](https://cdhk.tongji.edu.cn/cd/e7/c38347a380391/page.htm)。
- `students`：学生，数组可增删；`degree` 为 `phd` 或 `masters`。
- `research`：研究方向正文。
- `ui`：首页与其他栏目文案。
- `contactEmail`：课题组邮箱。
- `publications`：论文数组，真实论文完善后再填入。

英文直达链接：<https://szxshawn.github.io/zhangs-group/?lang=en>。

所有人物照片均为占位图。内容为初稿，没有虚构研究成果。私有仓库 `szxshawn/zhangs-group` 保存了初始源码和资料模板，**不会自动同步到此目录**；修改线上网站请直接编辑本目录。

English: replace same-name PNGs in `assets/photos/`, and edit both `zh` and `en` copy in `content/site-data.js`. This directory is the live publishing source. The private source backup does not sync automatically.

## 学生卡片资料

学生按博士研究生、硕士研究生分组，圆形头像自动裁切；照片文件名保持不变。

在每位学生的资料中可填写：

```js
enrollmentYear: '2026', // 入学年份；此处仅为格式示例
email: '',            // 邮箱
website: '',          // https:// 开头的个人主页
scholar: ''           // https:// 开头的学术主页
```

年份留空时显示“入学年份待补充”。链接留空时不显示图标，填入有效地址后自动出现对应入口。`interest` 可填写中英文研究主题，也可留空以隐藏。使用头像时建议将人脸放在照片中心偏上位置。

布局参考 [PRLab 学生页面](https://prlab-nju.com/nju/people/) 的圆形头像、分组与居中信息结构；未使用对方的人员资料或照片。

## 首页配图

首页使用实景照片，来源为 Kindel Media 和 Pavel Danilyuk / Pexels，仅作为研究方向的主题配图。摄影来源与许可见 `assets/photo-sources.json`。后续可替换 `assets/photos/research-electric-vehicle.jpg` 和 `assets/photos/research-robotics.jpg`；同名上传即可，页面自动适配裁切。

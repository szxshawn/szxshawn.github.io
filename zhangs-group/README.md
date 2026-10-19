# zhang’s group — 网站编辑

网站：<https://szxshawn.github.io/zhangs-group/>

**这个目录是线上网站的直接发布来源。** 修改并提交到 `main` 后，等待 GitHub Pages 部署完成，原网址便会更新。

## 换照片

进入 [`assets/photos/`](assets/photos/)，点击 **Add file → Upload files**，上传同名 PNG 即可替换：

| 位置 | 文件名 |
| --- | --- |
| 首席学术顾问 | `advisor.png` |
| 导师 1、导师 2 | `faculty-01.png`、`faculty-02.png` |
| 学生 1—6 | `student-01.png` 至 `student-06.png` |

建议使用 4:5 竖版照片，人物居中，至少 600 × 750 像素。也可上传 JPG / WebP，但需同步修改资料中的 `photo` 文件路径。不要把 JPG 仅通过改扩展名伪装成 PNG。

## 改文字

编辑 [`content/site-data.js`](content/site-data.js)，中文写在 `zh`，英文写在 `en`。

- `advisor`：顾问；陈虹教授资料参考[同济大学官方主页](https://see.tongji.edu.cn/info/1376/10290.htm)，任职关系待确认。
- `faculty`：导师，数组可增删。
- `students`：学生，数组可增删；`degree` 为 `phd` 或 `masters`。
- `research`：研究方向正文。
- `ui`：首页与其他栏目文案。
- `contactEmail`：课题组邮箱。
- `publications`：论文数组，真实论文完善后再填入。

英文直达链接：<https://szxshawn.github.io/zhangs-group/?lang=en>。

所有人物照片均为占位图。内容为初稿，没有虚构研究成果。私有仓库 `szxshawn/zhangs-group` 保存了初始源码和资料模板，**不会自动同步到此目录**；修改线上网站请直接编辑本目录。

English: replace same-name PNGs in `assets/photos/`, and edit both `zh` and `en` copy in `content/site-data.js`. This directory is the live publishing source. The private source backup does not sync automatically.

# KichikuRankingScripts
鬼畜周刊排行榜自动化操作脚本

### 本分支说明
-本分支的 jsx脚本 所使用的 offset 值为视频结束的时值
-本分支增添了播放视频并修改对应参数的的工具（测试中）

### 使用说明（视频组）
- 创建工作区
  1. 一个完整的工作区包含以下内容：
    - 当期的 xlsx 文档
      - 旧稿回顾
      - 冷门推荐 + 经典回顾
      - 连续在榜
      - 主榜
      - 新人自建（可选）
    - 当期的 包含视频相关信息的 图片
      - 连续在榜
      - 副榜21-125
      - 经典推荐
      - 冷门推荐
      - 主榜 part-1
      - 主榜 part-2
      - 主榜 part-3
    - 绿幕抠图 文件夹
    - 下载视频用 脚本
    - 处理 excel 文档用 xlsx2json.exe 程序
    - AE 脚本
      - （以及附属的 json2.js 依赖项）
  1. 运行 ./xlsx2json.exe
  1. 一个待修改 *.json 的工作区 将新增以下内容：
    - .json文件*4
    - ./psdownload/download.txt
- 修改 *.json
  - 主榜 part-1 的切片时长为45s
  - 主榜 part-2 和 part-3 的切片时长为25s
- 导出视频
  1. 打开 AE
  1. 运行脚本
  1. 导出视频

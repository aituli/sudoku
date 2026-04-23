#!/usr/bin/env bash
set -euo pipefail

echo "🔨 构建项目..."
npm run build

DIST_DIR="dist"

echo ""
echo "✅ 构建完成！产物在 ./$DIST_DIR/"
echo ""
echo "========================================="
echo "  选择部署方式"
echo "========================================="
echo ""
echo "  1) 本地预览（启动本地 HTTP 服务器）"
echo "  2) 部署到 GitHub Pages"
echo "  3) 打包成 ZIP（用于手动上传）"
echo ""
read -rp "请输入选项 [1/2/3]: " choice

case "$choice" in
  1)
    echo ""
    echo "🚀 启动本地预览服务器..."
    npx vite preview --port 4173
    ;;
  2)
    echo ""
    echo "🚀 部署到 GitHub Pages..."

    if ! git rev-parse --is-inside-work-tree &>/dev/null; then
      echo "⚠️  当前不是 Git 仓库，正在初始化..."
      git init
      git add -A
      git commit -m "初始提交"
    fi

    # 检查是否有 remote
    if ! git remote get-url origin &>/dev/null; then
      echo ""
      read -rp "请输入 GitHub 仓库地址（如 git@github.com:user/repo.git）: " repo_url
      git remote add origin "$repo_url"
    fi

    cd "$DIST_DIR"
    touch .nojekyll
    git init
    git checkout -b gh-pages
    git add -A
    git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"

    REMOTE_URL=$(cd .. && git remote get-url origin)
    git push -f "$REMOTE_URL" gh-pages

    cd ..
    echo ""
    echo "✅ 已部署到 GitHub Pages！"
    echo "   请在仓库 Settings → Pages 中选择 gh-pages 分支"
    ;;
  3)
    echo ""
    ZIP_NAME="shudu-$(date '+%Y%m%d%H%M%S').zip"
    cd "$DIST_DIR"
    zip -r "../$ZIP_NAME" .
    cd ..
    echo "✅ 已打包为 $ZIP_NAME（$(du -h "$ZIP_NAME" | cut -f1)）"
    echo "   可直接上传到任意静态托管服务（Netlify / Vercel / 阿里云 OSS 等）"
    ;;
  *)
    echo "❌ 无效选项"
    exit 1
    ;;
esac

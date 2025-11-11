#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# GitHub-এ Force Push Script
# Repository: https://github.com/Sudip1844/qr-code-genius-clone
# ═══════════════════════════════════════════════════════════════

set -e

echo "🚀 GitHub-এ force push শুরু হচ্ছে..."
echo ""

# Step 1: Git lock files মুছে ফেলুন (যদি থাকে)
echo "📝 Step 1: Git lock files পরিষ্কার করা হচ্ছে..."
rm -f .git/index.lock .git/config.lock .git/HEAD.lock 2>/dev/null || true
echo "✓ Lock files পরিষ্কার হয়েছে"
echo ""

# Step 2: Git config setup
echo "📝 Step 2: Git configuration সেটআপ করা হচ্ছে..."
git config user.name "Sudip1844" 2>/dev/null || true
git config user.email "sudip@example.com" 2>/dev/null || true
echo "✓ Git config সেটআপ হয়েছে"
echo ""

# Step 3: Remote repository পরিবর্তন করুন
echo "📝 Step 3: Remote repository আপডেট করা হচ্ছে..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Sudip1844/qr-code-genius-clone.git
echo "✓ Remote repository: https://github.com/Sudip1844/qr-code-genius-clone.git"
echo ""

# Step 4: .gitignore থেকে dist ফোল্ডার রিমুভ করুন (যদি থাকে)
echo "📝 Step 4: .gitignore চেক করা হচ্ছে..."
if grep -q "^dist$" .gitignore 2>/dev/null; then
    sed -i '/^dist$/d' .gitignore
    echo "✓ dist ফোল্ডার .gitignore থেকে রিমুভ করা হয়েছে"
else
    echo "✓ dist ফোল্ডার already tracked হবে"
fi
echo ""

# Step 5: সব ফাইল add করুন
echo "📝 Step 5: সব ফাইল staging-এ যোগ করা হচ্ছে..."
git add -A
git add dist -f 2>/dev/null || true
echo "✓ সব ফাইল added হয়েছে (dist ফোল্ডার সহ)"
echo ""

# Step 6: Commit করুন
echo "📝 Step 6: Changes commit করা হচ্ছে..."
COMMIT_MSG="🚀 Complete website update with dist folder - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG" || echo "⚠️  No changes to commit (already up to date)"
echo "✓ Commit সফল"
echo ""

# Step 7: Force push করুন
echo "📝 Step 7: GitHub-এ force push করা হচ্ছে..."
echo "⚠️  Warning: এটি আপনার GitHub repository-র সব পুরানো কোড মুছে দেবে!"
echo ""
read -p "Continue করতে চান? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 Pushing to GitHub..."
    git push -f origin main || git push -f origin master
    echo ""
    echo "✅ সফলভাবে GitHub-এ push হয়েছে!"
    echo "🔗 Repository: https://github.com/Sudip1844/qr-code-genius-clone"
    echo ""
    echo "📊 Push করা হয়েছে:"
    echo "   ✓ সব source code"
    echo "   ✓ dist ফোল্ডার (static website)"
    echo "   ✓ সব configuration files"
    echo "   ✓ deployment guides"
    echo ""
else
    echo "❌ Push cancelled করা হয়েছে"
    exit 1
fi

echo "═══════════════════════════════════════════════════════════════"
echo "🎉 সম্পন্ন! আপনার কোড এখন GitHub-এ আপডেট হয়েছে!"
echo "═══════════════════════════════════════════════════════════════"

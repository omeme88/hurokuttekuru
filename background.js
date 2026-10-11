/**
 * Side Note Editor - Background Service Worker
 * バックグラウンド処理（サイドパネル自動オープン設定、コンテキストメニュー連携など）
 */

// アイコンクリック時にサイドパネルを開く設定
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("サイドパネル設定エラー:", error));

// インストール・アップデート時の初期データセットアップ
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(["groups", "notes", "settings"]);

  const updates = {};
  if (!data.groups) {
    updates.groups = [
      { id: "g_default", name: "未分類", order: 0 }
    ];
  }

  if (!data.notes) {
    updates.notes = [
      {
        id: "n_" + Date.now(),
        groupId: "g_default",
        title: "Side Note Editor へようこそ！",
        content: "# Side Note Editor へようこそ！\n\nブラウジング中に手軽にメモが取れるサイドパネルエディタです。\n\n## 主な機能\n- [x] サイドパネルでのMarkdownメモ表示\n- [ ] メモのグループ整理・ドラッグ＆ドロップ\n- [ ] ダブルクリックで編集モードへ切り替え\n- [ ] URLの自動認識とリンクオープン\n\n### 操作方法\n- 右上の「編集」ボタンまたはダブルクリックで編集できます。\n- チェックボックスはプレビュー画面から直接オン/オフできます！",
        isPinned: true,
        order: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];
  }

  if (!data.settings) {
    updates.settings = {
      theme: "dark",
      sortMode: "manual",
      warnStorageLimit: false,
      confirmDelete: true
    };
  }

  if (Object.keys(updates).length > 0) {
    await chrome.storage.local.set(updates);
  }

  // 右クリックコンテキストメニューの作成
  chrome.contextMenus.create({
    id: "add_selection_to_note",
    title: "Side Note に選択テキストを追加",
    contexts: ["selection"]
  });
});

// コンテキストメニュー押下時のハンドラ（選択テキストを新規メモに追加）
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add_selection_to_note" && info.selectionText) {
    const data = await chrome.storage.local.get(["groups", "notes"]);
    const groups = data.groups || [{ id: "g_default", name: "未分類", order: 0 }];
    const notes = data.notes || [];

    const newNote = {
      id: "n_" + Date.now(),
      groupId: groups[0]?.id || "g_default",
      title: (info.selectionText.slice(0, 20).trim() || "選択テキストメモ"),
      content: info.selectionText + (tab?.url ? `\n\n[出典元リンク](${tab.url})` : ""),
      isPinned: false,
      order: notes.length,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    notes.unshift(newNote);
    await chrome.storage.local.set({ notes });
  }
});

/**
 * Chrome API モック（ブラウザ自動検証用）
 * Chrome拡張機能以外の通常のWebブラウザ環境でも完全に動作するようにエミュレートします
 */
if (typeof window.chrome === "undefined" || !window.chrome.storage) {
  const store = {
    groups: [
      { id: "g_default", name: "未分類", order: 0 }
    ],
    notes: [
      {
        id: "n_welcome",
        groupId: "g_default",
        title: "Side Note Editor へようこそ！",
        content: "# Side Note Editor へようこそ！\n\nブラウジング中に手軽にメモが取れるサイドパネルエディタです。\n\n## 主な機能\n- [x] サイドパネルでのMarkdownメモ表示\n- [ ] メモのグループ整理・ドラッグ＆ドロップ\n- [ ] ダブルクリックで編集モードへ切り替え\n- [ ] URLの自動認識とリンクオープン\n\n### 操作方法\n- 右上の「編集」ボタンまたはダブルクリックで編集できます。\n- チェックボックスはプレビュー画面から直接オン/オフできます！",
        isPinned: true,
        order: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ],
    settings: {
      theme: "dark",
      sortMode: "manual",
      warnStorageLimit: false,
      confirmDelete: true
    }
  };

  const listeners = [];

  window.chrome = {
    storage: {
      local: {
        get: async (keys) => {
          if (!keys) return { ...store };
          const res = {};
          const keyList = Array.isArray(keys) ? keys : [keys];
          keyList.forEach(k => {
            if (k in store) res[k] = store[k];
          });
          return res;
        },
        set: async (items) => {
          const changes = {};
          for (const k in items) {
            changes[k] = { oldValue: store[k], newValue: items[k] };
            store[k] = items[k];
          }
          listeners.forEach(fn => fn(changes, "local"));
        }
      },
      onChanged: {
        addListener: (fn) => listeners.push(fn)
      }
    },
    tabs: {
      create: async ({ url }) => {
        console.log("[Mock chrome.tabs.create] 新規タブを開きました:", url);
        return { id: 1, url };
      }
    }
  };
}

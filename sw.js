// キャッシュ名とキャッシュするファイルリストを定義
// キャッシュ名を変更すると、新しいService Workerがインストールされ、古いキャッシュが削除されます
const CACHE_NAME = 'click-game-pwa-v1';
const urlsToCache = [
    './', // index.html を含むルートパス
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    // アイコン画像もキャッシュ対象に含める (もし実際の画像を使う場合)
    'https://placehold.co/192x192/007BFF/FFFFFF?text=PWA',
    'https://placehold.co/512x512/007BFF/FFFFFF?text=PWA'
];

// インストールイベント: Service Workerがインストールされたときに実行されます
self.addEventListener('install', (event) => {
    // Service Workerのインストールが完了するまで待機
    event.waitUntil(
        // 指定されたキャッシュ名でキャッシュを開く
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                // キャッシュするファイルリストをキャッシュに追加
                return cache.addAll(urlsToCache);
            })
    );
});

// フェッチイベント: アプリがリソース（HTML, CSS, JS, 画像など）を要求したときに実行されます
self.addEventListener('fetch', (event) => {
    // リクエストに応答
    event.respondWith(
        // キャッシュにリクエストされたリソースがあるか確認
        caches.match(event.request)
            .then((response) => {
                // キャッシュにリソースがあれば、それを返す
                if (response) {
                    return response;
                }
                // キャッシュになければ、ネットワークから取得
                return fetch(event.request);
            })
    );
});

// アクティベートイベント: Service Workerが有効化されたときに実行されます
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // 現在使用するキャッシュ名

    event.waitUntil(
        // 古いキャッシュを削除
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // ホワイトリストにない（つまり古くなった）キャッシュは削除
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

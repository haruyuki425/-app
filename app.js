document.addEventListener('DOMContentLoaded', () => {
    // HTML要素の取得
    const startButton = document.getElementById('startButton');
    const clickButton = document.getElementById('clickButton');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');

    // ゲーム変数
    let score = 0;
    let timeLeft = 10; // ゲーム時間 (秒)
    let gameInterval;
    let isGameRunning = false;

    // 初期状態のセットアップ
    function initializeGame() {
        score = 0;
        timeLeft = 10;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        clickButton.disabled = true; // ゲーム開始前はクリックボタンを無効化
        startButton.disabled = false; // スタートボタンは有効化
        resultDisplay.classList.add('hidden'); // 結果表示を非表示に
        clickButton.textContent = 'ここをクリック！'; // ボタンのテキストを初期化
    }

    // ゲームスタート時の処理
    startButton.addEventListener('click', () => {
        if (!isGameRunning) {
            isGameRunning = true;
            startButton.disabled = true; // ゲーム開始したらスタートボタンを無効化
            clickButton.disabled = false; // クリックボタンを有効化
            resultDisplay.classList.add('hidden'); // 前回の結果を非表示に
            score = 0; // スコアをリセット
            scoreDisplay.textContent = score;
            timeLeft = 10; // 時間をリセット
            timerDisplay.textContent = timeLeft;

            // タイマーの開始
            gameInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(gameInterval); // タイマーを停止
                    isGameRunning = false;
                    clickButton.disabled = true; // クリックボタンを無効化
                    startButton.disabled = false; // スタートボタンを再度有効化
                    resultDisplay.textContent = `ゲーム終了！ ${score} 回クリックしました！`;
                    resultDisplay.classList.remove('hidden'); // 結果を表示
                }
            }, 1000); // 1秒ごとに実行
        }
    });

    // クリックボタン押下時の処理
    clickButton.addEventListener('click', () => {
        if (isGameRunning) {
            score++;
            scoreDisplay.textContent = score;
        }
    });

    // ページロード時に初期化
    initializeGame();

    // --- PWA Service Worker の登録 ---
    // ブラウザがService Workerをサポートしているか確認
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Service Workerを登録します
            // スコープはルートディレクトリに設定し、アプリ全体をカバーします
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    // 登録成功時のログ
                    console.log('Service Worker 登録成功:', registration.scope);
                })
                .catch(error => {
                    // 登録失敗時のログ
                    console.log('Service Worker 登録失敗:', error);
                });
        });
    }
});

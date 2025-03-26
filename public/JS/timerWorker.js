let timerInterval;

self.onmessage = function (e) {
    if (e.data.action === "start") {
        let timeLeft = e.data.timeLeft;
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                self.postMessage({ action: "timeUp" });
                return;
            }
            
            timeLeft--;
            self.postMessage({ action: "updateTime", timeLeft });
            
        }, 1000);
    } else if (e.data.action === "stop") {
        clearInterval(timerInterval);
    }
};

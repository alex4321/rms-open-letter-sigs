(function() {
    const updateTimeout = 24 * 3600;
    const storageItem = "rms-open-letter-prs";

    function now() {
        return Date.now() / 1000;
    }

    function addPRs(data, prs) {
        let users = Object.keys(prs);
        for(let i=0; i<users.length; i++) {
            let user = users[i];
            let userPrs = prs[user];
            if (data[user] === undefined) {
                data[user] = [];
            }
            for (let j=0; j<userPrs.length; j++) {
                data[user].push(userPrs[j]);
            }
        }
        return data;
    }

    function getRmsPullRequestsByUsers(readyCallback, updateCallback, hardcodedPRs) {
        let knownPRSText = localStorage.getItem(storageItem);
        if (!knownPRSText) {
            knownPRSText = JSON.stringify({
                "data": {},
                "time": now() - 24 * 3600 - 100
            });
        }
        let knownPRs = JSON.parse(knownPRSText);
        knownPRs.data = addPRs(knownPRs.data, hardcodedPRs);

        if (knownPRs.time < (now() - updateTimeout)) {
            const requestPerHour = 1000;
            const timeout = Math.ceil(3600 / requestPerHour);
            updateCallback();
            downloadRmsPullRequestsByUsers(timeout)
                .then(function(pullRequestsByUser) {
                    knownPRs.data = addPRs(knownPRs.data, pullRequestsByUser);
                    knownPRs.time = now();
                    localStorage.setItem(storageItem, JSON.stringify(knownPRs));
                    readyCallback(knownPRs.data);
                });
        }
        readyCallback(knownPRs.data);
    }

    window.getRmsPullRequestsByUsers = getRmsPullRequestsByUsers;
})();

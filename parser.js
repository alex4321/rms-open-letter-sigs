(function() {
    function getPRsPage(page) {
        const url = "https://api.github.com/repos/rms-open-letter/rms-open-letter.github.io/pulls?" + 
            "state=all&page=" + page.toString() + "&per_page=100";
        console.log(url);
        const headers = new Headers();
        headers.append("Accept", "application/vnd.github.v3+json");
        const request = new Request(url, {
            "method": "GET",
            "headers": headers,
        });
        return fetch(request)
            .then((response) => {
                if (response.status != 200) {
                    throw "Got status code " + response.status.toString();
                }
                return response.json();
            });
    }

    function getPRS(requestTimeout) {
        function getNextPage(successCallback) {
            page += 1;
            getPRsPage(page)
                .then((data) => {
                    for(let i = 0; i<data.length; i++) {
                        prs.push(data[i]);
                    }
                    if (data.length == 0) {
                        successCallback(prs);
                    } else {
                        setTimeout(() => {getNextPage(successCallback);}, requestTimeout);
                    }
                });
        }

        let prs = [];
        let page = 0;

        return new Promise((resolve, reject) => {
            getNextPage(resolve);
        });
    }

    function downloadRmsPullRequestsByUsers(requestTimeout) {
        return getPRS(requestTimeout)
            .then((pullRequests) => {
                let pullRequestsByUser = {}
                for (let i=0; i<pullRequests.length; i++) {
                    let request = pullRequests[i];
                    let user = request["user"]["login"];
                    let url = request["html_url"];
                    let title = request["title"];
                    if (pullRequestsByUser[user] === undefined) {
                        pullRequestsByUser[user] = [];
                    }
                    pullRequestsByUser[user].push({
                        "url": url,
                        "title": title,
                    });
                }
                return pullRequestsByUser;
            });
    }

    window.downloadRmsPullRequestsByUsers = downloadRmsPullRequestsByUsers;
})();

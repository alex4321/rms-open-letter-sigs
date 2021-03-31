function getPRsPage(page) {
    const url = "https://api.github.com/repos/rms-open-letter/rms-open-letter.github.io/pulls?" + 
        "state=all&page=" + page.toString() + "&per_page=100";
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
    function getNextPage(successCallback, errorCallback) {
        page += 1;
        getPRsPage(page)
            .then((data) => {
                for(let i = 0; i<data.length; i++) {
                    prs.push(data[i]);
                }
                if (data.length == 0) {
                    successCallback(prs);
                } else {
                    setTimeout(() => {getNextPage();}, requestTimeout);
                }
            })
            .catch((reason) => {
                errorCallback(reason);
            })
            .reject((reason) => {
                errorCallback(reason);
            });
    }

    let prs = [];
    let page = 0;

    return new Promise((resolve, reject) => {
        getNextPage(resolve, reject);
    });
}

(function() {
    const apiRateLimit = 3600;
    const timeout = Math.ceil(apiRateLimit / 1000);
    getPRS(timeout)
        .then((data) => {
            console.log("Success", data);
        })
        .reject((reason) => {
            console.log("Rejected", reason);
        });
})();
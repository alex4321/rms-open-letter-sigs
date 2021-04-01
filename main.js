(function() {
    function removeIndicatorIfExist() {
        let indicator = document.querySelectorAll("#rms-open-letter-signer-button");
        if (indicator.length > 0) {
            indicator[0].parentNode.removeChild(indicator[0]);
        }
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function addSignerIndicator(username, requests) {
        removeIndicatorIfExist();

        let actions = document.querySelector(".pagehead-actions");
        
        let signerButtonContainer = document.createElement("li");
        let signerButton = document.createElement("a");
        let searchLink = "https://github.com/rms-open-letter/rms-open-letter.github.io/pulls?q=is%3Apr+author%3A" + username;

        signerButton.setAttribute("href", searchLink);
        signerButton.setAttribute("class", "btn btn-sm btn-danger");
        signerButton.setAttribute("id", "rms-open-letter-signer-button");
        signerButton.innerText = "Possible signer of RMS open letter";
        signerButtonContainer.appendChild(signerButton);

        let hintText = requests.map( (request) => { return request.title; } ).filter(onlyUnique).join("; ");
        signerButton.setAttribute("title", hintText);

        actions.appendChild(signerButtonContainer);

        return signerButton;
    }

    function addIndicatorIfHaveTo(username) {
        getRmsPullRequestsByUsers(
            (data) => {
                if ((data[username] !== undefined) && (data[username].length > 0)) {
                    addSignerIndicator(username, data[username]);
                }
            }, 
            () => {}, 
            window.hardcodedPRs
        );
    }

    function onload() {
        if (window.location.hostname.toLowerCase().endsWith("github.com")) {
            const username = window.location.pathname.split("/")[1];
            addIndicatorIfHaveTo(username);
        }
    }

    if (document.readyState != "complete") {
        window.addEventListener('load', onload);
    } else {
        onload();
    }
})();
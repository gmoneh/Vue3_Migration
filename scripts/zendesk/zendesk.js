document.addEventListener("DOMContentLoaded", function (event) {

    // Submit organization form in the request page
    let organization = document.querySelector("#request-organization select");
    if (organization) organization.addEventListener("change", function () {
        this.form.submit();
    });

    let hide = (e) => e.style.display = "none";
    let show = (e) => e.style.display = "block";

    document.querySelectorAll('.support-widget .Button').forEach(
        (e) => e.addEventListener('click', function () {
            document.querySelectorAll('.support-widget').forEach(hide);
            document.querySelectorAll('.support-widget-popup').forEach(show);
        })
    );

    document.querySelectorAll('.close-x').forEach(
        (e) => e.addEventListener('click', function () {
            document.querySelectorAll('.support-widget-popup').forEach(hide);
            document.querySelectorAll('.support-widget').forEach(show);
        })
    );

    let subtext = document.querySelector('.zopimsubtext');
    let livechat = document.querySelector('h3#lblLiveChat');
    if (livechat) livechat.insertAdjacentHTML('afterend', '<p class="zopimsubtext" id="zopimoff">Offline</p><p class="zopimsubtext" id="zopimon">Online</p>');
    if (subtext) subtext.style.display = "none";


    if (window.$zopim) {
        $zopim(function () {            
            $zopim.livechat.setOnStatus(bubble);
            let zopim = undefined;

            window.setTimeout(
                () => {
                    $zopim.livechat.hideAll();
                    zopim = document.querySelector('.zopim')
                    if (zopim) zopim.style.display = "none";
                },
                0
            );

            function bubble(status) {
                console.log("Zopim status is " + status);

                let subtext = document.querySelector('.zopimsubtext');
                if (subtext) subtext.style.display = "none";
                if (zopim) zopim.style.display = "none";

                let zopimoff = document.querySelector('#zopimoff');
                let zopimon = document.querySelector('#zopimon');

                if (status == 'online') {
                    if (zopimon) {
                        zopimon.style.display = "block";
                        zopimon.parentElement.setAttribute('onclick', '$zopim.livechat.window.openPopout();return false;');
                    }
                }
                else {
                    if (zopimoff) zopimoff.style.display = "block";
                    //if agent is offline, remove the js to open window
                    if (zopimon) zopimon.parentElement.setAttribute('onclick', '');
                }

            }
        });
    };

});

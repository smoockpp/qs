'use strict';

$(document).ready(function () {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
        FB.init({
            appId: '354535741642547',
            xfbml: true,
            version: 'v2.10'
        });
        // This is called with the results from from FB.getLoginStatus().

        FB.AppEvents.logPageView();
        // $('#loginbutton,#feedbutton').removeAttr('disabled');
        // FB.getLoginStatus(updateStatusCallback);
        FB.api('/354535741642547/feed', { access_token: '354535741642547|10817c3396131ec16de01399e168c085', message: 'something' }, function (response) {
            if (!response || response.error) {
                console.error('Error occured:' + JSON.stringify(response.error));
            } else {
                console.log(response);
            }
        });
    });
});
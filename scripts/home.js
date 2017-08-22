$(document).ready(function() {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
            appId: '{503457173353795}',
            autoLogAppEvents : true,
            status           : true,
            xfbml            : true,
            version: 'v2.7' // or v2.1, v2.2, v2.3, ...
        });
        // $('#loginbutton,#feedbutton').removeAttr('disabled');
        // FB.getLoginStatus(updateStatusCallback);
        FB.api('/503457173353795/feed', {access_token: '503457173353795|d13bc5fd011232eeaa4b5da6b720a2e4' ,message: 'something'}, function(response) {
            if (!response || response.error) {
              console.error('Error occured:' + JSON.stringify(response.error));
            } else {
              console.log('Post ID: ' + response.id);
            }
        });
    });
});

'use strict';

angular.element(document).ready(function() {

  
  // Run copayApp after device is ready.
  var startAngular = function() {
    angular.bootstrap(document, ['copayApp']);
  };

  var handleBitcoinURI = function(url) {
    if (!url) return;
    if (url.indexOf('glidera') != -1) {
      url = '#/uri-glidera' + url.replace('bitcoin://glidera', '');
    } else {
      url = '#/uri-payment/' + url;
    }
    setTimeout(function() {
      window.location = url;
    }, 1000);
  };


  /* Cordova specific Init */
  if (window.cordova !== undefined) {
   // alert('knows cordova... oka...')
    document.addEventListener('deviceready', function() {
     // alert('device ready! yeah')
      var secondBackButtonPress = 'false';
      var intval = setInterval(function() {
        secondBackButtonPress = 'false';
      }, 5000);

      document.addEventListener('pause', function() {
        if (!window.ignoreMobilePause) {
          setTimeout(function() {
            window.location = '#/cordova/pause///';
          }, 100);
        }
      }, false);

      document.addEventListener('resume', function() {
        if (!window.ignoreMobilePause) {
          setTimeout(function() {
            window.location = '#/cordova/resume///';
          }, 100);
        }
        setTimeout(function() {

          //alert('ran this')
          var loc = window.location;
          var ignoreMobilePause = loc.toString().match(/(glidera|buy|sell)/) ? true : false;
          window.ignoreMobilePause = ignoreMobilePause;
        }, 100);
      }, false);

      // Back button event

      document.addEventListener('backbutton', function() {

        var loc = window.location;
        var fromDisclaimer = loc.toString().match(/disclaimer/) ? 'true' : '';
        var fromHome = loc.toString().match(/index\.html#\/$/) ? 'true' : '';
        if (!window.ignoreMobilePause) {
          window.location = '#/cordova/backbutton/' + fromHome + '/' + fromDisclaimer + '/' + secondBackButtonPress;
          if (secondBackButtonPress == 'true') {
            clearInterval(intval);
          } else {
            secondBackButtonPress = 'true';
          }
        }
        setTimeout(function() {
          window.ignoreMobilePause = false;
        }, 100);
      }, false);

      document.addEventListener('menubutton', function() {
        window.location = '#/preferences';
      }, false);

      setTimeout(function() {
       // alert('attempting splash')
        navigator.splashscreen.hide();
       // alert('aend splash');
      }, 1000);

     // alert('come')

      try{
      window.plugins.webintent.getUri(handleBitcoinURI);
    //  alert('stop not');
      window.plugins.webintent.onNewIntent(handleBitcoinURI);
     // alert('attempting');
     window.handleOpenURL = handleBitcoinURI;
    //  alert('doing it');
      }
      catch(err){
       // alert('moving on')
      }
      try{
      window.plugins.touchid.isAvailable(
        function(msg) {
         // alert('touch id')
          window.touchidAvailable = true;
        }, // success handler: TouchID available
        function(msg) {
         // alert('no touch id')
          window.touchidAvailable = false;
        } // error handler: no TouchID available
      );
    }

    catch(err){

     // alert('no!!')
    }
     // alert('stating angular app')
      startAngular();
     // alert('started angular')
    }, false);
  } else {
    try {
      window.handleOpenURL = handleBitcoinURI;
      window.plugins.webintent.getUri(handleBitcoinURI);
      window.plugins.webintent.onNewIntent(handleBitcoinURI);
    } catch (e) {}

    startAngular();
  }

});

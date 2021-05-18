
// var headers = {
//   "Content-Type": "application/json",
//   Authorization: "Bearer " + Config.authToken,
// };



$(document).ready(function () {
  intoTheSkyAppModel = new intoTheSkyApp();
  intoTheSkyAppModel.init();
  var Expand = (function() {
    var tile = $('.strips__strip');
    var tileLink = $('.strips__strip > .strip__content');
    var tileText = tileLink.find('.strip__inner-text');
    var stripClose = $('.strip__close');
    
    var expanded  = false;
  
    var open = function() {
        
      var tile = $(this).parent();
  
        if (!expanded) {
          tile.addClass('strips__strip--expanded');
          // add delay to inner text
          tileText.css('transition', 'all .5s .3s cubic-bezier(0.23, 1, 0.32, 1)');
          stripClose.addClass('strip__close--show');
          stripClose.css('transition', 'all .6s 1s cubic-bezier(0.23, 1, 0.32, 1)');
          expanded = true;
        } 
      };
    
    var close = function() {
      if (expanded) {
        tile.removeClass('strips__strip--expanded');
        // remove delay from inner text
        tileText.css('transition', 'all 0.15s 0 cubic-bezier(0.23, 1, 0.32, 1)');
        stripClose.removeClass('strip__close--show');
        stripClose.css('transition', 'all 0.2s 0s cubic-bezier(0.23, 1, 0.32, 1)')
        expanded = false;
      }
    }
  
      var bindActions = function() {
        tileLink.on('click', open);
        stripClose.on('click', close);
      };
  
      var initAction = function() {
        bindActions();
      };
  
      return {
        initAction: initAction
      };
  
  }());
  Expand.init();
});


function intoTheSkyApp() {

  var apiKey = "l6mLDfDsPCfqS75dAf6I5fnNm2fI0EbGeOtGB9dq";

  var fnHandleBars = function (template, data) {
    template = "#" + template;
    var Source = $(template).html();
    var fnTemplate = Handlebars.compile(Source);
    return fnTemplate(data);
  };

  var fnAjaxRequest = function (ajaxURL, ajaxReqMethod, ajaxReqHeader, ajaxReqData, onSucess, onError) {
      $.ajax({
          type: ajaxReqMethod,
          url: ajaxURL,
          headers: ajaxReqHeader,
          data: ajaxReqData,
          success: onSucess,
          error: onError
      });
  };



  function GetNasaApiData(url) {
    return new Promise(function(resolve,reject){
      var method = 'GET';
      fnAjaxRequest(url, method, {},"", resolve, reject);
    })
  }


  (function () {
      // for first tab call function APOD
      GetNasaApiData($(".headerbtn.active").attr("data-url")).then((data) => {
        // alert("success");
        console.log(data);
        data["sub_title"] = "Astronomy Picture of the Day";
        data = {data};
        var topicInfoHTML = fnHandleBars('topicInfoTemplate', data);
        $("#topicDetails").html(topicInfoHTML);
      }).catch((error) =>{
        alert("something whent wrong");
      });

      //  change nav tab
      $('body').off('click', '.headerbtn').on('click', '.headerbtn', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".headerbtn").removeClass("active");
        $(this).addClass("active");
        let url = $(this).attr("data-url");
        
        if($(".active").attr("id") === "apod"){
          // APOD data AJAX call
          GetNasaApiData(url).then((data) => {
            console.log(data);
            data = {data};
            var topicInfoHTML = fnHandleBars('topicInfoTemplate', data);
            $("#topicDetails").html(topicInfoHTML);
          }).catch((error) =>{
            alert("something whent wrong");
          });
        }
        else if($(this).attr("id") === "asteroidNeo"){
          //var filterHTML = fnHandleBars('filterTemplate', {});
          //$("#topicDetails").html(filterHTML);
          var topicInfoHTML = fnHandleBars('asteroidNeowTemplate', {});
          $("#topicDetails").html(topicInfoHTML);
          
        }

      });

      $('body').off('click', '.btnSub').on('click', '.btnSub', function (e) {
        let url = $("#asteroidNeo").attr("data-url");
        //asteroidNeo data AJAX call
        url = url + "feed?start_date=" + $("#start").val() + "&end_date="+ $("#end").val() + "&api_key=" +apiKey;
        // /feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY
        // $(".twoDivflex").removeClass("hide");
        //console.log($(this).attr("id"));
        GetNasaApiData(url).then((data) => {
          console.log(data);
          data = {data};
          var topicInfoHTML = fnHandleBars('asteroidNeowTemplate', data);
          $("#topicDetails").html(topicInfoHTML);
        }).catch((error) =>{
          alert("something whent wrong");
        });
      });

      $('body').off('click', '.expand-collapse').on('click', '.expand-collapse', function (e) {
          $('.expand-collapse h3').each(function() {
            var tis = $(this), state = false, answer = tis.next('div').slideUp();
            tis.click(function() {
              state = !state;
              answer.slideToggle(state);
              tis.toggleClass('active',state);
            });
          });
      });
  })();


  

  return {
      init: function () {
          var initialize = 1;
      }
  }
}
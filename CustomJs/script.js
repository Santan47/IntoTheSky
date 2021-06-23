
// var headers = {
//   "Content-Type": "application/json",
//   Authorization: "Bearer " + Config.authToken,
// };



$(document).ready(function () {
  intoTheSkyAppModel = new intoTheSkyApp();
  intoTheSkyAppModel.init();
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

//return an array of values that match on a certain key
function getValues(obj, key) {
  var objects = [];
  for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
          objects = objects.concat(getValues(obj[i], key));
      } else if (i == key) {
          objects.push(obj[i]);
      }
  }
  return objects;
}


  function GetNasaApiData(url) {
    return new Promise(function(resolve,reject){
      var method = 'GET';
      fnAjaxRequest(url, method, {},"", resolve, reject);
    })
  }


  (function () {
      // for first tab call function APOD
      $("#asteroidNeo").trigger("click");
      // GetNasaApiData($(".headerbtn.active").attr("data-url")).then((data) => {
      //   // alert("success");
      //   console.log(data);
      //   data["sub_title"] = "Astronomy Picture of the Day";
      //   data = {data};
      //   var topicInfoHTML = fnHandleBars('topicInfoTemplate', data);
      //   $("#topicDetails").html(topicInfoHTML);
      // }).catch((error) =>{
      //   alert("something whent wrong");
      // });

      $('body').off('click', '.closebtn').on('click', '.closebtn', function (e) {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("viewMain").style.marginLeft= "0";
      });

      $('body').off('click', '.openbtn').on('click', '.openbtn', function (e) {
        document.getElementById("mySidenav").style.width = "350px";
        document.getElementById("viewMain").style.marginLeft = "350px";
      });

      //  change nav tab
      $('body').off('click', '.headerbtn').on('click', '.headerbtn', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".headerbtn").removeClass("active");
        $(this).addClass("active");
        $("#topicDetails").addClass("hide");
        $(".loaderParent").removeClass("hide");
        
        let url = $(this).attr("data-url");
        
        if($(".active").attr("id") === "apod"){
          // APOD data AJAX call
          GetNasaApiData(url).then((data) => {
            console.log(data);
            data = {data};
           
            var topicInfoHTML = fnHandleBars('topicInfoTemplate', data);
            $("#topicDetails").html(topicInfoHTML);
            $(".loaderParent").addClass("hide");
            $("#topicDetails").removeClass("hide");
          }).catch((error) =>{
            alert("something whent wrong");
          });
        }
        else if($(this).attr("id") === "asteroidNeo"){
          var filterHTML = fnHandleBars('filterTemplate', {data:"Please give date in span of 7 Days To Get All Asteroids Details."});
          $("#topicDetails").html(filterHTML);
          $(".loaderParent").addClass("hide");
          $("#topicDetails").removeClass("hide");
          // var topicInfoHTML = fnHandleBars('asteroidNeowTemplate', {});
          // $("#topicDetails").html(topicInfoHTML);
          
        }
        else if($(this).attr("id") === "donki"){
          var filterHTML = fnHandleBars('filterTemplate', {data:"Please give date in span of 7 Days To Get All Donki Details."});
          $("#topicDetails").html(filterHTML);
          $(".loaderParent").addClass("hide");
          $("#topicDetails").removeClass("hide");
          // var topicInfoHTML = fnHandleBars('asteroidNeowTemplate', {});
          // $("#topicDetails").html(topicInfoHTML);
          
        }

      });

      $('body').off('click', '.btnSub').on('click', '.btnSub', function (e) {
        $("#topicDetails").addClass("hide");
        $(".loaderParent").removeClass("hide");
        if($(".active").attr("id") == "asteroidNeo"){
          let url = $("#asteroidNeo").attr("data-url");
          //asteroidNeo data AJAX call
          url = url + "feed?start_date=" + $("#start").val() + "&end_date="+ $("#end").val() + "&api_key=" +apiKey;
          GetNasaApiData(url).then((data) => {
            console.log(data);
            data = {data};
            jblKeysArray = getValues(data,"nasa_jpl_url");
            nameKeysArray = getValues(data,"name");
            obj = [];
            for(i = 0 ;i < jblKeysArray.length; i++){
              newItem = {
                "name": nameKeysArray[i],
                "jblUrl": jblKeysArray[i]
              }
              obj.push(newItem);
            }
            var topicInfoHTML = fnHandleBars('asteroidNeowTemplate', obj);
            $("#topicDetails").html(topicInfoHTML);
            $(".loaderParent").addClass("hide");
            $("#topicDetails").removeClass("hide");
          }).catch((error) =>{
            alert("something whent wrong");
          });
        }
        else if($(".active").attr("id") == "donki"){
          let url = $("#donki").attr("data-url");
          //asteroidNeo data AJAX call
          url = url + "startDate=" + $("#start").val() + "&endDate="+ $("#end").val() + "&api_key=" +apiKey;
          GetNasaApiData(url).then((data) => {
            console.log(data);
            //data = {data};
            // jblKeysArray = getValues(data,"nasa_jpl_url");
            // nameKeysArray = getValues(data,"name");
            // obj = [];
            // for(i = 0 ;i < jblKeysArray.length; i++){
            //   newItem = {
            //     "name": nameKeysArray[i],
            //     "jblUrl": jblKeysArray[i]
            //   }
            //   obj.push(newItem);
            // }
            var topicInfoHTML = fnHandleBars('donkiTemplate', data);
            $("#topicDetails").html(topicInfoHTML);
            $(".loaderParent").addClass("hide");
            $("#topicDetails").removeClass("hide");
          }).catch((error) =>{
            alert("something whent wrong");
          });
        }
        
      });

  })();


  

  return {
      init: function () {
          var initialize = 1;
      }
  }
}
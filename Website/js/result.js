$(function()
{
    var serious = false;
    var distress = false;

    var session_result = sessionStorage.getItem("result");
    session_result = JSON.parse(session_result);

    // Force scroll to top
    $(document).scrollTop(0);

    // Disable dragable element
    $("section").css({"pointer-events": "none"});

    var test_type;
    var test_count = 1;
    
    if(session_result["test"].length == 3)
    {
      test_type = "DASS";
      $(".result_title").append("Keputusan Ujian " + test_type + " Anda");

      for (var i = 0; i < 3; i++)
        display_result(to_malay(session_result["test"][i]), session_result["score"][i], session_result["overallscore"]);
    }
    else
    {
      test_type = to_malay(session_result["test"]);
      $(".result_title").append("Keputusan Ujian " + test_type + " Anda");

      display_result(to_malay(session_result["test"]), session_result["score"], session_result["overallscore"]);
    }

    function display_result(test_type, score, full_score)
    {
      var result_card = '<div class="col-md-4 text-center ftco-animate fadeInUp ftco-animated result-display">' +
                        '<div class="steps">' +
                        '<div class="icon mb-4 d-flex justify-content-center align-items-center">' +
                        '<span class="flaticon-cloud-computing-1"></span>' +
                        '</div>' +
                        '<h3>Skor ' + test_type + '</h3>' +
                        '<p><strong class="number" data-number=' + score + '>0</strong><strong>/' + full_score + '</strong><br>' +
                        result_text(session_result["test"][i], score) +
                        '</div>' +
                        '</div>';

      $(result_card).appendTo(".result-card");
    }

    if(distress)
    {
      $(".distress-button").append('<a href="#" class="btn btn-primary d-block px-3 py-3 mb-4 distress" style="display: none !important">Butang Kecemasan</a>');
      $(".distress-text").append('Memerlukan bantaun sekarang? Tekanlah butang kecemasan');
    }

    if(serious)
    {
      $(".help-text").append("Anda mempunyai skor " + test_type + " yang merisaukan. Di bawah merupakan beberapa saluran bantuan yang anda boleh hubungi")

      var table_header =  '<div class="col-md-12 ftco-animate fadeInUp ftco-animated">' +
                          '<div class="table-responsive">' +
                          '<table class="table">' +
                          '<thead class="thead-primary">' +
                          '<tr>' +
                          '<th>Nama Hospital</th>' +
                          '<th>Negeri</th>' +
                          '<th>Alamat</th>' +
                          '<th>Bandar</th>' +
                          '<th>No. Telefon</th>' +
                          '<th>Hubungan</th>' +
                          '</tr>' +
                          '</thead>' +
                          '<tbody class="suggestion-table-content">' +
                          '</tbody>'

      $(".result-suggestion").append(table_header);
    }
    else
    {
      $(".help-text").append("Skor " + test_type + " anda adalah normal, anda mempunyai status mental yang sihat. Tahniah!");
      $(".help-text").append("<br><br><p class='news-text'>Di bawah merupakan beberapa berita atau artikel tentang " + test_type + ". Anda boleh mengetahui lebih dengan melawat link tersebut</p>");

      var url = 'https://newsapi.org/v2/everything?' +
                'qInTitle=' + to_english(session_result["test"]) + '&' +
                'sortBy=popularity&' +
                'apiKey=dc5c322ae4684614872e8dd7b4d1ece9';

      var req = new Request(url);

      fetch(req)
        .then(response => response.json())
        .then(function(newsObject) {
          for(var i = 0; i < 6; i++)
          {
            var news_suggestion = '<div class="col-md-4 ftco-animate fadeInUp ftco-animated">' +
                                  '<div class="blog-entry">' +
                                  '<a href="' + newsObject["articles"][i]["url"] + '" class="block-20" style="background-image: url(\'' + newsObject["articles"][i]["urlToImage"] + '\');">' +
                                  '</a>' +
                                  '<div class="text d-flex py-4">' +
                                  '<h3><a class="news-heading" href="' + newsObject["articles"][i]["url"] + '">' + newsObject["articles"][i]["title"] + '</a></h3>' +
                                  '</div>' +
                                  '</div>' +
                                  '</div>'

              $(".news-suggestion").append(news_suggestion);
          }
        });
    }

    // custom section counter
    var counter = function() {
		
		$('#section-counter-custom').waypoint( function() {

			if(!$(this.element).hasClass('ftco-animated')) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function(){
					var $this = $(this),
						num = $this.data('number');
						console.log(num);
					$this.animateNumber(
					  {
					    number: num,
					    numberStep: comma_separator_number_step
					  }, 4000
          );
          $('.scoring-status').delay(4000).fadeIn(1000);
          $('.distress').delay(4000).fadeIn(1000);
          $('.distress-text').delay(4000).fadeIn(1000);
				});
			}

		} , { offset: '95%' } );

	}
  counter();

  var state = "Perak"
  state = get_state();

  if(serious)
  {
    $.getJSON("../json/hospital.json", function(data){
      $.each(data, function(i, field){
        if(field["NEGERI"] == state)
        {
          var hospital_list =   '<tr>' +
                                '<td>'+ field["HOSPITAL"] +'</td>' +
                                '<td>'+ field["NEGERI"] +'</td>' +
                                '<td>'+ field["ALAMAT"] +'</td>' +
                                '<td>'+ field["BANDAR"] +'</td>' +
                                '<td>'+ field["NO. TELEFON"] +'</td>' +
                                '<td><a href="#" class="btn btn-primary d-block px-3 py-3 mb-4 contact">Hubungi Hospital</a></td>'
                                '</tr>'

          $(".suggestion-table-content").append(hospital_list);
        }
      })
    });
  }

  function to_english(category)
  {
    if(category == 1)
      return "Loneliness";
    else if (category == 2)
      return "Depression";
    else if (category == 3)
      return "Anxiety";
    else if (category == 4)
      return "Stress";
    else if (category == 5)
      return "Suicidal Thoughts";
  }

  function to_malay(category)
  {
    if(category == 1)
      return "Kesepian";
    else if (category == 2)
      return "Kemurungan";
    else if (category == 3)
      return "Kerisauan";
    else if (category == 4)
      return "Stres";
    else if (category == 5)
      return "Ideasi Bunuh Diri";
  }
  
  function result_text(test_type, score)
  {
    var accessment;
    var scale;

    if(test_type == 2)
    {
      if(score > 27)
      {
        accessment = "Sangat Teruk";
        scale = 4;
      }
      else if (score > 20)
      {
        accessment = "Teruk";
        scale = 3;
      }
      else if (score > 13)
      {
        accessment = "Sederhana";
        scale = 2;
      }
      else if (score > 9)
      {
        accessment = "Ringan";
        scale = 1;
      }
      else
      {
        accessment = "Normal";
        scale = 0;
      }
    }
    else if(test_type == 3)
    {
      if(score > 19)
      {
        accessment = "Sangat Teruk";
        scale = 4;
      }
      else if (score > 14)
      {
        accessment = "Teruk";
        scale = 3;
      }
      else if (score > 9)
      {
        accessment = "Sederhana";
        scale = 2;
      }
      else if (score > 7)
      {
        accessment = "Ringan";
        scale = 1;
      }
      else
      {
        accessment = "Normal";
        scale = 0;
      }
    }
    else if(test_type == 4)
    {
      if(score > 33)
      {
        accessment = "Sangat Teruk";
        scale = 4;
      }
      else if (score > 25)
      {
        accessment = "Teruk";
        scale = 3;
      }
      else if (score > 18)
      {
        accessment = "Sederhana";
        scale = 2;
      }
      else if (score > 14)
      {
        accessment = "Ringan";
        scale = 1;
      }
      else
      {
        accessment = "Normal";
        scale = 0;
      }
    }
    else if(test_type == 1)
    {
      if(score > 29)
      {
        accessment = "Teruk";
        scale = 4;
      }
      else if (score > 21)
      {
        accessment = "Sederhana";
        scale = 2;
      }
      else if (score > 14)
      {
        accessment = "Ringan";
        scale = 1;
      }
      else
      {
        accessment = "Normal";
        scale = 0;
      }
    }
    else
    {
      if(score > 20)
      {
        accessment = "Teruk";
        scale = 4;
      }
      else if (score > 8)
      {
        accessment = "Sederhana";
        scale = 2;
      }
      else 
      {
        accessment = "Normal";
        scale = 0;
      }
    }

    if (scale > 0)
      serious = true;

    if (scale == 4)
      distress = true;

    var text;
    var color;

    if (scale == 0)
      color = "lime";
    else if (scale == 1)
      color = "teal"
    else if (scale == 2)
      color = "fuchsia"
    else if (scale == 3)
      color = "orange"
    else if (scale == 4)
      color = "red"

    text = '<strong class="scoring-status" style = "color:' + color +'; display:none">- ' + accessment + ' -</strong></p>'

    return text;
  }

function get_state()
{
  var latitude = 4.330322955981828;
  var longitude = 101.13721218103524;

  function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  }

  navigator.geolocation.getCurrentPosition(showPosition, error);

  function error(err) {
    alert(err);
  }

    /*var geocoder;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);

    geocoder.geocode(
    {'latLng': latlng}, 
    function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add= results[0].formatted_address ;
                    var  value=add.split(",");

                    count=value.length;
                    country=value[count-1];
                    state=value[count-2];
                    city=value[count-3];
                }
        }
    });*/

    return state;
}

})
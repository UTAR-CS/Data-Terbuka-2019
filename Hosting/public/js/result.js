$(function()
{
    // Flag for display hospital list and distress button
    var serious = false;
    var distress = false;

    // Default latitude and longitude
    var latitude = 3.158025;
    var longitude = 101.711668;

    // Variable for specifying which test user has taken
    var test_type;

    // Variable for specifying the most serious score and test name attempted
    var higest_score = 0;
    var highest_test_type;

    // Default state
    var state = "Kuala Lumpur"

    // Check if result is present, if not redirects user to homepage
    if(sessionStorage.getItem("result") !== null)
    {
      var session_result = sessionStorage.getItem("result");
      session_result = JSON.parse(session_result);
    }
    else
      window.location.href = "index.html";

    // Force document scroll to top
    $(document).scrollTop(0);

    // Disable dragable element on title
    $(".title").css({"pointer-events": "none"});
    
    // Determine whether test is DASS or not DASS and display the result accordingly
    if(session_result["test"].length == 3)
    {
      test_type = "DASS";
      $(".result_title").append("Keputusan Ujian " + test_type + " Anda");

      for (var i = 0; i < 3; i++)
      {
        if(higest_score < session_result["score"][i])
        {
          higest_score = session_result["score"][i];
          highest_test_type = to_malay(session_result["test"][i]);
        }

        display_result(session_result["test"][i], session_result["score"][i], session_result["overallscore"]);
      }
    }
    else
    {
      test_type = to_malay(session_result["test"]);
      highest_test_type = test_type;
      $(".result_title").append("Keputusan Ujian " + test_type + " Anda");

      higest_score = session_result["score"];
      display_result(session_result["test"], session_result["score"], session_result["overallscore"]);
    }

    // Check if location is cached on browser or not
    if (localStorage.getItem("location") === null)
    {
      get_state(display_hospital);
      display_suggestion();
    }
    else
    {
      var temp = JSON.parse(localStorage.getItem("location"));
      navigator.geolocation.getCurrentPosition(get_position);

      // Check if user location has been changed since last time
      setTimeout(function() {
        if (temp["longitude"] != longitude || temp["latitude"] != latitude)
          get_state(display_hospital);
        else
          display_hospital();

        display_suggestion()
      }, 1000);
    }

    function display_suggestion()
    {
      // Check if user has a serious score and display a distress button
      if(distress)
      {
        $(".distress-button").append('<a href="' + send_distress(counter) + '" class="btn btn-primary d-block px-3 py-3 mb-4 distress" style="display: none !important">Butang Kecemasan</a>');
        $(".distress-text").append('Memerlukan bantaun sekarang? Tekanlah butang kecemasan<br>Ia akan menghantar e-mel dengan lokasi anda ke hospital yang terdekat');
      }

      // Check if user has high scoring and display hospitals in the state
      if(serious)
      {
        counter();
        $(".help-text").append("Anda mempunyai skor " + test_type + " yang merisaukan. Di bawah merupakan beberapa hospital yang anda boleh hubungi<br>E-mel akan dihantar ke hospital dengan skor " + test_type + " anda");

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
        counter();
        // If results are normal, display news / articles on related topic for user to know more
        $(".help-text").append("Skor " + test_type + " anda adalah normal, anda mempunyai status mental yang sihat. Tahniah!");
        $(".help-text").append("<br><br><p class='news-text'>Di bawah merupakan beberapa berita atau artikel tentang " + test_type + ". Anda boleh mengetahui lebih dengan melawat link tersebut</p>");

        var url_title_query;

        if(session_result["test"].length == 3)
          url_title_query = Math.ceil((Math.random() * 3) + 1);
        else
          url_title_query = session_result["test"];

        var url = 'https://newsapi.org/v2/everything?' +
                  'qInTitle=' + to_english(url_title_query) + '&' +
                  'sortBy=popularity&' +
                  'apiKey=dc5c322ae4684614872e8dd7b4d1ece9';

        var req = new Request(url);

        fetch(req)
          .then(response => response.json())
          .then(function(newsObject) {
            $(".loader").hide();
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
    }

  // function for displaying the test result
  function display_result(test_type, score, full_score)
  {
    var result_card = '<div class="col-md-4 text-center ftco-animate fadeInUp ftco-animated result-display">' +
                      '<div class="steps">' +
                      '<div class="icon mb-4 d-flex justify-content-center align-items-center">' +
                      '<span><img src="../images/' + to_malay(test_type) + '.png" width=45 height=50></span>' +
                      '</div>' +
                      '<h3>Skor ' + to_malay(test_type) + '</h3>' +
                      '<p><strong class="number" data-number=' + score + '>0</strong><strong>/' + full_score + '</strong><br>' +
                      result_text(test_type, score) +
                      '</div>' +
                      '</div>';

    $(result_card).appendTo(".result-card");
  }

  // function for displaying hospital suggestion header
  function display_hospital()
    {
      var location = JSON.parse(localStorage.getItem("location"))
      state = location["state"];

      if(serious)
      {
        $(".loader").hide();
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
                                    '<td><a href="' + send_email() + '" class="btn btn-primary d-block px-3 py-3 mb-4 contact">Hubungi Hospital</a></td>'
                                    '</tr>'

              $(".suggestion-table-content").append(hospital_list);
            }
          })
        });
      }
    }

  // Convert to english test names
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

  // Convert to malay test names
  function to_malay(category)
  {
    if(category == 1)
      return "Kesepian";
    else if (category == 2)
      return "Kemurungan";
    else if (category == 3)
      return "Keresahan";
    else if (category == 4)
      return "Stres";
    else if (category == 5)
      return "Ideasi Bunuh Diri";
  }
  
  // Sets scale and cut off points for each test
  function result_text(test_type, score)
  {
    var accessment;
    var scale;

    if(test_type == 2)  // Depression
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
    else if(test_type == 3) // Anxiety
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
    else if(test_type == 4) // Stress
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
    else if(test_type == 1) // Loneliness
    {
      if(score > 65)
      {
        accessment = "Teruk";
        scale = 4;
      }
      else if (score > 50)
      {
        accessment = "Sederhana";
        scale = 2;
      }
      else if (score > 35)
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
    else  // Suiside Ideation
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

    // sets as alarming if one of the test score above normal
    if (scale > 0)
      serious = true;

    // sets as distress if test score falls in most serious scale
    if (scale == 4)
      distress = true;

    var text;
    var color;

    // selects text color based on result
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

  function send_distress(_callback)
  {
    var coordinates = latitude + ',' + longitude;
    var website = 'http://www.data.gov.my/';

    var recepient = 'dataterbuka@mampu.gov.my';
    var subject = 'Tolong! Bantuan mental amat Diperlukan!';
    var body =  'Saya telah membuat test ' + highest_test_type + ' di laman <Psyco-Pass>%0d%0a%0d%0a' +
                'Saya mendapat skor ' + higest_score + '/' + session_result["overallscore"] + '%0d%0a' +
                'Skor tersebut amat tinggi dan merisaukan saya. Saya amat memerlukan bantuan mental sekarang.%0d%0a' +
                'Lokasi saya ialah: ' +
                'https://www.google.com/maps/dir//' + coordinates + '/@' + coordinates + ',19z%0d%0a%0d%0a' + 
                'Laman Web Ujian Dilakukan: ' + website + '%0d%0a';

    var email = 'mailto:' + recepient + '?Subject=' + subject + '&Body=' + body;

    return email;
    _callback();
  }

  function send_email()
  {
    var coordinates = latitude + ',' + longitude;
    var website = 'http://www.data.gov.my/';

    var recepient = 'dataterbuka@mampu.gov.my';
    var subject = 'Saya ingin memdapatkan bantuan mental';
    var body =  'Saya telah membuat test ' + highest_test_type + ' di laman <Psyco-Pass>%0d%0a%0d%0a' +
                'Saya mendapat skor ' + higest_score + '/' + session_result["overallscore"] + '%0d%0a' +
                'Skor tersebut merisaukan saya. Saya ingin mendapatkan bantuan daripada pihak anda.%0d%0a' +
                'Lokasi saya ialah: ' +
                'https://www.google.com/maps/dir//' + coordinates + '/@' + coordinates + ',19z%0d%0a%0d%0a' + 
                'Laman Web Ujian Dilakukan: ' + website + '%0d%0a';

    var email = 'mailto:' + recepient + '?Subject=' + subject + '&Body=' + body;

    return email;
  }

  // function for getting current user latitude and longitude
  function get_position(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  }

  // function for getting current user state and sets as cache
  function get_state(_callback)
  {
    setTimeout(function(){

      var geocoder;
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

                      $.getJSON("../json/state.json", function(data){
                        $.each(data, function(i, field){
                          if(state.toLowerCase().includes(field["Negeri"].toLowerCase()))
                          {
                            state = field["True_Negeri"];

                            var obj = {
                              country: country,
                              state: state,
                              city: city,
                              latitude: latitude,
                              longitude: longitude,
                            }

                            localStorage.setItem("location", JSON.stringify(obj));
                            _callback();
                          }
                        })
                      });
                  }
          }
          else
          {
            var obj = {
              country: "Malaysia",
              state: "Kuala Lumpur",
              city: "Cheras",
              latitude: latitude,
              longitude: longitude,
            }

            localStorage.setItem("location", JSON.stringify(obj));
            _callback();
          }
      });
    }, 1000);

    navigator.geolocation.getCurrentPosition(get_position)
  }

  // function of custom section counter
  function counter () {
		
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
})
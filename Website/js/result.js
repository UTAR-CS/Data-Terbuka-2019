$(function()
{
    var serious = false;
    var distress = false;

    // Force scroll to top
    $(document).scrollTop(0);

    // Disable dragable element
    $("section").css({"pointer-events": "none"});

    // Dynamic variable to be read from session storage
    var test_type = "Kesepian";
    
    // Dynamic title of test taken
    $(".result_title").append("Keputusan Ujian " + test_type + " Anda");

    var test_count = 3;

    for(var i = 0; i < test_count; i++)
    {
        var test_type = "Kesepian";
        var score = 8;
        var full_score = 40;

        var result_card = '<div class="col-md-4 text-center ftco-animate fadeInUp ftco-animated result-display">' +
                        '<div class="steps">' +
                        '<div class="icon mb-4 d-flex justify-content-center align-items-center">' +
                        '<span class="flaticon-cloud-computing-1"></span>' +
                        '</div>' +
                        '<h3>Skor ' + test_type + '</h3>' +
                        '<p><strong class="number" data-number=' + score + '>0</strong><strong>/' + full_score + '</strong><br>' +
                        result_text(test_type, score) +
                        '</div>' +
                        '</div>';

        $(result_card).appendTo(".result-card");
    }

    if (distress)
    {
      $(".result-card").append('<a href="#" class="btn btn-primary d-block px-3 py-3 mb-4 distress">Butang Kecemasan</a>');
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
      $(".help-text").append("Skor " + test_type + " anda adalah normal, anda mempunyai status mental yang sihat. Tahniah!")

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

  
  
  function result_text(test_type, score)
  {
    var accessment;
    var scale;

    if(test_type == "Kemurungan")
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
    else if(test_type == "Kerisauan")
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
    else if(test_type == "Stres")
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
    else if(test_type == "Kesepian")
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
      if(score < 20)
      {
        accessment = "Teruk";
        scale = 4;
      }
      else if (score < 8)
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
                }
        }
    });

    return state;
}

})
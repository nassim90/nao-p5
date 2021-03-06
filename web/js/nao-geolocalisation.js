$('#appbundle_observation_commune').keypress(function(e) {
    if(e.which == 13){
        searchByVille();
    }
});


$('#encode').click(function() {
    searchByVille();
});

function searchByVille(){
    var map = new google.maps.Map(document.getElementById('map'), {});
    var geocoder = new google.maps.Geocoder;
    var address = document.getElementById('address').value;

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            $(appbundle_observation_latitude).val(results[0].geometry.location.lat) ;
            $(appbundle_observation_longitude).val(results[0].geometry.location.lng);
            $(appbundle_observation_commune).val(results[0].formatted_address);

            map.setZoom(11);
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Circle({
                map: map,
                center: results[0].geometry.location,
                radius:800,
                strokeColor:"#ff0000",
                strokeOpacity:0,
                fillColor:"#ff0000",
                fillOpacity:0.35,
                strokeWeight:2,
            });
        } else {
            alert('Echec de Géolocalisation : ' + status);
        }
    });
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {});
    var geocoder = new google.maps.Geocoder;
    var infoWindow = new google.maps.InfoWindow({map: map});

    if(document.getElementById('address').value != ''  ){
        console.log(document.getElementById('address').value);
        searchByVille();
    }else{
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    $(appbundle_observation_latitude).val(pos.lat) ;
                    $(appbundle_observation_longitude).val(pos.lng);
                    infoWindow.setPosition(pos);
                    map.setCenter(pos);
                    geocodeLatLng(geocoder, map, infoWindow);
                    var legend = document.getElementById('legend');
                    legend.innerHTML = '<strong>Votre position</strong> </br>Latitude : ' + pos.lat + ' - Longitude : ' + pos.lng;
                },
                function() {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Erreur: Le service de Géolocalisation est indidsponible.' :
        'Erreur: Votre navigateur ne supporte pas la geolocation.');
}

function geocodeLatLng(geocoder, map, infowindow) {
    var lat = document.getElementById('appbundle_observation_latitude').value;
    var lng = document.getElementById('appbundle_observation_longitude').value;
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
    geocoder.geocode({'location': latlng}, function(results, status) {
        $(appbundle_observation_commune).val(results[1].formatted_address);
        $(address).val(results[1].formatted_address);
        if (status === 'OK') {
            if (results[1]) {
                map.setZoom(11);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent(results[1].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('Aucun résultat');
            }

        } else {
            window.alert('Erreur de Géolocalisation : ' + status);
        }
    });
}

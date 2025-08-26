function LoadCount() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        url: '/Getlistloca',
        success: function (data) {
            console.log("Success");
            if (data.total > 0) {
                $('#spnCart').text(data.total);

                var lstproduct = $("#lstproduct");
                var result = "";
                lstproduct.html('');

                data.data.forEach((item, index) => {
                    result +=
                        '<div class="col-md-3" style="margin-bottom: 15px;">' +
                        '<div style="position: relative;background-color: black;">' +
                        '<img class="img-loca" src=" ' + item.Image + '  " width="100%" height="80" />' +
                        '<div class="icon-close" ><a href="#" onclick="Delele(' + item.ID + ')"><i class="fa fa-times" style="color: white"></a></i></div>' +
                        '</div>' +
                        '<div>' +
                        '<div class="div-text">' +
                        '<a href="/' + item.MenuAlias + '/' + item.Alias + ' " class="link-loca">' +
                        '<h5 style="color: #ffffff">' + item.Title + '</h5>' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                });
                console.log(result);
                lstproduct.html(result);

            } else {
                $('#spnCart').html('0');
                var lstproduct = $("#lstproduct");
                var results = "<h5>You do not like anywhere.</h5>";
                lstproduct.html(results);

            }
        },
        error: function (data) {
            console.log("Error");
        }
    });
}
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'autohide': 1,
            'loop': 1,
            'wmode': 'opaque'
        },
        videoId: 'f9sg_HhSa-Y',
        height: '420',
        width: '780',
        events: {
            'onReady': onPlayerReady
        }
    });
}


// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.mute();
    //event.target.setPlaybackRate(0.5);
}

function Delele(ID) {
    
    $.ajax({
        url: 'demo',
        type: 'POST',
        dataType: 'json',
        data: {
            id: ID
        },
        success: function (result) {
                    LoadCount();
            },
             error: function (ex) {
                alert("error");
        }
    });
    //$.ajax(
    //    {
    //        type: "POST",
    //        url: "/LastView/Delete/" + ID,
    //        dataType: "json",

    //        success: function (result) {
    //                LoadCount();
    //        },
    //         error: function (ex) {
    //            alert("error");
    //        }
    //    });

}





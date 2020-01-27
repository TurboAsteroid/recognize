$(function() {
    var localstream;
    var snapshot;

    function cameraConnect(callback) {
        navigator.getMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
        );
        if (!navigator.getMedia) {
            displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
        }
        else {
            navigator.getMedia(
                {
                    video: true
                },
                function (stream) {
                    localstream = stream;
                    video[0].srcObject = localstream;
                    video[0].onloadedmetadata = function(e) {
                         callback();
                    };

                    video[0].play();
                },
                function (err) {
                    displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
                }
            );
        }
    }

    var video = $('#camera-stream'),
        image = $('#snap'),
        start_camera = $('#start-camera'),
        controls = $('.controls'),
        take_photo_btn = $('#take-photo'),
        cameraon_btn = $('#cameraon'),
        download_photo_btn = $('#download-photo'),
        error_message = $('#error-message');

    cameraConnect(function () {});
    take_photo_btn.show();

    // cameraon_btn.on("click", function (e) {
    //     e.preventDefault();
    //     cameraon_btn.hide();
    //     image.hide();
    //     take_photo_btn.show();
    //     cameraConnect(function () {});
    // });

    take_photo_btn.on("click", function (e) {
        e.preventDefault();
        /*cameraConnect(function () {
            snapshot = takeSnapshot();
            localstream.getTracks()[0].stop();
            image.attr('src', snapshot).addClass("visible");
            var filename = socketid + " - "+ Date.now() + ".png";
            socket.emit('sendimg', filename + "|||***|||" + (snapshot + '').replace(/^data:image\/png;base64,/,""));

            download_photo_btn.removeClass("disabled");
            download_photo_btn.attr("href", snapshot);
        });*/


        snapshot = takeSnapshot();
        //localstream.getTracks()[0].stop();
        //image.attr('src', snapshot).addClass("visible");
        var filename = socketid + " - "+ Date.now() + ".png";
        socket.emit('sendimg', filename + "|||***|||" + (snapshot + '').replace(/^data:image\/png;base64,/,""));


        //image.show();
        //cameraon_btn.show();
        //take_photo_btn.hide();

        //download_photo_btn.removeClass("disabled");
        //download_photo_btn.attr("href", snapshot);
    });

    function takeSnapshot() {
        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');
        // var width = video.width(),
        //     height = video.height();
        // var width = 2592,
        //     height = 1944;
        var width = 960,
            height = 720;
        console.log(width, height)
        if (width && height) {
            hidden_canvas.width = width;
            hidden_canvas.height = height;
            context.drawImage(video[0], 0, 0, width, height);
            return hidden_canvas.toDataURL('image/png');
        }
    }

    function displayErrorMessage(error_msg, error) {
        error = error || "";
        if (error) {
            console.log(error);
        }
        error_message.text(error_msg);
        hideUI();
        error_message.addClass("visible");
    }

    function hideUI() {
        controls.removeClass("visible");
        start_camera.removeClass("visible");
        video.removeClass("visible");
        snap.classList.remove("visible");
        error_message.removeClass("visible");
    }

    function changeInfoTmp(user) {
        $('.buttons').show();
        var img = $('<img id="dynamic">');
        img.attr('src', "/face_tmp/" + user["emp_id"] + "/" + user["emp_id"] + ".jpg");
        $('#imagediv').html("").append(img);

        $('span.name1').text(user['last_name']);
        $('span.name2').text(user['first_name']);
        //$('span.name3').text(user.StoreName7);
        //$('span.position').text(user.StoreName8);
    }
    function unknownInfo() {
        $('span.name1').text("Неизвестный");
        $('span.name2').text("");
        $('span.name3').text("");
        $('span.position').text("");
        $('#imagediv').html("");
    }
    function clearInfo() {
        $('span.name1').text("");
        $('span.name2').text("");
        $('span.name3').text("");
        $('span.position').text("");
        $('#imagediv').html("");
    }

    var socketid = false;
    var socket = io('https://10.1.100.33/');
    socket.on('connect', function(){
        console.log("::::::::: Client Connect", socket.id);
        socketid = socket.id;
    });
    socket.on('disconnect', function(){
        console.log("::::::::: Client disconnect");
    });
    
    var answerData;
    socket.on('pythonanswer', function(data){

        console.log('answerData', data)
        answerData = data;
        if (data['first_name']) {
            changeInfoTmp(data)
        } else {
            unknownInfo();
        }
    });
    
    $('.buttons button').on("click", function () {
        console.log('answerData', answerData)
        $.post( "/logphoto/", { photo: answerData.photo, status: $(this).attr("param"), user: answerData.emp_id} , function() {
            $('.buttons').hide();
            clearInfo();
        });
    });

    // $("input:file").change(function (){
    //     input = $(this)[0];
    //     if (input.files && input.files[0]) {
    //         console.log(input.files[0]);
    //         var reader = new FileReader();
    //         reader.onload = function (e) {
    //             image.attr('src', e.target.result).addClass("visible");
    //             var filename = socketid + " - "+ Date.now() + " - " + input.files[0].name;
    //             var re = new RegExp("^data:" + input.files[0].type + ";base64,","g");
    //             socket.emit('sendimg', filename + "|||***|||" + (e.target.result + '').replace(re,""));
    //         };
    //         reader.readAsDataURL(input.files[0]);
    //     }
    // });
});
// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
// Write your JavaScript code.

$(document).ready(function () {
    // Global variables for exam, recording, and UI functionality.
    var ExmID = 0;
    var Score = null;
    var Status = null;
    var QuestionID = 0;
    var AnswerID = 0;
    var Duration = 0;
    var index = 0;
    var qIndex = 0;
    var objData = [];
    var result = [];
    var checkTime = [];
    var objReport = null;

    // Updated video constraints:
    // Use 'frameRate' (with a capital R) and relaxed 'ideal' values.
    var constraints = {
        audio: true,
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 60 }
        }
    };

    // DOM element references.
    var recBtn = document.querySelector('button#btnStart');
    var stopBtn = document.querySelector('button#btnSubmit');
    var liveVideoElement = document.querySelector('#gum');

    // Initial UI state.
    $('#ddlExam').prop('disabled', false);
    $('#btnStart').prop('disabled', false);
    $('#btnSubmit').prop('disabled', false);
    $('#btnSave').prop('disabled', true);
    $('#eqMain button.w3-left').prop('disabled', true);
    $('#eqMain button.w3-right').prop('disabled', true);
    $("#eqReport").children().prop('disabled', true);
    $('#eqReport a').removeAttr("href");
    $('#eqReport i').addClass("w3-opacity-max");
    $("#eqScore").children().prop('disabled', true);

    // Recording-related globals.
    var mediaRecorder;
    var chunks = [];
    var count = 0;
    var localStream = null;
    var soundMeter = null;
    var containerType = "video/webm"; // Defaults to webm. May switch to mp4 on Safari.

    // Helper function to stop and release any existing local stream.
    function stopLocalStream() {
        if (localStream) {
            localStream.getTracks().forEach(function (track) {
                track.stop();
            });
            localStream = null;
        }
    }

    // Check if getUserMedia is supported.
    if (!navigator.mediaDevices.getUserMedia) {
        alert('navigator.mediaDevices.getUserMedia not supported on your browser, use the latest version of Firefox or Chrome');
    } else {
        if (window.MediaRecorder === undefined) {
            alert('MediaRecorder not supported on your browser, use the latest version of Firefox or Chrome');
        } else {
            // Request access to the camera and microphone with updated constraints.
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function (stream) {
                    // Stop any existing stream (if necessary) before setting the new stream.
                    stopLocalStream();
                    localStream = stream;

                    // Set up event listeners on each track to log when they end.
                    localStream.getTracks().forEach(function (track) {
                        if (track.kind === "audio") {
                            track.onended = function (event) {
                                console.log("Audio track ended: readyState=" + track.readyState + ", muted=" + track.muted);
                            };
                        }
                        if (track.kind === "video") {
                            track.onended = function (event) {
                                console.log("Video track ended: readyState=" + track.readyState + ", muted=" + track.muted);
                            };
                        }
                    });

                    // Assign the stream to the video element and start playback.
                    liveVideoElement.srcObject = localStream;
                    liveVideoElement.play();

                    // Initialize AudioContext for sound metering.
                    try {
                        window.AudioContext = window.AudioContext || window.webkitAudioContext;
                        window.audioContext = new AudioContext();
                    } catch (e) {
                        console.log('Web Audio API not supported.');
                    }

                    // Set up the sound meter.
                    soundMeter = new SoundMeter(window.audioContext);
                    soundMeter.connectToSource(localStream, function (e) {
                        if (e) {
                            console.log(e);
                            return;
                        }
                        // Optionally, log sound levels here.
                        // setInterval(function() { console.log(Math.round(soundMeter.instant.toFixed(2) * 100)); }, 100);
                    });

                }).catch(function (err) {
                    // Enhanced error handling to catch NotReadableError.
                    console.error('Error accessing camera and microphone:', err.name, err.message);
                    if (err.name === "NotReadableError") {
                        alert("The camera or microphone is already in use or not accessible. Please close any other applications using it and try again.");
                    } else {
                        alert("Error accessing camera and microphone: " + err.name + " - " + err.message);
                    }
                });
        }
    }

    // Populate exam dropdown via AJAX.
    $.ajax({
        type: "GET",
        url: "/api/Exams",
        data: "{}",
        success: function (data) {
            var string = '<option value="-1">--- Please Select ---</option>';
            for (var i = 0; i < data.length; i++) {
                string += '<option value="' + data[i].examID + '">' + data[i].name + '</option>';
            }
            $("#ddlExam").html(string);
        }
    });

    // Start the exam on button click.
    $('#btnStart').click(function () {
        if ($("#ddlExam").val() > 0) {
            $('#ddlExam').prop('disabled', true);
            $('#btnStart').prop('disabled', true);
            $('#btnSave').prop('disabled', false);
            ExmID = $("#ddlExam").val();
            $.get('/api/Exam/', { ExamID: ExmID }, function (data) {
                Duration = data.duration;
                StartTimer(Duration, checkTime);
                StartRecord();
                PopulateQuestions(ExmID);
            });
        } else {
            $.alert({
                icon: 'fa fa-warning',
                type: 'orange',
                title: 'Select Skill',
                content: 'Please select your skill!',
                boxWidth: '40%',
                useBootstrap: false,
                closeIcon: true,
                closeIconClass: 'fa fa-close'
            });
        }
    });

    // Navigate to previous question.
    $('#btnPrev').click(function () {
        QuestionID = 0;
        AnswerID = 0;
        index = (index - 1) % qIndex;
        var count = index + 1;
        if (index <= qIndex - 1) {
            $('div#eqMain p').empty();
            var Ostring = "<div style='padding: 5px;' id='eqOption'>";
            $('#eqCount').html("(" + count + " of " + qIndex + ")");
            $('div#eqMain h3').html(objData.exam + " Quiz");
            $('div#eqMain h4').html("Question " + count + " : " + objData.questions[index].questionText);
            QuestionID = objData.questions[index].questionID;
            AnswerID = objData.questions[index].answer.optionID;
            let obj = result.find(o => o.QuestionID === QuestionID);
            for (var i in objData.questions[index].options) {
                if (!$.isEmptyObject(obj)) {
                    if (obj.SelectedOption == objData.questions[index].options[i].optionID) {
                        Ostring += "<input class='w3-radio' type='radio' name='option' value='" + objData.questions[index].options[i].optionID + "' checked><label> " + objData.questions[index].options[i].option + "</label><br/>";
                    } else {
                        Ostring += "<input class='w3-radio' type='radio' name='option' value='" + objData.questions[index].options[i].optionID + "'><label> " + objData.questions[index].options[i].option + "</label><br/>";
                    }
                } else {
                    Ostring += "<input class='w3-radio' type='radio' name='option' value='" + objData.questions[index].options[i].optionID + "'><label> " + objData.questions[index].options[i].option + "</label><br/>";
                }
            }
            Ostring += "</div>";
            $('div#eqMain p').append(Ostring);
            $('#eqMain button.w3-right').prop('disabled', false);
            if (index == 0) {
                $('#eqMain button.w3-left').prop('disabled', true);
            }
        }
    });

    // Navigate to next question.
    $('#btnNext').click(function () {
        QuestionID = 0;
        AnswerID = 0;
        index = (index + 1) % qIndex;
        var count = index + 1;
        if (index <= qIndex - 1) {
            $('div#eqMain p').empty();
            var Ostring = "<div style='padding: 5px;' id='eqOption'>";
            $('#eqCount').html("(" + count + " of " + qIndex + ")");
            $('div#eqMain h3').html(objData.exam + " Quiz");
            $('div#eqMain h4').html("Question " + count + " : " + objData.questions[index].questionText);
            QuestionID = objData.questions[index].questionID;
            AnswerID = objData.questions[index].answer.optionID;
            let obj = result.find(o => o.QuestionID === QuestionID);
            for (var i in objData.questions[index].options) {
                if (!$.isEmptyObject(obj)) {
                    if (obj.SelectedOption == objData.questions[index].options[i].optionID) {
                        Ostring += "<input class='w3-radio' type='radio' name='option' value='" + objData.questions[index].options[i].optionID + "' checked><label> " + objData.questions[index].options[i].option + "</label><br/>";
                    } else {
                        Ostring += "<input class='w3-radio' type='radio' name='option' value='" + objData.questions[index].options[i].optionID + "'><label> " + objData.questions[index].options[i].option + "</label><br/>";
                    }
                } else {
                    Ostring += "<input class='w3-radio' type='radio' name='option' value='" + objData.questions[index].options[i].optionID + "'><label> " + objData.questions[index].options[i].option + "</label><br/>";
                }
            }
            Ostring += "</div>";
            $('div#eqMain p').append(Ostring);
            $('#eqMain button.w3-left').prop('disabled', false);
            if (index == qIndex - 1) {
                $('#eqMain button.w3-right').prop('disabled', true);
            }
        }
    });

    // Save the selected answer.
    $('#btnSave').click(function () {
        var ans = {
            CandidateID: $('#eqCandidateID').text(),
            ExamID: ExmID,
            QuestionID: QuestionID,
            AnswerID: AnswerID,
            SelectedOption: $('input[name="option"]:checked').val()
        };
        if (result.some(item => item.QuestionID === QuestionID)) {
            UpdateItem(QuestionID);
        } else {
            result.push(ans);
        }
    });

    // Submit exam with confirmation.
    $('#btnSubmit').click(function () {
        $.confirm({
            icon: 'fa fa-warning',
            title: 'Submit Quiz',
            content: 'Are you sure you want to submit the quiz?',
            type: 'orange',
            closeIcon: true,
            closeIconClass: 'fa fa-close',
            boxWidth: '40%',
            useBootstrap: false,
            buttons: {
                Submit: {
                    text: 'Submit',
                    btnClass: 'btn-red',
                    action: function () {
                        $.post('/api/Score/', { objRequest: result }, function (data) {
                            if (data > 0) {
                                stop(checkTime);
                                StopRecord();
                                $('#btnSubmit').prop('disabled', true);
                                $("#eqReport").children().prop('disabled', false);
                                $("#eqReport a").attr("href", "/Score/Result");
                                $('#eqReport i').removeClass("w3-opacity-max");
                                $.alert({
                                    type: 'green',
                                    title: 'Success!',
                                    content: 'Please check the score.',
                                    boxWidth: '40%',
                                    useBootstrap: false,
                                    closeIcon: true,
                                    closeIconClass: 'fa fa-close'
                                });
                            } else {
                                $('#btnSubmit').prop('disabled', false);
                                $("#eqReport").children().prop('disabled', true);
                                $('#eqReport a').removeAttr("href");
                                $('#eqReport i').addClass("w3-opacity-max");
                                $.alert({
                                    type: 'red',
                                    title: 'Error!',
                                    content: 'Please try again.',
                                    boxWidth: '40%',
                                    useBootstrap: false,
                                    closeIcon: true,
                                    closeIconClass: 'fa fa-close'
                                });
                            }
                        });
                    }
                },
                Cancel: function () {
                    $(this).remove();
                }
            }
        });
    });

    // Display exam score details.
    $('.btnScore').click(function () {
        var request = {
            ExamID: $(this).closest("tr").find('td:eq(2)').text(),
            CandidateID: $('#hdnCandidateID').val(),
            SessionID: $(this).closest("tr").find('td:eq(1)').text()
        };
        Score = $(this).closest("tr").find('td:eq(4)').text();
        Status = $(this).closest("tr").find('td:eq(6)').text();
        $.post('/api/Report/', { argRpt: request }, function (data) {
            objReport = data;
            $('div#eqScore h3').html(data[0].exam + ' Test');
            $('div#eqScore .w3-container p:eq(0)').html('<strong>Candidate ID:</strong> ' + data[0].candidateID);
            $('div#eqScore .w3-container h5').html(data[0].message);
            $('div#eqScore .w3-container span').html('<strong>Date:</strong> ' + data[0].date);
            if (Status == "1") {
                $("#eqScore").children().prop('disabled', false);
            } else {
                Score = null;
                objReport = null;
                $("#eqScore").children().prop('disabled', true);
            }
        });
    });

    // Generate PDF report on button click.
    $('#btnReport').click(function () {
        var scoreFormat = {
            ExamID: objReport[0].examID,
            CandidateID: $('#hdnCandidateID').val(),
            SessionID: objReport[0].sessionID,
            Exam: objReport[0].exam,
            Date: objReport[0].date,
            Score: Score
        };
        $.post('/api/CreatePDF/', { argPDFRpt: scoreFormat }, function (data) {
            if (data.isSuccess) {
                window.open(data.path, '_blank');
            }
        });
    });

    // Image upload preview.
    $('#chooseFile').change(function () {
        var file = $('#chooseFile')[0].files[0].name;
        $('#noFile').text(file);
    });

    // Update an answer for the given question.
    function UpdateItem(QuestionID) {
        for (var i in result) {
            if (result[i].QuestionID == QuestionID) {
                result[i].CandidateID = $('#eqCandidateID').text();
                result[i].ExamID = ExmID;
                result[i].QuestionID = QuestionID;
                result[i].AnswerID = AnswerID;
                result[i].SelectedOption = $('input[name="option"]:checked').val();
                break;
            }
        }
    }

    // Populate exam questions.
    function PopulateQuestions(ExmID) {
        $.get('/api/Questions', { ExamID: ExmID }, function (data) {
            QuestionID = 0;
            AnswerID = 0;
            objData = data;
            var Ostring = "<div style='padding: 5px;' id='eqOption'>";
            qIndex = data.questions.length;
            $('#eqCount').html("(1 of " + qIndex + ")");
            $('div#eqMain h3').html(data.exam + " Quiz");
            $('div#eqMain h4').html("Question 1 : " + data.questions[0].questionText);
            QuestionID = data.questions[0].questionID;
            AnswerID = data.questions[0].answer.optionID;
            for (var i in data.questions[0].options) {
                Ostring += "<input class='w3-radio' type='radio' name='option' value='" + data.questions[0].options[i].optionID + "'><label> " + data.questions[0].options[i].option + "</label><br/>";
            }
            Ostring += "</div>";
            $('div#eqMain p').append(Ostring);
            $('#eqMain button.w3-right').prop('disabled', false);
        });
    }

    // Start the exam timer.
    function StartTimer(Duration, checkTime) {
        var deadline = new Date();
        deadline.setHours(deadline.getHours() + Duration);
        if (checkTime.length == 0) {
            var x = setInterval(function () {
                var now = new Date().getTime();
                var t = deadline.getTime() - now;
                var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((t % (1000 * 60)) / 1000);
                document.getElementById("timer").innerHTML = "Time : " + hours + ":" + minutes + ":" + seconds;
                if (t < 0) {
                    clearInterval(x);
                    document.getElementById("timer").innerHTML = "Time : 00:00:00";
                }
            }, 1000);
            checkTime.push(x);
        }
    }

    // Stop the exam timer.
    function stop(checkTime) {
        clearInterval(checkTime[0]);
        checkTime = [];
    }

    // Start recording with MediaRecorder.
    function StartRecord() {
        if (localStream == null) {
            alert('Could not get local stream from mic/camera');
        } else {
            chunks = [];
            console.log('Start recording...');
            var options = {};
            if (typeof MediaRecorder.isTypeSupported === 'function') {
                if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                    options = { mimeType: 'video/webm;codecs=vp9' };
                } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                    options = { mimeType: 'video/webm;codecs=h264' };
                } else if (MediaRecorder.isTypeSupported('video/webm')) {
                    options = { mimeType: 'video/webm' };
                } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                    containerType = "video/mp4";
                    options = { mimeType: 'video/mp4' };
                }
                console.log('Using mimeType: ' + options.mimeType);
                mediaRecorder = new MediaRecorder(localStream, options);
            } else {
                console.log('MediaRecorder.isTypeSupported is not supported, using default codecs.');
                mediaRecorder = new MediaRecorder(localStream);
            }

            mediaRecorder.ondataavailable = function (e) {
                console.log('Data available: size=' + e.data.size);
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onerror = function (e) {
                console.log('MediaRecorder error: ' + e);
            };

            mediaRecorder.onstart = function () {
                console.log('MediaRecorder started, state=' + mediaRecorder.state);
                localStream.getTracks().forEach(function (track) {
                    console.log(track.kind + " track: readyState=" + track.readyState + ", muted=" + track.muted);
                });
            };

            mediaRecorder.onstop = function () {
                console.log('MediaRecorder stopped, state=' + mediaRecorder.state);
                var recording = new Blob(chunks, { type: mediaRecorder.mimeType });
                PostBlob(recording);
            };

            mediaRecorder.onpause = function () {
                console.log('MediaRecorder paused, state=' + mediaRecorder.state);
            };

            mediaRecorder.onresume = function () {
                console.log('MediaRecorder resumed, state=' + mediaRecorder.state);
            };

            mediaRecorder.onwarning = function (e) {
                console.log('MediaRecorder warning: ' + e);
            };

            // Start recording and capture data every 1000ms.
            mediaRecorder.start(1000);
        }
    }

    // Stop recording and clear the video element.
    function StopRecord() {
        mediaRecorder.stop();
        liveVideoElement.srcObject = null;
    }

    // Post the recorded blob to the server via AJAX.
    function PostBlob(blob) {
        var formData = new FormData();
        formData.append('video-blob', blob);
        $.ajax({
            type: 'POST',
            url: "/Home/SaveRecoredFile",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result) {
                    console.log('Recording saved successfully.');
                }
            },
            error: function (result) {
                console.log(result);
            }
        });
    }
});

// Function for image upload preview.
function ShowImagePreview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgCandidate').prop('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

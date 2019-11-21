var width = window.innerWidth;
document.getElementById("my-video").width = width;
$(function() {
    var time = 0;
    var row = "";
    var category = "";
    var labels = "";
    var myPlayer = videojs('my-video');
    $('body').on('click', '.loadDataButton', function() {
        let data = $('#pastedData').val();
        let arrayData = data.split('\n');
        vidURL = arrayData[0].split('\t')[0];
        myPlayer.src({
            "type": "video/mp4",
            "src": vidURL
        });
        let row = [];
        let tableMatrix = "<tr><th>Label</th><th><a data-toggle='tooltip' title='Click on time-stamp to move to that time' data-placement='bottom'>Time-stamp</a></th><th>Remove</th></tr>";
        for (var i in arrayData) {
            row = arrayData[i].split('\t');
            tableMatrix += "<tr>";
            for (var j in row) {
                if (j == 1) {
                    tableMatrix += "<td>" + row[j] + "</td>";
                }
                if (j == 2) {
                    tableMatrix += "<td class='time_stamp'>" + row[j] + "</td>";
                }
            }
            tableMatrix += "<td><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></td></tr>"
        }
        $('#ticker table').html(tableMatrix);
    })

    function createList(labels) {
        var list = "";
        for (var i in labels) {
            list = list + "<li>" + labels[i] + "</li>";
        }
        return list;
    }
    $('body').on('click', '.load-video-but', function(event) {
        event.preventDefault();
        vidURL = $('#videoID').val();
        if ($('#videoID').val() == "") {
            alert("Enter a video ID");
        } else {
            $('#videoID').val("");
            myPlayer.src({
                "type": "video/mp4",
                "src": vidURL
            })
        };
        $('#ticker table').html("<table><tr><th>Label</th><th>Time-stamp</th><th>Action</th></tr></table>");
        $('#labels ul li').removeClass('selected');
        $('.list-group a').removeClass('active');
        $('.list-group a.first').addClass('active');
    })

    $('body').on('click', '#download_output', function() {
        var rows = Array.prototype.map.call(document.querySelectorAll('#dataTable tr'), function(tr) {
            return Array.prototype.map.call(tr.querySelectorAll('td:not(:last-child)'), function(td) {
                return td.innerHTML;
            });
        });
        rows.shift();
        var videoName = myPlayer.currentSrc().split('/').pop();
        for (var i in rows) {
            rows[i] = [videoName].concat(rows[i]);
        }
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        console.log(rows);
        var encodedUri = encodeURI(csvContent);
        var link = document.getElementById('download_output');

        link.setAttribute("href", encodedUri);
        link.setAttribute("download", videoName + ".csv");
    })

    $('body').on('click', '#labels ul li', function(event) {
        event.preventDefault();
        time = myPlayer.currentTime().toFixed(2);
        $(this).addClass('selected');
        row = "<tr><td>" + $(this).html() + "</td><td class='time_stamp'>" + time + "</td><td><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></td></tr>"
        $('#ticker table').append(row);
    })

    $('body').on('click', '.time_stamp', function() {
        console.log($(this).html());
        myPlayer.currentTime($(this).html());
        myPlayer.play();
    })
    $('body').on('click', '.glyphicon-remove', function() {
        $(this).closest('tr').remove();
    });
    $('body').on('click', '.clear', function() {
        $('#ticker table').html("<table><tr><th>Label</th><th>Time-stamp</th><th>Action</th></tr></table>");
        $('#labels ul li').removeClass('selected');
    });
    $('body').on('click', '.instructions-but', function() {
        myPlayer.pause();
    })
});

function createList(labels) {
    var list = "";
    for (var i in labels) {
        list = list + "<li>" + labels[i] + "</li>";
    }
    return list;
}
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

$('body').on('click', '#addLabel', function() {
    let newLabels = new Array($('#labelInput').val());
    $('#labels ul').append(createList(newLabels));
})

var videoplayer = videojs('my-video');

function playVideoTeaserFrom(video_clips, index) {
    //get your videoplayer
    videoplayer.currentTime(video_clips[index][0]); //not sure if player seeks to seconds or milliseconds
    videoplayer.play();
    
    var stopVideoAfter = (video_clips[index][1] - video_clips[index][0]) * 1000; //* 1000, because Timer is in ms
    setTimeout(function() {
        if (index == video_clips.length - 1) {
            videoplayer.pause();
        } else {
            playVideoTeaserFrom(video_clips, index + 1);
        }

    }, stopVideoAfter);
}

$('body').on('click', '.make-clip', function() {
    let clips = Array.prototype.map.call(document.querySelectorAll('#dataTable tr'), function(tr) {
        return Array.prototype.map.call(tr.querySelectorAll('td:not(:last-child)'), function(td) {
            return td.innerHTML;
        });
    });

    clips.shift();
    video_clips = [];
    for (let i = 0; i < clips.length / 2; i++) {
        //console.log([ parseInt(clips[i*2][1]), parseInt(clips[i*2 + 1][1])]);
        video_clips.push(
            [ parseInt(clips[i*2][1]), parseInt(clips[i*2 + 1][1])]
            )
    }
    playVideoTeaserFrom(
        video_clips
    , 0); //this event will call the function after page was loaded
})
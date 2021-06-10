var newEvent;
var editEvent;

$(document).ready(function () {
    const roomcolors = {
        1: "#54478c",
        2: "#2c699a",
        3: "#048ba8",
        6: "#0db39e",
        9: "#16db93",
        10: "#db3a34",
        11: "#da627d",
        13: "#a53860"
    }

    function validateTxt(txt) {
        //至少
        var re = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if (re.test(txt)) {
            return true
        } else {
            return false
        }
    }

    function fetchandAlert(url, method, obj, txt) {
        fetch(url, {
                method: method,
                mode: 'cors',
                body: JSON.stringify(obj)
            })
            .then(res => res.text())
            .then(res => {
                $("#pre-text").text(txt);
                $("#insavetext").text(res);
                window.setTimeout(function () {
                    $("#alertbox").fadeIn(1000, 'linear').fadeOut(2500, function () {
                        $(this).hide();
                    });
                }, 100)
            })
    }

    function getRoomlist() {
        $.ajax({
                url: getRooms,
                type: 'GET',
                datatype: 'json'
            })
            .done(data =>
                $.each(data, function (key, value) {
                    $('#getRooms, #getRoomsEdit')
                        .append($("<option></option>")
                            .attr("value", value.RomeId)
                            .text(value.Name));
                })
            ).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus)
            });
    }
    getRoomlist();

    function isAnOverlapEvent(event) {
        var result;
        $.ajax({
                url: isoverlap,
                type: 'GET',
                data: {
                    roomId: event.roomId,
                    monst: moment(event.start).startOf('month').format('YYYY-MM-DD hh:mm'),
                    monEd: moment(event.end).endOf('month').format('YYYY-MM-DD hh:mm'),
                    newSt: event.start,
                    newEn: event.end
                },
                datatype: 'json',
                async: false
            })
            .done(data => {
                result = data;
                
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus)
            });
        return result;
    }
    var calendar = $('#calendar').fullCalendar({

        eventRender: function (event, element, view) {

            var startTimeEventInfo = moment(event.start).format('HH:mm');
            var endTimeEventInfo = moment(event.end).format('HH:mm');
            var displayEventDate;

            // element.find(".fc-content").css('padding-left', '55px');
            // element.find(".fc-content").after($("<div class=\"fc-avatar-image\"></div>").html('<img src="image/group.png" />'));
            displayEventDate = startTimeEventInfo + " - " + endTimeEventInfo;
            element.popover({
                title: '<div class="popoverTitleCalendar" style="background-color:' + event.backgroundColor + '; color:#ffffff">' + event.title + '</div>',
                content: '<div class="popoverInfoCalendar">' +
                    '<p><strong>主席:</strong> ' + event.host + '</p>' +
                    '<p><strong>會議時間:</strong> ' + displayEventDate + '</p>' +
                    '<div class="popoverDescCalendar"><strong>內容:</strong> ' + event.note + '</div>' +
                    '</div>',
                delay: {
                    show: "200",
                    hide: "50"
                },
                trigger: 'hover',
                placement: 'top',
                html: true,
                container: 'body'
            });

        },
        customButtons: {
            printButton: {
                icon: 'print',
                click: function () {
                    window.print();
                }
            }
        },
        header: {
            left: 'today, prevYear, nextYear, printButton',
            center: 'prev, title, next',
            right: 'month,agendaWeek,agendaDay,listWeek',
        },
        views: {
            month: {
                columnFormat: 'dddd'
            },
            agendaWeek: {
                columnFormat: 'ddd M/D',
                eventLimit: false
            },
            agendaDay: {
                columnFormat: 'dddd',
                eventLimit: false
            },
            listWeek: {
                columnFormat: ''
            }
        },

        loading: function (bool) {
            //alert('events are being rendered');
        },
        eventAfterAllRender: function (view) {
            if (view.name == "month") {
                $(".fc-content").css('height', 'auto');
            }
        },
        eventLimitClick: function (cellInfo, event) {},
        eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
            $('.popover.fade.top').remove();
        },
        eventDragStart: function (event, jsEvent, ui, view) {
            var draggedEventIsAllDay;
            draggedEventIsAllDay = event.allDay;
        },
        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
            let updateObj = {
                "host": event.host,
                "attendees": event.attendees,
                "title": event.title,
                "roomId": event.id,
                "start": event.start.format('YYYY-MM-DD HH:mm'),
                "end": event.end.format('YYYY-MM-DD HH:mm'),
                "note": event.note,
                "timeId": moment().format('YYYY-MM-DD HH:mm:ss')
            }
            // fetchandAlert(updateEventURL + event.id, "PUT", updateObj, "太好了!");
        },
        unselect: function (jsEvent, view) {},
        select: function (startDate, endDate, jsEvent, view) {

            var today = moment();
            var startDate;
            var endDate;

            if (view.name == "month") {
                startDate.set({
                    hours: today.hours(),
                    minute: today.minutes()
                });
                startDate = moment(startDate).format('YYYY-MM-DD HH:mm');
                endDate = moment(endDate).subtract(1, 'days');
                endDate.set({
                    hours: today.hours() + 1,
                    minute: today.minutes()
                });
                endDate = moment(endDate).format('YYYY-MM-DD HH:mm');
            } else {
                startDate = moment(startDate).format('YYYY-MM-DD HH:mm');
                endDate = moment(endDate).format('YYYY-MM-DD HH:mm');
            }


            var $contextMenu = $("#contextMenu");
            var HTMLContent = '<ul class="dropdown-menu dropNewEvent" role="menu" aria-labelledby="dropdownMenu" style="display:block;position:static;margin-bottom:5px;font-size:1.6rem;">' +
                '<li onclick=\'newEvent("' + startDate + '","' + endDate + '","' + "Appointment" + '")\'> <a tabindex="-1" href="#">新增活動</a></li>' +
                '<li class="divider"></li>' +
                '<li><a tabindex="-1" href="#">關閉</a></li>' +
                '</ul>';
            $(".fc-body").unbind('click');
            $(".fc-body:not(.fc-event-container)").on('click', 'td', function (e) {
                e.preventDefault();
                document.getElementById('contextMenu').innerHTML = (HTMLContent);
                $contextMenu.addClass("contextOpened");
                $contextMenu.css({
                    display: "block",
                    left: e.pageX,
                    top: e.pageY
                });
                return false;
            });

            $contextMenu.on("click", "a", function (e) {
                e.preventDefault();
                $contextMenu.removeClass("contextOpened");
                $contextMenu.hide();
            });

            $('body').on('click', function () {
                $contextMenu.hide();
                $contextMenu.removeClass("contextOpened");
            });

            //newEvent(startDate, endDate);

        },
        eventClick: function (event, jsEvent, view) {

            editEvent(event);

        },
        locale: 'zh-tw', // 改變顯示語言
        nextDayThreshold: "09:00:00",
        allDaySlot: false,
        displayEventTime: true,
        displayEventEnd: true,
        firstDay: 1,
        weekNumbers: false,
        selectable: true,
        weekNumberCalculation: "ISO",
        eventLimit: true,
        eventLimitClick: 'week', //popover
        navLinks: true,
        defaultDate: '2021-05-21',
        timeFormat: 'HH:mm',
        defaultTimedEventDuration: '01:00:00',
        editable: true,
        minTime: '08:30:00',
        maxTime: '18:00:00',
        slotLabelFormat: 'HH:mm',
        weekends: true,
        nowIndicator: true,
        dayPopoverFormat: 'dddd DD MM',
        longPressDelay: 0,
        eventLongPressDelay: 0,
        selectLongPressDelay: 0,
        eventOverlap: false,
        events: {
            url: getEventsURL,
            success: function (res) {
                let arrl = [];
                res.forEach(function (val) {
                    arrl.push({
                        "title": val.eTitle,
                        "id": val.id,
                        "start": moment(val.startDay).utc().format('YYYY-MM-DD HH:mm:ss').toString(),
                        "end": moment(val.endDay).utc().format('YYYY-MM-DD HH:mm:ss').toString(),
                        "note": val.note,
                        "host": val.host,
                        "attendees": val.attendees,
                        "roomId": val.roomId,
                        "overlap": false,
                        "backgroundColor": roomcolors[val.roomId],
                        "className": 'colorViewing'
                    })
                });
                return arrl;
            }
        }
    });

    $("#starts-at, #ends-at").datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        locale: "zh-tw",
        stepping: 30,
        enabledHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    });
    $(" #editStartDate, #editEndDate").datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        locale: "zh-tw",
        stepping: 30,
        enabledHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    });

    //CREATE NEW EVENT CALENDAR
    newEvent = function (start, end) {

        $("#contextMenu").hide();
        $('input#title').val("");
        $('#starts-at').val(start);
        $('#ends-at').val(end);
        $('#newEventModal').modal('show');

        var statusAllDay;
        var endDay;

        //GENERATE RAMDON ID - JUST FOR TEST - DELETE IT

        var eventId = 1 + Math.floor(Math.random() * 1000);
        //GENERATE RAMDON ID - JUST FOR TEST - DELETE IT

        $('#save-event').unbind();
        $('#save-event').on('click', function () {
            var host = $('input#host').val().trim();
            var title = $('input#title').val().trim();
            var attendees = $('input#attendees').val();
            var roomId = $('#getRooms option').filter(':selected').val();
            var startDay = $('#starts-at').val();
            //Wed 28 Feb 2018 13:46
            var endDay = $('#ends-at').val();
            var note = $('#add-event-desc').val().trim();

            //驗證
            if (startDay > endDay) {
                $('#starts-at').val("開始時間晚於結束時間，請重新輸入！");
                return;
            }
            if (!validateTxt(title)) {
                alert("必填未填或輸入含特殊符號請修正!");
                return;
            }

            var eventData = {
                title: title,
                start: startDay,
                end: endDay,
                attendees: attendees,
                timeId: moment().format('YYYY-MM-DD HH:mm:ss'),
                note: note,
                roomId: roomId,
                backgroundColor: roomcolors[roomId],
                host: host,
                className: 'colorViewing'
            };

            if(isAnOverlapEvent(eventData) === "True"){
                $('.showTxt').fadeIn(200).delay(1200).fadeOut(200);                
                return;
            }

            // fetchandAlert(addEventURL, 'POST', eventData,"太棒了!");

            $("#calendar").fullCalendar('renderEvent', eventData, true);
            $('#newEventModal').find('input, textarea').val('');
            $('#newEventModal').find('input:checkbox').prop('checked', false);
            $('#ends-at').prop('disabled', false);
            $('#newEventModal').modal('hide');

        });
    }

    //EDIT EVENT CALENDAR

    editEvent = function (event, element, view) {

        $('.popover.fade.top').remove();
        $(element).popover("hide");
        //$(".dropdown").hide().css("visibility", "hidden");
        $('#editHost').val(event.host);
        $('#editAttendees').val(event.attendees);
        $('#getRoomsEdit option[value=' + event.roomId + ']').prop("selected", true);
        $('#editTitle').val(event.title);
        $('#editStartDate').val(event.start.format('YYYY-MM-DD HH:mm'));
        $('#editEndDate').val(event.end.format('YYYY-MM-DD HH:mm'));
        $('#edit-event-desc').val(event.note);
        $('.eventName').text(":" + event.title);
        $('#editEventModal').modal('show');
        $('#updateEvent').unbind();
        $('#updateEvent').on('click', function () {
            var host = $('input#editHost').val().trim();
            var attendees = $('input#editAttendees').val();
            var roomId = $('#getRoomsEdit option').filter(':selected').val();
            var title = $('input#editTitle').val().trim();
            var startDate = $('input#editStartDate').val();
            var endDate = $('input#editEndDate').val();
            var note = $('#edit-event-desc').val().trim();
            if (!validateTxt(title)) {
                alert("必填未填或輸入含特殊符號請修正!");
                return;
            }

            $('#editEventModal').modal('hide');
            var eventData;
            var updateObj = {
                "host": host,
                "attendees": attendees,
                "roomId": roomId,
                "title": title,
                "start": startDate,
                "end": endDate,
                "note": note,
                "timeId": moment().format('YYYY-MM-DD HH:mm:ss')
            };

            event.host = host
            event.roomId = roomId
            event.backgroundColor = roomcolors[roomId]
            event.attendees = attendees
            event.title = title
            event.start = startDate
            event.end = endDate
            event.note = note

            $("#calendar").fullCalendar('updateEvent', event);
            // fetchandAlert(updateEventURL + event.id, 'PUT', updateObj, "完成!");
        });

        $('#deleteEvent').on('click', function () {
            $('#deleteEvent').unbind();
            if (event._id.includes("_fc")) {
                fetchandAlert(updateEventURL + event.id, "DELETE", null, "清潔溜溜!")
                $("#calendar").fullCalendar('removeEvents', [event._id]);
            } else {
                fetchandAlert(updateEventURL + event.id, "DELETE", null, "清潔溜溜!")
                $("#calendar").fullCalendar('removeEvents', [event._id]);
            }
            $('#editEventModal').modal('hide');
        });
    }

});
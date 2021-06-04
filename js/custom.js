var newEvent;
var editEvent;

$(document).ready(function () {

    var calendar = $('#calendar').fullCalendar({

        eventRender: function (event, element, view) {

            var startTimeEventInfo = moment(event.start).format('HH:mm');
            var endTimeEventInfo = moment(event.end).format('HH:mm');
            var displayEventDate;

            element.find(".fc-content").css('padding-left', '55px');
            element.find(".fc-content").after($("<div class=\"fc-avatar-image\"></div>").html('<img src="image/group.png" />'));

            displayEventDate = startTimeEventInfo + " - " + endTimeEventInfo;
            element.popover({
                title: '<div class="popoverTitleCalendar" style="background-color:#47acdf' + '; color:#ffffff">' + event.title + '</div>',
                content: '<div class="popoverInfoCalendar">' +
                    '<p><strong>主席:</strong> ' + event.host + '</p>' +
                    '<p><strong>會議時間:</strong> ' + displayEventDate + '</p>' +
                    '<div class="popoverDescCalendar"><strong>內容:</strong> ' + event.note + '</div>' +
                    '</div>',
                delay: {
                    show: "800",
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
            $('.popover.fade.top').remove();
        },
        unselect: function (jsEvent, view) {
            //$(".dropNewEvent").hide();
        },
        // dayClick: function (startDate, jsEvent, view) {

        //     var today = moment();
        //     var startDate;

        //     if(view.name == "month"){

        //      startDate.set({ hours: today.hours(), minute: today.minutes() });
        //      alert('Clicked on: ' + startDate.format());

        //     }

        // },
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

            var HTMLContent = '<ul class="dropdown-menu dropNewEvent" role="menu" aria-labelledby="dropdownMenu" style="display:block;position:static;margin-bottom:5px;">' +
                '<li onclick=\'newEvent("' + startDate + '","' + endDate + '","' + "Appointment" + '")\'> <a tabindex="-1" href="#">新增活動</a></li>' +
                '<li class="divider"></li>' +
                '<li><a tabindex="-1" href="#">關閉</a></li>' +
                '</ul>';

            $(".fc-body").unbind('click');
            $(".fc-body").on('click', 'td', function (e) {

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
        minTime: '07:00:00',
        maxTime: '18:00:00',
        slotLabelFormat: 'HH:mm',
        weekends: true,
        nowIndicator: true,
        dayPopoverFormat: 'dddd DD MM',
        longPressDelay: 0,
        eventLongPressDelay: 0,
        selectLongPressDelay: 0,
        events: {
            url: getEvents,            
            success: function(res) {    
                let arrl = [];                             
                res.forEach(function(val){
                    arrl.push({"title":val.eTitle,"id":val.id,"start":moment(val.startDay).utc().format('YYYY-MM-DD HH:mm:ss').toString(),              
                    "end":moment(val.endDay).utc().format('YYYY-MM-DD HH:mm:ss').toString(), "note":val.note,"host":val.host, "attendees":val.attendees,"className":'colorViewing'            
                    })    
                });                
                return arrl; 
            }
        }
        // events: [{
            // id: 11,
            // title: 'Michigan University',
            // note: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
            // start: '2021-05-22 09:30',
            // end: '2021-05-22 10:00',
            // host: 'Caio Vitorelli',
            // attendees:'Beauty',
            // className: 'colorViewing'
        // }, {
        //     _id: 12,
        //     title: 'California Polytechnic',
        //     description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
        //     start: '2018-03-01T12:30',
        //     end: '2018-03-01T15:30',
        //     host: 'Adam Rackham',
        //     attendees:'Beast',
        //     className: 'colorViewing',

        // }, {
        //     _id: 13,
        //     title: 'Michigan University',
        //     description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
        //     start: '2018-03-03 09:30',
        //     end: '2018-03-03 10:00',
        //     host: 'Caio Vitorelli',
        //     attendees:'Beauty',
        //     className: 'colorViewing',

        // }, {
        //     _id: 14,
        //     title: 'Vermont University',
        //     description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
        //     start: '2018-03-06 09:30',
        //     end: '2018-03-06 12:00',
        //     attendees:'Tree',
        //     className: 'colorViewing',
        //     host: 'Peter Grant'            
        // }]

    });

    $("#starts-at, #ends-at").datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        locale: "zh-tw"
    });

    //var minDate = moment().subtract(0, 'days').millisecond(0).second(0).minute(0).hour(0);

    $(" #editStartDate, #editEndDate").datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        locale: "zh-tw"
        //minDate: minDate
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

        // $('.allDayNewEvent').on('change', function () {

        //     if ($(this).is(':checked')) {
        //         statusAllDay = true;
        //         var endDay = $('#ends-at').prop('disabled', true);
        //     } else {
        //         statusAllDay = false;
        //         var endDay = $('#ends-at').prop('disabled', false);
        //     }
        // });

        //GENERATE RAMDON ID - JUST FOR TEST - DELETE IT
        var eventId = 1 + Math.floor(Math.random() * 1000);
        //GENERATE RAMDON ID - JUST FOR TEST - DELETE IT

        $('#save-event').unbind();
        $('#save-event').on('click', function () {

            var title = $('input#title').val();
            var attendees = $('input#attendees').val();
            var startDay = $('#starts-at').val();
            //Wed 28 Feb 2018 13:46
            var endDay = $('#ends-at').val();
            if(startDay > endDay) {
                $('#starts-at').val("開始時間晚於結束時間，請重新輸入！");
                return;
            }
            var note = $('#add-event-desc').val();
            if (title) {
                var eventData = {
                    title: title,
                    start: startDay,
                    end: endDay,
                    attendees: attendees,
                    note: note,
                    host: 'Doran'
                };
                fetch(addEvent, {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify(eventData)
                    })
                    .then(res => res.text())
                    .then(res => console.log(res))


                $("#calendar").fullCalendar('renderEvent', eventData, true);
                $('#newEventModal').find('input, textarea').val('');
                $('#newEventModal').find('input:checkbox').prop('checked', false);
                $('#ends-at').prop('disabled', false);
                $('#newEventModal').modal('hide');
            } else {
                alert("Title can't be blank. Please try again.")
            }
        });
    }

    //EDIT EVENT CALENDAR

    editEvent = function (event, element, view) {

        $('.popover.fade.top').remove();
        $(element).popover("hide");

        //$(".dropdown").hide().css("visibility", "hidden");

        $('#editHost').val(event.host);
        $('#editAttendees').val(event.attendees);
        $('#editTitle').val(event.title);
        $('#editStartDate').val(event.start.format('YYYY-MM-DD HH:mm'));
        $('#editEndDate').val(event.end.format('YYYY-MM-DD HH:mm'));
        $('#edit-event-desc').val(event.note);
        $('.eventName').text(event.title);
        $('#editEventModal').modal('show');
        $('#updateEvent').unbind();
        $('#updateEvent').on('click', function () {
            var host = $('input#editHost').val();
            var attendees = $('input#editAttendees').val();
            var title = $('input#editTitle').val();
            var startDate = $('input#editStartDate').val();
            var endDate = $('input#editEndDate').val();
            var note = $('#edit-event-desc').val();
            $('#editEventModal').modal('hide');
            var eventData;
            if (title) {
                event.host = host
                event.attendees = attendees
                event.title = title
                event.start = startDate
                event.end = endDate
                event.note = note
                $("#calendar").fullCalendar('updateEvent', event);
                //edit sql

                fetch(addevent, {
                        method: 'PUT',
                        mode: 'cors',
                        body: JSON.stringify(eventData)
                    })
                    .then(res => res.text())
                    .then(res => console.log(res))

            } else {
                alert("Title can't be blank. Please try again.")
            }
        });

        $('#deleteEvent').on('click', function () {
            $('#deleteEvent').unbind();
            if (event._id.includes("_fc")) {
                $("#calendar").fullCalendar('removeEvents', [event._id]);
            } else {
                $("#calendar").fullCalendar('removeEvents', [event._id]);
            }
            $('#editEventModal').modal('hide');
        });
    }

});
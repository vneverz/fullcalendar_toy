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
        
            if (event.allDay == false) {
                displayEventDate = startTimeEventInfo + " - " + endTimeEventInfo;
            } else {
                displayEventDate = "All Day";
            }

            element.popover({
                title: '<div class="popoverTitleCalendar" style="background-color:#47acdf' + '; color:#ffffff">' + event.title + '</div>',
                content: '<div class="popoverInfoCalendar">' +
                    '<p><strong>主席:</strong> ' + event.host + '</p>' +
                    '<p><strong>會議時間:</strong> ' + displayEventDate + '</p>' +
                    '<div class="popoverDescCalendar"><strong>Description:</strong> ' + event.description + '</div>' +
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
                '<li onclick=\'newEvent("' + startDate + '","' + endDate + '","' + "Appointment" + '")\'> <a tabindex="-1" href="#">Add Appointment</a></li>' +            
                '<li onclick=\'newEvent("' + startDate + '","' + endDate + '","' + "Viewing" + '")\'> <a tabindex="-1" href="#">Add Viewing</a></li>' +
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
        allDaySlot: true,
        displayEventTime: true,
        displayEventEnd: true,
        firstDay: 1,
        weekNumbers: false,
        selectable: true,
        weekNumberCalculation: "ISO",
        eventLimit: true,
        eventLimitClick: 'week', //popover
        navLinks: true,
        defaultDate: '2018-03-07',
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

        events: [{
            _id: 1,
            title: 'Michigan University',
            description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
            start: '2018-03-07T09:30',
            end: '2018-03-07T10:00',
            host: 'Caio Vitorelli',
            attendees:'Beauty',
            className: 'colorViewing',
            allDay: false
        }, {
            _id: 2,
            title: 'California Polytechnic',
            description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
            start: '2018-03-01T12:30',
            end: '2018-03-01T15:30',
            host: 'Adam Rackham',
            attendees:'Beast',
            className: 'colorViewing',
            allDay: false
        }, {
            _id: 3,
            title: 'Vermont University 2',
            description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
            start: '2018-03-02',
            end: '2018-03-02',
            className: 'colorViewing',
            attendees:'Flower',
            host: 'Adam Rackham',
            allDay: true
        }, {
            _id: 4,
            title: 'Vermont University',
            description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
            start: '2018-03-06',
            end: '2018-03-06',
            attendees:'Tree',
            className: 'colorViewing',
            host: 'Peter Grant',
            allDay: true
        }, {
            _id: 5,
            title: 'Michigan High School',
            description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
            start: '2018-03-08',
            end: '2018-03-08',
            className: 'colorViewing',
            host: 'Peter Grant',
            allDay: true
        }, {
            _id: 6,
            title: 'Vermont High School',
            description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
            start: '2018-03-09',
            end: '2018-03-09',
            className: 'colorViewing',
            host: 'Peter Grant',
            allDay: true
        }, {
            _id: 7,
            title: 'California High School',            
            description: 'Lorem ipsum dolor sit incid idunt ut Lorem ipsum sit.',
            start: '2018-03-07',
            end: '2018-03-08',
            attendees:'Birds',
            className: 'colorViewing',
            host: 'Caio Vitorelli',
            allDay: true
        }]

    });

    $("#starts-at, #ends-at").datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        locale:"zh-tw"
    });

    //var minDate = moment().subtract(0, 'days').millisecond(0).second(0).minute(0).hour(0);

    $(" #editStartDate, #editEndDate").datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        locale:"zh-tw"
        //minDate: minDate
    });

    //CREATE NEW EVENT CALENDAR

    newEvent = function (start, end, eventType) {

        var colorEventyType = "colorViewing";

        $("#contextMenu").hide();
        $('.eventType').text(eventType);
        $('input#title').val("");
        $('#starts-at').val(start);
        $('#ends-at').val(end);
        $('#newEventModal').modal('show');

        var statusAllDay;
        var endDay;

        $('.allDayNewEvent').on('change', function () {

            if ($(this).is(':checked')) {
                statusAllDay = true;
                var endDay = $('#ends-at').prop('disabled', true);
            } else {
                statusAllDay = false;
                var endDay = $('#ends-at').prop('disabled', false);
            }
        });

        //GENERATE RAMDON ID - JUST FOR TEST - DELETE IT
        var eventId = 1 + Math.floor(Math.random() * 1000);
        //GENERATE RAMDON ID - JUST FOR TEST - DELETE IT

        $('#save-event').unbind();
        $('#save-event').on('click', function () {
            var title = $('input#title').val();
            var attendees = $('input#attendees').val();
            var startDay = $('#starts-at').val();
            //Wed 28 Feb 2018 13:46
            if (!$(".allDayNewEvent").is(':checked')) {
                var endDay = $('#ends-at').val();
            }
            var description = $('#add-event-desc').val();
            if (title) {
                var eventData = {
                    title: title,
                    start: startDay,
                    end: endDay,
                    attendees:attendees,
                    description: description,
                    host: 'Doran',
                    allDay: statusAllDay
                };
                fetch(hostServer, {                        
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

        if (event.allDay == true) {
            $('#editEventModal').find('#editEndDate').attr("disabled", true);
            $('#editEventModal').find('#editEndDate').val("");
            $(".allDayEdit").prop('checked', true);
        } else {
            $('#editEventModal').find('#editEndDate').attr("disabled", false);
            $('#editEventModal').find('#editEndDate').val(event.end.format('YYYY-MM-DD HH:mm'));
            $(".allDayEdit").prop('checked', false);
        }

        $('.allDayEdit').on('change', function () {

            if ($(this).is(':checked')) {
                $('#editEventModal').find('#editEndDate').attr("disabled", true);
                $('#editEventModal').find('#editEndDate').val("");
                $(".allDayEdit").prop('checked', true);
            } else {
                $('#editEventModal').find('#editEndDate').attr("disabled", false);
                $(".allDayEdit").prop('checked', false);
            }
        });
        $('#editHost').val(event.host);
        $('#editTitle').val(event.title);
        $('#editStartDate').val(event.start.format('YYYY-MM-DD HH:mm'));
        $('#edit-event-desc').val(event.description);
        $('.eventName').text(event.title);
        $('#editEventModal').modal('show');
        $('#updateEvent').unbind();
        $('#updateEvent').on('click', function () {
            var statusAllDay;
            if ($(".allDayEdit").is(':checked')) {
                statusAllDay = true;
            } else {
                statusAllDay = false;
            }
            var host = $('input#editHost').val();
            var attendees = $('input#attendees').val();
            var title = $('input#editTitle').val();
            var startDate = $('input#editStartDate').val();
            var endDate = $('input#editEndDate').val();
            var description = $('#edit-event-desc').val();
            $('#editEventModal').modal('hide');
            var eventData;
            if (title) {
                event.host = host
                event.attendees = attendees
                event.title = title
                event.start = startDate
                event.end = endDate
                event.description = description
                event.allDay = statusAllDay
                $("#calendar").fullCalendar('updateEvent', event);
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


    //WEATHER GRAMATICALLY

    function retira_acentos(str) {
        var com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝRÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿr";
        var sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
        var novastr = "";
        for (i = 0; i < str.length; i++) {
            troca = false;
            for (a = 0; a < com_acento.length; a++) {
                if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                    novastr += sem_acento.substr(a, 1);
                    troca = true;
                    break;
                }
            }
            if (troca == false) {
                novastr += str.substr(i, 1);
            }
        }
        return novastr.toLowerCase().replace(/\s/g, '-');
    }

});
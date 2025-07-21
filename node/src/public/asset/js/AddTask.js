$(document).ready(function() {
    const userTimezone = localStorage.getItem('user_timezone'); // user timezone from storage

    $('#task-form').on('submit', function(e) {
        e.preventDefault();

        function localToUTC(datetimeLocalString) {
            return new Date(datetimeLocalString).toISOString();
        }

        const task = {
            title: $('#NoteTitle').val(),
            toWho: $('#toWho').val(),
            toEmail: $('#fEmail').val(),
            description: $('#description').val(),
            task_name: $('#cate').val(),
            priority: $('#priority').val(),
            start_time: localToUTC($('#startAt').val()),
            deadline_time: localToUTC($('#EndAt').val()),
            timezone: userTimezone,
            start_status: $('#startStatus').is(':checked') ? 'active' : 'inactive',
            deadline_status: $('#deadlineStatus').is(':checked') ? 'active' : 'inactive',
        };

        $.ajax({
            url: 'https://remindwho.onrender.com/ToDo/remindme/create',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            contentType: 'application/json',
            data: JSON.stringify(task),
            success: function(response) {
                $('#task-form')[0].reset();
                $('#msg').text(response.message).css('color', 'green');
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    alert('Unauthorized. Please log in again.');
                    window.location.href = 'login.html';
                } else {
                    alert('Error creating task: ' + xhr.responseText);
                }
            }
        });
    });
});

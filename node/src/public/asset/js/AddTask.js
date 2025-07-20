  $(document).ready(function() {
        $('#task-form').on('submit', function(e) {
            e.preventDefault();

            const task = {
                title: $('#NoteTitle').val(),
                toWho: $('#toWho').val(),
                description: $('#description').val(),
                task_name: $('#cate').val(),
                priority: $('#priority').val(),
                start_time: $('#startAt').val(),
                deadline_time: $('#EndAt').val(),
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
                    // alert(response.message);
                    $('#task-form')[0].reset();
                    // location.href = 'http://127.0.0.1:5501/index.html';
                    $('#msg').text(response.message).css('color', 'green');
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 401) {
                        alert('Unauthorized. Please log in again.');
                        window.location.href = 'login.html';
                    } 
                    else {
                    alert('Please login before creating a task.');
                        window.location.href = 'login.html';
                    }
                }
            });
        });
    });
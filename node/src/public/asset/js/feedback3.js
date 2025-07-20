  $(document).ready(function() {
        $('#task-form').on('submit', function(e) {
            e.preventDefault();

            const task = {
                id: $('#id').val(),
                username: $('#username').val(),
                email: $('#email').val(),
                feedback: $('#elseTextarea').val(),
            };

            $.ajax({
                url: 'https://remindwho.onrender.com/ToDo/remindme/feedback',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                contentType: 'application/json',
                data: JSON.stringify(task),
                success: function(response) {
                    // alert(response.message);
                    $('#msg').text(response.message).css('color', 'green');
                    $('#task-form')[0].reset();
                    // location.href = 'http://127.0.0.1:5501/feedback.html';
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 401) {
                        // alert('Session expired or unauthorized. Please log in again.');
                        $('#msg').text('Session expired or unauthorized. Please log in again.').css('color', 'red');
                        window.location.href = 'login.html';
                    } 
                    else {
                    alert('something went wrong. It might be a server issue. Sorry!');
                    }
                }
            });
        });
    });

$(document).ready(function () {
    const taskId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');


    if (!token) {
      alert('Please log in first.');
      window.location.href = 'login.html';
      return;
    }

    function toDatetimeLocal(dateStr) {
        const date = new Date(dateStr);
        const offset = date.getTimezoneOffset(); // in minutes
        const localDate = new Date(date.getTime() - offset * 60000); // offset correction
        return localDate.toISOString().slice(0, 16);
    }

    // Fetch task
    $.ajax({
      url: `https://remindwho.onrender.com/ToDo/remindme/filter/${taskId}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      success: function (response) {
        const task = response.task[0];
        $('#startAt').val(toDatetimeLocal(task.start_time));
        $('#EndAt').val(toDatetimeLocal(task.deadline_time));
        $('#taskId').val(taskId);
        $('#fEmail').val(task.toEmail || '');
        $('#NoteTitle').val(task.title);
        $('#description').val(task.description);
        $('#cate').val(task.task_name.toLowerCase());
        $('#priority').val(task.priority.toLowerCase());
        $('#startStatus').prop('checked', task.start_status === 'active');
        $('#deadlineStatus').prop('checked', task.deadline_status === 'active');
      },
      error: function(xhr) {
        alert('Failed to fetch task. ' + xhr.responseText);
        console.error(xhr);
      }
    });

    // Submit update
    $('#task-form').on('submit', function (e) {
      e.preventDefault();

      function localToUTC(datetimeLocalString) {
          return new Date(datetimeLocalString).toISOString();
      }

      const updatedTask = {
        title: $('#NoteTitle').val(),
        description: $('#description').val(),
        toEmail: $('#fEmail').val(),
        toWho: $('#toWho').val(),
        task_name: $('#cate').val(),
        priority: $('#priority').val(),
        start_time: localToUTC($('#startAt').val()),
        deadline_time: localToUTC($('#EndAt').val()),
        start_status: $('#startStatus').is(':checked') ? 'active' : 'inactive',
        deadline_status: $('#deadlineStatus').is(':checked') ? 'active' : 'inactive',
      };

      $.ajax({
        url: `https://remindwho.onrender.com/ToDo/remindme/update/${taskId}`,
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token },
        contentType: 'application/json',
        data: JSON.stringify(updatedTask),
        success: function (response) {
          $("#msg").text(response.message).css("color", "green");
          $('#task-form')[0].reset();
        },
        error: function(xhr) {
          $('#msg').text(xhr.responseText).css('color', 'red');
          console.error(xhr);
        }
      });
    });
});

// $(document).ready(function () {
//     const taskId = new URLSearchParams(window.location.search).get('id');
//     const token = localStorage.getItem('token');


//     if (!token) {
//       alert('Please log in first.');
//       window.location.href = 'login.html';
//       return;
//     }

//     // function toDatetimeLocal(dateStr) {
//     //     const date = new Date(dateStr);
//     //     const offset = date.getTimezoneOffset(); // in minutes
//     //     const localDate = new Date(date.getTime() - offset * 60000); // offset correction
//     //     return localDate.toISOString().slice(0, 16);
//     // }
//     function formatForDatetimeLocal(pgDate) {
//   const d = new Date(pgDate); // parses the ISO-like string
//   const pad = n => n.toString().padStart(2, '0');
//   return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// }


//     // Fetch task
//     $.ajax({
//       url: `https://remindwho.picocolor.site/ToDo/remindme/filter/${taskId}`,
//       method: 'GET',
//       headers: { 'Authorization': 'Bearer ' + token },
//       success: function (response) {
//         const task = response.task;
//         console.log(task);
//         $('#startAt').val(formatForDatetimeLocal(task.start_time));
//         $('#EndAt').val(formatForDatetimeLocal(task.deadline_time));
//         $('#taskId').val(taskId);
//         $('#fEmail').val(task.toEmail || '');
//         $('#NoteTitle').val(task.title);
//         $('#description').val(task.description);
//         $('#cate').val(task.task_name.toLowerCase());
//         $('#priority').val(task.priority.toLowerCase());
//         $('#startStatus').prop('checked', task.start_status === 'active');
//         $('#deadlineStatus').prop('checked', task.deadline_status === 'active');
//       },
//       error: function(xhr) {
//         alert('Failed to fetch task. ' + xhr.responseText);
//         console.error(xhr);
//       }
//     });

//     // Submit update
//     $('#task-form').on('submit', function (e) {
//       e.preventDefault();

//       function localToUTC(datetimeLocalString) {
//           return new Date(datetimeLocalString).toISOString();
//       }

//       const updatedTask = {
//         title: $('#NoteTitle').val(),
//         description: $('#description').val(),
//         toEmail: $('#fEmail').val(),
//         toWho: $('#toWho').val(),
//         task_name: $('#cate').val(),
//         priority: $('#priority').val(),
//         start_time: localToUTC($('#startAt').val()),
//         deadline_time: localToUTC($('#EndAt').val()),
//         start_status: $('#startStatus').is(':checked') ? 'active' : 'inactive',
//         deadline_status: $('#deadlineStatus').is(':checked') ? 'active' : 'inactive',
//       };

//       $.ajax({
//         url: `https://remindwho.picocolor.site/ToDo/remindme/update/${taskId}`,
//         method: 'PUT',
//         headers: { 'Authorization': 'Bearer ' + token },
//         contentType: 'application/json',
//         data: JSON.stringify(updatedTask),
//         success: function (response) {
//           $("#msg").text(response.message).css("color", "green");
//           $('#task-form')[0].reset();
//         },
//         error: function(xhr) {
//           $('#msg').text(xhr.responseText).css('color', 'red');
//           console.error(xhr);
//         }
//       });
//     });
// });
$(document).ready(function () {
  const taskId = new URLSearchParams(window.location.search).get('id');
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  // Format Postgres timestamp for datetime-local input
  function formatForDatetimeLocal(pgDate) {
    if (!pgDate) return ''; // guard against undefined/null
    const d = new Date(pgDate);
    if (isNaN(d)) {
      console.warn("⚠️ Could not parse date:", pgDate);
      return '';
    }
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Fetch task
  $.ajax({
    url: `https://remindwho.picocolor.site/ToDo/remindme/filter/${taskId}`,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
    success: function (response) {
      console.log("✅ Full response:", response);

      const task = response.task;
      if (!task) {
        console.error("❌ No task object in response");
        return;
      }
      console.log("📌 Task object:", task);

      // Safely populate fields
      $('#startAt').val(formatForDatetimeLocal(task.start_time));
      $('#EndAt').val(formatForDatetimeLocal(task.deadline_time));
      $('#taskId').val(taskId);
      $('#NoteTitle').val(task.title || '');
      $('#description').val(task.description || '');
      if (task.task_name) $('#cate').val(task.task_name);
      if (task.priority) $('#priority').val(task.priority.toLowerCase());
      $('#startStatus').prop('checked', task.start_status === 'active');
      $('#deadlineStatus').prop('checked', task.deadline_status === 'active');
    },
    error: function (xhr) {
      alert('Failed to fetch task. ' + xhr.responseText);
      console.error("❌ Fetch error:", xhr);
    }
  });

  // Submit update
  $('#task-form').on('submit', function (e) {
    e.preventDefault();

    function localToUTC(datetimeLocalString) {
      if (!datetimeLocalString) return null;
      return new Date(datetimeLocalString).toISOString();
    }

    const updatedTask = {
      title: $('#NoteTitle').val(),
      description: $('#description').val(),
      // toEmail: $('#fEmail').val(),
      toWho: $('#toWho').val(),
      task_name: $('#cate').val(),
      priority: $('#priority').val(),
      start_time: localToUTC($('#startAt').val()),
      deadline_time: localToUTC($('#EndAt').val()),
      start_status: $('#startStatus').is(':checked') ? 'active' : 'inactive',
      deadline_status: $('#deadlineStatus').is(':checked') ? 'active' : 'inactive',
    };

    console.log("📤 Sending updated task:", updatedTask);

    $.ajax({
      url: `https://remindwho.picocolor.site/ToDo/remindme/update/${taskId}`,
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token },
      contentType: 'application/json',
      data: JSON.stringify(updatedTask),
      success: function (response) {
        console.log("✅ Update response:", response);
        $("#msg").text(response.message).css("color", "green");
        $('#task-form')[0].reset();
      },
      error: function (xhr) {
        console.error("❌ Update error:", xhr);
        $('#msg').text(xhr.responseText).css('color', 'red');
      }
    });
  });
});

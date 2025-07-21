$(document).ready(function(){
    LoadTask();

    function LoadTask() {
        $.ajax({
            url: 'https://remindwho.onrender.com/ToDo/remindme/displayAll',
            method: 'GET',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')  // ← Token added here
        },
            success: function(response) {
                const tasks = response.task;

                const taskStyles = {
                    work:    { color: 'yellow',   class: 'working_card',   icon: 'working-removebg-preview.png' },
                    reading: { color: 'blue',     class: 'reading_card',   icon: 'reading-removebg-preview.png' },
                    study:   { color: 'green',    class: 'study_card',     icon: 'studying-removebg-preview.png' },
                    business:{ color: 'orange',   class: 'business_card',  icon: 'business-removebg-preview.png' },
                    important:{color: 'gold',     class: 'important_card', icon: 'important-removebg-preview.png' },
                    urgent:  { color: 'red',      class: 'urgent_card',    icon: 'urgent-removebg-preview.png' },
                    social:  { color: 'purple',   class: 'social_card',    icon: 'social-removebg-preview.png' },
                    // Add more if needed
                };

                tasks.forEach(task => {
                    const style = taskStyles[task.task_name];
                    if (!style) return; // Skip if task_name not found

                    $('.rows').append(createCard(task, style));
                });
            },
            error: function(xhr, status, error) {
    console.error('Error loading tasks:', error);
    if (xhr.status === 401) {
        alert('Session expired or unauthorized. Please log in again.');
        window.location.href = 'login.html'; // redirect to login page
    } else {
        alert('Something went wrong. Please try again later.');
    }
}

        });
    }

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString(); // You can customize this
    }

    function createCard(task, style) {
        return `
        <div class="col-md-4 col-sm-6 content-card ${style.class}">
            <div class="card-big-shadow">
                <img src="img/pinTop-removebg-preview.png"  style="width: 60px;margin: auto;position: absolute;z-index: 100;top: -20px;left: 47%;">
                <div class="card card-just-text" data-background="color" data-color="${style.color}" data-radius="none">
                  <h6 class="category" style="float: right;display: flex;justify-content: start; align-items: center;padding:7px 0px 0px 7px;color:rgb(48, 48, 48);opacity:0.6" ><img src="img/${style.icon}" width="25px" style='opacity:0.8'><i>${task.task_name}</i></h6>
                    <div class="content">
                        <h4 class="title" style='text-align: center'><a><b>${task.title}</b></a></h4>
                        <p class="description">${task.description}</p>
                        <p class='priority'>Priority : ${task.priority}</p>
                    </div>
                    <div style="display: grid;gap:5px">
                        <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:5px 0px 0px 10px"><label>Start at :  </label> <div style='padding-left:3px'> ${formatDateTime(task.start_time)} | Email-Alert : ${task.start_status}</div></div>
                        <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:5px 0px 0px 10px"><label>End at : </label> <div style='padding-left:3px'>${formatDateTime(task.deadline_time)} | Email-Alert : ${task.deadline_status}</div></div>
                    </div>
                    <br>
                    <div style="display: flex;justify-content: space-between;padding: 10px;width: 95%;margin: auto;">
                        <div style="display: flex;justify-content: space-evenly;gap: 2px;font-size: 12px;color: rgb(0, 0, 0);opacity: 0.6;"><p>Create at :  </p> <div> ${formatDateTime(task.created_at || Date.now())}</div></div>
                        <div style="display: flex;justify-content: space-evenly;gap: 15px;opacity: 0.6;"> 
                            <a href="ToDoUpdate.html?id=${task.task_id}" style="color:  rgb(10, 89, 145);"><i class="fa-solid fa-pen-to-square"></i></a>
                            <span>|</span>
                            <a onclick="deleteTask(${task.task_id})" style="color: rgb(153, 33, 33);cursor: pointer;"><i class="fa-solid fa-trash"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
       
    
});

  function deleteTask(id){
            $.ajax({                                                                                                            
                url: 'https://remindwho.onrender.com/ToDo/remindme/delete/' + id,
                method: 'DELETE',
                        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')  // ← Token added here
        },
                success: function(response) {
                    console.log(response);
                    window.location.reload();
                },
                error: function(xhr, status, error) {
                    alert('Error deleting Task: ' + error);
                }
            });         

         }







           $(document).ready(function () {
    const taskId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      window.location.href = 'login.html';
      return;
    }

    // Fetch task
    $.ajax({
      url: `https://remindwho.onrender.com/ToDo/remindme/filter/${taskId}`,
      method: 'GET',
         headers: { 'Authorization': 'Bearer ' + token },
      success: function (response) {
        const task = response.task[0];
        function toDatetimeLocal(dateStr) {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset(); // in minutes
  const localDate = new Date(date.getTime() - offset * 60000); // offset correction
  return localDate.toISOString().slice(0, 16);
}
        $('#startAt').val(toDatetimeLocal(task.start_time));
        $('#EndAt').val(toDatetimeLocal(task.deadline_time));
        $('#taskId').val(taskId);
        $('#NoteTitle').val(task.title);
        $('#description').val(task.description);
        $('#cate').val(task.task_name.toLowerCase());
        $('#priority').val(task.priority.toLowerCase());
        // $('#startAt').val(new Date(task.start_time).toISOString().slice(0, 16));
        // $('#EndAt').val(new Date(task.deadline_time).toISOString().slice(0, 16));
        $('#startStatus').prop('checked', task.start_status === 'active');
        $('#deadlineStatus').prop('checked', task.deadline_status === 'active');
      },
      error: function(xhr) {
        console.log('Failed to fetch task. ' + xhr.responseText);
        console.error(xhr);
      }
    });

    // Submit update
    $('#task-form').on('submit', function (e) {
      e.preventDefault();
      const updatedTask = {
        title: $('#NoteTitle').val(),
        description: $('#description').val(),
        task_name: $('#cate').val(),
        priority: $('#priority').val(),
        start_time: $('#startAt').val(),
        deadline_time: $('#EndAt').val(),
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
          // alert(response.message);
          $("#msg").text(response.message).css("color", "green");
          $('#task-form')[0].reset();
          //  location.href = 'http://127.0.0.1:5501/index.html';
        },
        error: function(xhr) {
          // alert('Update failed: ' + xhr.responseText);
          $('#msg').text(xhr.responseText).css('color', 'red');
          console.log('Failed to update task. ' + xhr.responseText);
          console.error(xhr);
        }
      });
    });
  });


  $(document).ready(function () {
    const taskId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      window.location.href = 'login.html';
      return;
    }

    // Fetch task
    $.ajax({
      url: `https://remindwho.onrender.com/ToDo/remindme/filter/${taskId}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      success: function (response) {
        const task = response.task[0];
        function toDatetimeLocal(dateStr) {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset(); // in minutes
  const localDate = new Date(date.getTime() - offset * 60000); // offset correction
  return localDate.toISOString().slice(0, 16);
}

        $('#startAt').val(toDatetimeLocal(task.start_time));
        $('#EndAt').val(toDatetimeLocal(task.deadline_time));
        $('#taskId').val(taskId);
        $('#fEmail').val(task.toEmail);
        $('#NoteTitle').val(task.title);
        $('#description').val(task.description);
        $('#cate').val(task.task_name.toLowerCase());
        $('#priority').val(task.priority.toLowerCase());
        // $('#startAt').val(new Date(task.start_time).toISOString().slice(0, 16));
        // $('#EndAt').val(new Date(task.deadline_time).toISOString().slice(0, 16));
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
      const updatedTask = {
        title: $('#NoteTitle').val(),
        description: $('#description').val(),
        toEmail: $('#fEmail').val(),
        toWho:$('#toWho').val(),
        task_name: $('#cate').val(),
        priority: $('#priority').val(),
        start_time: $('#startAt').val(),
        deadline_time: $('#EndAt').val(),
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
          // alert(response.message);
             $("#msg").text(response.message).css("color", "green");
          $('#task-form')[0].reset();
          //  location.href = 'http://127.0.0.1:5501/index.html';
        },
        error: function(xhr) {
          // alert('Update failed: ' + xhr.responseText);
          $('msg').text(xhr.responseText).css('color', 'red');
          console.error(xhr);
        }
      });
    });
  });
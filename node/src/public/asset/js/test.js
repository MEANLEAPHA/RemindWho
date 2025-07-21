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
                    work:    { color: 'yellow',   class: 'work_card',   icon: 'working-removebg-preview.png' },
                    reading: { color: 'blue',     class: 'reading_card',   icon: 'reading-removebg-preview.png' },
                    study:   { color: 'green',    class: 'study_card',     icon: 'studying-removebg-preview.png' },
                    entertainment:{ color: 'pink',   class: 'entertainment_card',  icon: 'entertainment-removebg-preview.png' },
                    business:{ color: 'gray',   class: 'business_card',  icon: 'business-removebg-preview.png' },
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
        alert('Your Toekn is expired or unauthorized. Please log in again.');
        window.location.href = 'login.html'; // redirect to login page
    } 
    // else {
    //  alert('Please login again.');
    //     window.location.href = 'login.html';
    // }
}

        });

        
           
    }

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString(); // You can customize this
    }

    function createCard(task, style) {
     
      const alertStatus1 = (task.start_status === 'active') ? 'on' : 'off';
      const alertStatus2 = (task.deadline_status === 'active') ? 'on' : 'off';

      const TaskComplete = (task.start_alert_sent === 1) ? '✅' : '';
      const TaskDeadline = (task.deadline_alert_sent === 1) ? '✅' : '';

     

        if(task.toWho === 'Friend'){
            
        return `
                <div class="content-cardx ${style.class}" >
                    <div class="card-big-shadow">
                        <img src="img/pinTop-removebg-preview.png"  style="width: 60px;margin: auto;position: absolute;z-index: 100;top: -20px;left: 47%;">
                        <div class="card card-just-text" data-background="color" data-color="${style.color}" data-radius="none">
                        <h6 class="category" style="float: right;display: flex;justify-content: start; align-items: center;padding:7px 0px 0px 7px;color:rgb(48, 48, 48);opacity:0.6" ><img src="img/${style.icon}" width="25px" style='opacity:0.8'><i>${task.task_name}</i></h6>
                            <div class="content">
                                <h4 class="title" style='text-align: center;font-size: 18px;'><a><b>${task.title}</b></a></h4>
                                <p class="description">${task.description}</p>
                                <p class='priority1'>Remind to : ${task.toEmail}</p>
                                <p class='priority2'>Priority : ${task.priority}</p>
                            </div>
                            <div style="display: grid;gap:0px;margin-top: 4px">
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px"><label>Start at :  </label> <div style='padding-left:3px'> ${formatDateTime(task.start_time)} | Send <img src="img/mail.png" width="20px"  style='margin-bottom: 4px'> : <span class='state'>${alertStatus1}</span> <span > ${TaskComplete}</span></div></div>
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px"><label>End at : </label> <div style='padding-left:3px'>${formatDateTime(task.deadline_time)} | Send <img src="img/mail.png" width="20px"  style='margin-bottom: 4px'> : <span class='state'>${alertStatus2}</span> <span > ${TaskDeadline}</span></div></div>
                            </div>
                            
                            <div style="display: flex;justify-content: space-between;padding: 10px;width: 100%;margin: auto;">
                                <div style="display: flex;justify-content: space-evenly;gap: 2px;font-size: 12px;color: rgb(0, 0, 0);opacity: 0.6;"><p>Create at :  </p> <div> ${formatDateTime(task.created_at || Date.now())}</div></div>
                                <div style="display: flex;justify-content: space-evenly;gap: 15px;opacity: 0.6;"> 
                                    <a href="remindMyFriendUpdate.html?id=${task.task_id}" style="color:  rgb(10, 89, 145);"><i class="fa-solid fa-pen-to-square"></i></a>
                                    <span>|</span>
                                    <a onclick="deleteTask(${task.task_id})" style="color: rgb(153, 33, 33);cursor: pointer;"><i class="fa-solid fa-trash"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
        else{
              return `
                <div class="content-cardx ${style.class}">
                    <div class="card-big-shadow">
                        <img src="img/pinTop-removebg-preview.png"  style="width: 60px;margin: auto;position: absolute;z-index: 100;top: -20px;left: 47%;">
                        <div class="card card-just-text" data-background="color" data-color="${style.color}" data-radius="none">
                        <h6 class="category" style="float: right;display: flex;justify-content: start; align-items: center;padding:7px 0px 0px 7px;color:rgb(48, 48, 48);opacity:0.6" ><img src="img/${style.icon}" width="25px" style='opacity:0.8'><i>${task.task_name}</i></h6>
                            <div class="content">
                                <h4 class="title" style='text-align: center;font-size: 18px;'><a><b>${task.title}</b></a></h4>
                                <p class="description">${task.description}</p>
                                <p class='priority1'>Remind to : ${task.member_email}</p>
                                <p class='priority2'>Priority : ${task.priority}</p>
                            </div>
                            <div style="display: grid;gap:0px;margin-top: 4px">
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px"><label>Start at :  </label> <div style='padding-left:3px'> ${formatDateTime(task.start_time)} | Send <img src="img/mail.png" width="20px" style='margin-bottom: 4px'> : <span class='state'>${alertStatus1}</span> <span >  ${TaskComplete}</span></div></div>
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px"><label>End at : </label> <div style='padding-left:3px'>${formatDateTime(task.deadline_time)} | Send <img src="img/mail.png" width="20px" style='margin-bottom: 4px'> : <span class='state'>${alertStatus2}</span> <span > ${TaskDeadline}</span></div></div>
                            </div>
                           
                            <div style="display: flex;justify-content: space-between;padding: 10px;width: 100%;margin: auto;">
                                <div style="display: flex;justify-content: space-evenly;gap: 2px;font-size: 12px;color: rgb(0, 0, 0);opacity: 0.6;"><p>Create at :  </p> <div> ${formatDateTime(task.created_at || Date.now())}</div></div>
                                <div style="display: flex;justify-content: space-evenly;gap: 13px;opacity: 0.6;"> 
                                    <a href="UpdateTask.html?id=${task.task_id}" style="color:  rgb(10, 89, 145);"><i class="fa-solid fa-pen-to-square"></i></a>
                                    <span>|</span>
                                    <a onclick="deleteTask(${task.task_id})" style="color: rgb(153, 33, 33);cursor: pointer;"><i class="fa-solid fa-trash"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
      
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

   function convertToUTC(datetimeStr) {
        const localDate = new Date(datetimeStr);
        return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
    }
 $(document).ready(function() {
        $('#task-form').on('submit', function(e) {
            e.preventDefault();

            const startTimeUTC = convertToUTC($('#startAt').val());
            const endTimeUTC = convertToUTC($('#EndAt').val());

            const task = {
                title: $('#NoteTitle').val(),
                toWho: $('#toWho').val(),
                description: $('#description').val(),
                task_name: $('#cate').val(),
                priority: $('#priority').val(),
                start_time: startTimeUTC,
                deadline_time: endTimeUTC,
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


     $(document).ready(function () {
    const taskId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      window.location.href = 'login.html';
      return;
    }

    // Convert from UTC to local datetime-local input
    function toDatetimeLocal(dateStr) {
      const date = new Date(dateStr);
      const offset = date.getTimezoneOffset(); // in minutes
      const localDate = new Date(date.getTime() - offset * 60000); // offset correction
      return localDate.toISOString().slice(0, 16);
    }

    // Convert from local datetime input to UTC ISO string
    function toUTCString(datetimeStr) {
      const localDate = new Date(datetimeStr);
      return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
    }

    // Fetch task data and fill form
    $.ajax({
      url: `https://remindwho.onrender.com/ToDo/remindme/filter/${taskId}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      success: function (response) {
        const task = response.task[0];

        $('#startAt').val(toDatetimeLocal(task.start_time));
        $('#EndAt').val(toDatetimeLocal(task.deadline_time));
        $('#taskId').val(taskId);
        $('#NoteTitle').val(task.title);
        $('#description').val(task.description);
        $('#cate').val(task.task_name.toLowerCase());
        $('#priority').val(task.priority.toLowerCase());
        $('#startStatus').prop('checked', task.start_status === 'active');
        $('#deadlineStatus').prop('checked', task.deadline_status === 'active');
      },
      error: function (xhr) {
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
        start_time: toUTCString($('#startAt').val()),
        deadline_time: toUTCString($('#EndAt').val()),
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
        error: function (xhr) {
          $('#msg').text(xhr.responseText).css('color', 'red');
          console.log('Failed to update task. ' + xhr.responseText);
          console.error(xhr);
        }
      });
    });
  });


  
const { DateTime } = require('luxon');
const schedule = require('node-schedule');
const { sendEmail } = require('../util/email');
const db = require('../config/db');

// Run every minute
schedule.scheduleJob('* * * * *', async () => {
    try {
        const [tasks] = await db.query(`
            SELECT t.*, u.timezone 
            FROM todo_tasks t 
            JOIN users u ON t.member_id = u.user_id
        `);

        const nowUtc = DateTime.utc();

        for (const task of tasks) {
            const taskStart = DateTime.fromJSDate(new Date(task.start_time), { zone: 'utc' });
            const taskDeadline = DateTime.fromJSDate(new Date(task.deadline_time), { zone: 'utc' });

            // Convert now into user's local time
            const userNow = nowUtc.setZone(task.timezone || 'UTC');

            let recipientEmail;
            let senderEmail = task.member_email;

            // 🧠 Decide who gets the email
            const isFriend = task.toWho === 'Friend';
            if (isFriend) {
                recipientEmail = task.toEmail;
            } else {
                recipientEmail = senderEmail;
            }

            // Format email body
            const formatBody = (type, type1, type2, type3) => {
                // const baseMessage = `The task "${task.title}" has ${type}.`;
                const baseMessage = `"${task.title}" has ${type}\n\n${type1} "${task.title}" ${type2}.\n\n📌 Description: ${task.description}\n\n🔥 The Priority is ${task.priority}\n\n${type3}\n\n🎯 You’ve got this!\n\nBest regards, Your Task RemindeMe Bot 💌`;
                if (isFriend) {
                    return `${baseMessage}\n\nThis reminder was sent to you by your friend: ${senderEmail}`;
                }
                return baseMessage;
            };

            // ✅ START TIME ALERT
            if (
                task.start_status === 'active' &&
                !task.start_alert_sent &&
                userNow >= taskStart.setZone(task.timezone)
            ) {
                await sendEmail(
                    recipientEmail,
                    `📌 Task Started - ${task.title}`,
                    formatBody('officially kicked off 🚀', 'Just a friendly heads-up that your task ', 'is Now in Progress ⏰', "Let’s make the most of your time and tackle this with focus. Now’s a great moment to plan ahead or set a timer for deep work mode")
                );
                await db.query("UPDATE todo_tasks SET start_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
            }

            // ⏰ DEADLINE TIME ALERT
            if (
                task.deadline_status === 'active' &&
                !task.deadline_alert_sent &&
                userNow >= taskDeadline.setZone(task.timezone)
            ) {
                await sendEmail(
                    recipientEmail,
                    `⏰ Task Ended - ${task.title}`,
                    formatBody('Reached Its Deadline ⏰', 'Just a quick reminder that your task ', 'has now reached its deadline ⏳', "✅ If you've already completed it—amazing! If not, there’s no better time than now to finish strong")
                );
                await db.query("UPDATE todo_tasks SET deadline_alert_sent = 1 WHERE task_id = ?", [task.task_id]);
            }
        }
    } catch (error) {
        console.error('❌ Error processing task alerts:', error);
    }
});


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
                    work:    { color: 'yellow',   class: 'work_card',   icon: 'working-removebg-preview.png' },
                    reading: { color: 'blue',     class: 'reading_card',   icon: 'reading-removebg-preview.png' },
                    study:   { color: 'green',    class: 'study_card',     icon: 'studying-removebg-preview.png' },
                    entertainment:{ color: 'pink',   class: 'entertainment_card',  icon: 'entertainment-removebg-preview.png' },
                    business:{ color: 'gray',   class: 'business_card',  icon: 'business-removebg-preview.png' },
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
        alert('Your Toekn is expired or unauthorized. Please log in again.');
        window.location.href = 'login.html'; // redirect to login page
    } 
    // else {
    //  alert('Please login again.');
    //     window.location.href = 'login.html';
    // }
}

        });

        
           
    }

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString(); // You can customize this
    }

    function createCard(task, style) {
     
      const alertStatus1 = (task.start_status === 'active') ? 'on' : 'off';
      const alertStatus2 = (task.deadline_status === 'active') ? 'on' : 'off';

      const TaskComplete = (task.start_alert_sent === 1) ? '✅' : '';
      const TaskDeadline = (task.deadline_alert_sent === 1) ? '✅' : '';

     

        if(task.toWho === 'Friend'){
            
        return `
                <div class="content-cardx ${style.class}" >
                    <div class="card-big-shadow">
                        <img src="img/pinTop-removebg-preview.png"  style="width: 60px;margin: auto;position: absolute;z-index: 100;top: -20px;left: 47%;">
                        <div class="card card-just-text" data-background="color" data-color="${style.color}" data-radius="none">
                        <h6 class="category" style="float: right;display: flex;justify-content: start; align-items: center;padding:7px 0px 0px 7px;color:rgb(48, 48, 48);opacity:0.6" ><img src="img/${style.icon}" width="25px" style='opacity:0.8'><i>${task.task_name}</i></h6>
                            <div class="content">
                                <h4 class="title" style='text-align: center;font-size: 18px;'><a><b>${task.title}</b></a></h4>
                                <p class="description">${task.description}</p>
                                <p class='priority1'>Remind to : ${task.toEmail}</p>
                                <p class='priority2'>Priority : ${task.priority}</p>
                            </div>
                            <div style="display: grid;gap:0px;margin-top: 4px">
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px"><label>Start at :  </label> <div style='padding-left:3px'> ${formatDateTime(task.start_time)} | Send <img src="img/mail.png" width="20px"  style='margin-bottom: 4px'> : <span class='state'>${alertStatus1}</span> <span > ${TaskComplete}</span></div></div>
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px"><label>End at : </label> <div style='padding-left:3px'>${formatDateTime(task.deadline_time)} | Send <img src="img/mail.png" width="20px"  style='margin-bottom: 4px'> : <span class='state'>${alertStatus2}</span> <span > ${TaskDeadline}</span></div></div>
                            </div>
                            
                            <div style="display: flex;justify-content: space-between;padding: 10px;width: 100%;margin: auto;">
                                <div style="display: flex;justify-content: space-evenly;gap: 2px;font-size: 12px;color: rgb(0, 0, 0);opacity: 0.6;"><p>Create at :  </p> <div> ${formatDateTime(task.created_at || Date.now())}</div></div>
                                <div style="display: flex;justify-content: space-evenly;gap: 15px;opacity: 0.6;"> 
                                    <a href="remindMyFriendUpdate.html?id=${task.task_id}" style="color:  rgb(10, 89, 145);"><i class="fa-solid fa-pen-to-square"></i></a>
                                    <span>|</span>
                                    <a onclick="deleteTask(${task.task_id})" style="color: rgb(153, 33, 33);cursor: pointer;"><i class="fa-solid fa-trash"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
        else{
              return `
                <div class="content-cardx ${style.class}">
                    <div class="card-big-shadow">
                        <img src="img/pinTop-removebg-preview.png"  style="width: 60px;margin: auto;position: absolute;z-index: 100;top: -20px;left: 47%;">
                        <div class="card card-just-text" data-background="color" data-color="${style.color}" data-radius="none">
                        <h6 class="category" style="float: right;display: flex;justify-content: start; align-items: center;padding:7px 0px 0px 7px;color:rgb(48, 48, 48);opacity:0.6" ><img src="img/${style.icon}" width="25px" style='opacity:0.8'><i>${task.task_name}</i></h6>
                            <div class="content">
                                <h4 class="title" style='text-align: center;font-size: 18px;'><a><b>${task.title}</b></a></h4>
                                <p class="description">${task.description}</p>
                                <p class='priority1'>Remind to : ${task.member_email}</p>
                                <p class='priority2'>Priority : ${task.priority}</p>
                            </div>
                            <div style="display: grid;gap:0px;margin-top: 4px">
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px"><label>Start at :  </label> <div style='padding-left:3px'> ${formatDateTime(task.start_time)} | Send <img src="img/mail.png" width="20px" style='margin-bottom: 4px'> : <span class='state'>${alertStatus1}</span> <span >  ${TaskComplete}</span></div></div>
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px"><label>End at : </label> <div style='padding-left:3px'>${formatDateTime(task.deadline_time)} | Send <img src="img/mail.png" width="20px" style='margin-bottom: 4px'> : <span class='state'>${alertStatus2}</span> <span > ${TaskDeadline}</span></div></div>
                            </div>
                           
                            <div style="display: flex;justify-content: space-between;padding: 10px;width: 100%;margin: auto;">
                                <div style="display: flex;justify-content: space-evenly;gap: 2px;font-size: 12px;color: rgb(0, 0, 0);opacity: 0.6;"><p>Create at :  </p> <div> ${formatDateTime(task.created_at || Date.now())}</div></div>
                                <div style="display: flex;justify-content: space-evenly;gap: 13px;opacity: 0.6;"> 
                                    <a href="UpdateTask.html?id=${task.task_id}" style="color:  rgb(10, 89, 145);"><i class="fa-solid fa-pen-to-square"></i></a>
                                    <span>|</span>
                                    <a onclick="deleteTask(${task.task_id})" style="color: rgb(153, 33, 33);cursor: pointer;"><i class="fa-solid fa-trash"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
      
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


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


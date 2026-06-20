$(document).ready(function(){
    LoadTask();

    function LoadTask() {
        $.ajax({
            url: 'https://remindwho.picocolor.site/ToDo/remindme/displayAll',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')  // ← Token added here
            },
            success: function(response) {
                const tasks = response.task;
                console.log(response.task);
            
                const taskStyles = {
                    Work:    { color: 'yellow',   class: 'work_card',   icon: 'working-removebg-preview.png' },
                    Reading: { color: 'blue',     class: 'reading_card',   icon: 'reading-removebg-preview.png' },
                    Study:   { color: 'green',    class: 'study_card',     icon: 'studying-removebg-preview.png' },
                    Entertainment:{ color: 'pink',   class: 'entertainment_card',  icon: 'entertainment-removebg-preview.png' },
                    Business:{ color: 'gray',   class: 'business_card',  icon: 'business-removebg-preview.png' },
                    Important:{color: 'gold',     class: 'important_card', icon: 'important-removebg-preview.png' },
                    Urgent:  { color: 'red',      class: 'urgent_card',    icon: 'urgent-removebg-preview.png' },
                    Social:  { color: 'purple',   class: 'social_card',    icon: 'social-removebg-preview.png' },
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
                    alert('Your Token is expired or unauthorized. Please log in again.');
                    window.location.href = 'login.html'; // redirect to login page
                } 
            }
        });
    }

    function formatDateTime(dateString) {
    const date = new Date(dateString); // Converts to local time
    let hours = date.getHours();       // Gets local hours
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return (
        date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(hours).padStart(2, '0') + ':' + minutes + ' ' + ampm
    );
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
                        <h6 class="category" style="float: right;display: flex;justify-content: start; align-items: center;padding:7px 0px 0px 7px;color:rgb(48, 48, 48);opacity:0.6" >
                            <img src="img/${style.icon}" width="25px" style='opacity:0.8'><i>${task.task_name}</i>
                        </h6>
                            <div class="content">
                                <h4 class="title" style='text-align: center;font-size: 18px;'><a><b>${task.title}</b></a></h4>
                                <p class="description">${task.description}</p>
                                <p class='priority1'>Remind to : ${task.to_email}</p>
                                <p class='priority2'>Priority : ${task.priority}</p>
                            </div>
                            <div style="display: grid;gap:0px;margin-top: 4px">
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px">
                                    <label>Start at :  </label> 
                                    <div style='padding-left:3px'> 
                                        ${formatDateTime(task.start_time)} | Send <img src="img/mail.png" width="20px"  style='margin-bottom: 4px'> : <span class='state'>${alertStatus1}</span> <span > ${TaskComplete}</span>
                                    </div>
                                </div>
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px">
                                    <label>End at : </label> 
                                    <div style='padding-left:3px'>${formatDateTime(task.deadline_time)} | Send <img src="img/mail.png" width="20px"  style='margin-bottom: 4px'> : <span class='state'>${alertStatus2}</span> <span > ${TaskDeadline}</span></div>
                                </div>
                            </div>
                            
                            <div style="display: flex;justify-content: space-between;padding: 10px;width: 100%;margin: auto;">
                                <div style="display: flex;justify-content: space-evenly;gap: 2px;font-size: 12px;color: rgb(0, 0, 0);opacity: 0.6;">
                                    <p>Create at :  </p> 
                                    <div> ${formatDateTime(task.created_at || Date.now())}</div>
                                </div>
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
                        <h6 class="category" style="float: right;display: flex;justify-content: start; align-items: center;padding:7px 0px 0px 7px;color:rgb(48, 48, 48);opacity:0.6" >
                            <img src="img/${style.icon}" width="25px" style='opacity:0.8'><i>${task.task_name}</i>
                        </h6>
                            <div class="content">
                                <h4 class="title" style='text-align: center;font-size: 18px;'><a><b>${task.title}</b></a></h4>
                                <p class="description">${task.description}</p>
                                <p class='priority1'>Remind to : ${task.member_email}</p>
                                <p class='priority2'>Priority : ${task.priority}</p>
                            </div>
                            <div style="display: grid;gap:0px;margin-top: 4px">
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px">
                                    <label>Start at :  </label> 
                                    <div style='padding-left:3px'> ${formatDateTime(task.start_time)} | Send <img src="img/mail.png" width="20px" style='margin-bottom: 4px'> : <span class='state'>${alertStatus1}</span> <span >  ${TaskComplete}</span></div>
                                </div>
                                <div style="display: flex;font-size: 13px;color: rgb(36, 36, 36);opacity: 0.9;padding:0px 0px 0px 10px">
                                    <label>End at : </label> 
                                    <div style='padding-left:3px'>${formatDateTime(task.deadline_time)} | Send <img src="img/mail.png" width="20px" style='margin-bottom: 4px'> : <span class='state'>${alertStatus2}</span> <span > ${TaskDeadline}</span></div>
                                </div>
                            </div>
                           
                            <div style="display: flex;justify-content: space-between;padding: 10px;width: 100%;margin: auto;">
                                <div style="display: flex;justify-content: space-evenly;gap: 2px;font-size: 12px;color: rgb(0, 0, 0);opacity: 0.6;">
                                    <p>Create at :  </p> 
                                    <div> ${formatDateTime(task.created_at || Date.now())}</div>
                                </div>
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
        url: 'https://remindwho.picocolor.site/ToDo/remindme/delete/' + id,
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token') 
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

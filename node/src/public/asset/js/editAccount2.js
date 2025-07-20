
    $(document).ready(function (){
           const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      window.location.href = 'login.html';
      return;
    }

    $('#task-form').on('submit', function (e) {
      e.preventDefault();
      const updatedUser = {
        user_id: $('#id').val(),
        username: $('#username').val(),
        email: $('#email').val(),
        timezone: $('#timezone').val(),
      };

      $.ajax({
        url: `http://localhost:3000/ToDo/remindme/updateAccount`,
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token },
        contentType: 'application/json',
        data: JSON.stringify(updatedUser),
        success: function (response) {
          $('msg').text(response.message);
          // alert(response.message);
           location.href = 'http://127.0.0.1:5501/account.html';
        },
        error: function(xhr) {
          const message = xhr.responseJSON?.message || xhr.responseText || "Failed to update account.";
          $('#msg').text(xhr.message).css('color', 'red');
          console.error(xhr);
        }
      });
    });
    })

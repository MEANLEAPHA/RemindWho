$('#changeBtn').on('click', function () {
      const token = localStorage.getItem('token');
      const currentPassword = $('#currentPassword').val().trim();
      const newPassword = $('#newPassword').val().trim();
      const confirmPassword = $('#confirmPassword').val().trim();
      const msg = $('#responseMsg').removeClass('success').text('');

      if (!currentPassword || !newPassword || !confirmPassword) {
        msg.text("All fields are required.");
        return;
      }

      if (newPassword !== confirmPassword) {
        msg.text("New passwords do not match.");
        return;
      }

      $.ajax({
        url: 'http://localhost:3000/ToDo/remindme/changePassword',
        method: 'PUT',
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + token
        },
        data: JSON.stringify({ currentPassword, newPassword }),
        success: function (res) {
          msg.text(res.message || "Password changed successfully.").addClass('success');
          $('#currentPassword, #newPassword, #confirmPassword').val('');
        },
        error: function (xhr) {
          const errorMsg = xhr.responseJSON?.message || "Failed to change password.";
          msg.text(errorMsg);
        }
      });
    });
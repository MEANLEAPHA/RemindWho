 $(document).ready(function () {
      $('#member-form').on('submit', function (e) {
          e.preventDefault(); 
       if (!$('#terms').is(':checked')) {
      
      $('#msg').text('You must agree to the Terms & Conditions to continue.').css('color', 'red');
      
    // Prevent form from submitting
      return;
    }
       const newPass = $('#password').val();
      const confirmPass = $('#password2').val();

      if (!newPass || newPass.length < 6) {
           $('#msg').text('Password must be at least 6 characters.').css('color', 'red');
        return;
      }

      if (newPass !== confirmPass) {
       
        $('#msg').text('Passwords do not match.').css('color', 'red');
        return;
      }

        // Get user timezone from browser
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

        const member = {
          username: $('#name').val(),
          email: $('#email').val(),
          password: $('#password').val(),
          timezone: timezone, // Add timezone here
        };

        $.ajax({
          url: 'https://remindwho.onrender.com/ToDo/remindme/register',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(member),
          success: function (response) {
            $('#msg').text(response.message).css('color', 'green');
            localStorage.setItem('verify_token', response.token);
            location.href = 'https://remindwho.onrender.com/verify.html';
            // Optionally clear the form or redirect here
          },
          // error: function (xhr, status, error) {
          //   console.error('AJAX Error:', xhr.responseText);
          //   alert('createmember: ' + xhr.responseText);
          // },
            error: function(xhr, status, error) {
                try {
                    const err = JSON.parse(xhr.responseText);
                    $('#msg').text(err.message).css('color', 'red'); // Displays just "No user found"
                } catch (e) {
                    $('#msg').text('An unexpected error occurred');
                }
            }

        });
      });
    });
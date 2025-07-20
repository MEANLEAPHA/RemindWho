
  const token = localStorage.getItem('verify_token');

  if (!token) {
    alert("Token missing! Please sign up again.");
    window.location.href = 'signup.html';
  }

  const inputs = document.querySelectorAll('.pin');
  inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === "Backspace" && input.value === '' && i > 0) {
        inputs[i - 1].focus();
      }
    });
  });

  $('#verifyBtn').on('click', function () {
    const pin = Array.from(inputs).map(inp => inp.value.trim()).join('');
    if (!/^\d{6}$/.test(pin)) {
      alert("Please enter a valid 6-digit PIN.");
      return;
    }

    $.ajax({
      url: 'http://localhost:3000/ToDo/remindme/verify',
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token
      },
      data: JSON.stringify({ pin }),
      success: function (res) {
        alert(res.message || "Verified successfully!");
        localStorage.removeItem('verify_token');
        window.location.href = 'login.html';
      },
      error: function (xhr) {
        const message = xhr.responseJSON?.message || xhr.responseText || "Verification failed";
        alert("Verification failed: " + message);
      }
    });
  });

  $('#resendPinBtn').on('click', function () {
    $.ajax({
      url: 'http://localhost:3000/ToDo/remindme/resend-pin',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      success: function (res) {
        alert(res.message || "Verification code resent!");
      },
      error: function (xhr) {
        const message = xhr.responseJSON?.message || xhr.responseText || "Failed to resend code.";
        alert("Resend failed: " + message);
      }
    });
  });

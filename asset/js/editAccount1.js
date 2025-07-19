 const toastTrigger = document.querySelector('#liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}

   const toastTrigger2 = document.querySelector('#liveToastBtn2')
const toastLiveExample2 = document.getElementById('liveToast2')

if (toastTrigger2) {
  const toastBootstrap2 = bootstrap.Toast.getOrCreateInstance(toastLiveExample2)
  toastTrigger2.addEventListener('click', () => {
    toastBootstrap2.show()
  })
}

  function logout() {
    localStorage.removeItem('token');
    window.location.href = "login.html";
  }
  async function displayName() {
    try {
      const response = await fetch('http://localhost:3000/ToDo/remindme/name', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')  // or however you're storing the JWT
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const data = await response.json();
      const nameElement = document.getElementById("username");
      const idElement = document.getElementById("id");
      const emailElement = document.getElementById("email");
      const timezoneElement = document.getElementById("timezone");
      idElement.value = data.user_id;
      nameElement.value = data.username ;
      emailElement.value = data.email ;
      timezoneElement.value = data.timezone ;
     
    //   nameElement.textContent = data.username || "Guest";
    } catch (err) {
      console.error("Error fetching username:", err);
    }
  }

  // Run on page load
  window.onload = displayName;
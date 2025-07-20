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
      const response = await fetch('https://remindwho.onrender.com/ToDo/remindme/name', {
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
       const emailElement = document.getElementById("email");
       const idElement = document.getElementById("id");
      nameElement.value = data.username ;
      emailElement.value = data.email ;
      idElement.value = data.user_id ;

    } catch (err) {
      console.error("Error fetching username:", err);
    }
  }

  // Run on page load
  window.onload = displayName;
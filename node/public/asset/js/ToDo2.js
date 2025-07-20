
  var allBtn = document.getElementById('all');
  var studyBtn = document.getElementById('study');
  var entertainmentBtn = document.getElementById('entertaintment');
  var workBtn = document.getElementById('work');
  var socialBtn = document.getElementById('social');
  var readingBtn = document.getElementById('reading');
  var businessBtn = document.getElementById('business');
  var importantBtn = document.getElementById('important');
  var urgentBtn = document.getElementById('urgent');
 
   allBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
  // Card elements

//   // Fixed function names
  function showAll() {
  //  allBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
   allBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
   allBtn.style.backgroundSize="contain";
    allBtn.style.backgroundRepeat="no-repeat";
   allBtn.style.backgroundPosition="center";
    studyBtn.style.background="none";
      readingBtn.style.background="none";
        businessBtn.style.background="none";
          socialBtn.style.background="none";
            workBtn.style.background="none";
              entertainmentBtn.style.background="none";
                importantBtn.style.background="none";
                  urgentBtn.style.background="none";
 
  const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "block");
    important_card.forEach(card => card.style.display = "block");
    entertainment_card.forEach(card => card.style.display = "block");
    work_card.forEach(card => card.style.display = "block");
    study_card.forEach(card => card.style.display = "block");
    business_card.forEach(card => card.style.display = "block");
    social_card.forEach(card => card.style.display = "block");
    urgent_card.forEach(card => card.style.display = "block");

  }
  function showStudy() {
     allBtn.style.background="none";
    studyBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
    studyBtn.style.backgroundSize="contain";
    studyBtn.style.backgroundRepeat="no-repeat";
    studyBtn.style.backgroundPosition="center";
      readingBtn.style.background="none";
        businessBtn.style.background="none";
          socialBtn.style.background="none";
            workBtn.style.background="none";
              entertainmentBtn.style.background="none";
                importantBtn.style.background="none";
                  urgentBtn.style.background="none";

    
  const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "none");
    important_card.forEach(card => card.style.display = "none");
    entertainment_card.forEach(card => card.style.display = "none");
    work_card.forEach(card => card.style.display = "none");
    study_card.forEach(card => card.style.display = "block");
    business_card.forEach(card => card.style.display = "none");
    social_card.forEach(card => card.style.display = "none");
    urgent_card.forEach(card => card.style.display = "none");
  }

  function showEntertainment() {
     allBtn.style.background="none";
    studyBtn.style.background="none";
      readingBtn.style.background="none";
        businessBtn.style.background="none";
          socialBtn.style.background="none";
            workBtn.style.background="none";
              entertainmentBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
                entertainmentBtn.style.backgroundSize="contain";
                entertainmentBtn.style.backgroundRepeat="no-repeat";
                entertainmentBtn.style.backgroundPosition="center";
                importantBtn.style.background="none";
                  urgentBtn.style.background="none";
  const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "none");
    important_card.forEach(card => card.style.display = "none");
    entertainment_card.forEach(card => card.style.display = "block");
    work_card.forEach(card => card.style.display = "none");
    study_card.forEach(card => card.style.display = "none");
    business_card.forEach(card => card.style.display = "none");
    social_card.forEach(card => card.style.display = "none");
    urgent_card.forEach(card => card.style.display = "none");
  }

  function showWork() {
      allBtn.style.background="none";
    studyBtn.style.background="none";
      readingBtn.style.background="none";
        businessBtn.style.background="none";
          socialBtn.style.background="none";
            workBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
              workBtn.style.backgroundSize="contain";
              workBtn.style.backgroundRepeat="no-repeat";
              workBtn.style.backgroundPosition="center";
              entertainmentBtn.style.background="none";
                importantBtn.style.background="none";
                  urgentBtn.style.background="none";

     const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "none");
    important_card.forEach(card => card.style.display = "none");
    entertainment_card.forEach(card => card.style.display = "none");
    work_card.forEach(card => card.style.display = "block");
    study_card.forEach(card => card.style.display = "none");
    business_card.forEach(card => card.style.display = "none");
    social_card.forEach(card => card.style.display = "none");
    urgent_card.forEach(card => card.style.display = "none");
  }

  function showSocial() {
     allBtn.style.background="none";
    studyBtn.style.background="none";
      readingBtn.style.background="none";
        businessBtn.style.background="none";
          socialBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
            socialBtn.style.backgroundSize="contain";
            socialBtn.style.backgroundRepeat="no-repeat";
            socialBtn.style.backgroundPosition="center";
            workBtn.style.background="none";
              entertainmentBtn.style.background="none";
                importantBtn.style.background="none";
                  urgentBtn.style.background="none";

     const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "none");
    important_card.forEach(card => card.style.display = "none");
    entertainment_card.forEach(card => card.style.display = "none");
    work_card.forEach(card => card.style.display = "none");
    study_card.forEach(card => card.style.display = "none");
    business_card.forEach(card => card.style.display = "none");
    social_card.forEach(card => card.style.display = "block");
    urgent_card.forEach(card => card.style.display = "none");
  }

  function showReading() {
     allBtn.style.background="none";
    studyBtn.style.background="none";
      readingBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
        readingBtn.style.backgroundSize="contain";
        readingBtn.style.backgroundRepeat="no-repeat";
        readingBtn.style.backgroundPosition="center";
        businessBtn.style.background="none";
          socialBtn.style.background="none";
            workBtn.style.background="none";
              entertainmentBtn.style.background="none";
                importantBtn.style.background="none";
                  urgentBtn.style.background="none";

    const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "block");
    important_card.forEach(card => card.style.display = "none");
    entertainment_card.forEach(card => card.style.display = "none");
    work_card.forEach(card => card.style.display = "none");
    study_card.forEach(card => card.style.display = "none");
    business_card.forEach(card => card.style.display = "none");
    social_card.forEach(card => card.style.display = "none");
    urgent_card.forEach(card => card.style.display = "none");
  }

  function showImportant() {
        allBtn.style.background="none";
    studyBtn.style.background="none";
      readingBtn.style.background="none";
        businessBtn.style.background="none";
          socialBtn.style.background="none";
            workBtn.style.background="none";
              entertainmentBtn.style.background="none";
                importantBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
                  importantBtn.style.backgroundSize="contain";
                  importantBtn.style.backgroundRepeat="no-repeat";
                  importantBtn.style.backgroundPosition="center";
                  urgentBtn.style.background="none";

     const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "none");
    important_card.forEach(card => card.style.display = "block");
    entertainment_card.forEach(card => card.style.display = "none");
    work_card.forEach(card => card.style.display = "none");
    study_card.forEach(card => card.style.display = "none");
    business_card.forEach(card => card.style.display = "none");
    social_card.forEach(card => card.style.display = "none");
    urgent_card.forEach(card => card.style.display = "none");
  }

  function showUrgent() {
        allBtn.style.background="none";
    studyBtn.style.background="none";
      readingBtn.style.background="none";
        businessBtn.style.background="none";
          socialBtn.style.background="none";
            workBtn.style.background="none";
              entertainmentBtn.style.background="none";
                importantBtn.style.background="none";
                  urgentBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
                  urgentBtn.style.backgroundSize="contain";
                  urgentBtn.style.backgroundRepeat="no-repeat";
                  urgentBtn.style.backgroundPosition="center";
    const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "none");
    important_card.forEach(card => card.style.display = "none");
    entertainment_card.forEach(card => card.style.display = "none");
    work_card.forEach(card => card.style.display = "none");
    study_card.forEach(card => card.style.display = "none");
    business_card.forEach(card => card.style.display = "none");
    social_card.forEach(card => card.style.display = "none");
    urgent_card.forEach(card => card.style.display = "block");
  }
    function showBusiness() {
        allBtn.style.background="none";
    studyBtn.style.background="none";
      readingBtn.style.background="none";
        businessBtn.style.backgroundImage = "url('../img/paint-removebg-preview.png')";
        businessBtn.style.outline="none";
        businessBtn.style.backgroundSize="contain";
        businessBtn.style.backgroundRepeat="no-repeat";
        businessBtn.style.backgroundPosition="center";
          socialBtn.style.background="none";
            workBtn.style.background="none";
              entertainmentBtn.style.background="none";
                importantBtn.style.background="none";
                  urgentBtn.style.background="none";
    const work_card = document.querySelectorAll('.work_card');
  const study_card = document.querySelectorAll('.study_card');
  const entertainment_card = document.querySelectorAll('.entertainment_card');
  const social_card = document.querySelectorAll('.social_card');
  const reading_card = document.querySelectorAll('.reading_card');
  const business_card = document.querySelectorAll('.business_card');
  const important_card = document.querySelectorAll('.important_card');
  const urgent_card = document.querySelectorAll('.urgent_card');

    reading_card.forEach(card => card.style.display = "none");
    important_card.forEach(card => card.style.display = "none");
    entertainment_card.forEach(card => card.style.display = "none");
    work_card.forEach(card => card.style.display = "none");
    study_card.forEach(card => card.style.display = "none");
    business_card.forEach(card => card.style.display = "block");
    social_card.forEach(card => card.style.display = "none");
    urgent_card.forEach(card => card.style.display = "none");
  }

//   // Assign click handlers
  allBtn.onclick = showAll;
  studyBtn.onclick = showStudy;
  entertainmentBtn.onclick = showEntertainment;
  workBtn.onclick = showWork;
  socialBtn.onclick = showSocial;
  readingBtn.onclick = showReading;
  importantBtn.onclick = showImportant;
  urgentBtn.onclick = showUrgent;
  businessBtn.onclick = showBusiness;
    // const content_card = document.getElementById('content-card').style.display = "none";
    
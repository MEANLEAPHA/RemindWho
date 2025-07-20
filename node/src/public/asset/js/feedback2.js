  function toggleFeedback() {
            var section = document.getElementById("feedbackSections");
            section.style.display = section.style.display === "none" ? "block" : "none";
        }
        
        function toggleTextarea(textareaId, checkboxId) {
            var textarea = document.getElementById(textareaId);
            var checkbox = document.getElementById(checkboxId);
            textarea.style.display = checkbox.checked ? "block" : "none";
        }
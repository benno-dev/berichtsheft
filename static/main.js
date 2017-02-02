document.addEventListener("DOMContentLoaded", function() {

  var reportLinks = document.querySelectorAll(".year-list a");
  var reportView = document.querySelector(".report-view iframe");
  var lastActiveLink = null;

  for (var i = 0; i < reportLinks.length; i++) {
    reportLinks[i].addEventListener("click", function(event) {
      event.preventDefault();
      reportView.src = this.href;

      if (lastActiveLink !== null) {
        lastActiveLink.classList.remove("active");
      }

      this.classList.add("active");
      lastActiveLink = this;
    });
  }

  reportLinks[0].click();

});

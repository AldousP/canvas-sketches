'use strict';
var page_nav = document.getElementById("page-nav");
var nav_hidden = false;
var hiding_nav = false;

page_nav.classList.add('nav-hidden');

window.addEventListener("scroll", onScroll);
function onScroll() {
  if (page_nav !== null) {
    page_nav.style.marginTop = window.pageYOffset;
  }
}

function togglePageNav() {
  nav_hidden = !nav_hidden;
  if (nav_hidden) {
    page_nav.classList.add('nav-hidden');
  } else {
    page_nav.classList.remove('nav-hidden');
  }
}

function scrollToTag(tag) {
  var goal = document.querySelector(tag);
  var currentMargin = window.pageYOffset;
  var goalMargin = goal.offsetTop;
  var frameRate = 60;
  var length = 1;
  var limit = length * frameRate;
  var count = 0;
  var loop = null;

  hiding_nav = false;
  loop = setInterval(function () {
    if (count >= limit) {
      clearInterval(loop);
    }
    var alpha = count / limit;
    alpha = Math.pow(alpha, 2);
    scrollTo(0, currentMargin + (goalMargin - currentMargin) * alpha);
    count++;

    if (count === limit) {
      page_nav.classList.add('nav-hidden');
    }
  }, length / frameRate);
}

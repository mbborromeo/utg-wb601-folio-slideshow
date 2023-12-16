/* Slideshow source:
 * https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_slideshow
 */
let slideIndex; // global variable for project slide
let autoScroll = true; //set to false if you don't want to automatically scroll
let autoScrollIntervalID = 0;

let imagesLoadedCounter = 0;

const startTime = Date.now();
console.log("starting timer...");

function outputTimeUntil(eventString) {
  const millis = Date.now() - startTime;
  console.log(`seconds until ${eventString} called/loaded: ${millis / 1000}`);
}

function stopAutoScroll() {
  autoScroll = false;
  clearInterval(autoScrollIntervalID); //stop auto slider
}

function rewindSlider() {
  goToSlide(0); // to do: discuss function 'hoisting', since goToSlide() is defined later
}

function updatePreviousNextButtons(slidesLength) {
  const buttonPrevious = document.getElementById("btn-prev");
  const buttonNext = document.getElementById("btn-next");

  buttonPrevious.classList.remove("disabled");
  buttonNext.classList.remove("disabled");

  // if on first slide
  if (slideIndex == 0) {
    buttonPrevious.classList.add("disabled");
  }

  // if on last slide
  if (slideIndex == slidesLength - 1) {
    buttonNext.classList.add("disabled");

    // and if auto scroll is running, rewind the slider after 4 seconds
    if (autoScroll) {
      stopAutoScroll();
      setTimeout(rewindSlider, 4000);
    }
  }
}

function showActiveDot() {
  let dots = document.getElementsByClassName("dot");

  // remove any active styles from all dots initially
  for (let d = 0; d < dots.length; d++) {
    dots[d].classList.remove("active");
  }

  // style the dot representing current slide as active
  dots[slideIndex].classList.add("active");
}

function goToSlide(index) {
  outputTimeUntil("goToSlide");

  let slides = document.getElementsByClassName("slide");

  /*
  if (index < 0) {
    // go to last slide
    slideIndex = slides.length-1;
  } else if (index >= 0 && index < slides.length) {
    slideIndex = index;
  } else {
    // go to first slide
    slideIndex = 0;
  }
  */
  if (index >= 0 && index < slides.length) {
    slideIndex = index;

    // hide all slides initially
    for (let s = 0; s < slides.length; s++) {
      slides[s].style.display = "none";
    }

    // show active slide
    slides[slideIndex].style.display = "block";

    showActiveDot();

    updatePreviousNextButtons(slides.length);
  }
}

function userActionGoToSlide(index) {
  stopAutoScroll();
  goToSlide(index);
}

function nextSlide(incrementValue) {
  const newIndex = slideIndex + incrementValue;
  goToSlide(newIndex);
}

function userActionNextSlide(incrementValue) {
  stopAutoScroll();
  nextSlide(incrementValue);
}

function tryToStartSlider() {
  outputTimeUntil("tryToStartSlider");

  if (autoScroll) {
    // return value of setInterval() is an ID number of the timer that was set,
    // so you can use clearInterval() to cancel that specific timer.
    autoScrollIntervalID = setInterval(
      function () {
        nextSlide(1);
      },
      4000 // run at intervals of 4 seconds
    );
  }
}

// check when all slideshow images have been loaded, then auto-start slideshow
function anImageLoadedCallback(numberOfImagesToLoad) {
  imagesLoadedCounter++;
  outputTimeUntil(`image #${imagesLoadedCounter}`);

  // if all images have loaded
  if (imagesLoadedCounter === numberOfImagesToLoad) {
    console.log("ALL images have LOADED!");
    tryToStartSlider();
  }
}

function buildSlides(data) {
  outputTimeUntil("buildSlides");

  // get HTML element that we will populate
  const slideshow = document.getElementById("slideshow");
  const dotsParent = document.getElementById("dots");

  // run a for-loop to generate a slide for each project
  for (let s = 0; s < data.length; s++) {
    const project = data[s];

    // build slide
    const slide = document.createElement("div");
    slide.classList.add("slide", "fade");

    const image = document.createElement("img");
    // event handler for when image has loaded
    image.onload = function () {
      anImageLoadedCallback(data.length);
    };
    image.src = project.image;
    slide.appendChild(image);

    const textBackground = document.createElement("div");
    textBackground.className = "text-background";
    slide.appendChild(textBackground);

    const textContainer = document.createElement("div");
    textContainer.className = "text-container";

    const slideNumber = document.createElement("div");
    slideNumber.className = "numbertext";
    slideNumber.innerHTML = s + 1 + " / " + data.length;
    textContainer.appendChild(slideNumber);

    const h3 = document.createElement("h3");
    h3.innerHTML = project.title;
    textContainer.appendChild(h3);

    const paragraph = document.createElement("p");
    paragraph.innerHTML = project.description;
    textContainer.appendChild(paragraph);

    const technologiesUsed = document.createElement("div");
    technologiesUsed.className = "technologies";
    for (let t = 0; t < project.technologies.length; t++) {
      if (t !== project.technologies.length - 1) {
        technologiesUsed.innerHTML += project.technologies[t] + ", ";
      } else {
        // last technology doesn't need a comma at end
        technologiesUsed.innerHTML += project.technologies[t];
      }
    }
    textContainer.appendChild(technologiesUsed);

    const link = document.createElement("a");
    link.className = "link";
    link.href = project.url;
    link.target = "_blank";
    link.innerHTML = "View";
    textContainer.appendChild(link);

    slide.appendChild(textContainer);

    slideshow.appendChild(slide);

    // build dot indicators
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.onclick = function () {
      // anonymous function will only be called when event 'onclick' occurs
      userActionGoToSlide(s);
    };
    dotsParent.appendChild(dot);
  }
}

// read JSON file
// mention this happens asynchronously,
// which is why we have to use then()
fetch("projects.json")
  .then(function (res) {
    outputTimeUntil("fetched json");

    // console.log('res', res);
    const json = res.json(); // parse into JSON format
    // console.log('json', json);
    return json;
  })
  .then(function (data) {
    outputTimeUntil("finished parsing json");

    buildSlides(data);
    goToSlide(0);
  })
  .catch(function (error) {
    console.log("error", error);
  });

/* Doesn't seem to work...
 * Only want to trigger this when page including images and CSS have been loaded.
 * Q: Is there a cross-browser approach for this for PC and Mac browsers?
 */
// window.addEventListener("load", function () {
//   outputTimeUntil('window loaded');
//   tryToStartSlider();
// });

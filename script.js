const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let count = 5;
let totalImages = 30;

let photosArray = [];
let initialLoad = true;

// Helper Function to set attributes on DOM elements

const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

// Check if all images have loaded
const imageLoaded = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    initialLoad = false;
    count = 30;
  }
};

// Create elements for links and photos and add it to DOM
const displayPhotos = () => {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    //create <a></a> to link to Unsplash
    const item = document.createElement("a");
    // item.setAttribute("href", photo.links.html);
    // item.setAttribute("target", "blank");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    //Create <img> for photo
    const img = document.createElement("img");
    const h4 = document.createElement("h4");

    img.setAttribute("src", photo.urls.regular);
    if (photo.alt_description === null) {
      setAttributes(img, {
        src: photo.urls.regular,
        alt: "Image",
        title: "No description",
      });
      h4.innerText = "No description";
    } else {
      setAttributes(img, {
        src: photo.urls.regular,
        alt: `${
          photo.alt_description.charAt(0).toUpperCase() +
          photo.alt_description.slice(1)
        }...`,
        title: `${
          photo.alt_description.charAt(0).toUpperCase() +
          photo.alt_description.slice(1)
        }...`,
      });
      h4.innerText = `${
        photo.alt_description.charAt(0).toUpperCase() +
        photo.alt_description.slice(1)
      }...`;
    }
    // Event Listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
    imageContainer.appendChild(h4);
  });
};

// Get photos from Unsplash API
const getPhotos = () => {
  new Promise(() => {
    const apiKey = "PTL2qNsEUK7zazJpO30ZYsKbCgLqjRLHR3zEEN2fsxo";
    const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;
    fetch(apiUrl, {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          imageContainer.innerText = `${response.status} Forbidden Too many requests`;
          loader.hidden = true;
        }
        return response.json();
      })
      .then((data) => {
        photosArray = data;
        displayPhotos();
      })
      .catch((error) => {
        console.log("whoops, no quote", error);
      });
  });
};

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();

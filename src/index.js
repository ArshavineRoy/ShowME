const URL = "http://localhost:3000/shows";
const showsPerPage = 30; // Number of shows per page
let currentPage = 1; // Current page number
let data = []; // Array to store the fetched data

fetch(URL)
  .then((res) => res.json())
  .then((fetchedData) => {
    data = fetchedData; // Save the fetched data in the 'data' array
    handleShows();
    createPagination(data.length);
  });

function handleShows() {
  const imgCard = document.querySelector(".show-cards");

  // Calculate start and end indices based on the current page
  const startIndex = (currentPage - 1) * showsPerPage;
  const endIndex = startIndex + showsPerPage;

  // Iterate over the shows within the specified range
  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const show = data[i];
    const id = show.id;
    const name = show.name;
    const img = show.image.medium;
    const showStatus = show.status;
    const avgRating =
      show.rating && show.rating.average
        ? show.rating.average.toFixed(1)
        : "N/A";
    const endDate = formatDate(show.ended); // formatting date from 2023-04-07 to July 4, 2023
    const premiered = formatDate(show.premiered);
    const summary = show.summary;
    const genres = show.genres.join(", "); // Access the "genres" property for each show and join the array elements into a string
    const imgElement = document.createElement("img");
    createCards();

    function createCards() {
      // Create a new card for each show
      const card = document.createElement("div");
      card.classList.add("card");

      // Create an image element

      imgElement.src = img;
      imgElement.alt = "Show Image";

      // Create the card content
      const cardContent = document.createElement("div");
      cardContent.classList.add("card-content");

      const title = document.createElement("h2");
      title.textContent = name;

      const rating = document.createElement("div");
      rating.classList.add("rating");
      rating.innerHTML = `
      <span class="star">&#9733;</span>
      <span id="rating-value">${avgRating}</span>
    `;

      // Create a container for the title and rating
      const titleRatingContainer = document.createElement("div");
      titleRatingContainer.classList.add("title-rating-container");

      // Append elements to the title rating container
      titleRatingContainer.appendChild(title);
      titleRatingContainer.appendChild(rating);

      // Append the title rating container to the card content
      cardContent.appendChild(titleRatingContainer);

      // Create a paragraph element for the status
      const status = document.createElement("p");
      if (showStatus === "Ended") {
        status.innerHTML = `<p><span style="font-weight: bold;">Premiered:</span> ${premiered} <br> <span style="font-weight: bold;">Status:</span> <span style="color: red;">Ended on ${endDate} </span><br> 
        <span style="font-weight: bold;">Genres:</span> ${genres}</p>`;
      } else {
        status.innerHTML = `<p><span style="font-weight: bold;">Premiered: </span>${premiered} <br> <span style="font-weight: bold;">Status:</span> Running <br> 
        <span style="font-weight: bold;">Genres:</span> ${genres} </p>`;
      }

      // Append the status paragraph to the card content
      cardContent.appendChild(status);

      card.appendChild(imgElement);
      card.appendChild(cardContent);

      imgCard.appendChild(card);
    }
  }
  const searchBtn = document.querySelector("#search-btn");
  searchBtn.addEventListener("click", fetchResults);

  function fetchResults() {
    const keyword = document.querySelector("#search-input").value;
    console.log(keyword);
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        imgCard.innerHTML = ""; // Clear existing show cards
        const searchResults = data.filter((show) =>
          show.name.toLowerCase().includes(keyword.toLowerCase())
        );
        if (searchResults.length > 0) {
          searchResults.forEach((show) => {
            createCard(show);
          });
        } else {
          imgCard.innerHTML = "<h1>No results found.</h1>";
          console.log("No results found");
        }
      });
  }

  function filterShows() {
    const keyword = document.querySelector("#search-input").value;
    const statusFilter = document.querySelector("#status").value;
    const genreFilter = document.querySelector("#genre").value;
    const ratingFilter = document.querySelector("#rating").value;
    const sortFilter = document.querySelector("#sort").value;

    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        imgCard.innerHTML = "";

        const filterData = (show) => {
          const showRating =
            show.rating && show.rating.average ? show.rating.average : null;
          if (ratingFilter === "") {
            // If no rating filter applied
            return (
              show.name.toLowerCase().includes(keyword.toLowerCase()) ||
              show.genres
                .join(", ")
                .toLowerCase()
                .includes(keyword.toLowerCase())
            );
          } else if (ratingFilter.endsWith("+")) {
            // Rating filter n+
            const ratingValue = parseInt(ratingFilter);
            return (
              (show.name.toLowerCase().includes(keyword.toLowerCase()) ||
                show.genres
                  .join(", ")
                  .toLowerCase()
                  .includes(keyword.toLowerCase())) &&
              showRating !== null &&
              parseFloat(showRating) >= ratingValue
            );
          }
          return false;
        };

        let searchResults = data.filter(filterData);
        // alphabetical sorting logic
        if (sortFilter === "a-to-z") {
          searchResults.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortFilter === "z-to-a") {
          searchResults.sort((a, b) => b.name.localeCompare(a.name));
        }

        // Filter by popularity (most popular = 7+ rating and least popular = 3 and below)
        if (sortFilter === "popular") {
          searchResults.sort((a, b) => {
            const ratingA =
              a.rating && a.rating.average ? parseFloat(a.rating.average) : 0;
            const ratingB =
              b.rating && b.rating.average ? parseFloat(b.rating.average) : 0;
            return ratingB - ratingA; // Sort in descending order of ratings
          });
          searchResults = searchResults.filter((show) => {
            const showRating =
              show.rating && show.rating.average
                ? parseFloat(show.rating.average)
                : 0;
            return showRating >= 7; // Filtering shows with 7+ rating and above
          });
        } else if (sortFilter === "unpopular") {
          searchResults.sort((a, b) => {
            const ratingA =
              a.rating && a.rating.average ? parseFloat(a.rating.average) : 0;
            const ratingB =
              b.rating && b.rating.average ? parseFloat(b.rating.average) : 0;
            return ratingA - ratingB; // Sort in ascending order of ratings
          });
          searchResults = searchResults.filter((show) => {
            const showRating =
              show.rating && show.rating.average
                ? parseFloat(show.rating.average)
                : 0;
            return showRating <= 3; // Filter shows with 3 star and below rating
          });
        }
        // Sorting logic by rating (highest and lowest rating)
        if (sortFilter === "highest-rated") {
          searchResults.sort((a, b) => {
            const ratingA =
              a.rating && a.rating.average ? parseFloat(a.rating.average) : 0;
            const ratingB =
              b.rating && b.rating.average ? parseFloat(b.rating.average) : 0;
            return ratingB - ratingA; // Sort in descending order of ratings
          });
        } else if (sortFilter === "lowest-rated") {
          searchResults.sort((a, b) => {
            const ratingA =
              a.rating && a.rating.average ? parseFloat(a.rating.average) : 0;
            const ratingB =
              b.rating && b.rating.average ? parseFloat(b.rating.average) : 0;
            return ratingA - ratingB; // Sort in ascending order of ratings
          });
        }
        //creating cards for the shows based on filter criteria
        if (searchResults.length > 0) {
          let hasResults = false;
          let count = 0; // Counter for the number of cards created

          searchResults.forEach((show) => {
            // Filtering shows based on status, genre, rating, etc. through the filter button
            if (
              show.genres
                .join(", ")
                .toLowerCase()
                .includes(genreFilter.toLowerCase()) &&
              show.status.toLowerCase().includes(statusFilter.toLowerCase())
            ) {
              //console.log("Found!");
              if (
                count >= (currentPage - 1) * showsPerPage &&
                count < currentPage * showsPerPage
              ) {
                createCard(show);
                hasResults = true;
              }
              count++;
            }
          });

          if (!hasResults) {
            imgCard.innerHTML = "<h1>No results found.</h1>";
            console.log("No results found");
          }
        } else {
          imgCard.innerHTML = "<h1>No results found.</h1>";
          console.log("No results found");
        }
      });
  }

  /* event listener for the "Enter" key press if the user enters a
 keyword and presses the Enter key
 */

  const searchInput = document.querySelector("#search-input");
  searchInput.addEventListener("keypress", handleKeyPress);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      fetchResults();
    }
  }

  const filterBtn = document.querySelector("#filter-btn");
  filterBtn.addEventListener("click", filterShows);

  function createCard(show) {
    const imgCard = document.querySelector(".show-cards");
    const imgElement = document.createElement("img");
    const id = show.id;
    const name = show.name;
    const img = show.image.medium;
    const showStatus = show.status;
    const avgRating =
      show.rating && show.rating.average
        ? show.rating.average.toFixed(1)
        : "N/A";
    const endDate = formatDate(show.ended);
    const premiered = formatDate(show.premiered);
    const summary = show.summary;
    const genres = show.genres.join(", ");

    // Create a new card for the show
    const card = document.createElement("div");
    card.classList.add("card");

    // Create an image element
    imgElement.src = img;
    imgElement.alt = "Show Image";

    // Create the card content
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const title = document.createElement("h2");
    title.textContent = name;

    const rating = document.createElement("div");
    rating.classList.add("rating");
    rating.innerHTML = `
      <span class="star">&#9733;</span>
      <span id="rating-value">${avgRating}</span>
    `;

    // Create a container for the title and rating
    const titleRatingContainer = document.createElement("div");
    titleRatingContainer.classList.add("title-rating-container");

    // Append elements to the title rating container
    titleRatingContainer.appendChild(title);
    titleRatingContainer.appendChild(rating);

    // Append the title rating container to the card content
    cardContent.appendChild(titleRatingContainer);

    // Create a paragraph element for the status
    const status = document.createElement("p");
    if (showStatus === "Ended") {
      status.innerHTML = `<p><span style="font-weight: bold;">Premiered:</span> ${premiered} <br> <span style="font-weight: bold;">Status:</span> <span style="color: red;">Ended on ${endDate} </span><br> 
      <span style="font-weight: bold;">Genres:</span> ${genres}</p>`;
    } else {
      status.innerHTML = `<p><span style="font-weight: bold;">Premiered: </span>${premiered} <br> <span style="font-weight: bold;">Status:</span> Running <br> 
      <span style="font-weight: bold;">Genres:</span> ${genres} </p>`;
    }

    // Append the status paragraph to the card content
    cardContent.appendChild(status);

    card.appendChild(imgElement);
    card.appendChild(cardContent);

    imgCard.appendChild(card);
  }
}

function createPagination(totalShows) {
  const pagination = document.querySelector(".pagination-reference");

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalShows / showsPerPage);

  // Create pagination buttons for each page
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("a");
    button.textContent = i;
    button.href = "#";
    button.classList.add("pagination-button");

    // Highlight the current page button
    if (i === currentPage) {
      button.classList.add("active");
    }

    // Add event listener to handle page change
    button.addEventListener("click", (e) => {
      currentPage = i;
      const imgCard = document.querySelector(".show-cards");
      imgCard.innerHTML = ""; // Clear existing show cards
      handleShows();
      updatePaginationButtons();
    });

    pagination.appendChild(button);
  }
}

function updatePaginationButtons() {
  const paginationButtons = document.querySelectorAll(".pagination-button");

  // Remove active class from all buttons
  paginationButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Add active class to the current page button
  const currentButton = document.querySelector(
    `.pagination-button:nth-child(${currentPage})`
  );
  currentButton.classList.add("active");
}

// function to format date into July 4, 2023 format
function formatDate(dateString) {
  if (!dateString) {
    return ""; // Return an empty string if the input date is null or undefined
  }

  const dateParts = dateString.split("-");
  const year = dateParts[0];
  const month = getMonthName(parseInt(dateParts[1], 10));
  const day = parseInt(dateParts[2], 10);

  return `${month} ${day}, ${year}`;
}

function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[monthNumber - 1];
}

//console.log(formatDate("2016-04-15"));

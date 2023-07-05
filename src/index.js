const URL = "http://localhost:3000/shows";
const showsPerPage = 50; // Number of shows per page
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
    const endDate = show.ended;
    const premiered = show.premiered;
    const summary = show.summary;
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
        status.innerHTML = `<p>Premiered: ${premiered} <br> Status: <span style="color: red;">Ended on ${endDate} </span></p>`;
      } else {
        status.innerHTML = `<p>Premiered: ${premiered} <br> Status: Running </p>`;
      }

      // Append the status paragraph to the card content
      cardContent.appendChild(status);

      card.appendChild(imgElement);
      card.appendChild(cardContent);

      imgCard.appendChild(card);
    }
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
    button.addEventListener("click", () => {
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

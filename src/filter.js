document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".filter-section").innerHTML = `
<div class="filter">
<label for="status">Show Status:</label> <br />
<select id="status">
  <option value=""></option>
  <option value="running">Running</option>
  <option value="ended">Ended</option>
</select>
</div>
<div class="filter">
<label for="genre">Genre:</label> <br />
<select id="genre">
  <option value=""></option>
  <option value="action">Action</option>
  <option value="drama">Drama</option>
  <option value="science-fiction">Science-Fiction</option>
  <option value="romance">Romance</option>
  <option value="comedy">Comedy</option>
  <option value="crime">Crime</option>
  <option value="anime">Anime</option>
  <option value="fantasy">Fantasy</option>
  <option value="horror">Horror</option>
  <option value="history">History</option>
  <option value="sports">Sports</option>
  <option value="supernatural">Supernatural</option>
  <option value="thriller">Thriller</option>
  <option value="travel">Travel</option>
  <option value="war">War</option>
  <option value="western">Western</option>
  <option value="adult">Adult</option>
  <option value="adventure">Adventure</option>
  <option value="music">Music</option>
  <option value="mystery">Mystery</option>
  <option value="children">Children</option>
</select>
</div>
<div class="filter">
<label for="rating">Rating:</label> <br />
<select id="rating">
  <option value=""></option>
  <option value="2+">2+</option>
  <option value="3+">3+</option>
  <option value="4+">4+</option>
  <option value="5+">5+</option>
  <option value="6+">6+</option>
  <option value="7+">7+</option>
  <option value="8+">8+</option>
  <option value="9+">9+</option>
</select>
</div>
<div class="filter">
<label for="sort">Sort By:</label> <br />
<select id="sort">
  <option value=""></option>
  <option value="popular">Most Popular</option>
  <option value="unpopular">Least Popular</option>
  <option value="highest-rated">Highest Rating</option>
  <option value="lowest-rated">Lowest Rating</option>
  <option value="a-to-z">A to Z</option>
  <option value="z-to-a">Z to A</option>
</select>
</div>
<button id="filter-btn" class="green-button"><span>Filter</span></button>`;
});

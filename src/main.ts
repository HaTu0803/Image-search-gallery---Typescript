// import axios from "axios";
// import axios from "axios";
interface ImageUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

interface Image {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  downloads: number;
  likes: number;
  liked_by_user: boolean;
  description: string;
  urls: ImageUrls;
  user: User;
}

interface User {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  portfolio_url: string;
  bio: string;
  location: string;
  total_likes: number;
  total_photos: number;
  total_collections: number;
  instagram_username: string;
  twitter_username: string;
  links: UserLinks;
}

interface UserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
}

document.addEventListener("DOMContentLoaded", function () {
  
  const searchForm = document.querySelector(".search-form") as HTMLFormElement;
  const input = document.querySelector(".input") as HTMLInputElement;
  const photoGrid = document.querySelector(".photo-grid") as HTMLElement;
  const hotKeyWords = document.querySelectorAll(".hot-keyword");

  const API_URL = "https://api.unsplash.com/photos/random";
  const ACCESS_KEY = "LMdfguklTWSfi5F5PjY96u-2IOLYk-juubaNfI79UKE";

  function handleSearch(event: Event, query: string): void {
    event.preventDefault();
    axios
      .get(`${API_URL}?count=10&client_id=${ACCESS_KEY}&query=${query}`)
      .then((response) => {
        const images: Image[] = response.data;
        photoGrid.innerHTML = "";
        images.forEach((image) => {
          const imageElement = document.createElement("li");
          imageElement.innerHTML = `
            <img src="" data-src="${image.urls.regular}" class="lazy" alt="Image" />
          `;
          photoGrid.appendChild(imageElement);
        });
        // Start lazy loading after images are added
        observeLazyImages();
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }

  function observeLazyImages(): void {
    const lazyImages = document.querySelectorAll(".lazy");
    lazyImages.forEach((image) => {
      imageObserver.observe(image as Element);
    });
  }

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLImageElement;
        const src = target.getAttribute("data-src");
        if (entry.isIntersecting && src) {
          target.setAttribute("src", src);
          target.classList.remove("lazy"); // Remove lazy class after loading
          imageObserver.unobserve(target);
        }
      });
    },
    {
      rootMargin: "200px",
      threshold: 0.9,
    }
  );

  function handleClickKeyword(event: Event): void {
    const target = event.target as HTMLElement;
    const query = target.innerText;
    handleSearch(event, query);
  }

  hotKeyWords.forEach((keyword) => {
    keyword.addEventListener("click", handleClickKeyword);
  });

  searchForm.addEventListener("submit", (event) => {
    const inputValue = input.value.trim();
    if (!inputValue) {
      event.preventDefault(); // Prevent form submission and page reload

      alert("Please enter a search term.");
      return;
    }

    handleSearch(event, inputValue);
  });

  if (!input.value.trim()) {
    handleSearch({ preventDefault: () => {} } as Event, "random");
  }
});

// Main JavaScript file for LaptopStore

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initializeComponents()

  // Add event listeners
  addEventListeners()

  // Initialize form validation
  initializeFormValidation()
})

// Initialize all components
function initializeComponents() {
  // Initialize tooltips if Bootstrap is loaded
  if (typeof bootstrap !== "undefined") {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  // Initialize carousel auto-play
  initializeCarousel()

  // Initialize search functionality
  initializeSearch()

  // Initialize cart functionality
  initializeCart()

  initializeCategoryToggle()
}

// Add event listeners
function addEventListeners() {
  // Category toggle
  const categoryToggle = document.querySelector('[data-target="#categoryNav"]')
  if (categoryToggle) {
    categoryToggle.addEventListener("click", () => {
      const categoryNav = document.getElementById("categoryNav")
      if (categoryNav) {
        categoryNav.classList.toggle("show")
      }
    })
  }

  // Product card hover effects
  const productCards = document.querySelectorAll(".product-card")
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.classList.add("fade-in")
    })
  })

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Back to top button
  addBackToTopButton()
}

// Initialize carousel
function initializeCarousel() {
  const carousel = document.getElementById("bannerCarousel")
  if (carousel) {
    // Auto-play carousel every 5 seconds
    setInterval(() => {
      if (typeof $ !== "undefined") {
        $("#bannerCarousel").carousel("next")
      }
    }, 5000)

    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        if (typeof $ !== "undefined") {
          $("#bannerCarousel").carousel("prev")
        }
      } else if (e.key === "ArrowRight") {
        if (typeof $ !== "undefined") {
          $("#bannerCarousel").carousel("next")
        }
      }
    })
  }
}

// Initialize search functionality
function initializeSearch() {
  const searchInput = document.querySelector(".search-bar input")
  const searchButton = document.querySelector(".search-bar button")

  if (searchInput && searchButton) {
    // Search on button click
    searchButton.addEventListener("click", () => {
      performSearch(searchInput.value)
    })

    // Search on Enter key press
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch(this.value)
      }
    })

    // Auto-complete functionality (placeholder)
    searchInput.addEventListener("input", function () {
      const query = this.value
      if (query.length > 2) {
        // Implement auto-complete logic here
        showSearchSuggestions(query)
      } else {
        hideSearchSuggestions()
      }
    })
  }
}

// Perform search
function performSearch(query) {
  if (query.trim() === "") {
    alert("Vui lòng nhập từ khóa tìm kiếm")
    return
  }

  // Show loading state
  showLoadingState()

  // Simulate search (replace with actual search logic)
  setTimeout(() => {
    hideLoadingState()
    // Redirect to products page with search query
    window.location.href = `html/products.html?search=${encodeURIComponent(query)}`
  }, 1000)
}

// Show search suggestions (placeholder)
function showSearchSuggestions(query) {
  // Implement search suggestions logic here
  console.log("Showing suggestions for:", query)
}

// Hide search suggestions
function hideSearchSuggestions() {
  // Implement hide suggestions logic here
  console.log("Hiding suggestions")
}

// Initialize cart functionality
function initializeCart() {
  let cartCount = 0
  const cartCountElement = document.querySelector(".cart-count")

  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".btn-primary")
  addToCartButtons.forEach((button) => {
    if (button.textContent.includes("Xem chi tiết")) {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        addToCart()
      })
    }
  })

  function addToCart() {
    cartCount++
    if (cartCountElement) {
      cartCountElement.textContent = cartCount
      cartCountElement.style.display = cartCount > 0 ? "inline-block" : "none"
    }

    // Show success message
    showNotification("Đã thêm sản phẩm vào giỏ hàng!", "success")
  }
}

// Initialize form validation
function initializeFormValidation() {
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      if (!validateForm(this)) {
        e.preventDefault()
      }
    })
  })
}

// Validate form
function validateForm(form) {
  let isValid = true
  const requiredFields = form.querySelectorAll("[required]")

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      showFieldError(field, "Trường này là bắt buộc")
      isValid = false
    } else {
      clearFieldError(field)

      // Validate email
      if (field.type === "email" && !isValidEmail(field.value)) {
        showFieldError(field, "Email không hợp lệ")
        isValid = false
      }

      // Validate phone
      if (field.type === "tel" && !isValidPhone(field.value)) {
        showFieldError(field, "Số điện thoại không hợp lệ")
        isValid = false
      }
    }
  })

  return isValid
}

// Show field error
function showFieldError(field, message) {
  clearFieldError(field)
  field.classList.add("is-invalid")

  const errorDiv = document.createElement("div")
  errorDiv.className = "invalid-feedback"
  errorDiv.textContent = message
  field.parentNode.appendChild(errorDiv)
}

// Clear field error
function clearFieldError(field) {
  field.classList.remove("is-invalid")
  const errorDiv = field.parentNode.querySelector(".invalid-feedback")
  if (errorDiv) {
    errorDiv.remove()
  }
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10,11}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  notification.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
  notification.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert">
            <span>&times;</span>
        </button>
    `

  document.body.appendChild(notification)

  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Show loading state
function showLoadingState() {
  const loadingDiv = document.createElement("div")
  loadingDiv.id = "loading-overlay"
  loadingDiv.className = "position-fixed w-100 h-100 d-flex align-items-center justify-content-center"
  loadingDiv.style.cssText = "top: 0; left: 0; background: rgba(255,255,255,0.8); z-index: 9999;"
  loadingDiv.innerHTML = '<div class="loading-spinner"></div>'

  document.body.appendChild(loadingDiv)
}

// Hide loading state
function hideLoadingState() {
  const loadingDiv = document.getElementById("loading-overlay")
  if (loadingDiv) {
    loadingDiv.remove()
  }
}

// Add back to top button
function addBackToTopButton() {
  const backToTopButton = document.createElement("button")
  backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>'
  backToTopButton.className = "btn btn-primary position-fixed"
  backToTopButton.style.cssText =
    "bottom: 20px; right: 20px; z-index: 999; display: none; width: 50px; height: 50px; border-radius: 50%;"
  backToTopButton.title = "Về đầu trang"

  document.body.appendChild(backToTopButton)

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = "block"
    } else {
      backToTopButton.style.display = "none"
    }
  })

  // Scroll to top on click
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Filter functionality for products page
function initializeProductFilters() {
  const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]')
  const sortSelect = document.querySelector(".sort-options select")

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      applyFilters()
    })
  })

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      sortProducts(this.value)
    })
  }
}

// Apply filters
function applyFilters() {
  const activeFilters = {
    price: [],
    brand: [],
  }

  // Get active price filters
  const priceFilters = document.querySelectorAll('.filter-group input[id^="price"]:checked')
  priceFilters.forEach((filter) => {
    activeFilters.price.push(filter.id)
  })

  // Get active brand filters
  const brandFilters = document.querySelectorAll('.filter-group input[id^="brand"]:checked')
  brandFilters.forEach((filter) => {
    activeFilters.brand.push(filter.id)
  })

  // Filter products (implement actual filtering logic)
  filterProducts(activeFilters)
}

// Filter products
function filterProducts(filters) {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const shouldShow = true

    // Apply filter logic here
    // This is a placeholder - implement actual filtering based on product data

    if (shouldShow) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// Sort products
function sortProducts(sortType) {
  const productsContainer = document.querySelector(".products-section .row")
  const productCards = Array.from(document.querySelectorAll(".product-card"))

  productCards.sort((a, b) => {
    switch (sortType) {
      case "Giá thấp đến cao":
        return getPriceFromCard(a) - getPriceFromCard(b)
      case "Giá cao đến thấp":
        return getPriceFromCard(b) - getPriceFromCard(a)
      case "Tên A-Z":
        return getNameFromCard(a).localeCompare(getNameFromCard(b))
      case "Tên Z-A":
        return getNameFromCard(b).localeCompare(getNameFromCard(a))
      default:
        return 0
    }
  })

  // Re-append sorted cards
  productCards.forEach((card) => {
    productsContainer.appendChild(card.parentElement)
  })
}

// Get price from product card
function getPriceFromCard(card) {
  const priceElement = card.querySelector(".current-price")
  if (priceElement) {
    return Number.parseInt(priceElement.textContent.replace(/[^\d]/g, ""))
  }
  return 0
}

// Get name from product card
function getNameFromCard(card) {
  const nameElement = card.querySelector("h5")
  return nameElement ? nameElement.textContent : ""
}

// Initialize page-specific functionality
function initializePageSpecific() {
  const currentPage = window.location.pathname

  if (currentPage.includes("products.html")) {
    initializeProductFilters()
  }

  if (currentPage.includes("contact.html")) {
    initializeContactForm()
  }
}

// Initialize contact form
function initializeContactForm() {
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      if (validateForm(this)) {
        showLoadingState()

        // Simulate form submission
        setTimeout(() => {
          hideLoadingState()
          showNotification("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.", "success")
          contactForm.reset()
        }, 2000)
      }
    })
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initializePageSpecific()
})

// Utility functions
const Utils = {
  // Format currency
  formatCurrency: (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount),

  // Format date
  formatDate: (date) => new Intl.DateTimeFormat("vi-VN").format(new Date(date)),

  // Debounce function
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle
    return function () {
      const args = arguments

      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },
}

// Category toggle functionality
function initializeCategoryToggle() {
  const categoryToggle = document.getElementById("categoryToggle")
  const categoryDropdown = document.getElementById("categoryDropdown")

  if (categoryToggle && categoryDropdown) {
    categoryToggle.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      categoryDropdown.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!categoryToggle.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("show")
      }
    })
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Utils }
}

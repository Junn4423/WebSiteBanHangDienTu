$(document).ready(() => {
  let currentPage = 1
  let zoomLevel = 1
  let thumbnailsVisible = false
  let soundEnabled = true
  const totalPages = 6 

  // Audio element
  const pageFlipSound = document.getElementById("page-flip-sound")

  // Update total pages display
  $("#total-pages").text(totalPages)
  $("#mobile-total-pages").text(totalPages)

  // Set up event listeners
  setupEventListeners()

  // Initialize flipbook
  initializeFlipbook()

  // Create thumbnails
  createThumbnails()

  // Function to set up event listeners
  function setupEventListeners() {
    // Toggle thumbnails
    $("#toggle-thumbnails, #mobile-toggle-thumbnails").on("click", () => {
      thumbnailsVisible = !thumbnailsVisible
      $(".thumbnails-container").toggleClass("active", thumbnailsVisible)

      // Update mobile menu button text
      $("#mobile-toggle-thumbnails").html(
        thumbnailsVisible ? '<i class="fas fa-th"></i> Ẩn Thumbnails' : '<i class="fas fa-th"></i> Hiện Thumbnails',
      )
    })

    // Zoom controls
    $("#zoom-in").on("click", () => {
      zoomLevel = Math.min(zoomLevel + 0.2, 2)
      applyZoom()
    })

    $("#zoom-out").on("click", () => {
      zoomLevel = Math.max(zoomLevel - 0.2, 0.6)
      applyZoom()
    })

    $("#zoom-reset").on("click", () => {
      zoomLevel = 1
      applyZoom()
    })

    // Close zoom overlay
    $(".close-zoom").on("click", () => {
      $(".zoom-overlay").fadeOut()
    })

    // Toggle sound
    $("#toggle-sound, #mobile-toggle-sound").on("click", () => {
      soundEnabled = !soundEnabled
      updateSoundIcon()
    })

    // Update sound icon based on state
    function updateSoundIcon() {
      const icon = soundEnabled ? "fa-volume-up" : "fa-volume-mute"
      $("#toggle-sound i, #mobile-toggle-sound i").attr("class", `fas ${icon}`)

      // Update mobile menu button text
      $("#mobile-toggle-sound").html(`<i class="fas ${icon}"></i> ${soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}`)
    }

    // First page button
    $("#first-page, #mobile-first-page").on("click", () => {
      $("#flipbook").turn("page", 1)
    })

    // Last page button
    $("#last-page, #mobile-last-page").on("click", () => {
      $("#flipbook").turn("page", totalPages)
    })

    // Go to specific page
    $("#go-to-page, #mobile-go-to-page").on("click", function () {
      const isMobile = $(this).attr("id") === "mobile-go-to-page"
      goToEnteredPage(isMobile)
    })

    // Also go to page when Enter key is pressed in the input field
    $("#page-input, #mobile-page-input").on("keypress", (e) => {
      if (e.which === 13) {
        const isMobile = $(e.target).attr("id") === "mobile-page-input"
        goToEnteredPage(isMobile)
      }
    })

    // Mobile menu toggle
    $("#mobile-menu-btn").on("click", () => {
      $(".mobile-menu").addClass("active")
    })

    // Close mobile menu
    $("#close-mobile-menu").on("click", () => {
      $(".mobile-menu").removeClass("active")
    })

    // Mobile navigation
    $("#mobile-prev").on("click", () => {
      $("#flipbook").turn("previous")
    })

    $("#mobile-next").on("click", () => {
      $("#flipbook").turn("next")
    })

    // Close mobile menu when clicking outside
    $(document).on("click", (e) => {
      if (
        $(".mobile-menu").hasClass("active") &&
        !$(e.target).closest(".mobile-menu").length &&
        !$(e.target).closest("#mobile-menu-btn").length
      ) {
        $(".mobile-menu").removeClass("active")
      }
    })
  }

  // Function to go to entered page
  function goToEnteredPage(isMobile = false) {
    const inputId = isMobile ? "#mobile-page-input" : "#page-input"
    const pageNum = Number.parseInt($(inputId).val())

    if (isNaN(pageNum)) {
      alert("Vui lòng nhập số trang hợp lệ")
      return
    }

    if (pageNum < 1 || pageNum > totalPages) {
      alert(`Vui lòng nhập số trang từ 1 đến ${totalPages}`)
      return
    }

    $("#flipbook").turn("page", pageNum)
    $(inputId).val("") // Clear the input field

    // Close mobile menu if open
    if (isMobile) {
      $(".mobile-menu").removeClass("active")
    }
  }

  // Function to play page flip sound
  function playPageFlipSound() {
    if (soundEnabled && pageFlipSound) {
      pageFlipSound.currentTime = 0
      pageFlipSound.play().catch((error) => {
        console.log("Audio playback error:", error)
      })
    }
  }

  // Function to apply zoom
  function applyZoom() {
    $("#flipbook").css("transform", `scale(${zoomLevel})`)
  }

  // Function to initialize the flipbook
  function initializeFlipbook() {
    // Hide loading overlay
    setTimeout(() => {
      $(".loading-overlay").fadeOut()
    }, 1000)

    $("#flipbook").turn({
      width: 800,
      height: 560,
      autoCenter: true,
      display: "double",
      acceleration: true,
      elevation: 50,
      gradients: true,
      duration: 1000,
      when: {
        turning: function (event, page, view) {
          // Play page flip sound
          playPageFlipSound()

          // Add shadow effect during page turn
          const book = $(this)
          book.addClass("shadow")
          setTimeout(() => {
            book.removeClass("shadow")
          }, 1000)

          // Update current page display
          currentPage = page
          $("#current-page, #mobile-current-page").text(page)

          // Update active thumbnail
          updateActiveThumbnail(page)
        },
      },
    })

    // Set up navigation buttons
    $("#prev").on("click", () => {
      $("#flipbook").turn("previous")
    })

    $("#next").on("click", () => {
      $("#flipbook").turn("next")
    })

    // Add keyboard navigation
    $(document).keydown((e) => {
      switch (e.which) {
        case 37: // left arrow
          $("#flipbook").turn("previous")
          break
        case 39: // right arrow
          $("#flipbook").turn("next")
          break
        default:
          return
      }
      e.preventDefault()
    })

    // Set initial page counter
    $("#current-page, #mobile-current-page").text("1")

    // Update active thumbnail
    updateActiveThumbnail(1)

    // Set max value for page input
    $("#page-input, #mobile-page-input").attr("max", totalPages)

    // Handle window resize
    $(window).on("resize", handleResize)
    handleResize()
  }

  // Function to handle window resize
  function handleResize() {
    const width = $(window).width()

    if (width <= 400) {
      $("#flipbook").turn("size", 300, 210)
    } else if (width <= 576) {
      $("#flipbook").turn("size", 350, 245)
    } else if (width <= 768) {
      $("#flipbook").turn("size", 500, 350)
    } else if (width <= 900) {
      $("#flipbook").turn("size", 600, 420)
    } else if (width <= 1024) {
      $("#flipbook").turn("size", 700, 490)
    } else {
      $("#flipbook").turn("size", 800, 560)
    }

    // Reset zoom level on resize
    zoomLevel = 1
    applyZoom()
  }

  // Function to create thumbnails
  function createThumbnails() {
    const thumbnailsData = [
      { page: 1, title: "Bìa trước" },
      { page: 2, title: "Gaming" },
      { page: 3, title: "Văn phòng" },
      { page: 4, title: "Đồ họa" },
      { page: 5, title: "MacBook" },
      { page: 6, title: "Bìa sau" },
    ]

    thumbnailsData.forEach((data, index) => {
      const thumbnail = $('<div class="thumbnail"></div>')

      // Set background based on page type
      if (index === 0 || index === thumbnailsData.length - 1) {
        // Cover pages
        thumbnail.css({
          background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
        })
      } else {
        // Content pages - use product images
        const imageIndex = index // Adjust as needed
        thumbnail.css({
          backgroundImage: `url(../assets/images/img${imageIndex}.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        })
      }

      thumbnail.append(`<div class="page-num">${data.page}</div>`)

      thumbnail.on("click", () => {
        $("#flipbook").turn("page", data.page)
      })

      $(".thumbnails-scroller").append(thumbnail)
    })
  }

  // Function to update active thumbnail
  function updateActiveThumbnail(page) {
    // Remove active class from all thumbnails
    $(".thumbnail").removeClass("active")

    // Add active class to current thumbnail
    if (page >= 1 && page <= totalPages) {
      $(".thumbnail")
        .eq(page - 1)
        .addClass("active")

      // Scroll to the active thumbnail
      const thumbnailsScroller = $(".thumbnails-scroller")
      const activeThumb = $(".thumbnail.active")

      if (activeThumb.length) {
        thumbnailsScroller.animate(
          {
            scrollLeft:
              activeThumb.position().left +
              thumbnailsScroller.scrollLeft() -
              thumbnailsScroller.width() / 2 +
              activeThumb.width() / 2,
          },
          300,
        )
      }
    }
  }

  // Double-click to zoom functionality
  $("#flipbook").on("dblclick", ".page", function () {
    const page = $(this)
    const pageContent = page.find("img").first()

    if (pageContent.length) {
      const zoomedImage = $(".zoomed-image")
      zoomedImage.css({
        "background-image": `url(${pageContent.attr("src")})`,
        "background-size": "contain",
        "background-position": "center",
        "background-repeat": "no-repeat",
      })
      $(".zoom-overlay").fadeIn()
    }
  })
})

// Ensure jQuery is loaded
if (typeof jQuery == "undefined") {
  console.error("jQuery is not loaded. Please include jQuery in your HTML.")
}

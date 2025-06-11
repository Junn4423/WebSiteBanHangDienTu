// Wait for document to be ready
$(document).ready(() => {
  const totalImages = 211 // Updated to 211 images
  const imagePath = "Image_Procs_Catalogue/"
  let loadedImages = 0
  let flipbookInitialized = false
  let currentPage = 1
  let zoomLevel = 1
  let thumbnailsVisible = false
  let soundEnabled = true
  const totalPages = totalImages * 2 + 2 

  const pageFlipSound = document.getElementById("page-flip-sound")

  createCoverPages()

  preloadImages()

  $("#total-pages").text(totalPages)
  $("#mobile-total-pages").text(totalPages)

  setupEventListeners()

  function setupEventListeners() {
    // Toggle thumbnails
    $("#toggle-thumbnails, #mobile-toggle-thumbnails").on("click", () => {
      thumbnailsVisible = !thumbnailsVisible
      $(".thumbnails-container").toggleClass("active", thumbnailsVisible)

      if (thumbnailsVisible) {
        $(".catalog-container").css("margin-bottom", "150px")
      } else {
        $(".catalog-container").css("margin-bottom", "70px")
      }

      $("#mobile-toggle-thumbnails").html(
        thumbnailsVisible ? '<i class="fas fa-th"></i> Hide Thumbnails' : '<i class="fas fa-th"></i> Show Thumbnails',
      )
    })

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

    $(".close-zoom").on("click", () => {
      $(".zoom-overlay").fadeOut()
    })

    $("#toggle-sound, #mobile-toggle-sound").on("click", () => {
      soundEnabled = !soundEnabled
      updateSoundIcon()
    })

    function updateSoundIcon() {
      const icon = soundEnabled ? "fa-volume-up" : "fa-volume-mute"
      $("#toggle-sound i, #mobile-toggle-sound i").attr("class", `fas ${icon}`)

      $("#mobile-toggle-sound").html(`<i class="fas ${icon}"></i> ${soundEnabled ? "Mute Sound" : "Enable Sound"}`)
    }

    $("#first-page, #mobile-first-page").on("click", () => {
      $("#flipbook").turn("page", 1)
    })

    $("#last-page, #mobile-last-page").on("click", () => {
      $("#flipbook").turn("page", totalPages)
    })

    $("#go-to-page, #mobile-go-to-page").on("click", function () {
      const isMobile = $(this).attr("id") === "mobile-go-to-page"
      goToEnteredPage(isMobile)
    })

    $("#page-input, #mobile-page-input").on("keypress", (e) => {
      if (e.which === 13) {
        // Enter key
        const isMobile = $(e.target).attr("id") === "mobile-page-input"
        goToEnteredPage(isMobile)
      }
    })

    $("#mobile-menu-btn").on("click", () => {
      $(".mobile-menu").addClass("active")
    })

    $("#close-mobile-menu").on("click", () => {
      $(".mobile-menu").removeClass("active")
    })

    $("#mobile-prev").on("click", () => {
      $("#flipbook").turn("previous")
    })

    $("#mobile-next").on("click", () => {
      $("#flipbook").turn("next")
    })

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

  function goToEnteredPage(isMobile = false) {
    const inputId = isMobile ? "#mobile-page-input" : "#page-input"
    const pageNum = Number.parseInt($(inputId).val())

    if (isNaN(pageNum)) {
      alert("Please enter a valid page number")
      return
    }

    if (pageNum < 1 || pageNum > totalPages) {
      alert(`Please enter a page number between 1 and ${totalPages}`)
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

  // Function to create cover pages
  function createCoverPages() {
    createFrontCover()
    createBackCover()
  }

  // Function to create front cover design
  function createFrontCover() {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 560
    const ctx = canvas.getContext("2d")

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 560)
    gradient.addColorStop(0, "#1a3a6c")
    gradient.addColorStop(0.5, "#b21f1f")
    gradient.addColorStop(1, "#fdbb2d")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 400, 560)

    // Load and draw SOF logo
    const logo = new Image()
    logo.crossOrigin = "anonymous"
    logo.onload = function () {
      // Draw logo at the top center
      const logoWidth = 150
      const logoHeight = (logoWidth / this.width) * this.height
      ctx.drawImage(this, (400 - logoWidth) / 2, 80, logoWidth, logoHeight)

      // Title
      ctx.fillStyle = "white"
      ctx.font = "bold 45px 'Playfair Display', serif"
      ctx.textAlign = "center"
      ctx.fillText("SOF", 200, 280)

      ctx.font = "bold 30px 'Playfair Display', serif"
      ctx.fillText("CATALOGUE", 200, 330)

      // Decorative elements
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(100, 370)
      ctx.lineTo(300, 370)
      ctx.stroke()

      // Year
      ctx.font = "bold 30px 'Montserrat', sans-serif"
      ctx.fillText("2025", 200, 450)

      // Save the canvas as an image and use it as background for front cover
      const dataUrl = canvas.toDataURL("image/png")
      $(".cover-front").css({
        "background-image": `url(${dataUrl})`,
        "background-size": "cover",
        "background-position": "center",
      })
    }
    logo.src = "public/images/sof-logo.png"
  }

  // Function to create back cover design
  function createBackCover() {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 560
    const ctx = canvas.getContext("2d")

    // Background gradient (reverse of front cover)
    const gradient = ctx.createLinearGradient(0, 0, 400, 560)
    gradient.addColorStop(0, "#fdbb2d")
    gradient.addColorStop(0.5, "#b21f1f")
    gradient.addColorStop(1, "#1a3a6c")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 400, 560)

    // Load and draw SOF logo
    const logo = new Image()
    logo.crossOrigin = "anonymous"
    logo.onload = function () {
      // Draw logo at the center
      const logoWidth = 120
      const logoHeight = (logoWidth / this.width) * this.height
      ctx.drawImage(this, (400 - logoWidth) / 2, 150, logoWidth, logoHeight)

      // Thank you text
      ctx.fillStyle = "white"
      ctx.font = "24px 'Playfair Display', serif"
      ctx.textAlign = "center"
      ctx.fillText("Thank you for viewing", 200, 350)
      ctx.fillText("our catalogue", 200, 380)

      // Copyright
      ctx.font = "14px 'Montserrat', sans-serif"
      ctx.fillText("© 2025 SOF. Allrights reserved.", 200, 500)

      // Save the canvas as an image and use it as background for back cover
      const dataUrl = canvas.toDataURL("image/png")
      $(".cover-back").css({
        "background-image": `url(${dataUrl})`,
        "background-size": "cover",
        "background-position": "center",
      })
    }
    logo.src = "public/images/sof-logo.png"
  }

  // Function to preload all images
  function preloadImages() {
    for (let i = 1; i <= totalImages; i++) {
      const img = new Image()
      img.crossOrigin = "anonymous" // Avoid CORS issues
      img.onload = function () {
        loadedImages++
        updateLoadingProgress()

        // Add the image split across two pages
        addSplitImageToFlipbook(i, this)

        // Add thumbnail
        addThumbnail(i, this.src)

        // Initialize the flipbook when all images are loaded
        if (loadedImages === totalImages && !flipbookInitialized) {
          initializeFlipbook()
        }
      }
      img.onerror = () => {
        console.error(`Failed to load image: ${i}.png`)
        loadedImages++
        updateLoadingProgress()

        // Add blank pages instead
        addBlankPagesToFlipbook(i)

        // Add blank thumbnail
        addBlankThumbnail(i)

        // Initialize the flipbook when all images are loaded
        if (loadedImages === totalImages && !flipbookInitialized) {
          initializeFlipbook()
        }
      }
      img.src = `${imagePath}${i}.png`
    }
  }

  // Function to update loading progress
  function updateLoadingProgress() {
    const progress = Math.floor((loadedImages / totalImages) * 100)
    $(".progress-text").text(`${progress}%`)
    $(".progress-fill").css("width", `${progress}%`)

    if (progress === 100) {
      setTimeout(() => {
        $(".loading-overlay").fadeOut()
      }, 500)
    }
  }

  // Function to add a split image across two pages
  function addSplitImageToFlipbook(imageIndex, imgElement) {
    // Calculate page numbers (2 pages per image)
    const leftPageNum = (imageIndex - 1) * 2 + 1
    const rightPageNum = leftPageNum + 1

    // Create left half page (odd page)
    const leftPage = $('<div class="page"></div>')
    leftPage.css({
      "background-image": `url(${imgElement.src})`,
      "background-size": "200% 100%",
      "background-position": "left center",
    })

    // Create right half page (even page)
    const rightPage = $('<div class="page"></div>')
    rightPage.css({
      "background-image": `url(${imgElement.src})`,
      "background-size": "200% 100%",
      "background-position": "right center",
    })

    // Add page numbers
    const leftPageNumEl = $('<div class="page-number"></div>').text(leftPageNum)
    const rightPageNumEl = $('<div class="page-number"></div>').text(rightPageNum)

    leftPage.append(leftPageNumEl)
    rightPage.append(rightPageNumEl)

    // Add double-click event for zooming
    leftPage.on("dblclick", () => showZoomedImage(imgElement.src, "left"))
    rightPage.on("dblclick", () => showZoomedImage(imgElement.src, "right"))

    // Insert the pages before the back cover
    leftPage.insertBefore(".cover-back")
    rightPage.insertBefore(".cover-back")
  }

  // Function to show zoomed image
  function showZoomedImage(src, side) {
    const zoomedImage = $(".zoomed-image")
    zoomedImage.css({
      "background-image": `url(${src})`,
      "background-position": side === "left" ? "left center" : "right center",
    })
    $(".zoom-overlay").fadeIn()
  }

  // Function to add blank pages to the flipbook
  function addBlankPagesToFlipbook(imageIndex) {
    // Calculate page numbers (2 pages per image)
    const leftPageNum = (imageIndex - 1) * 2 + 1
    const rightPageNum = leftPageNum + 1

    const leftPage = $('<div class="page blank-page"></div>')
    leftPage.text(`Page ${leftPageNum} (Image not found)`)

    const rightPage = $('<div class="page blank-page"></div>')
    rightPage.text(`Page ${rightPageNum} (Image not found)`)

    // Add page numbers
    const leftPageNumEl = $('<div class="page-number"></div>').text(leftPageNum)
    const rightPageNumEl = $('<div class="page-number"></div>').text(rightPageNum)

    leftPage.append(leftPageNumEl)
    rightPage.append(rightPageNumEl)

    leftPage.insertBefore(".cover-back")
    rightPage.insertBefore(".cover-back")
  }

  // Function to add thumbnail
  function addThumbnail(imageIndex, src) {
    const pageNum = (imageIndex - 1) * 2 + 1
    const thumbnail = $('<div class="thumbnail"></div>')
    thumbnail.css("background-image", `url(${src})`)
    thumbnail.append(`<div class="page-num">${pageNum}-${pageNum + 1}</div>`)

    thumbnail.on("click", () => {
      $("#flipbook").turn("page", pageNum)
    })

    $(".thumbnails-scroller").append(thumbnail)
  }

  // Function to add blank thumbnail
  function addBlankThumbnail(imageIndex) {
    const pageNum = (imageIndex - 1) * 2 + 1
    const thumbnail = $('<div class="thumbnail blank-page"></div>')
    thumbnail.append(`<div class="page-num">${pageNum}-${pageNum + 1}</div>`)

    thumbnail.on("click", () => {
      $("#flipbook").turn("page", pageNum)
    })

    $(".thumbnails-scroller").append(thumbnail)
  }

  // Function to initialize the flipbook
  function initializeFlipbook() {
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

    flipbookInitialized = true

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
    // Adjust book size for mobile
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

  // Function to update active thumbnail
  function updateActiveThumbnail(page) {
    // Calculate which thumbnail corresponds to this page
    const thumbnailIndex = Math.floor((page - 1) / 2)

    // Remove active class from all thumbnails
    $(".thumbnail").removeClass("active")

    // Add active class to current thumbnail
    if (thumbnailIndex >= 0 && thumbnailIndex < totalImages) {
      $(".thumbnail").eq(thumbnailIndex).addClass("active")

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
})

// Ensure jQuery is loaded
if (typeof jQuery == "undefined") {
  console.error("jQuery is not loaded. Please include jQuery in your HTML.")
}

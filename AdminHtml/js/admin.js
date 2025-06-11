// Admin Panel JavaScript
$(document).ready(() => {
  // Sidebar toggle
  $(".sidebar-toggle").click(() => {
    $(".sidebar").toggleClass("active")
  })

  // Close sidebar when clicking outside on mobile
  $(document).click((e) => {
    if ($(window).width() <= 768) {
      if (!$(e.target).closest(".sidebar, .sidebar-toggle").length) {
        $(".sidebar").removeClass("active")
      }
    }
  })

  // Select all checkbox
  $("#selectAll").change(function () {
    $('tbody input[type="checkbox"]').prop("checked", this.checked)
  })

  // Individual checkbox change
  $('tbody input[type="checkbox"]').change(() => {
    var total = $('tbody input[type="checkbox"]').length
    var checked = $('tbody input[type="checkbox"]:checked').length
    $("#selectAll").prop("checked", total === checked)
  })

  // Search functionality
  $(".search-box input").on("input", function () {
    var searchTerm = $(this).val().toLowerCase()
    // Implement search logic here
    console.log("Searching for:", searchTerm)
  })

  // Notification click
  $(".notifications").click(() => {
    // Show notifications dropdown
    console.log("Show notifications")
  })

  // Auto-refresh data every 30 seconds
  setInterval(() => {
    // Refresh dashboard data
    refreshDashboardData()
  }, 30000)

  // Initialize tooltips
  $('[data-toggle="tooltip"]').tooltip()

  // Initialize popovers
  $('[data-toggle="popover"]').popover()
})

// Refresh dashboard data
function refreshDashboardData() {
  // Simulate data refresh
  console.log("Refreshing dashboard data...")

  // Update stats cards with animation
  $(".stats-card").each(function () {
    $(this).addClass("updating")
    setTimeout(() => {
      $(this).removeClass("updating")
    }, 1000)
  })
}

// Show success message
function showSuccessMessage(message) {
  const alert = $(`
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle"></i> ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `)

  $(".content").prepend(alert)

  setTimeout(() => {
    alert.alert("close")
  }, 5000)
}

// Show error message
function showErrorMessage(message) {
  const alert = $(`
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle"></i> ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `)

  $(".content").prepend(alert)

  setTimeout(() => {
    alert.alert("close")
  }, 5000)
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(date))
}

// Confirm delete action
function confirmDelete(itemName, callback) {
  if (confirm(`Bạn có chắc chắn muốn xóa "${itemName}"?`)) {
    callback()
  }
}

// Export data to Excel
function exportToExcel(data, filename) {
  // Implement Excel export functionality
  console.log("Exporting to Excel:", filename)
  showSuccessMessage("Đã xuất dữ liệu thành công!")
}

// Import data from Excel
function importFromExcel(file, callback) {
  // Implement Excel import functionality
  console.log("Importing from Excel:", file.name)
  showSuccessMessage("Đã nhập dữ liệu thành công!")
  if (callback) callback()
}

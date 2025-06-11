// Products page specific JavaScript
$(document).ready(() => {
  // Initialize products page
  initializeProductsPage()

  // Handle image upload
  $("#productImages").change(function () {
    handleImageUpload(this.files)
  })

  // Handle form submission
  $("#addProductForm").submit((e) => {
    e.preventDefault()
    addNewProduct()
  })

  // Handle bulk actions
  $(".bulk-action-btn").click(function () {
    var action = $(this).data("action")
    var selectedItems = getSelectedProducts()

    if (selectedItems.length === 0) {
      showErrorMessage("Vui lòng chọn ít nhất một sản phẩm")
      return
    }

    handleBulkAction(action, selectedItems)
  })

  // Handle individual product actions
  $(".action-buttons .btn").click(function () {
    var action = $(this).data("action") || $(this).attr("title").toLowerCase()
    var productId = $(this).closest("tr").data("product-id")

    handleProductAction(action, productId)
  })

  // Handle category filter
  $('select[name="category"]').change(function () {
    filterProductsByCategory($(this).val())
  })

  // Handle status filter
  $('select[name="status"]').change(function () {
    filterProductsByStatus($(this).val())
  })

  // Handle search
  $(".search-box input").on(
    "input",
    debounce(function () {
      searchProducts($(this).val())
    }, 300),
  )
})

// Initialize products page
function initializeProductsPage() {
  loadProducts()
  loadCategories()
  loadBrands()
}

// Load products data
function loadProducts(page = 1, filters = {}) {
  // Simulate API call
  console.log("Loading products...", { page, filters })

  // Show loading state
  showLoadingState()

  // Simulate delay
  setTimeout(() => {
    hideLoadingState()
    updateProductsTable(mockProductsData)
  }, 1000)
}

// Mock products data
const mockProductsData = [
  {
    id: 1,
    name: "Laptop Gaming ROG Strix G15",
    sku: "LT001",
    category: "Laptop Gaming",
    brand: "ASUS",
    price: 25990000,
    oldPrice: 28990000,
    stock: 45,
    status: "active",
    image: "../assets/images/img1.jpg",
    createdAt: "2024-12-15",
  },
  {
    id: 2,
    name: "MacBook Pro M2 13 inch",
    sku: "MB001",
    category: "MacBook",
    brand: "Apple",
    price: 45990000,
    oldPrice: null,
    stock: 23,
    status: "active",
    image: "../assets/images/img4.jpg",
    createdAt: "2024-12-14",
  },
  // Add more mock data as needed
]

// Update products table
function updateProductsTable(products) {
  const tbody = $(".table tbody")
  tbody.empty()

  products.forEach((product) => {
    const row = createProductRow(product)
    tbody.append(row)
  })

  // Reinitialize event handlers
  initializeTableEvents()
}

// Create product row
function createProductRow(product) {
  const stockClass = product.stock <= 5 ? "stock-low" : product.stock === 0 ? "stock-out" : ""
  const statusBadge = getStatusBadge(product.status, product.stock)

  return `
        <tr data-product-id="${product.id}">
            <td><input type="checkbox"></td>
            <td>
                <img src="${product.image}" alt="Product" class="product-thumb">
            </td>
            <td>
                <div class="product-info">
                    <h6>${product.name}</h6>
                    <small class="text-muted">SKU: ${product.sku}</small>
                </div>
            </td>
            <td>${product.category}</td>
            <td>
                <div class="price-info">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    ${product.oldPrice ? `<small class="old-price">${formatCurrency(product.oldPrice)}</small>` : ""}
                </div>
            </td>
            <td>
                <span class="stock-info ${stockClass}">
                    <span class="stock-number">${product.stock}</span>
                    <small class="text-muted">chiếc</small>
                </span>
            </td>
            <td>${statusBadge}</td>
            <td>${formatDate(product.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" title="Xem" data-action="view">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" title="Sửa" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Xóa" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
}

// Get status badge
function getStatusBadge(status, stock) {
  if (stock === 0) {
    return '<span class="badge badge-danger">Hết hàng</span>'
  } else if (stock <= 5) {
    return '<span class="badge badge-warning">Sắp hết</span>'
  } else if (status === "active") {
    return '<span class="badge badge-success">Còn hàng</span>'
  } else {
    return '<span class="badge badge-secondary">Ngừng bán</span>'
  }
}

// Handle image upload
function handleImageUpload(files) {
  const uploadArea = $(".upload-area")

  if (files.length > 0) {
    uploadArea.html(`
            <i class="fas fa-check-circle text-success"></i>
            <p>${files.length} ảnh đã chọn</p>
        `)
  }
}

// Add new product
function addNewProduct() {
  const formData = new FormData($("#addProductForm")[0])

  // Validate form
  if (!validateProductForm(formData)) {
    return
  }

  // Show loading
  const submitBtn = $(".modal-footer .btn-primary")
  const originalText = submitBtn.text()
  submitBtn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin"></i> Đang lưu...')

  // Simulate API call
  setTimeout(() => {
    submitBtn.prop("disabled", false).text(originalText)
    $("#addProductModal").modal("hide")
    showSuccessMessage("Đã thêm sản phẩm thành công!")
    loadProducts() // Reload products list
  }, 2000)
}

// Validate product form
function validateProductForm(formData) {
  const requiredFields = ["name", "price", "sku", "stock", "category"]

  for (const field of requiredFields) {
    if (!formData.get(field)) {
      showErrorMessage(`Vui lòng nhập ${field}`)
      return false
    }
  }

  return true
}

// Handle product actions
function handleProductAction(action, productId) {
  switch (action) {
    case "view":
    case "xem":
      viewProduct(productId)
      break
    case "edit":
    case "sửa":
      editProduct(productId)
      break
    case "delete":
    case "xóa":
      deleteProduct(productId)
      break
  }
}

// View product
function viewProduct(productId) {
  console.log("Viewing product:", productId)
  // Implement view product modal
}

// Edit product
function editProduct(productId) {
  console.log("Editing product:", productId)
  // Implement edit product modal
}

// Delete product
function deleteProduct(productId) {
  const product = mockProductsData.find((p) => p.id == productId)

  confirmDelete(product?.name || "sản phẩm này", () => {
    // Simulate API call
    setTimeout(() => {
      showSuccessMessage("Đã xóa sản phẩm thành công!")
      loadProducts() // Reload products list
    }, 1000)
  })
}

// Get selected products
function getSelectedProducts() {
  const selected = []
  $('tbody input[type="checkbox"]:checked').each(function () {
    const productId = $(this).closest("tr").data("product-id")
    selected.push(productId)
  })
  return selected
}

// Handle bulk actions
function handleBulkAction(action, selectedItems) {
  console.log("Bulk action:", action, selectedItems)

  switch (action) {
    case "delete":
      confirmDelete(`${selectedItems.length} sản phẩm`, () => {
        // Implement bulk delete
        showSuccessMessage(`Đã xóa ${selectedItems.length} sản phẩm!`)
        loadProducts()
      })
      break
    case "activate":
      // Implement bulk activate
      showSuccessMessage(`Đã kích hoạt ${selectedItems.length} sản phẩm!`)
      loadProducts()
      break
    case "deactivate":
      // Implement bulk deactivate
      showSuccessMessage(`Đã vô hiệu hóa ${selectedItems.length} sản phẩm!`)
      loadProducts()
      break
  }
}

// Filter products by category
function filterProductsByCategory(category) {
  console.log("Filtering by category:", category)
  loadProducts(1, { category })
}

// Filter products by status
function filterProductsByStatus(status) {
  console.log("Filtering by status:", status)
  loadProducts(1, { status })
}

// Search products
function searchProducts(query) {
  console.log("Searching products:", query)
  loadProducts(1, { search: query })
}

// Load categories
function loadCategories() {
  // Simulate loading categories
  console.log("Loading categories...")
}

// Load brands
function loadBrands() {
  // Simulate loading brands
  console.log("Loading brands...")
}

// Initialize table events
function initializeTableEvents() {
  // Reinitialize checkbox events
  $('tbody input[type="checkbox"]')
    .off("change")
    .on("change", () => {
      var total = $('tbody input[type="checkbox"]').length
      var checked = $('tbody input[type="checkbox"]:checked').length
      $("#selectAll").prop("checked", total === checked)
    })

  // Reinitialize action button events
  $(".action-buttons .btn")
    .off("click")
    .on("click", function () {
      var action = $(this).data("action") || $(this).attr("title").toLowerCase()
      var productId = $(this).closest("tr").data("product-id")
      handleProductAction(action, productId)
    })
}

// Show loading state
function showLoadingState() {
  $(".table tbody").html(`
        <tr>
            <td colspan="9" class="text-center py-4">
                <i class="fas fa-spinner fa-spin"></i> Đang tải...
            </td>
        </tr>
    `)
}

// Hide loading state
function hideLoadingState() {
  // Loading will be hidden when table is updated
}

// Debounce function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Mock functions (replace with your actual implementations)
function showErrorMessage(message) {
  alert("Error: " + message)
}

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN")
}

function showSuccessMessage(message) {
  alert("Success: " + message)
}

function confirmDelete(itemName, callback) {
  if (confirm(`Bạn có chắc chắn muốn xóa ${itemName}?`)) {
    callback()
  }
}

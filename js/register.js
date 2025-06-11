// Register page functionality

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 100,
  })

  initializeRegisterForm()
  initializePasswordStrength()
  initializeCategoryToggle()
})

// Initialize register form
function initializeRegisterForm() {
  const form = document.getElementById("registerForm")
  const submitBtn = document.getElementById("submitBtn")

  if (!form) return

  // Real-time validation
  const inputs = form.querySelectorAll("input, select")
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input))
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) {
        validateField(input)
      }
    })
  })

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (validateForm(form)) {
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...'

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get form data
      const formData = new FormData(form)
      const userData = Object.fromEntries(formData.entries())

      // Show success modal with user data
      showSuccessModal(userData)

      submitBtn.disabled = false
      submitBtn.innerHTML = '<i class="fas fa-user-plus mr-2"></i>Tạo tài khoản'
    }
  })
}

// Validate individual field
function validateField(field) {
  const value = field.value.trim()
  const fieldName = field.name
  let isValid = true
  let errorMessage = ""

  // Clear previous validation
  field.classList.remove("is-invalid", "is-valid")
  const feedback = field.parentNode.querySelector(".invalid-feedback")
  if (feedback) feedback.textContent = ""

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    isValid = false
    errorMessage = "Trường này là bắt buộc"
  } else if (value) {
    // Specific field validations
    switch (fieldName) {
      case "fullName":
        if (value.length < 2) {
          isValid = false
          errorMessage = "Họ tên phải có ít nhất 2 ký tự"
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
          isValid = false
          errorMessage = "Họ tên chỉ được chứa chữ cái và khoảng trắng"
        }
        break

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          isValid = false
          errorMessage = "Email không hợp lệ"
        }
        break

      case "phone":
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
        if (!phoneRegex.test(value)) {
          isValid = false
          errorMessage = "Số điện thoại không hợp lệ (VD: 0901234567)"
        }
        break

      case "birthDate":
        const birthDate = new Date(value)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        if (age < 13) {
          isValid = false
          errorMessage = "Bạn phải từ 13 tuổi trở lên"
        } else if (age > 100) {
          isValid = false
          errorMessage = "Ngày sinh không hợp lệ"
        }
        break

      case "address":
        if (value.length < 10) {
          isValid = false
          errorMessage = "Địa chỉ phải có ít nhất 10 ký tự"
        }
        break

      case "password":
        const passwordValidation = validatePassword(value)
        if (!passwordValidation.isValid) {
          isValid = false
          errorMessage = passwordValidation.message
        }
        // Also validate confirm password if it has value
        const confirmPassword = document.getElementById("confirmPassword")
        if (confirmPassword.value) {
          validateField(confirmPassword)
        }
        break

      case "confirmPassword":
        const password = document.getElementById("password").value
        if (value !== password) {
          isValid = false
          errorMessage = "Mật khẩu xác nhận không khớp"
        }
        break

      case "agreeTerms":
        if (!field.checked) {
          isValid = false
          errorMessage = "Bạn phải đồng ý với điều khoản sử dụng"
        }
        break
    }
  }

  // Apply validation result
  if (isValid) {
    field.classList.add("is-valid")
  } else {
    field.classList.add("is-invalid")
    if (feedback) {
      feedback.textContent = errorMessage
    }
  }

  return isValid
}

// Validate entire form
function validateForm(form) {
  let isValid = true
  const inputs = form.querySelectorAll("input, select")

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false
    }
  })

  return isValid
}

// Password validation
function validatePassword(password) {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Mật khẩu phải có ít nhất ${minLength} ký tự`,
      strength: "weak",
    }
  }

  let score = 0
  if (hasUpperCase) score++
  if (hasLowerCase) score++
  if (hasNumbers) score++
  if (hasSpecialChar) score++

  if (score < 3) {
    return {
      isValid: false,
      message: "Mật khẩu phải chứa ít nhất 3 trong 4: chữ hoa, chữ thường, số, ký tự đặc biệt",
      strength: score < 2 ? "weak" : "medium",
    }
  }

  return {
    isValid: true,
    message: "Mật khẩu mạnh",
    strength: "strong",
  }
}

// Initialize password strength indicator
function initializePasswordStrength() {
  const passwordInput = document.getElementById("password")
  const strengthContainer = passwordInput.parentNode.querySelector(".password-strength")
  const strengthBar = strengthContainer.querySelector(".strength-fill")
  const strengthText = strengthContainer.querySelector(".strength-text")

  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value
    const validation = validatePassword(password)

    // Update strength bar
    strengthContainer.className = `password-strength strength-${validation.strength}`
    strengthText.textContent = validation.message

    // Update visual feedback
    if (password.length === 0) {
      strengthContainer.className = "password-strength"
      strengthText.textContent = "Nhập mật khẩu"
    }
  })
}

// Show success modal with user data
function showSuccessModal(userData) {
  const modal = document.getElementById("successModal")
  const userInfoCard = document.getElementById("userInfoCard")

  // Format user data for display
  const userInfo = [
    { label: "Họ và tên", value: userData.fullName },
    { label: "Email", value: userData.email },
    { label: "Số điện thoại", value: userData.phone },
    { label: "Ngày sinh", value: formatDate(userData.birthDate) },
    { label: "Giới tính", value: getGenderText(userData.gender) },
    { label: "Địa chỉ", value: userData.address },
    { label: "Nhận thông tin khuyến mãi", value: userData.agreeMarketing ? "Có" : "Không" },
  ]

  // Populate user info card
  userInfoCard.innerHTML = userInfo
    .map(
      (item) => `
        <div class="user-info-item">
            <span class="user-info-label">${item.label}:</span>
            <span class="user-info-value">${item.value}</span>
        </div>
    `,
    )
    .join("")

  // Show modal
  $(modal).modal("show")
}

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function getGenderText(gender) {
  const genderMap = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  }
  return genderMap[gender] || gender
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

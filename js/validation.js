// Enhanced Form Validation Library for LaptopStore

class FormValidator {
  constructor(form) {
    this.form = form
    this.errors = {}
    this.rules = {}
    this.messages = {
      required: "Trường này là bắt buộc",
      email: "Email không hợp lệ",
      phone: "Số điện thoại không hợp lệ",
      minLength: "Tối thiểu {min} ký tự",
      maxLength: "Tối đa {max} ký tự",
      pattern: "Định dạng không hợp lệ",
      passwordWeak: "Mật khẩu quá yếu",
      passwordMismatch: "Mật khẩu xác nhận không khớp",
      ageInvalid: "Tuổi không hợp lệ",
      nameInvalid: "Họ tên chỉ được chứa chữ cái và khoảng trắng",
    }
  }

  // Thêm rule validation cho field
  addRule(fieldName, rule, message = null) {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = []
    }
    this.rules[fieldName].push({
      rule: rule,
      message: message,
    })
    return this
  }

  // Validate từng field riêng lẻ
  validateField(fieldName, value) {
    const rules = this.rules[fieldName]
    if (!rules) return true

    // Duyệt qua tất cả rules của field
    for (const ruleObj of rules) {
      const { rule, message } = ruleObj
      let isValid = true
      let errorMessage = message

      // Kiểm tra loại rule
      if (typeof rule === "string") {
        switch (rule) {
          case "required":
            isValid = value.trim() !== ""
            errorMessage = errorMessage || this.messages.required
            break
          case "email":
            isValid = this.isValidEmail(value)
            errorMessage = errorMessage || this.messages.email
            break
          case "phone":
            isValid = this.isValidPhone(value)
            errorMessage = errorMessage || this.messages.phone
            break
        }
      } else if (typeof rule === "object") {
        // Rule dạng object với options
        if (rule.minLength) {
          isValid = value.length >= rule.minLength
          errorMessage = errorMessage || this.messages.minLength.replace("{min}", rule.minLength)
        }
        if (rule.maxLength && isValid) {
          isValid = value.length <= rule.maxLength
          errorMessage = errorMessage || this.messages.maxLength.replace("{max}", rule.maxLength)
        }
        if (rule.pattern && isValid) {
          isValid = rule.pattern.test(value)
          errorMessage = errorMessage || this.messages.pattern
        }
      } else if (typeof rule === "function") {
        // Custom validation function
        isValid = rule(value)
        errorMessage = errorMessage || "Giá trị không hợp lệ"
      }

      // Nếu không hợp lệ, lưu lỗi và return false
      if (!isValid) {
        this.errors[fieldName] = errorMessage
        return false
      }
    }

    // Xóa lỗi nếu field hợp lệ
    delete this.errors[fieldName]
    return true
  }

  // Validate toàn bộ form
  validate() {
    this.errors = {}
    let isValid = true

    // Lấy tất cả fields trong form
    const fields = this.form.querySelectorAll("input, select, textarea")

    fields.forEach((field) => {
      const fieldName = field.name || field.id
      if (fieldName && this.rules[fieldName]) {
        const fieldValid = this.validateField(fieldName, field.value)
        if (!fieldValid) {
          isValid = false
          this.showFieldError(field, this.errors[fieldName])
        } else {
          this.clearFieldError(field)
        }
      }
    })

    return isValid
  }

  // Hiển thị lỗi cho field
  showFieldError(field, message) {
    this.clearFieldError(field)
    field.classList.add("is-invalid")

    const errorDiv = document.createElement("div")
    errorDiv.className = "invalid-feedback"
    errorDiv.textContent = message
    field.parentNode.appendChild(errorDiv)
  }

  // Xóa lỗi của field
  clearFieldError(field) {
    field.classList.remove("is-invalid")
    const errorDiv = field.parentNode.querySelector(".invalid-feedback")
    if (errorDiv) {
      errorDiv.remove()
    }
  }

  // Validate email với regex
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate số điện thoại Việt Nam
  isValidPhone(phone) {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  // Validate tên (chỉ chữ cái và khoảng trắng)
  isValidName(name) {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/
    return nameRegex.test(name) && name.length >= 2
  }

  // Validate tuổi
  isValidAge(birthDate) {
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    return age >= 13 && age <= 100
  }

  // Validate mật khẩu mạnh
  isStrongPassword(password) {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) return false

    let score = 0
    if (hasUpperCase) score++
    if (hasLowerCase) score++
    if (hasNumbers) score++
    if (hasSpecialChar) score++

    return score >= 3
  }

  // Lấy danh sách lỗi
  getErrors() {
    return this.errors
  }

  // Xóa tất cả lỗi
  clearErrors() {
    this.errors = {}
    const invalidFields = this.form.querySelectorAll(".is-invalid")
    invalidFields.forEach((field) => {
      this.clearFieldError(field)
    })
  }
}

// Các rule validation có sẵn
const ValidationRules = {
  required: "required",
  email: "email",
  phone: "phone",
  minLength: (min) => ({ minLength: min }),
  maxLength: (max) => ({ maxLength: max }),
  pattern: (regex) => ({ pattern: regex }),
  custom: (fn) => fn,

  // Rules đặc biệt cho form đăng ký
  vietnameseName: (value) => /^[a-zA-ZÀ-ỹ\s]+$/.test(value) && value.length >= 2,
  vietnamesePhone: (value) => /^(0[3|5|7|8|9])+([0-9]{8})$/.test(value.replace(/\s/g, "")),
  strongPassword: (value) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)

    if (value.length < minLength) return false

    let score = 0
    if (hasUpperCase) score++
    if (hasLowerCase) score++
    if (hasNumbers) score++
    if (hasSpecialChar) score++

    return score >= 3
  },
  validAge: (value) => {
    const birth = new Date(value)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    return age >= 13 && age <= 100
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { FormValidator, ValidationRules }
}

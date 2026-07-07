$(document).ready(function () {
    let currentStep = 1;
    const totalSteps = 4;
    const defaultCurrentPassword = "Password123@";
    let isAnimating = false;

    // Buttons
    const $btnNext = $("#btn-next");
    const $btnPrev = $("#btn-prev");
    const $btnFinish = $("#btn-finish");

    function showError(input, message) {
        clearError(input);
        input.addClass("error");
        input.removeClass("valid");
        let parent = input.parent();
        let label = $('<label class="error"></label>').text(message);
        parent.append(label);
    }

    function clearError(input) {
        input.removeClass("error");
        input.addClass("valid");
        let parent = input.parent();
        parent.find("label.error").remove();
    }

    function isValidEmail(email) {
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    function isValidPassword(password) {
        let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
        return pattern.test(password);
    }

    function isValidPhone(phone) {
        let pattern = /^\+?[0-9]{7,15}$/;
        return pattern.test(phone);
    }

    function isValidUserId(userId) {
        let pattern = /^[a-zA-Z0-9_]{4,30}$/;
        return pattern.test(userId);
    }

    // This function validates one input field at a time
    function validateField(input) {
        let type = input.attr("type");
        let value = type === "password" ? input.val() : input.val().trim();
        let name = input.attr("name");
        let placeholder = input.attr("placeholder") || name;
        let minLen = input.attr("minlength");
        let maxLen = input.attr("maxlength");

        if (value === "") {
            showError(input, placeholder + " is required");
            return false;
        }

        if (minLen && value.length < parseInt(minLen)) {
            showError(
                input,
                placeholder + " must be at least " + minLen + " characters",
            );
            return false;
        }

        if (maxLen && value.length > parseInt(maxLen)) {
            showError(
                input,
                placeholder + " must be at most " + maxLen + " characters",
            );
            return false;
        }

        // Check 3: Is the email format valid?
        if (type === "email" && !isValidEmail(value)) {
            showError(input, "Please enter a valid email address");
            return false;
        }

        // Check 4: Is the phone number valid?
        if (name === "phone" && !isValidPhone(value)) {
            showError(
                input,
                "Please enter a valid phone number (digits only, 7-15 characters)",
            );
            return false;
        }

        // Check 5: Is the user ID format valid?
        if (name === "user_id" && !isValidUserId(value)) {
            showError(
                input,
                "User ID must be alphanumeric (letters, numbers, underscores)",
            );
            return false;
        }

        // Check 6: Does the password meet strength requirements?
        if (
            type === "password" &&
            name !== "current_password_confirm" &&
            name !== "confirm_new_password"
        ) {
            if (!isValidPassword(value)) {
                showError(
                    input,
                    "Must have uppercase, lowercase, number & special character",
                );
                return false;
            }
        }

        // Check 7: Does current password match the default current password?
        if (name === "current_password") {
            if (value !== defaultCurrentPassword) {
                showError(input, "Incorrect current password");
                return false;
            }
        }

        // Check 8: Does confirm password match current password?
        if (name === "current_password_confirm") {
            let currentPwd = $("[name='current_password']").val();
            if (value !== currentPwd) {
                showError(input, "Must match the current password");
                return false;
            }
        }

        // Check 9: Does confirm new password match new password?
        if (name === "confirm_new_password") {
            let newPwd = $("[name='new_password']").val();
            if (value !== newPwd) {
                showError(input, "Passwords do not match");
                return false;
            }
        }

        // All checks passed - clear any error
        clearError(input);
        return true;
    }
    
    function validateCurrentStep() {
        let isValid = true;
        let currentSection = $("#step-" + currentStep);

        // Find all named input fields (text, email, tel, password) in the current step
        currentSection
            .find(
                "input[name][type='text'], input[name][type='email'], input[name][type='tel'], input[name][type='password']",
            )
            .each(function () {
                let input = $(this);
                if (!validateField(input)) {
                    isValid = false;
                }
            });

        return isValid;
    }

    // When user types in a field, re-check validation in real time
    $(document).on("input", ".form-control", function () {
        let input = $(this);
        // Only re-validate if the field was already validated before
        if (input.hasClass("error") || input.hasClass("valid")) {
            validateField(input);
        }
    });

    // WIZARD NAVIGATION
    $btnNext.on("click", function () {
        if (isAnimating) return;
        if (!validateCurrentStep()) {
            return;
        }

        if (currentStep < totalSteps) {
            isAnimating = true;
            $("#step-" + currentStep).fadeOut(300, function () {
                currentStep++;

                $("#step-" + currentStep).fadeIn(300, function() {
                    isAnimating = false;
                });

                updateWizardUI();
            });
        }
    });

    $btnPrev.on("click", function () {
        if (isAnimating) return;
        if (currentStep > 1) {
            isAnimating = true;
            $("#step-" + currentStep).fadeOut(200, function () {
                currentStep--;

                $("#step-" + currentStep).fadeIn(200, function() {
                    isAnimating = false;
                });

                updateWizardUI();
            });
        }
    });

    $(".step-indicator").on("click", function () {
        if (isAnimating) return;
        const stepNumber = $(this).data("step");

        if (stepNumber === currentStep) return;

        // Validate all steps between current and target when moving forward
        if (stepNumber > currentStep) {
            for (let s = currentStep; s < stepNumber; s++) {
                let stepSection = $("#step-" + s);
                let stepValid = true;
                stepSection
                    .find(
                        "input[name][type='text'], input[name][type='email'], input[name][type='tel'], input[name][type='password']",
                    )
                    .each(function () {
                        if (!validateField($(this))) {
                            stepValid = false;
                        }
                    });
                if (!stepValid) {
                    // Jump to the failing step instead
                    if (s !== currentStep) {
                        isAnimating = true;
                        $("#step-" + currentStep).fadeOut(200, function () {
                            currentStep = s;
                            $("#step-" + currentStep).fadeIn(200, function() {
                                isAnimating = false;
                            });
                            updateWizardUI();
                        });
                    }
                    return;
                }
            }
        }

        isAnimating = true;

        $("#step-" + currentStep).fadeOut(200, function () {
            currentStep = stepNumber;

            $("#step-" + currentStep).fadeIn(200, function() {
                isAnimating = false;
            });

            updateWizardUI();
        });
    });

    function updateWizardUI() {
        if (currentStep < totalSteps) {
            $btnPrev.show();
            $btnNext.show();
            $btnFinish.hide();
        }
        if (currentStep === totalSteps) {
            $btnPrev.hide();
            $btnNext.hide();
            $btnFinish.show();
        }

        // Reset all indicators
        for (let i = 1; i <= totalSteps; i++) {
            $("#indicator-" + i + " .step-img").attr(
                "src",
                "images/step-" + i + ".png",
            );
        }

        // Activate current indicator
        $("#indicator-" + currentStep + " .step-img").attr(
            "src",
            "images/step-" + currentStep + "-active.png",
        );
    }

    updateWizardUI();

    // When "Proceed to checkout" is clicked, show all form data in the console
    $btnFinish.on("click", function () {
        // Get all the form field values
        let firstName = $("[name='first_name']").val();
        let lastName = $("[name='last_name']").val();
        let email = $("[name='email']").val();
        let userId = $("[name='user_id']").val();
        let country = $("[name='country']").val();
        let state = $("[name='state']").val();
        let city = $("[name='city']").val();
        let phone = $("[name='phone']").val();

        // Get cart item quantities
        let cartItems = [];
        $(".table-cart tbody tr").each(function () {
            let row = $(this);
            let productName = row.find(".product-detail a").text();
            let price = row.find(".price").attr("data-price");
            let quantity = row.find(".qty-input").val();
            let total = row.find(".item-total").text();
            cartItems.push({
                product: productName,
                price: "$" + price,
                quantity: quantity,
                total: "$" + total,
            });
        });

        // Get selected shipping option
        let shipping = $("input[name='shipping']:checked").parent().text().trim();

        // Get cart totals
        let subtotal = $("#cart-subtotal").text();
        let service = $("#cart-service").text();
        let grandTotal = $("#cart-total").text();

        // Build a single JSON object with all form data
        let formData = {
            personalInfo: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                userId: userId,
                country: country,
                state: state,
                city: city,
                phone: phone,
            },
            cartItems: cartItems,
            orderSummary: {
                shipping: shipping,
                subtotal: "$" + subtotal,
                serviceFee: "$" + service,
                grandTotal: "$" + grandTotal,
            },
        };

        // Log as formatted JSON
        console.log(JSON.stringify(formData, null, 2));
    });
    // TOGGLE PASSWORD VISIBILITY
    $(".toggle-password").on("click", function () {
        const $passwordInput = $(".password-input");

        if ($passwordInput.attr("type") === "password") {
            $passwordInput.attr("type", "text");
        } else {
            $passwordInput.attr("type", "password");
        }
    });

    $(".btn-plus").on("click", function () {
        const $input = $(this).siblings(".qty-input");

        const currentValue = parseInt($input.val());

        const newValue = currentValue + 1;

        $input.val(newValue);

        updateItemTotal($(this));
    });

    $(".btn-minus").on("click", function () {
        const $input = $(this).siblings(".qty-input");

        const currentValue = parseInt($input.val());

        if (currentValue > 0) {
            const newValue = currentValue - 1;

            $input.val(newValue);

            updateItemTotal($(this));
        }
    });

    function updateItemTotal($button) {
        const $row = $button.closest("tr");

        const unitPrice = parseInt($row.find(".price").attr("data-price"));

        const quantity = parseInt($row.find(".qty-input").val());

        const newTotal = unitPrice * quantity;

        $row.find(".item-total").text(newTotal);

        updateCartTotals();
    }

    function updateCartTotals() {
        let subtotal = 0;

        $(".item-total").each(function () {
            subtotal += parseInt($(this).text());
        });

        $("#cart-subtotal").text(subtotal.toFixed(2));

        const serviceFee = parseFloat($("#cart-service").text());

        const grandTotal = subtotal + serviceFee;

        $("#cart-total").text(grandTotal.toFixed(2));
    }
});

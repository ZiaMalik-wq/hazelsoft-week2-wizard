# Training Assignment 2

This project is a static multi-step form wizard built with HTML, CSS, jQuery, and local assets. It guides the user through personal details, password change validation, a small shopping cart, and an order summary.

## Features

- 4-step wizard interface with step indicators and animated transitions.
- Client-side validation for required fields, email format, phone format, user ID format, and password rules.
- Password visibility toggle for the reference code field.
- Cart quantity controls with live item total and cart total updates.
- Final step with shipping options and order summary.
- No backend submission; the collected form data is logged to the browser console as JSON when the checkout button is pressed.

## Project Structure

- `index.html` - Main page that contains the wizard markup.
- `css/style.css` - Layout, typography, form styling, cart styling, and responsive behavior.
- `js/main.js` - Wizard navigation, validation, password toggle, and cart calculations.
- `images/` - Background, step icons, and product images.
- `fonts/` - Local font files and Material Design Iconic Font assets.

## How It Works

1. Step 1 collects basic details such as name, email, user ID, location, phone number, and a reference code.
2. Step 2 checks current password, confirmation, and new password rules.
3. Step 3 displays cart items with quantity controls and item totals.
4. Step 4 shows the subtotal, shipping choice, service fee, and grand total.

Navigation is handled with the `Continue`, `Back`, and `Proceed to checkout` buttons, plus clickable step indicators.

## Validation Rules

- Email must be in a valid email format.
- Phone number must contain 7 to 15 digits and may start with `+`.
- User ID must use only letters, numbers, and underscores.
- Passwords must include uppercase, lowercase, a number, and a special character.
- The default current password used in the script is `Password123@`.

## How to Run

1. Open `index.html` in a browser, or use a local server such as VS Code Live Server.
2. Fill in the fields step by step.
3. Use the cart controls to adjust quantities.
4. Click `Proceed to checkout` on the last step to view the collected JSON in the browser console.

## Notes

- This is a front-end only demo.
- The cart totals are calculated on the client side.
- The form does not submit to an API or database.
